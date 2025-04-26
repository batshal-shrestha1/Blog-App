import { cookies } from "next/headers";
import LoginForm from "../../../components/LoginForm";
import CreatePostForm from "../../../components/CreatePostForm";

export default async function CreatePost() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("auth_token");

  if (!authToken) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <CreatePostForm />
        </div>
      </main>
    </div>
  );
} 