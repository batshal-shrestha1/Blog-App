import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";
import { toUrlPath } from "@repo/utils/url";

async function getPostsByTag(name: string) {
  // Fetch all posts and filter by tag slug
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });
  return posts
    .map(post => ({ ...post, likes: post.Likes.length }))
    .filter(post => {
      const normalizedTags = post.tags.split(",").map((tag) => toUrlPath(tag.trim()));
      return normalizedTags.includes(name);
    });
}

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const filteredPosts = await getPostsByTag(name);

  if (filteredPosts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>The posts you are looking for does not exist.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Main posts={filteredPosts}/>
    </AppLayout>
  );
}