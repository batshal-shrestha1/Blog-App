import type { PostWithLikes } from "@repo/db/types";
import Link from "next/link";
import Image from "next/image";
import { HeartIcon } from "@heroicons/react/24/solid";

export function BlogListItem({ post }: { post: PostWithLikes }) {
  const tags = post.tags.split(",").map((tag) => tag.trim());
  const formattedDate = new Date(post.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return (
    <li className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 mb-8 flex flex-col md:flex-row gap-6">
      <div className="flex-shrink-0">
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={320}
          height={200}
          className="rounded-lg object-cover w-[320px] h-[200px]"
          priority
        />
      </div>
      <div className="flex flex-col flex-1 gap-2">
        <div className="flex items-center text-xs text-gray-500 gap-4 mb-1">
          <span>{formattedDate}</span>
          <span>{post.category}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
          <Link href={`/post/${post.urlId}`}>{post.title}</Link>
        </h2>
        <div className="text-gray-600 dark:text-gray-300 mb-2 line-clamp-3">{post.description}</div>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">#{tag}</span>
          ))}
        </div>
        <div className="flex items-center text-sm text-gray-400 gap-6 mt-auto">
          <span>{post.views} views</span>
          <span className="flex items-center gap-1"><HeartIcon className="h-4 w-4 text-red-500" /> {post.likes} likes</span>
        </div>
      </div>
    </li>
  );
}
