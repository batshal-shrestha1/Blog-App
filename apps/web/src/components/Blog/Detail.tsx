"use client";
import type { Post } from "@repo/db/data";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image"; // Importing Image component from Next.js

export function BlogDetail({ post }: { post: Post }) {
  const [views, setViews] = useState(post.views); // Initialize with the value from the Post object
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false); // Track if the user has liked the post

  useEffect(() => {
    // Increment views every time the page is visited
    setViews((prevViews) => prevViews + 1);

    // Update the views in the Post object (mocked here)
    post.views = post.views + 1; // Increment the original post.views value
  }, []); // Runs only once when the component mounts

  const handleLike = () => {
    if (isLiked) {
      // Unlike the post
      setLikes((prevLikes) => prevLikes - 1);
    } else {
      // Like the post
      setLikes((prevLikes) => prevLikes + 1);
    }
    setIsLiked(!isLiked); // Toggle the like state
  };

  const tags = post.tags.split(",").map((tag) => tag.trim());

  const formattedDate = post.date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <article data-test-id={`blog-post-${post.id}`}>
      <h2 style={{ fontWeight: "bold" }}>
        <Link href={`/post/${post.urlId}`}>{post.title}</Link>
      </h2>
      <Image
        src={post.imageUrl} // The image URL
        alt={post.title} // Alt text for accessibility
        width={600} // Set the width of the image
        height={400} // Set the height of the image
        style={{ objectFit: "cover", borderRadius: "8px" }} // Optional: Add styling for the image
      />

      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
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