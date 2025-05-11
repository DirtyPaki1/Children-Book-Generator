import { NextResponse } from "next/server";
import OpenAI from "openai";
import { Character } from "@/types/character";

export const runtime = "edge";

interface DALLEResponse {
  data: {
    url: string;
    revised_prompt?: string;
  }[];
}

export async function POST(req: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { character }: { character: Character } = await req.json();

    // Generate image with type assertion
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Create a ${character.artStyle} style image of ${character.name}, a ${character.age}-year-old character. ${character.aiDescription}`,
      n: 1,
      size: "1024x1024",
    }) as unknown as DALLEResponse; // Type assertion here

    const imageUrl = response.data[0].url;
    if (!imageUrl) throw new Error('No image URL returned');

    return NextResponse.json({ imageUrl });
    
  } catch (error) {
    console.error("DALL-E Error:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}