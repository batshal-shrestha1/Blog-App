import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@repo/db/client";

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

    // Save the new post to the database
    const newPost = await client.db.post.create({
      data: {
        title,
        description,
        content,
        imageUrl,
        tags,
        category,
        urlId: title.toLowerCase().replace(/\s+/g, "-"),
        date: new Date(),
        views: 0,
        active: true,
      },
    });

    return new NextResponse(JSON.stringify({ message: "Post created successfully", post: newPost }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return new NextResponse(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
} 