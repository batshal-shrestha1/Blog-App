import { categories } from "@/functions/categories";
import type { Post } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";
import { SummaryItem } from "./SummaryItem";
import { LinkList } from "./LinkList";

export function CategoryList({ posts }: { posts: Post[] }) {
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
