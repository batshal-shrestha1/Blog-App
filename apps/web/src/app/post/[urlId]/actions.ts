"use server";

import { client } from "@repo/db/client";

export async function incrementPostViews(postId: number) {
  await client.db.post.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });
} 