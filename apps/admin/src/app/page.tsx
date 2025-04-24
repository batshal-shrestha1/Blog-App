import { posts } from "@repo/db/data";
import { cookies } from 'next/headers';
import LoginForm from "../components/LoginForm";
import PostList from "../components/PostList";
import FilterBar, { FilterProvider } from "../components/FilterBar";

// Function to normalize dates by removing time component
const normalizeDate = (date: Date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

export default async function Home() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');

  if (!authToken) {
    return <LoginForm />;
  }

  // Sort posts by date in descending order, using normalized dates
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = normalizeDate(a.date);
    const dateB = normalizeDate(b.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin of Full Stack Blog
          </h1>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </form>
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
