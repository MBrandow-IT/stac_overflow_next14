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

    const { tagId, searchQuery, filter, page = 1, pageSize = 15 } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

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

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: filterCriteria,
        skip: skipAmount,
        limit: pageSize,
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

    const totalTagQuestions = await Question.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
    });

    const isNext = totalTagQuestions
      ? totalTagQuestions.questions.length > skipAmount + tag.questions.length
      : false;

    return { tag, isNext };
  } catch (error) {
    console.log(error);
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    const { searchQuery, filter, page = 1, pageSize = 21 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { description: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let filterCriteria: any = { count: -1, name: 1 };

    if (filter) {
      if (filter === "popular") {
        filterCriteria = { count: -1, name: 1 };
      }
      if (filter === "recent") {
        filterCriteria = { createdAt: -1, name: 1 };
      }
      if (filter === "old") {
        filterCriteria = { createdAt: 1, name: 1 };
      }
      if (filter === "name") {
        filterCriteria = { name: 1 };
      }
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
          createdAt: { $first: "$createdAt" },
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
          createdAt: 1,
        },
      },
      {
        $sort: filterCriteria,
      },
      {
        $skip: skipAmount,
      },
      {
        $limit: pageSize,
      },
    ]);

    const totalTags = await Tag.countDocuments(query);

    const isNext = totalTags > skipAmount + tags.length;

    return { tags, isNext };
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
