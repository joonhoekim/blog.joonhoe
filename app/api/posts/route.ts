import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { postsTable } from '@/db/schema/schema';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content } = body;

    const [post] = await db
      .insert(postsTable)
      .values({
        title,
        content,
      })
      .returning();

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}