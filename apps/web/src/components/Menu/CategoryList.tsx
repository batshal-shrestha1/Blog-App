import type { PostWithLikes } from "@repo/db/types";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";
import { LinkList } from "./LinkList";
import { categories } from "@/functions/categories";

export function CategoryList({ posts }: { posts: PostWithLikes[] }) {
  // TODO: Implement proper category list

  return (
    <LinkList title="Categories">
      <ul>
        {categories(posts).map((item) => (
          <SummaryItem
            key={item.name}
            name={item.name}
            link={`/category/${toUrlPath(item.name)}`}
            count={item.count}
            isSelected={false}
            title={`Category / ${item.name}`}
          />
        ))}
      </ul>
    </LinkList>
  );
}
