import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function SearchPage({ 
  searchParams }: { searchParams: Promise<{ q?: string }>; 
}) {
  const { q } = await searchParams;

  // Filter posts based on the search query
  const filteredPosts = posts.filter((post) =>{

      const query = q?.toLowerCase() || "";
      return (
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
    }
  );

  // If no posts match the search query, display "0 Posts"
  if (filteredPosts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>No posts found for the search query "{q}".</p>
      </AppLayout>
    );
  }

  // Render the filtered posts
  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}