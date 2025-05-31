import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { client } from '@repo/db/client';
import jwt from 'jsonwebtoken';
import { env } from '@repo/env/admin';

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
    const { postId } = await request.json();
    
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Get the current post to toggle its active status
    const post = await client.db.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Update the post's active status
    const updatedPost = await client.db.post.update({
      where: { id: postId },
      data: { active: !post.active }
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Error toggling post status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}