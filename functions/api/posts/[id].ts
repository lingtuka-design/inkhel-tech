interface Env {
  DB: D1Database;
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    const post: any = await context.request.json();

    const tagsJson = JSON.stringify(post.tags || []);
    const specsJson = JSON.stringify(post.specs || {});
    const prosJson = JSON.stringify(post.pros || []);
    const consJson = JSON.stringify(post.cons || []);
    const affJson = JSON.stringify(post.affiliateLinks || {});

    await context.env.DB.prepare(`
      UPDATE posts SET
        slug = ?,
        title = ?,
        excerpt = ?,
        category = ?,
        author = ?,
        published_at = ?,
        read_time = ?,
        image = ?,
        content = ?,
        tags = ?,
        specs = ?,
        pros = ?,
        cons = ?,
        affiliate_links = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).bind(
      post.slug,
      post.title,
      post.excerpt || '',
      post.category || 'Smartphones',
      post.author || 'iTECH Editorial',
      post.publishedAt,
      Number(post.readTime) || 5,
      post.image || '',
      post.content || '',
      tagsJson,
      specsJson,
      prosJson,
      consJson,
      affJson,
      id
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

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const id = context.params.id as string;
    await context.env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();

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
