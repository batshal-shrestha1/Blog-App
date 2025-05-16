export function tags(
  posts: { tags: string; active: boolean }[],
): { name: string; count: number }[] {
  return posts
    .filter((p) => p.active)
    .reduce(
      (acc, post) => {
        post.tags.split(',').forEach((tag) => {
          const trimmedTag = tag.trim();
          const existingTag = acc.find((t) => t.name === trimmedTag);
          if (existingTag) {
            existingTag.count++;
          } else {
            acc.push({ name: trimmedTag, count: 1 });
          }
        });
        return acc;
      },
      [] as { name: string; count: number }[],
    )
    .sort((a, b) => a.name.localeCompare(b.name));
}
