interface Env {
  DB: D1Database;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { id, featured } = (await context.request.json()) as {
      id?: string;
      featured?: boolean;
    };

    if (!id) {
      return new Response(JSON.stringify({ error: 'Post ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (featured) {
      // Set selected post as 1, and all others as 0 atomically
      await context.env.DB.prepare(
        'UPDATE posts SET is_featured = CASE WHEN id = ? THEN 1 ELSE 0 END'
      ).bind(id).run();
    } else {
      // Unfeature this post
      await context.env.DB.prepare(
        'UPDATE posts SET is_featured = 0 WHERE id = ?'
      ).bind(id).run();
    }

    return new Response(JSON.stringify({ success: true, id, featured: Boolean(featured) }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
