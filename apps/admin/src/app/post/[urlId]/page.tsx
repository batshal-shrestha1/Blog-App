import { client } from "@repo/db/client";
import { PostWithLikes } from "@repo/db/types";
import { isLoggedIn } from "../../../utils/auth";
import LoginForm from "../../../components/LoginForm";
import UpdatePostForm from "../../../components/UpdatePostForm";

interface PageProps {
  params: Promise<{ urlId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UpdatePost({
  params,
  searchParams,
}: PageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const loggedIn = await isLoggedIn();
  if (!loggedIn) {
    return <LoginForm />;
  }

  const post = await client.db.post.findUnique({
    where: { urlId: resolvedParams.urlId },
  });

  if (!post) {
    return <div>Post not found</div>;
  }

  const postWithLikes: PostWithLikes = { ...post, likes: 0 };
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UpdatePostForm post={postWithLikes} />
        </div>
      </main>
    </div>
  );
} 