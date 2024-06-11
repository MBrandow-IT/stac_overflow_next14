"use server";

import Tag from "../database/tag.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams } from "./types";

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const tags = Tag.aggregate([
      // Lookup questions with each tag
      {
        $lookup: {
          from: "questions", // the collection name of questions
          localField: "_id",
          foreignField: "tags",
          as: "taggedQuestions",
        },
      },

      // Unwind the taggedQuestions array
      {
        $unwind: { path: "$taggedQuestions", preserveNullAndEmptyArrays: true },
      },

      // Group by tag and count the occurrences
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          count: { $sum: { $cond: [{ $not: ["$taggedQuestions"] }, 0, 1] } },
        },
      },

      // Project the required fields
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          count: 1,
        },
      },
    ]);
    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
