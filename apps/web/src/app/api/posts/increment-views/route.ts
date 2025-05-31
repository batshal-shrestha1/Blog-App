import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db/client";

export async function POST(req: NextRequest) {
  const { postId } = await req.json();
  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }
  const post = await client.db.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
    select: { views: true },
  });
  return NextResponse.json({ views: post.views });
} 