import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  const activePosts = posts.filter((post) => post.active);

  if (activePosts.length === 0) {
    return <div className="py-6">No Active Post Found</div>;
  }

  return <div className="py-6">
    <ul>
      {activePosts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </ul>
  </div>;
}

export default BlogList;
