import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";
import { toUrlPath } from "@repo/utils/url";
import Pagination from "@/components/Blog/Pagination";
import { POSTS_PER_PAGE } from "../../constants";

function getPaginationParams(searchParams: Record<string, string | string[] | undefined>) {
  const page = parseInt((searchParams.page as string) || "1", 10);
  return { page: isNaN(page) || page < 1 ? 1 : page };
}

async function getPaginatedPosts({ name, page }: { name: string; page: number }) {
  // Fetch all posts and filter by category slug
  const allPosts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });
  const filtered = allPosts.filter(post => toUrlPath(post.category) === name);
  const total = filtered.length;
  const posts = filtered.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  return {
    posts: posts.map(post => ({ ...post, likes: post.Likes.length })),
    total,
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { name } = await params;
  const resolvedParams = await searchParams;
  const { page } = getPaginationParams(resolvedParams || {});
  const { posts, total } = await getPaginatedPosts({ name, page });
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  if (posts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>The category you are looking for does not exist.</p>
      </AppLayout>
    );
  }

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    return `/category/${name}?${params.toString()}`;
  };

  return (
    <AppLayout>
      <h1>Category: {name}</h1>
      <Main posts={posts}>
        <Pagination currentPage={page} totalPages={totalPages} getPageUrl={getPageUrl} />
      </Main>
    </AppLayout>
  );
}
