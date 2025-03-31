import type { Post } from "@repo/db/data";
import { BlogListItem } from "./ListItem";

export function BlogList({ posts }: { posts: Post[] }) {
  return <div className="py-6">
    <ul>
      {posts.map((post) => (
        <BlogListItem key={post.id} post={post} />
      ))}
    </ul>
  </div>;
}

export default BlogList;
