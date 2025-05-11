import { posts } from "@repo/db/data";
import { cookies } from "next/headers";
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
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return <LoginForm />;
  }

  const post = posts.find((p) => p.urlId === resolvedParams.urlId);

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