import { useEffect } from 'react';
import type { Post } from '../data/posts';

export interface SeoProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  post?: Post;
}

export function useSeo({
  title,
  description = 'iTECH is an independent technology publication covering smartphones, gadgets, buying guides, and deals.',
  canonicalUrl = 'https://tech.inkhel.com/',
  ogType = 'website',
  ogImage = 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80',
  post,
}: SeoProps) {
  useEffect(() => {
    // 1. Title
    const formattedTitle = title.includes('iTECH') ? title : `${title} | iTECH`;
    document.title = formattedTitle;

    // Helper to update or set meta
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Standard Meta
    setMeta('description', description);

    // Open Graph
    setMeta('og:title', formattedTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:type', ogType, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', ogImage, true);
    setMeta('og:site_name', 'iTECH', true);

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', formattedTitle);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // JSON-LD Structured Data
    const scriptId = 'itech-seo-jsonld';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    if (post) {
      const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline: post.title,
        description: post.excerpt,
        image: [post.image],
        datePublished: post.publishedAt,
        author: {
          '@type': 'Organization',
          name: post.author,
          url: 'https://tech.inkhel.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'iTECH',
          logo: {
            '@type': 'ImageObject',
            url: 'https://tech.inkhel.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': canonicalUrl,
        },
      };
      scriptElement.textContent = JSON.stringify(articleSchema);
    } else {
      const siteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'iTECH',
        url: 'https://tech.inkhel.com/',
        description: description,
        publisher: {
          '@type': 'Organization',
          name: 'iTECH',
        },
      };
      scriptElement.textContent = JSON.stringify(siteSchema);
    }
  }, [title, description, canonicalUrl, ogType, ogImage, post]);
}
