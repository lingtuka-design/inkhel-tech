interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { posts, categories } = (await context.request.json()) as {
      posts?: any[];
      categories?: string[];
    };

    const statements: any[] = [];

    // Sync categories if provided
    if (Array.isArray(categories)) {
      for (const cat of categories) {
        if (cat && typeof cat === 'string') {
          statements.push(
            context.env.DB.prepare(
              'INSERT OR IGNORE INTO categories (name) VALUES (?)'
            ).bind(cat.trim())
          );
        }
      }
    }

    // Sync posts if provided
    if (Array.isArray(posts)) {
      for (const post of posts) {
        if (post && post.id && post.title && post.slug) {
          const tagsJson = JSON.stringify(post.tags || []);
          const specsJson = JSON.stringify(post.specs || {});
          const prosJson = JSON.stringify(post.pros || []);
          const consJson = JSON.stringify(post.cons || []);
          const affJson = JSON.stringify(post.affiliateLinks || {});

          const isFeatured = post.featured ? 1 : 0;

          statements.push(
            context.env.DB.prepare(`
              INSERT INTO posts (
                id, slug, title, excerpt, category, author, published_at, read_time, image, content, tags, specs, pros, cons, affiliate_links, is_featured, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
              ON CONFLICT(id) DO UPDATE SET
                slug = excluded.slug,
                title = excluded.title,
                excerpt = excluded.excerpt,
                category = excluded.category,
                author = excluded.author,
                published_at = excluded.published_at,
                read_time = excluded.read_time,
                image = excluded.image,
                content = excluded.content,
                tags = excluded.tags,
                specs = excluded.specs,
                pros = excluded.pros,
                cons = excluded.cons,
                affiliate_links = excluded.affiliate_links,
                is_featured = excluded.is_featured,
                updated_at = datetime('now')
            `).bind(
              post.id,
              post.slug,
              post.title,
              post.excerpt || '',
              post.category || 'Phone',
              post.author || 'iTECH Editorial',
              post.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              Number(post.readTime) || 5,
              post.image || '',
              post.content || '',
              tagsJson,
              specsJson,
              prosJson,
              consJson,
              affJson,
              isFeatured
            )
          );
        }
      }
    }

    if (statements.length > 0) {
      await context.env.DB.batch(statements);
    }

    return new Response(JSON.stringify({ success: true, count: statements.length }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
