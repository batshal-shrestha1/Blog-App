"use client";
import type { Post, Like } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { marked } from "marked";
import { HeartIcon } from "@heroicons/react/24/solid";

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
    hasIncremented.current = { [post.id]: true };
    fetch(`/api/posts/increment-views`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data.views === "number") setViews(data.views);
      });
    fetch(`/api/likes?postId=${post.id}`, { cache: "no-store" })
      .then(res => res.json())
      .then(data => {
        setIsLiked(data.liked);
        setReady(true);
      });
  }, [post.id]);

  const handleLike = async () => {
    if (!ready) return;
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
  const parsedContent = post.content
    ? marked(post.content)
    : "<p>No content available</p>";

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl shadow p-8 max-w-3xl mx-auto mt-8">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        <Link href={`/post/${post.urlId}`}>{post.title}</Link>
      </h2>
      <div className="flex items-center text-sm text-gray-500 gap-4 mb-4">
        <span>{formattedDate}</span>
        <span>{post.category}</span>
        <span className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">#{tag}</span>
          ))}
        </span>
      </div>
      <Image
        src={post.imageUrl}
        alt={post.title}
        width={800}
        height={400}
        className="rounded-lg object-cover w-full max-h-[400px] mb-6"
        priority
      />
      <div
        data-test-id={`content-markdown`}
        className="prose dark:prose-invert max-w-none mb-6"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      ></div>
      <div className="flex items-center justify-between text-gray-500 text-sm mt-6">
        <span>{views} views</span>
        <button
          data-test-id={`like-button`}
          onClick={handleLike}
          disabled={loading || !ready}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-white transition-colors ${isLiked ? "bg-red-600" : "bg-gray-400 hover:bg-red-500"} ${loading || !ready ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <HeartIcon className="h-5 w-5" />
          {likes} {isLiked ? "Unlike" : "Like"}
        </button>
      </div>
    </article>
  );
}