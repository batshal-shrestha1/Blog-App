import type { PostWithLikes } from "@repo/db/types";
import Link from "next/link";
import Image from "next/image";

export function BlogListItem({ post }: { post: PostWithLikes }) {
  const tags = post.tags.split(",").map((tag) => tag.trim());
  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <article
      key={post.id}
      className="flex flex-row gap-8"
      data-test-id={`blog-post-${post.id}`}
    >
      <h2 style={{ fontWeight: "bold" }}>
        <Link href={`/post/${post.urlId}`}>{post.title}</Link>
      </h2>
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={300}
        height={200}
        style={{ objectFit: "cover", width: "300px", height: "200px" }}
        priority
      />
      <div>{post.description}</div>
      <div>{post.category}</div>
      <div>{formattedDate}</div>
      <div>
        {tags.map((tag, index) => (
          <span key={index} style={{ marginRight: "8px" }}>
            #{tag}
          </span>
        ))}
      </div>
      <div>{post.likes} likes</div>
      <div>{post.views} views</div>
      <hr />
    </article>
  );
}
