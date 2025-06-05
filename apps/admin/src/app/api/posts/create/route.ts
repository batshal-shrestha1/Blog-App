import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { client } from "@repo/db/client";
import { toUrlPath } from "@repo/utils/url";
import jwt from "jsonwebtoken";
import { env } from "@repo/env/admin";

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
  const authToken = cookieStore.get("auth_token")?.value;

  // Verify JWT token
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
    });
  }
  try {
    jwt.verify(authToken, env.JWT_SECRET || "");
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, {
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
        urlId: toUrlPath(title),
        date: new Date(),
        views: 0,
        active: true,
      },
    });

    return NextResponse.json({ message: "Post created successfully", post: newPost }, {
      status: 200,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json({ error: "Internal server error" }, {
      status: 500,
    });
  }
}