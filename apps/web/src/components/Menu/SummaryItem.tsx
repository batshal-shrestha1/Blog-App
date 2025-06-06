import Link from "next/link";
export function SummaryItem({
  name,
  link,
  count,
  isSelected,
  title,
}: {
  name: string;
  link: string;
  count: number;
  isSelected: boolean;
  title?: string;
}) {
  // TODO: Implement the summary item
  // must show the number of posts in that category and the name
  // if if is selected it must show in different color/background
  return (
    <li>
      <Link
        href={link}
        title={title || name}
        className={`flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors${isSelected ? " selected bg-gray-200 dark:bg-gray-700 font-bold" : ""}`}
      >
        <span>{name}</span>
        <span data-test-id="post-count" className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full">
          {count}
        </span>
      </Link>
    </li>
  );
  
 // return <li>{CategoryList.name}</li>;
}