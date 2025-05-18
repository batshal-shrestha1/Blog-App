import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";

async function getPostsBySearch(q: string = "") {
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });

  const query = q.toLowerCase();
  return posts
    .map(post => ({ ...post, likes: post.Likes.length }))
    .filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query)
    );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const filteredPosts = await getPostsBySearch(q);

  if (filteredPosts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>No posts found for the search query &quot;{q}&quot;.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}