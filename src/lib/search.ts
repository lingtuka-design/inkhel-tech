import type { Post, Category } from '../data/posts';

export function filterPosts(
  posts: Post[],
  query: string,
  category: Category | 'All' = 'All'
): Post[] {
  let filtered = posts;

  if (category && category !== 'All') {
    filtered = filtered.filter((post) => post.category === category);
  }

  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) {
    return filtered;
  }

  return filtered.filter((post) => {
    const titleMatch = post.title.toLowerCase().includes(cleanQuery);
    const excerptMatch = post.excerpt.toLowerCase().includes(cleanQuery);
    const categoryMatch = post.category.toLowerCase().includes(cleanQuery);
    const authorMatch = post.author.toLowerCase().includes(cleanQuery);
    const tagsMatch = post.tags?.some((t) => t.toLowerCase().includes(cleanQuery));

    return titleMatch || excerptMatch || categoryMatch || authorMatch || tagsMatch;
  });
}
