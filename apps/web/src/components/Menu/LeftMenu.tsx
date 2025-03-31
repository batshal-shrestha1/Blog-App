import { posts } from "@repo/db/data";
import { CategoryList } from "./CategoryList";
import { HistoryList } from "./HistoryList";
import { TagList } from "./TagList";
import Link from "next/link";

export function LeftMenu() {
  return (
    <div>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div>
        <Link href="/" >Full Stack Blog</Link>
      </div>
      <nav>
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li title="Categories">
            <CategoryList posts={posts} />
          </li>
          <li title="History">
            <HistoryList selectedYear="" selectedMonth="" posts={posts} />
          </li>
          <li title="Tags">
            <TagList selectedTag="" posts={posts} />
          </li>
          <li>Admin</li>
        </ul>
      </nav>
    </div>
  );
}
