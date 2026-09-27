interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const slug = context.params.slug as string;
  let response = await context.next();

  // If response is not ok (e.g. 404), fallback to root index.html asset
  if (!response.ok && context.env.ASSETS) {
    try {
      response = await context.env.ASSETS.fetch(new URL('/', context.request.url));
    } catch {
      // Continue with current response
    }
  }

  if (!slug || !context.env.DB) {
    return response;
  }

  try {
    const post: any = await context.env.DB.prepare(
      'SELECT id, slug, title, excerpt, image, author, category FROM posts WHERE slug = ? LIMIT 1'
    ).bind(slug).first();

    if (!post) {
      return response;
    }

    const title = post.title ? `${post.title} — iTECH` : 'iTECH — Tech News & Reviews';
    const excerpt = post.excerpt || 'Tech chanchin thar, smartphone, gadgets leh review kimchang.';
    const postUrl = `https://tech.inkhel.com/post/${slug}`;

    let ogImage = post.image || '';
    if (ogImage.startsWith('/')) {
      ogImage = `https://tech.inkhel.com${ogImage}`;
    }
    if (!ogImage) {
      ogImage = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80';
    }

    const safeTitle = title.replace(/"/g, '&quot;');
    const safeExcerpt = excerpt.replace(/"/g, '&quot;');

    // Use Cloudflare HTMLRewriter to inject exact metadata for WhatsApp, Facebook, Twitter & Browsers
    const rewriter = new HTMLRewriter()
      .on('title', {
        element(e) {
          e.setInnerContent(title);
        },
      })
      .on('meta[name="description"]', {
        element(e) {
          e.setAttribute('content', excerpt);
        },
      })
      .on('meta[property="og:title"]', {
        element(e) {
          e.setAttribute('content', title);
        },
      })
      .on('meta[property="og:description"]', {
        element(e) {
          e.setAttribute('content', excerpt);
        },
      })
      .on('meta[property="og:url"]', {
        element(e) {
          e.setAttribute('content', postUrl);
        },
      })
      .on('meta[property="og:type"]', {
        element(e) {
          e.setAttribute('content', 'article');
        },
      })
      .on('meta[property="og:site_name"]', {
        element(e) {
          e.setAttribute('content', 'iTECH');
        },
      })
      .on('meta[name="twitter:card"]', {
        element(e) {
          e.setAttribute('content', 'summary_large_image');
        },
      })
      .on('meta[name="twitter:title"]', {
        element(e) {
          e.setAttribute('content', title);
        },
      })
      .on('meta[name="twitter:description"]', {
        element(e) {
          e.setAttribute('content', excerpt);
        },
      })
      .on('meta[property="og:image"]', {
        element(e) {
          e.setAttribute('content', ogImage);
        },
      })
      .on('meta[name="twitter:image"]', {
        element(e) {
          e.setAttribute('content', ogImage);
        },
      })
      .on('head', {
        element(e) {
          // OpenGraph & Twitter tags required by WhatsApp & Facebook crawlers
          e.append(`<meta property="og:image:secure_url" content="${ogImage}" />\n`, { html: true });
          e.append(`<meta property="og:image:width" content="1200" />\n`, { html: true });
          e.append(`<meta property="og:image:height" content="630" />\n`, { html: true });
          e.append(`<meta property="og:image:alt" content="${safeTitle}" />\n`, { html: true });
          e.append(`<meta name="twitter:image:alt" content="${safeTitle}" />\n`, { html: true });
          e.append(`<meta name="author" content="${(post.author || 'iTECH Editorial').replace(/"/g, '&quot;')}" />\n`, { html: true });
          e.append(`<link rel="canonical" href="${postUrl}" />\n`, { html: true });
        },
      });

    return rewriter.transform(response);
  } catch {
    return response;
  }
};
