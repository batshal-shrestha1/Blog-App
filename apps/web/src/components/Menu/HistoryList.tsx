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

  // TODO: use the "history" function on "functions" directory to get the history
  //       and render all history items using the SummaryItem component

  return (
    <LinkList title="History">
      <ul>
        {historyItems.map((dateString, idx) => {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = months[date.getMonth() + 1];
          const isSelected =
            selectedYear === year.toString() &&
            selectedMonth === (date.getMonth() + 1).toString();

          return (
            <SummaryItem
              key={`${dateString}-${idx}`}
              name={`${month} ${year}`}
              link={`/history/${year}/${date.getMonth() + 1}`}
              count={posts.filter(
                (post) =>
                  post.date.getFullYear() === year &&
                  post.date.getMonth() === date.getMonth()
              ).length}
              isSelected={isSelected}
              title={`History / ${dateString}`}
            />
          );
        })}
      </ul>
    </LinkList>
  );
}
