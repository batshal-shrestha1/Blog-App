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
    <li style={itemStyle} title={title}>
      <Link href={link} style={{ textDecoration: "none", color: "inherit" }}>
        {name} ({count})
      </Link>
    </li>
  );
  
 // return <li>{CategoryList.name}</li>;
}
