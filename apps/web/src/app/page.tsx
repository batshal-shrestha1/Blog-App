import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
import { client } from "@repo/db/client";
import Pagination from "../components/Blog/Pagination";
import { POSTS_PER_PAGE } from "./constants";

function getPaginationParams(searchParams: Record<string, string | string[] | undefined>) {
  const page = parseInt((searchParams.page as string) || "1", 10);
  const q = (searchParams.q as string) || "";
  return { page: isNaN(page) || page < 1 ? 1 : page, q };
}

async function getPaginatedPosts({ page, q }: { page: number; q: string }) {
  const where: any = { active: true };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }
  const [total, posts] = await Promise.all([
    client.db.post.count({ where }),
    client.db.post.findMany({
      where,
      orderBy: { date: "desc" },
      include: { Likes: true },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
  ]);
  return {
    posts: posts.map(post => ({ ...post, likes: post.Likes.length })),
    total,
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const { page, q } = getPaginationParams(resolvedParams || {});
  const { posts, total } = await getPaginatedPosts({ page, q });
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  if (posts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>No posts found{q ? ` for search "${q}"` : ""}.</p>
      </AppLayout>
    );
  }

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("page", String(p));
    return `/?${params.toString()}`;
  };

  return (
    <AppLayout>
      <Main posts={posts} className={styles.main}>
        <Pagination currentPage={page} totalPages={totalPages} getPageUrl={getPageUrl} />
      </Main>
    </AppLayout>
  );
}