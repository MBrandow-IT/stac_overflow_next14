"use server";

import { revalidatePath } from "next/cache";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateQuestionParams, GetQuestionsParams } from "./share.types";
import {
  DeleteQuestionParams,
  GetQuestionByIdParams,
  RecommendedParams,
} from "./types";
import Answer from "../database/answer.model";
import Interaction from "../database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestionsByAuthorId(authorId: string) {
  try {
    connectToDatabase();

    const questions = await Question.find({ author: authorId })
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ views: -1 });

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 15 } = params;

    const skipAmmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let filterCriteria: any = { createdAt: -1 };

    if (filter) {
      if (filter === "newest") {
        filterCriteria = { createdAt: -1 };
      }
      if (filter === "recommended") {
        filterCriteria = { upvotes: -1 };
      }
      if (filter === "frequent") {
        filterCriteria = { views: -1 };
      }
      if (filter === "unanswered") {
        query.answers = { $size: 0 };
      }
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(filterCriteria)
      .skip(skipAmmount)
      .limit(pageSize);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmmount + questions.length;

    return { questions, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    // Take current user and create a question based on the question props and push it to the database.
    const { title, content, tags, author, path } = params;

    // Create the question
    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];

    // Create tags if they don't exist
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    revalidatePath(path);
  } catch (error) {}
}

interface UpdateQuestionParams {
  questionId: string;
  title: string;
  content: string;
  tags: string[];
  path: string;
}

export async function updateQuestion(params: UpdateQuestionParams) {
  try {
    connectToDatabase();

    console.log("You ARE TRYING TO UPDATE THE QUESTION");

    const { questionId, title, content, tags, path } = params;

    const question = await Question.findByIdAndUpdate(
      questionId,
      {
        title,
        content,
      },
      { new: true }
    );

    const tagDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(existingTag._id);
    }

    await Question.findByIdAndUpdate(question._id, {
      $set: { tags: tagDocuments },
    });

    revalidatePath(path);
  } catch (error) {
    console.error(error);
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    // Take current user and create a question based on the question props and push it to the database.
    const { questionId } = params;

    // Create the question
    const question = await Question.findById({
      _id: questionId,
    })
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture createdAt username saved",
      });

    return question;
  } catch (error) {}
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    // Take current user and create a question based on the question props and push it to the database.
    const { questionId, path } = params;

    // Create the question
    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      { $pull: { questions: questionId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopQuestions() {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      .select("_id title")
      .sort({ views: -1 })
      .limit(5);

    return { questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getRecommendedQuestions(params: RecommendedParams) {
  try {
    await connectToDatabase();

    const { userId, page = 1, pageSize = 20, searchQuery } = params;

    // find user
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }

    const skipAmount = (page - 1) * pageSize;

    // Find the user's interactions
    const userInteractions = await Interaction.find({ user: user._id })
      .populate("tags")
      .exec();

    // Extract tags from user's interactions
    const userTags = userInteractions.reduce((tags, interaction) => {
      if (interaction.tags) {
        tags = tags.concat(interaction.tags);
      }
      return tags;
    }, []);

    // Get distinct tag IDs from user's interactions
    const distinctUserTagIds = [
      // @ts-ignore
      ...new Set(userTags.map((tag: any) => tag._id)),
    ];

    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctUserTagIds } }, // Questions with user's tags
        { author: { $ne: user._id } }, // Exclude user's own questions
      ],
    };

    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(query);

    const recommendedQuestions = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestions > skipAmount + recommendedQuestions.length;

    return { questions: recommendedQuestions, isNext };
  } catch (error) {
    console.error("Error getting recommended questions:", error);
    throw error;
  }
}
