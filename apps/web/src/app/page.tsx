import { AppLayout } from "../components/Layout/AppLayout";
import { Main } from "../components/Main";
import styles from "./page.module.css";
import { client } from "@repo/db/client";

async function getAllPosts() {
  const posts = await client.db.post.findMany({
    where: { active: true },
    orderBy: { date: "desc" },
    include: { Likes: true },
  });
  return posts.map(post => ({ ...post, likes: post.Likes.length }));
}

export default async function Home() {
  const posts = await getAllPosts();
  return (
    <AppLayout>
      <Main posts={posts} className={styles.main} />
    </AppLayout>
  );
}