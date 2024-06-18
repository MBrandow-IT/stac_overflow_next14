"use server";

import { revalidatePath } from "next/cache";
import Question from "../database/question.model";
import Answer from "../database/answer.model";
import { connectToDatabase } from "../mongoose";
import { SaveParams, VoteParams } from "./types";
import User from "../database/user.model";

export async function handleVote(params: VoteParams) {
  try {
    await connectToDatabase();

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

    const author = item.author;

    if (isUpVoting) {
      if (hasDownVoted) {
        item.downvotes.pull(userId);
        await User.findByIdAndUpdate(userId, { $inc: { reputation: 1 } });
        await User.findByIdAndUpdate(author, { $inc: { reputation: 2 } });
      }
      if (!hasUpVoted) {
        item.upvotes.push(userId);
        await User.findByIdAndUpdate(userId, { $inc: { reputation: 1 } });
        await User.findByIdAndUpdate(author, { $inc: { reputation: 10 } });
      } else {
        item.upvotes.pull(userId);
        await User.findByIdAndUpdate(userId, { $inc: { reputation: -1 } });
        await User.findByIdAndUpdate(author, { $inc: { reputation: -10 } });
      }
    }

    if (isDownVoting) {
      if (hasUpVoted) {
        item.upvotes.pull(userId);
        await User.findByIdAndUpdate(userId, { $inc: { reputation: -1 } });
        await User.findByIdAndUpdate(author, { $inc: { reputation: -10 } });
      }
      if (!hasDownVoted) {
        item.downvotes.push(userId);
        await User.findByIdAndUpdate(userId, { $inc: { reputation: -1 } });
        await User.findByIdAndUpdate(author, { $inc: { reputation: -2 } });
      } else {
        item.downvotes.pull(userId);
        await User.findByIdAndUpdate(userId, { $inc: { reputation: 1 } });
        await User.findByIdAndUpdate(author, { $inc: { reputation: 2 } });
      }
    }

    await item.save();
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function handleSave({ userId, questionId, isSaved }: SaveParams) {
  try {
    connectToDatabase();

    console.log("saved clicked");

    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      throw new Error("User not found.");
    }

    if (isSaved) {
      // Remove the question from the user's saved list
      user.saved.pull(questionId);
    } else {
      // Add the question to the user's saved list
      user.saved.push(questionId);
    }

    await user.save();
    revalidatePath(`/collection`); // Adjust this path as necessary
  } catch (error) {
    console.log(error);
    throw error;
  }
}
