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
  const where: any = { active: true, tags: { contains: name, mode: "insensitive" } };
  // Fetch all posts and filter by tag slug
  const allPosts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });
  const filtered = allPosts.filter(post => {
    const normalizedTags = post.tags.split(",").map((tag) => toUrlPath(tag.trim()));
    return normalizedTags.includes(name);
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
  params: Promise<{ name: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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
        <p>The posts you are looking for does not exist.</p>
      </AppLayout>
    );
  }

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", String(p));
    return `/tags/${name}?${params.toString()}`;
  };

  return (
    <AppLayout>
      <Main posts={posts}>
        <Pagination currentPage={page} totalPages={totalPages} getPageUrl={getPageUrl} />
      </Main>
    </AppLayout>
  );
}