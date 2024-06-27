import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  const { question } = await req.json();

  const openai = new OpenAI({
    apiKey: process.env.CHAT_GPT_API_KEY,
  });

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = response.choices[0].message.content;

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    return NextResponse.json(
      { error: "Error communicating with OpenAI" },
      { status: 500 }
    );
  }
}
