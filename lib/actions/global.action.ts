"use server";

import { FilterQuery } from "mongoose";
import Question from "../database/question.model";
import { connectToDatabase } from "../mongoose";
import Tag from "../database/tag.model";
import User from "../database/user.model";
import Answer from "../database/answer.model";

interface GlobalSearchResultParams {
  global: string;
  type?: string;
}

export async function getGlobalSearchResult(params: GlobalSearchResultParams) {
  try {
    await connectToDatabase();

    const { global = "", type } = params;

    let result = [];

    if (type) {
      result = await searchByType(global, type);
    } else {
      const [questions, tags, users, answers] = await Promise.all([
        searchByType(global, "question"),
        searchByType(global, "tag"),
        searchByType(global, "user"),
        searchByType(global, "answer"),
      ]);

      // Combine all results
      result = [...questions, ...tags, ...users, ...answers];

      // Optionally sort the results here if needed
      // For example, sort by some relevance score or simply by _id
      result.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));

      // Limit to top 10 results
      result = result.slice(0, 10);
    }

    console.log(result);
    return JSON.stringify(result);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function searchByType(global: string, type: string) {
  let result = [];
  const query: FilterQuery<any> = {};

  if (global) {
    const regex = new RegExp(global, "i");

    switch (type) {
      case "question":
        query.$or = [
          { title: { $regex: regex } },
          { content: { $regex: regex } },
        ];
        result = await Question.find(query).select("_id title").limit(10);
        result = result.map((item) => ({
          ...item.toObject(),
          type: "question",
        }));
        break;

      case "tag":
        query.$or = [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
        ];
        result = await Tag.find(query).select("_id name").limit(10);
        result = result.map((item) => ({
          ...item.toObject(),
          type: "tag",
        }));
        break;

      case "user":
        query.$or = [
          { name: { $regex: regex } },
          { username: { $regex: regex } },
        ];
        result = await User.find(query)
          .select("_id name username clerkId")
          .limit(10);
        result = result.map((item) => ({
          ...item.toObject(),
          type: "user",
        }));
        break;

      case "answer":
        query.$or = [{ content: { $regex: regex } }];
        result = await Answer.aggregate([
          {
            $lookup: {
              from: "questions",
              localField: "question",
              foreignField: "_id",
              as: "questionDetails",
            },
          },
          {
            $match: {
              $or: [
                { content: { $regex: regex } },
                { "questionDetails.title": { $regex: regex } },
              ],
            },
          },
          {
            $unwind: "$questionDetails",
          },
          {
            $limit: 10,
          },
          {
            $project: {
              _id: "$questionDetails._id",
              content: 1,
              title: "$questionDetails.title",
              type: { $literal: "answer" },
            },
          },
        ]);
        break;
    }
  }

  return result;
}
