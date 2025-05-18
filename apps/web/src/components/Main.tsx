import type { PostWithLikes } from "@repo/db/types";
import BlogList from "./Blog/List";

export function Main({
  posts,
  className,
}: {
  posts: PostWithLikes[];
  className?: string;
}) {
  return (
    <main className={className}>
      <BlogList posts={posts} />
    </main>
  );
}
