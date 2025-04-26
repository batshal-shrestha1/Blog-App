import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Post, posts } from "@repo/db/data";

interface CreatePostBody {
  title: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  category: string;
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const body = await request.json() as CreatePostBody;
    const { title, description, content, imageUrl, tags, category } = body;

    // Create a new post
    const newPost: Post = {
      id: Math.max(...posts.map(p => p.id)) + 1,
      title,
      description,
      content,
      imageUrl,
      tags,
      category,
      urlId: title.toLowerCase().replace(/\s+/g, "-"),
      date: new Date(),
      views: 0,
      likes: 0,
      active: true,
    };

    // Add the new post to the array
    posts.push(newPost);

    return new NextResponse(JSON.stringify({ message: "Post created successfully" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
} 