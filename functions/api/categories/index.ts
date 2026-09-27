interface Env {
  DB: D1Database;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const { results } = await context.env.DB.prepare(
      'SELECT name FROM categories ORDER BY rowid ASC'
    ).all();

    const categories = results.map((r: any) => r.name);

    return new Response(JSON.stringify(categories), {
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
    const { name } = (await context.request.json()) as { name?: string };

    if (!name || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Category name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'INSERT OR IGNORE INTO categories (name) VALUES (?)'
    ).bind(name.trim()).run();

    return new Response(JSON.stringify({ success: true, name: name.trim() }), {
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
    const { name } = (await context.request.json()) as { name?: string };

    if (!name) {
      return new Response(JSON.stringify({ error: 'Category name is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await context.env.DB.prepare(
      'DELETE FROM categories WHERE name = ?'
    ).bind(name).run();

    return new Response(JSON.stringify({ success: true, name }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
