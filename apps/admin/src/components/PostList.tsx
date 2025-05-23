'use client';

import { PostWithLikes } from "@repo/db/types";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useFilter } from "./FilterBar";


const POSTS_PER_PAGE = 4; // Number of posts per page
interface PostListProps {
  posts: PostWithLikes[];
}

// Function to format date consistently
const formatDate = (date: Date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return `Posted on ${month} ${day}, ${year}`;
};

export default function PostList({ posts: initialPosts }: PostListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const { contentFilter, tagFilter, dateFilter, sortBy } = useFilter();
  const [currentPage, setCurrentPage] = useState(1);

  // Function to format tags
  const formatTags = (tags: string) => {
    return tags.split(',').map(tag => `#${tag.trim()}`).join(', ');
  };

  // Function to toggle post active status
  const toggleActiveStatus = async (postId: number) => {
    try {
      const response = await fetch('/api/posts/toggle-active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId }),
      });

      if (response.ok) {
        // Update local state
        setPosts(posts.map(post => {
          if (post.id === postId) {
            return { ...post, active: !post.active };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error('Error toggling post status:', error);
    }
  };

  // Filter posts based on content, tag, and date
  const filteredPosts = posts.filter(post => {
    const matchesContent = !contentFilter || 
      post.title.toLowerCase().includes(contentFilter.toLowerCase()) || 
      post.content.toLowerCase().includes(contentFilter.toLowerCase());
    
    const matchesTag = !tagFilter || 
      post.tags.toLowerCase().includes(tagFilter.toLowerCase());
    
    // Date filtering logic
    let matchesDate = true;
    if (dateFilter) {
      // Parse the date filter (DDMMYYYY format)
      const day = parseInt(dateFilter.substring(0, 2));
      const month = parseInt(dateFilter.substring(2, 4)) - 1; // JS months are 0-indexed
      const year = parseInt(dateFilter.substring(4, 8));
      
      // Create a Date object for the filter date
      const filterDate = new Date(year, month, day);
      filterDate.setHours(0, 0, 0, 0); // Reset time part
      
      // Get date without time for comparison
      const postDate = new Date(post.date);
      postDate.setHours(0, 0, 0, 0);
      
      // Check if post date is after or equal to the filter date
      matchesDate = postDate >= filterDate;
    }
    
    return matchesContent && matchesTag && matchesDate;
  });

  // Sort posts based on selected option
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'date-asc':
        return a.date.getTime() - b.date.getTime();
      case 'date-desc':
      default:
        return b.date.getTime() - a.date.getTime(); // Default to date descending
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // Pagination navigation
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [contentFilter, tagFilter, dateFilter, sortBy]);

  return (
    <div className="grid gap-6">
      <div className="flex justify-end mb-4">
        <Link 
          href="/posts/create" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Create Post
        </Link>
      </div>
      {paginatedPosts.length === 0 ? (
        <div className="py-6">0 Posts</div>
      ) : (
        paginatedPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white shadow rounded-lg p-6"
            data-test-id="article"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <Link href={`/post/${post.urlId}`} className="block">
                  <h2 className="text-xl font-semibold mb-2 hover:text-indigo-600">{post.title}</h2>
                </Link>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span className="mr-4">{formatDate(post.date)}</span>
                  <span className="mr-4">{post.category}</span>
                  <span>{formatTags(post.tags)}</span>
                </div>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md mb-4"
                  width={600}
                  height={300}
                  // onError={(e) => {
                  //   const target = e.currentTarget;
                  //   if (target.src !== 'http://example.com/image.jpg') {
                  //     target.src = 'http://example.com/image.jpg';
                  //   }
                  // }
               // }
                />
              </div>
              <button
                onClick={() => toggleActiveStatus(post.id)}
                className={`ml-4 px-3 py-1 rounded-md ${
                  post.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
                data-test-id="active-button"
              >
                {post.active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </article>
        ))
      )}
      <div className="flex justify-center items-center gap-2 mt-8" aria-label="Pagination">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
          aria-label="Previous Page"
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => goToPage(i + 1)}
            disabled={currentPage === i + 1}
            aria-current={currentPage === i + 1 ? "page" : undefined}
            className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-red-700 text-white" : "hover:bg-gray-100"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${currentPage === totalPages ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-gray-100"}`}
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
}