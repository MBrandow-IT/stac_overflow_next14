"use server";

import Answer from "@/lib/database/answer.model";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./types";
import Question from "@/lib/database/question.model";
import { revalidatePath } from "next/cache";
import User from "../database/user.model";

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

    const answers = await Answer.find({})
      .where("question", params.questionId)
      .populate({ path: "author", model: User })
      .populate({ path: "question", model: Question })
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
