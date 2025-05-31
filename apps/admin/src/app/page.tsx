import { client } from "@repo/db/client";
import { isLoggedIn } from "../utils/auth";
import LoginForm from "../components/LoginForm";
import PostList from "../components/PostList";
import FilterBar, { FilterProvider } from "../components/FilterBar";
import LogoutButton from "../components/LogoutButton";
import SuccessMessage from "../components/SuccessMessage";

export default async function Home() {
  const isAuthenticated = await isLoggedIn();

  if (!isAuthenticated) {
    return <LoginForm />;
  }
  else {
    // Fetch posts from the database, including Likes relation
    const posts = await client.db.post.findMany({
      orderBy: { date: "desc" },
      include: { Likes: true },
    });
    
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin of Full Stack Blog
            </h1>
            <LogoutButton />
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <SuccessMessage />
            <FilterProvider>
              <FilterBar />
              <PostList posts={posts} />
            </FilterProvider>
          </div>
        </main>
      </div>
    );
  }
}