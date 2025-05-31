import { client } from "@repo/db/client";
import { isLoggedIn } from "../../../utils/auth";
import LoginForm from "../../../components/LoginForm";
import UpdatePostForm from "../../../components/UpdatePostForm";

interface PageProps {
  params: Promise<{ urlId: string }>;
}

export default async function UpdatePost({
  params,
}: PageProps) {
  const [resolvedParams] = await Promise.all([params]);
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

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UpdatePostForm post={post} />
        </div>
      </main>
    </div>
  );
}