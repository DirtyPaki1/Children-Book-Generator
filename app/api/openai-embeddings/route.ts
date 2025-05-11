import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { prompt, size } = await req.json();
    
    console.log("Generating image for prompt:", prompt); // Debug log
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      size: size || "1024x1024",
      quality: "standard",
      n: 1
    });

    const imageUrl = response.data[0].url;
    console.log("Generated image URL:", imageUrl); // Debug log
    
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    return NextResponse.json({ imageUrl });
    
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json(
      { error: error.message || "Image generation failed" },
      { status: 500 }
    );
  }
}