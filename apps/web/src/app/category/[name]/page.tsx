import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const filteredPosts = posts.filter((post) => {
    return toUrlPath(post.category) === name && post.active;
  })

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
