interface Env {
  R2: R2Bucket;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const formData = await context.request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Extract file extension and clean filename
    const parts = file.name.split('.');
    const ext = (parts.length > 1 ? parts.pop() : 'jpg')?.toLowerCase() || 'jpg';
    const cleanName = parts
      .join('.')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 40) || 'image';

    const key = `${Date.now()}-${cleanName}.${ext}`;
    const arrayBuffer = await file.arrayBuffer();

    await context.env.R2.put(key, arrayBuffer, {
      httpMetadata: {
        contentType: file.type || 'image/jpeg',
      },
    });

    const url = `/api/media/${key}`;

    return new Response(JSON.stringify({ success: true, url, key }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
