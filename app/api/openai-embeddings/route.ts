import { NextResponse } from 'next/server';
import OpenAI from "openai";

export const runtime = 'edge';

export async function POST(req: Request, res: Response) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const body = await req.text();
  const { prompt } = JSON.parse(body);
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: prompt
  });
  console.log('response:', response);
  const embedding = response?.data?.[0]?.embedding;
  console.log('embedding:', embedding);
  return NextResponse.json({ embedding });
};