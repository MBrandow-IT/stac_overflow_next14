"use server";

import Question from "../database/question.model";
import { connectToDatabase } from "../mongoose";

interface GlobalSearchResultParams {
  global: string;
  type?: string;
}

export async function getGlobalSearchResult(params: GlobalSearchResultParams) {
  try {
    connectToDatabase();

    const { global = "", type } = params;

    return [];
  } catch (error) {
    console.log(error);
    throw error;
  }
}
