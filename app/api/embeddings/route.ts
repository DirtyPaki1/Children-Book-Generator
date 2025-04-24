import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: Request, res: Response) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
    environment: 'gcp-starter'
  });

  const body = await req.text();
  const { queryVector } = JSON.parse(body);

  const index = pinecone.index("children-books");
  const stats = await index.describeIndexStats();
  console.log('stats:', stats);
  const queryResponse = await index.query({
    vector: queryVector,
    topK: 1,
    includeMetadata: true,
  });
  console.log('queryResponse:', queryResponse);
  const metadata = queryResponse?.matches?.[0]?.metadata;
  return NextResponse.json({ metadata });
};