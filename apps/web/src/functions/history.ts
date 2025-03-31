export function history(posts: { date: Date; active: boolean }[]): string[] {
  // Implement per specification
  // Return the ordered list of "month, year" strings sorted from most recent to oldes
  // consider only active posts

  return posts
    .filter(post => post.active)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(post => `${post.date.toLocaleString('default', { month: 'long' })}, ${post.date.getFullYear()}`);
}
