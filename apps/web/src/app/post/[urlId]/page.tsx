import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { client } from "@repo/db/client";

async function getPostByUrlId(urlId: string) {
  const post = await client.db.post.findUnique({
    where: { urlId },
    include: { Likes: true }
  });

  if (!post) return null;

  return {
    ...post,
    likes: post.Likes.length // Convert Likes array to count
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>
}) {
  const post = await getPostByUrlId((await params).urlId);

  if (!post) {
    return (
      <AppLayout>
        <h1>Post not found</h1>
        <p>The post you are looking for does not exist.</p>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <BlogDetail post={post} />
    </AppLayout>
  );
}