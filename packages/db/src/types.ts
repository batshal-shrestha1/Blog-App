import type { Post, Like } from "@prisma/client";

export type PostWithLikes = Post & {
  Likes?: Like[];
  likes: number;
}; 