"use client";

import { useRouter } from "next/navigation";
import ThemeSwitch from "../Themes/ThemeSwitcher";
import { useState } from "react";

function debounce<T extends (...args: Any[]) => Any>(fn: T, delay = 300) {
  let timeoutId: Any;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState(query || "");

  // const handleSearch = debounce(
  //   (event: React.ChangeEvent<HTMLInputElement>) => {
  //     const search = event.target.value;
  //     router.push(`/search?q=${search}`);
  //   },
  // );

  const handleSearch = debounce((value: string) => {
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }, 300);

  // Update the search state and trigger the debounced handler
  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    handleSearch(value);
  };

  // TODO: create and hook the search input to the handleSearch function
  //       make sure you are able to explain what the handleSearch is doing and what debounce does

  return (
    <div className="flex justify-between items-center p-4">
      <form action="#" method="GET" className="flex-1">
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={onSearchChange}
          className="p-2 border rounded w-full"
        />
      </form>
      <div className="flex items-center gap-x-6">
        <ThemeSwitch />
      </div>
    </div>
  );
}
