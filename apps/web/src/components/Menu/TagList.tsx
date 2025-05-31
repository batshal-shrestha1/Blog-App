import type { PostWithLikes } from "@repo/db/types";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";

export async function TagList({
  posts,
  selectedTag,
}: {
  selectedTag?: string;
  posts: PostWithLikes[];
}) {
  const postTags = await tags(posts);

  return (
    <LinkList title="Tags">
      <ul>
        {postTags.map((item) => (
          <SummaryItem
            key={item.name}
            name={item.name}
            link={`/tags/${toUrlPath(item.name)}`}
            count={item.count}     
            isSelected={selectedTag === item.name}
            title={`Tag / ${item.name}`}
          />
        ))}
      </ul>
    </LinkList>
  );
}

// return (
//   <LinkList title="Tags">
//     Tags {/* Todo implement, use the summary item */}

//   </LinkList>
// );
