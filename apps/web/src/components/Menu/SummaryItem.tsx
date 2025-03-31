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
  const itemStyle = isSelected
    ? { backgroundColor: "#f0f0f0", fontWeight: "bold" }
    : { backgroundColor: "transparent" };

  return (
    <li style={itemStyle}>
      <Link href={link} title={title || name}  style={{ textDecoration: "none", color: "inherit" }}>
        {name} <span data-test-id="post-count">({count})</span>
      </Link>
    </li>
  );
  
 // return <li>{CategoryList.name}</li>;
}