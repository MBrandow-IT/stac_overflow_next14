"use server";

import { revalidatePath } from "next/cache";
import Question from "../database/question.model";
import Answer from "../database/answer.model";
import { connectToDatabase } from "../mongoose";
import { VoteParams } from "./types";

export async function handleVote(params: VoteParams) {
  // console.log(params);
  try {
    connectToDatabase();

    const {
      userId,
      questionId,
      answerId,
      hasUpVoted,
      hasDownVoted,
      isUpVoting,
      isDownVoting,
    } = params;

    let item;

    if (answerId) {
      item = await Answer.findById(answerId);
    } else if (questionId) {
      item = await Question.findById(questionId);
    } else {
      throw new Error("Either questionId or answerId must be provided.");
    }

    if (!item) {
      throw new Error("Item not found.");
    }

    if (isUpVoting) {
      if (hasDownVoted) {
        item.downvotes.pull(userId);
      }
      if (!hasUpVoted) {
        item.upvotes.push(userId);
      } else {
        item.upvotes.pull(userId);
      }
    }

    if (isDownVoting) {
      if (hasUpVoted) {
        item.upvotes.pull(userId);
      }
      if (!hasDownVoted) {
        item.downvotes.push(userId);
      } else {
        item.downvotes.pull(userId);
      }
    }

    await item.save();
    revalidatePath(`/question/${questionId}`); // Adjust this path as necessary
  } catch (error) {
    console.log(error);
    throw error;
  }
}
