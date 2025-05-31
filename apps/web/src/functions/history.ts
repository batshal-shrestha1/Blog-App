export function history(posts: { date: Date; active: boolean }[]): { month: number; year: number; count: number }[] {
  if (!Array.isArray(posts) || posts.length === 0) return [];
  const counts: Record<string, { month: number; year: number; count: number }> = {};
  for (const post of posts) {
    if (!post.active || !post.date) continue;
    const dateObj = new Date(post.date);
    if (isNaN(dateObj.getTime())) continue;
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // 1-based month
    const key = `${year}-${month}`;
    if (!counts[key]) {
      counts[key] = { month, year, count: 0 };
    }
    counts[key].count++;
  }
  return Object.values(counts)
    .sort((a, b) => b.year - a.year || b.month - a.month);
}
