import type { PostWithLikes } from "@repo/db/types";
import BlogList from "./Blog/List";
import { ReactNode } from "react";

export function Main({
  posts,
  className,
  children,
}: {
  posts: PostWithLikes[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <main className={`flex-1 ${className || ""}`}>
      <section className="mb-10">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">From the blog</h1>

        <BlogList posts={posts} />
        {children}
      </section>
    </main>
  );
}
