import type { PostWithLikes } from "@repo/db/types";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: PostWithLikes[] }) {
  const activePosts = posts.filter((post) => post.active);

  if (activePosts.length === 0) {
    return <div className="py-6">No Active Post Found</div>;
  }

  return (
    <section className="py-6">
      {activePosts.length === 0 ? (
        <div>No Active Post Found</div>
      ) : (
        <ul className="space-y-8">
          {activePosts.map((post) => (
            <article key={post.id}>
              <BlogListItem post={post} />
            </article>
          ))}
        </ul>
      )}
    </section>
  );
}

export default BlogList;
