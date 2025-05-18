import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";
import { toUrlPath } from "@repo/utils/url";

async function getPostsByCategory(name: string) {
  // Fetch all posts and filter by category slug
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });
  return posts
    .map(post => ({ ...post, likes: post.Likes.length }))
    .filter(post => toUrlPath(post.category) === name);
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filteredPosts = await getPostsByCategory(name);

  if (filteredPosts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>The category you are looking for does not exist.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1>Category: {name}</h1>
      <Main posts={filteredPosts}/>
    </AppLayout>
  );
}
