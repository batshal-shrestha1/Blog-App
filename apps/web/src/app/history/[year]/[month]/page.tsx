import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";

async function getPostsByYearMonth(year: string, month: string) {
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });

  return posts
    .map(post => ({ ...post, likes: post.Likes.length }))
    .filter(post => {
      const date = new Date(post.date);
      return (
        date.getFullYear() === parseInt(year) &&
        date.getMonth() + 1 === parseInt(month)
      );
    });
}

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { year, month } = await params;
  const filteredPosts = await getPostsByYearMonth(year, month);

  if (filteredPosts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>No posts found for the specified month and year.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1>History: {month}/{year}</h1>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}