import { posts } from "@repo/db/data";
import { isLoggedIn } from "../utils/auth";
import LoginForm from "../components/LoginForm";
import PostList from "../components/PostList";
import FilterBar, { FilterProvider } from "../components/FilterBar";
import LogoutButton from "../components/LogoutButton";

export default async function Home() {
  const isAuthenticated = await isLoggedIn();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Sort posts by date in descending order
  const sortedPosts = [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
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
          <FilterProvider>
            <FilterBar />
            <PostList posts={sortedPosts} />
          </FilterProvider>
        </div>
      </main>
    </div>
  );
}
