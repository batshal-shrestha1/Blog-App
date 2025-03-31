import type { Post } from "@repo/db/data";
import Link from "next/link";
import Image from "next/image"; 

export function BlogListItem({ post }: { post: Post }) {
  const tags = post.tags.split(",").map((tag) => tag.trim());
  const formattedDate = post.date.toLocaleDateString("en-GB", {
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
      {/* <img src={post.imageUrl} alt={post.title} style={{ width: "100%", height: "auto" }} /> */}

      <Image
        src={post.imageUrl} // The image URL
        alt={post.title} // Alt text for accessibility
        width={300} // Set the width of the image
        height={200} // Set the height of the image
        style={{ objectFit: "cover" }} // Optional: Add styling for the image
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

      {/* Blog Likes and Views */}
      <div>{post.likes} likes</div>
      <div>{post.views} views</div>
      <hr />
    </article>
  );
}
