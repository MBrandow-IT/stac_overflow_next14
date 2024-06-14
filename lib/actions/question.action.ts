"use server";

import { revalidatePath } from "next/cache";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import { CreateQuestionParams, GetQuestionsParams } from "./share.types";
import { DeleteQuestionParams, GetQuestionByIdParams } from "./types";
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

    const { searchQuery } = params;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    // const questions = await Question.find({})
    //   .populate({ path: "tags", model: Tag })
    //   .populate({ path: "author", model: User })
    //   .sort({ createdAt: -1 });

    return { questions };
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
