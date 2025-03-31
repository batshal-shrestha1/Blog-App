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
    const normalizedTags = post.tags.split(",").map((tag) => toUrlPath(tag.trim()));
    return normalizedTags.includes(name);
  });


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