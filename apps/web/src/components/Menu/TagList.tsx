import { type Post } from "@repo/db/data";
import { tags } from "../../functions/tags";
import { LinkList } from "./LinkList";
import { SummaryItem } from "./SummaryItem";
import { toUrlPath } from "@repo/utils/url";

export async function TagList({
  selectedTag,
  posts,
}: {
  selectedTag?: string;
  posts: Post[];
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
            isSelected={false}
            title={`Tag / ${item.name}`} // Updated to show "Tag / {name}"
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
