"use server";

import { revalidatePath } from "next/cache";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  UpdateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
} from "./types";
import Question from "../database/question.model";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const users = User.aggregate([
      // Lookup questions authored by each user
      {
        $lookup: {
          from: "questions", // the collection name of questions
          localField: "_id",
          foreignField: "author",
          as: "authoredQuestions",
        },
      },

      // Unwind the authoredQuestions array
      {
        $unwind: {
          path: "$authoredQuestions",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Unwind the tags in authoredQuestions
      {
        $unwind: {
          path: "$authoredQuestions.tags",
          preserveNullAndEmptyArrays: true,
        },
      },

      // Group by user and tags, and count the occurrences
      {
        $group: {
          _id: { userId: "$_id", tagId: "$authoredQuestions.tags" },
          count: { $sum: 1 },
        },
      },

      // Lookup tag details
      {
        $lookup: {
          from: "tags", // the collection name of tags
          localField: "_id.tagId",
          foreignField: "_id",
          as: "tagDetails",
        },
      },

      // Unwind the tagDetails array
      { $unwind: { path: "$tagDetails", preserveNullAndEmptyArrays: true } },

      // Group back to user level and collect tag details
      {
        $group: {
          _id: "$_id.userId",
          tags: {
            $push: {
              _id: "$tagDetails._id",
              name: "$tagDetails.name",
              count: "$count",
            },
          },
        },
      },

      // Lookup user details
      {
        $lookup: {
          from: "users", // the collection name of users
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },

      { $unwind: "$userDetails" },

      // Project the required fields
      {
        $project: {
          _id: "$_id", // Include user _id
          name: "$userDetails.name",
          username: "$userDetails.username",
          picture: "$userDetails.picture",
          tags: {
            $filter: {
              input: "$tags",
              as: "tag",
              cond: { $ne: ["$$tag._id", null] },
            },
          },
        },
      },
    ]);
    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId, clerkUserId } = params;
    let user;

    if (userId) {
      user = await User.findById(userId);
    } else {
      user = await User.findOne({ clerkId: clerkUserId });
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userData: CreateUserParams) {
  try {
    connectToDatabase();

    const newUser = await User.create(userData);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(userData: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = userData;

    await User.findOneAndUpdate({ clerkId }, updateData, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(userData: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = userData;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // const userQuestionIds = await Question.find({ author: user._id }).distinct(
    //   "_id"
    // );

    await Question.deleteMany({ author: user._id });

    const deletedUser = await User.findByIdAndDelete(user._id);

    revalidatePath("/");
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
