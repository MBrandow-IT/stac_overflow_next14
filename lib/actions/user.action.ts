"use server";

import { FilterQuery } from "mongoose";
import { revalidatePath } from "next/cache";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  UpdateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
} from "./types";
import Question from "../database/question.model";
import Tag from "../database/tag.model";
import Answer from "../database/answer.model";

export async function getUserIdWithClerkId(clerkId: string) {
  try {
    connectToDatabase();

    const userId = await User.findOne({ clerkId })
      .select("_id")
      .populate({ path: "saved", model: Question });

    return userId;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    connectToDatabase();

    const user = await User.findOne({ clerkId });

    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return { user, totalQuestions, totalAnswers };
  } catch (error) {
    console.log(error);
  }
}

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
          clerkId: "$userDetails.clerkId",
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
      user = await User.findOne({ clerkId: clerkUserId }).populate({
        path: "saved",
        model: Question,
        populate: [
          {
            path: "author",
            model: User,
          },
          {
            path: "tags",
            model: Tag,
          },
        ],
      });
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        {
          path: "author",
          model: User,
          select: "_id clerkId name picture username",
        },
      ],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
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

interface UpdateProfileParams {
  clerkId: string;
  name: string;
  username: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  path: string;
}

export async function updateProfile(params: UpdateProfileParams) {
  try {
    await connectToDatabase();

    const { clerkId, name, username, bio, location, portfolio } = params;

    await User.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          name,
          username,
          bio,
          location,
          portfolioWebsite: portfolio,
        },
      },
      { new: true }
    );

    revalidatePath(params.path);
  } catch (error) {
    console.error(error);
  }
}
