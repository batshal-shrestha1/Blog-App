import { history } from "@/functions/history";
import type { PostWithLikes } from "@repo/db/types";
import { SummaryItem } from "./SummaryItem";
import { LinkList } from "./LinkList";

const months = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export async function HistoryList({
  selectedYear,
  selectedMonth,
  posts,
}: {
  selectedYear?: string;
  selectedMonth?: string;
  posts: PostWithLikes[];
}) {
  const historyItems = history(posts);

  return (
    <LinkList title="History">
      <ul>
        {historyItems.map((item, idx) => {
          const { year, month, count } = item;
          const monthName = months[month];
          const isSelected =
            selectedYear === year.toString() &&
            selectedMonth === month.toString();

          return (
            <SummaryItem
              key={`${year}-${month}`}
              name={`${monthName}, ${year}`}
              link={`/history/${year}/${month}`}
              count={count}
              isSelected={isSelected}
              title={`History / ${monthName}, ${year}`}
            />
          );
        })}
      </ul>
    </LinkList>
  );
}
