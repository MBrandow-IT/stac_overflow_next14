"use server";

import { FilterQuery } from "mongoose";
import Question from "../database/question.model";
import Tag, { ITag } from "../database/tag.model";
import User from "../database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetQuestionsByTagIdParams } from "./types";

export async function getAllTagQuestions(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
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

    return tag;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery } = params;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    const tags = await Tag.aggregate([
      {
        $match: query,
      },
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

export async function getTopTags() {
  try {
    connectToDatabase();

    const tags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
