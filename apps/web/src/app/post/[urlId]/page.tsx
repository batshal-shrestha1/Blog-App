import { BlogDetail } from "@/components/Blog/Detail";
import { AppLayout } from "@/components/Layout/AppLayout";
import { posts } from "@repo/db/data";
import { parse } from "marked";

export default async function Page({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  const post = posts.find((post) => { 
    return post.urlId === urlId
  });


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
      {/* <h1 data-test-id={`blog-post-${post.id}`}>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html : parse(post.content)}}></div> */}
    </AppLayout>
  );
}
