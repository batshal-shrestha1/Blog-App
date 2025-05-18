import type { PostWithLikes } from "@repo/db/types";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import Link from "next/link";
import { client } from "@repo/db/client";

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
    <div>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div>
        <Link href="/" >Full Stack Blog</Link>
      </div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li title="Categories">
            <CategoryList posts={postsWithLikes} />
          </li>
          <li title="History">
            <HistoryList selectedYear="" selectedMonth="" posts={postsWithLikes} />
          </li>
          <li title="Tags">
            <TagList selectedTag="" posts={postsWithLikes} />
          </li>
          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}
