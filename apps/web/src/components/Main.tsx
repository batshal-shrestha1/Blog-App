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
    <main className={`flex-1 ${className || ""}`}>
      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">From the blog</h1>

        <BlogList posts={posts} />
      </section>
    </main>
  );
}
