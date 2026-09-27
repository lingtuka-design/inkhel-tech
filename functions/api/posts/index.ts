interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT * FROM posts ORDER BY datetime(created_at) DESC, published_at DESC'
    ).all();

    const posts = results.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      category: row.category,
      author: row.author,
      publishedAt: row.published_at,
      readTime: Number(row.read_time) || 5,
      image: row.image,
      content: row.content,
      tags: row.tags ? JSON.parse(row.tags) : [],
      specs: row.specs ? JSON.parse(row.specs) : {},
      pros: row.pros ? JSON.parse(row.pros) : undefined,
      cons: row.cons ? JSON.parse(row.cons) : undefined,
      affiliateLinks: row.affiliate_links ? JSON.parse(row.affiliate_links) : undefined,
    }));

    return new Response(JSON.stringify(posts), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const post: any = await context.request.json();

    if (!post.title || !post.slug) {
      return new Response(JSON.stringify({ error: 'Title and slug are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const id = post.id || Date.now().toString();
    const tagsJson = JSON.stringify(post.tags || []);
    const specsJson = JSON.stringify(post.specs || {});
    const prosJson = JSON.stringify(post.pros || []);
    const consJson = JSON.stringify(post.cons || []);
    const affJson = JSON.stringify(post.affiliateLinks || {});

    await context.env.DB.prepare(`
      INSERT INTO posts (
        id, slug, title, excerpt, category, author, published_at, read_time, image, content, tags, specs, pros, cons, affiliate_links, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
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
        updated_at = datetime('now')
    `).bind(
      id,
      post.slug,
      post.title,
      post.excerpt || '',
      post.category || 'Smartphones',
      post.author || 'iTECH Editorial',
      post.publishedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      Number(post.readTime) || 5,
      post.image || '',
      post.content || '',
      tagsJson,
      specsJson,
      prosJson,
      consJson,
      affJson
    ).run();

    return new Response(JSON.stringify({ success: true, id }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
