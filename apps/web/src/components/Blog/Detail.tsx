"use client";
import type { Post, Like } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { marked } from "marked";

type PostWithLikes = Post & {
  Likes: Like[];
  likes: number;
};

export function BlogDetail({ post }: { post: PostWithLikes }) {
  const [views, setViews] = useState(post.views);
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const hasIncremented = useRef<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (hasIncremented.current[post.id]) return;
    hasIncremented.current = { [post.id]: true }; // Reset for new post
    console.log("Incrementing views for post", post.id);
    // Increment views and update state
    fetch(`/api/posts/increment-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.views === "number") setViews(data.views);
      });
    // Fetch if the user has liked this post
    fetch(`/api/likes?postId=${post.id}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        console.log("isLiked GET response:", data.liked);
        setIsLiked(data.liked);
        setReady(true);
      });
  }, [post.id]);

  const handleLike = async () => {
    if (!ready) return;
    console.log("handleLike called, isLiked:", isLiked);
    const method = isLiked ? "DELETE" : "POST";
    setLoading(true);
    const res = await fetch("/api/likes", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });
    const data = await res.json();
    setLikes(data.likeCount);
    setIsLiked(data.liked);
    setLoading(false);
  };

  const tags = post.tags.split(",").map((tag) => tag.trim());

  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
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
        style={{ width: "100%", height: "auto" }}
        priority
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
          data-test-id={`like-button`}
          onClick={handleLike}
          disabled={loading || !ready}
          style={{
            marginLeft: "10px",
            padding: "5px 10px",
            backgroundColor: isLiked ? "red" : "gray",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: loading || !ready ? "not-allowed" : "pointer",
          }}
        >
          {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    </article>
  );
}