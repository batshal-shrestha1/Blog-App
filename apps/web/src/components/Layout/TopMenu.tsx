"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";
import { useState } from "react";
import Link from "next/link";

function debounce<T extends (...args: any[]) => any>(fn: T, delay = 300) {
  let timeoutId: any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(query || "");

  const handleSearch = debounce((value: string) => {
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }, 300);

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    handleSearch(value);
  };

  return (
    <div className="flex items-center justify-between border-b bg-white dark:bg-gray-950 px-8 py-4">
      <div className="flex-1 flex justify-center">
        <form action="#" method="GET" className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={onSearchChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </form>
      </div>
      <div className="ml-6 flex-shrink-0 flex items-center gap-4">
        <Link
          href="https://blog-app-web-eight.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded bg-red-700 text-white font-semibold hover:bg-red-800 transition"
        >
          Admin
        </Link>
        <ThemeSwitch />
      </div>
    </div>
  );
}
