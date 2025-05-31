import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
import { client } from "@repo/db/client";
import Pagination from "../components/Blog/Pagination";
import { POSTS_PER_PAGE } from "./constants";

function getPaginationParams(searchParams: Record<string, string | string[] | undefined>) {
  const page = parseInt((searchParams.page as string) || "1", 10);
  return { page: isNaN(page) || page < 1 ? 1 : page };
}

async function getPaginatedPosts({ page }: { page: number }) {
  // Only show active posts, no search logic here
  const filter: any = { active: true };

  // Fetch total count and paginated posts in parallel
  const [totalPosts, paginatedPosts] = await Promise.all([
    client.db.post.count({ where: filter }),
    client.db.post.findMany({
      where: filter,
      orderBy: { date: "desc" },
      include: { Likes: true },
      skip: (page - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
    }),
  ]);

  // Add a 'likes' property to each post for convenience
  const postsWithLikes = paginatedPosts.map(post => ({
    ...post,
    likes: post.Likes.length,
  }));

  return {
    posts: postsWithLikes,
    total: totalPosts,
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const { page } = getPaginationParams(resolvedParams || {});
  const { posts, total } = await getPaginatedPosts({ page });
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  if (posts.length === 0) {
    return (
      <AppLayout>
        <h1>0 Posts</h1>
        <p>No posts found.</p>
      </AppLayout>
    );
  }

  const getPageUrl = (p: number) => {
    const params = new URLSearchParams();
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