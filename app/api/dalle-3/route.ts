import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) throw new Error('No image URL returned');

    return NextResponse.json({ imageUrl });

  } catch (error: any) {
    console.error('DALL-E Error:', error);
    return NextResponse.json(
      { error: error.message || 'Image generation failed' },
      { status: 500 }
    );
  }
}