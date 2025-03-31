"use client";
import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { marked } from "marked";

export function BlogDetail({ post }: { post: Post }) {
  const [views, setViews] = useState(post.views);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (views === post.views) {
      const newViewCount = post.views + 1;
      setViews(newViewCount);
      post.views = newViewCount;
    }
  }, []);

  const handleLike = () => {
    setLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
    setIsLiked(!isLiked);
  };

  const tags = post.tags.split(",").map((tag) => tag.trim());

  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Safely parse Markdown content
  const parsedContent = post.content
    ? marked(post.content)
    : "<p>No content available</p>";

  return (
    <article data-test-id={`blog-post-${post.id}`}>
      <h2 style={{ fontWeight: "bold" }}>
        <Link href={`/post/${post.urlId}`}>{post.title}</Link>
      </h2>
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={600}
        height={400}
        style={{ objectFit: "cover", borderRadius: "8px" }}
      />
      <div
        data-test-id={`content-markdown`}
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      ></div>
      <div>{post.category}</div>
      <div>
        {tags.map((tag, index) => (
          <span key={index} style={{ marginRight: "8px" }}>
            #{tag}
          </span>
        ))}
      </div>
      <div>{formattedDate}</div>
      <div>{views} views</div>
      <div>
        {likes} likes
        <button
          onClick={handleLike}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: isLiked ? "red" : "gray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    </article>
  );
}