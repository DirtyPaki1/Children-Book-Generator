import { NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export const runtime = 'edge';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY || '',
  environment: 'gcp-starter'
});

export async function POST(req: Request) {
  try {
    const { queryVector } = await req.json();

    if (!queryVector) {
      return NextResponse.json(
        { error: 'Query vector is required' },
        { status: 400 }
      );
    }

    const index = pinecone.index("children-books");
    const queryResponse = await index.query({
      vector: queryVector,
      topK: 1,
      includeMetadata: true,
    });

    const metadata = queryResponse.matches?.[0]?.metadata;
    if (!metadata) throw new Error('No metadata found');

    return NextResponse.json({ metadata });

  } catch (error: any) {
    console.error('Pinecone Error:', error);
    return NextResponse.json(
      { error: error.message || 'Vector search failed' },
      { status: 500 }
    );
  }
}