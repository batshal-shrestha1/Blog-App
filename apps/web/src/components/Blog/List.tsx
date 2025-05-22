import type { PostWithLikes } from "@repo/db/types";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: PostWithLikes[] }) {
  if (posts.length === 0) {
    return <div className="py-6">0 Posts</div>;
  }

  return (
    <section className="py-6">
      <ul className="space-y-8">
        {posts.map((post) => (
          <li key={post.id}>
            <article
              data-test-id={`blog-post-${post.id}`}
              className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-6"
            >
              <BlogListItem post={post} />
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default BlogList;
