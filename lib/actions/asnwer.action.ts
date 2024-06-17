"use server";

import Answer from "@/lib/database/answer.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./types";
import Question from "@/lib/database/question.model";
import { revalidatePath } from "next/cache";
import User from "../database/user.model";
import Interaction from "../database/interaction.model";

export async function getAnswersByAuthorId(authorId: string) {
  try {
    connectToDatabase();

    const answers = await Answer.find({ author: authorId })
      .populate({ path: "author", model: User })
      .populate({ path: "question", model: Question })
      .sort({ upvotes: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    console.log(content);

    const newAnswer = await Answer.create({ content, author, question });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { filter, page = 1, pageSize = 10 } = params;

    const skipAmount = (page - 1) * pageSize;

    let filterCriteria: any = { createdAt: -1 };

    if (filter) {
      if (filter === "highestUpvotes") {
        filterCriteria = { upvotes: -1 };
      }
      if (filter === "lowestUpvotes") {
        filterCriteria = { upvotes: 1 };
      }
      if (filter === "recent") {
        filterCriteria = { createdAt: -1 };
      }
      if (filter === "old") {
        filterCriteria = { createdAt: 1 };
      }
    }

    const answers = await Answer.find({})
      .where("question", params.questionId)
      .populate({ path: "author", model: User })
      .populate({ path: "question", model: Question })
      .sort(filterCriteria)
      .skip(skipAmount)
      .limit(pageSize);

    const totalAnswers = await Answer.countDocuments({
      question: params.questionId,
    });

    const isNext = totalAnswers > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    connectToDatabase();

    // Take current user and create a question based on the question props and push it to the database.
    const { answerId, path } = params;
    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found");
    }

    // Create the question
    await Answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answers: answerId } }
    );
    await Interaction.deleteMany({ answer: answerId });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
