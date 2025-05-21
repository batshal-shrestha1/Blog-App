import type { PostWithLikes } from "@repo/db/types";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: PostWithLikes[] }) {
  const activePosts = posts.filter((post) => post.active);

  if (activePosts.length === 0) {
    return <div className="py-6">No Active Post Found</div>;
  }

  return (
    <div className="py-6">
      <ul className="space-y-8">
        {activePosts.map((post) => (
          <BlogListItem key={post.id} post={post} />
        ))}
      </ul>
    </div>
  );
}

export default BlogList;
