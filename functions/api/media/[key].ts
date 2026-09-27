interface Env {
  R2: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const key = context.params.key as string;
    if (!key) {
      return new Response('Not Found', { status: 404 });
    }

    const object = await context.env.R2.get(key);
    if (!object) {
      return new Response('Image Not Found', { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');

    return new Response(object.body, { headers });
  } catch (error: any) {
    return new Response('Error loading image', { status: 500 });
  }
};
