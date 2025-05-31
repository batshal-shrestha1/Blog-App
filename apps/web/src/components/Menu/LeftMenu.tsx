import type { PostWithLikes } from "@repo/db/types";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import Link from "next/link";
import { client } from "@repo/db/client";
import { HomeIcon } from "@heroicons/react/24/outline";

export async function LeftMenu() {
  const posts = await client.db.post.findMany({
    include: {
      Likes: true,
    },
  });

  const postsWithLikes: PostWithLikes[] = posts.map((post) => ({
    ...post,
    likes: post.Likes.length,
  }));

  return (
    <div className="flex flex-col gap-8 h-full text-gray-900 dark:text-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <HomeIcon className="h-8 w-8 text-red-700" />
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-gray-100">Full Stack Blog</Link>
      </div>
      <nav className="flex-1 flex flex-col gap-8">
        <CategoryList posts={postsWithLikes} />
        <HistoryList selectedYear="" selectedMonth="" posts={postsWithLikes} />
        <TagList selectedTag="" posts={postsWithLikes} />
      </nav>
    </div>
  );
}
