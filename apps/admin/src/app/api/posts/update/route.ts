import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { client } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { env } from '@repo/env/admin';
import { toUrlPath } from '@repo/utils/url';

export async function POST(request: NextRequest) {
  // Check authentication
  const cookieStore = cookies();
  const authToken = (await cookieStore).get('auth_token')?.value;

  // Verify JWT token
  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    jwt.verify(authToken, env.JWT_SECRET || '');
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, title, description, content, imageUrl, tags, category } = await request.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Get the current post to verify it exists
    const existingPost = await client.db.post.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update the post
    const updatedPost = await client.db.post.update({
      where: { id },
      data: {
        title,
        description,
        content,
        imageUrl,
        tags,
        category,
        urlId: toUrlPath(title) // Use toUrlPath for urlId
      }
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}