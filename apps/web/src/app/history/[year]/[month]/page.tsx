import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { client } from "@repo/db/client";
import Pagination from "@/components/Blog/Pagination";
import { POSTS_PER_PAGE } from "../../../constants";

function getPaginationParams(searchParams: Record<string, string | string[] | undefined>) {
  const page = parseInt((searchParams.page as string) || "1", 10);
  return { page: isNaN(page) || page < 1 ? 1 : page };
}

async function getPaginatedPosts({ year, month, page }: { year: string; month: string; page: number }) {
  const allPosts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });
  const filtered = allPosts.filter(post => {
    const date = new Date(post.date);
    return (
      date.getFullYear() === parseInt(year) &&
      date.getMonth() + 1 === parseInt(month)
    );
  });
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
  params: Promise<{ year: string; month: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { year, month } = await params;
  const resolvedParams = await searchParams;
  const { page } = getPaginationParams(resolvedParams || {});
  const { posts, total } = await getPaginatedPosts({ year, month, page });
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  if (posts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>No posts found for the specified month and year.</p>
      </AppLayout>
    );
  }

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    return `/history/${year}/${month}?${params.toString()}`;
  };

  return (
    <AppLayout>
      <h1>History: {month}/{year}</h1>
      <Main posts={posts}>
        <Pagination currentPage={page} totalPages={totalPages} getPageUrl={getPageUrl} />
      </Main>
    </AppLayout>
  );
}