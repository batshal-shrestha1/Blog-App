import { NextRequest, NextResponse } from "next/server";
import { client } from "@repo/db/client";

function getUserIP(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";
  // Fallback to ::1 for local/test/dev environments
  return ip === "unknown" ? "::1" : ip;
}

// Helper to get like count
async function getLikeCount(postId: number) {
  return await client.db.like.count({ where: { postId } });
}

// POST: Like a post
export async function POST(req: NextRequest) {
  const { postId } = await req.json();
  const userIP = getUserIP(req);

  const existing = await client.db.like.findUnique({
    where: { postId_userIP: { postId, userIP } },
  });
  if (existing) {
    const likeCount = await getLikeCount(postId);
    return NextResponse.json({ success: false, message: "Already liked", likeCount, liked: true }, { status: 400 });
  }

  await client.db.like.create({
    data: { postId, userIP },
  });
  const likeCount = await getLikeCount(postId);
  return NextResponse.json({ success: true, likeCount, liked: true });
}

// DELETE: Unlike a post
export async function DELETE(req: NextRequest) {
  const { postId } = await req.json();
  const userIP = getUserIP(req);

  try {
    await client.db.like.delete({
      where: { postId_userIP: { postId, userIP } },
    });
  } catch (e: unknown) {
    // If the like does not exist, ignore the error
    console.error("DELETE failed (may not exist)", e);
  }
  const likeCount = await getLikeCount(postId);
  return NextResponse.json({ success: true, likeCount, liked: false });
}

// GET: Check if liked
export async function GET(req: NextRequest) {
    const postId = Number(req.nextUrl.searchParams.get("postId"));
    const userIP = getUserIP(req);
  
    const existing = await client.db.like.findUnique({
      where: { postId_userIP: { postId, userIP } },
    });
  
    return NextResponse.json({ liked: !!existing });
  }
