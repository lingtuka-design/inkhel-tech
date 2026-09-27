import fs from 'fs';
import { POSTS } from '../src/data/posts';
import { DEFAULT_CATEGORIES } from '../src/data/postsStore';

function escapeSql(str: string): string {
  if (!str) return "''";
  return "'" + str.replace(/'/g, "''") + "'";
}

let sql = '-- Seed script for inkhel-tech-db\n\n';

// Seed Categories
for (const cat of DEFAULT_CATEGORIES) {
  sql += `INSERT OR IGNORE INTO categories (name) VALUES (${escapeSql(cat)});\n`;
}

sql += '\n';

// Seed Posts
for (const p of POSTS) {
  const tagsJson = JSON.stringify(p.tags || []);
  const specsJson = JSON.stringify(p.specs || {});
  const prosJson = JSON.stringify(p.pros || []);
  const consJson = JSON.stringify(p.cons || []);
  const affJson = JSON.stringify(p.affiliateLinks || {});

  sql += `INSERT OR REPLACE INTO posts (
    id, slug, title, excerpt, category, author, published_at, read_time, image, content, tags, specs, pros, cons, affiliate_links
  ) VALUES (
    ${escapeSql(p.id)},
    ${escapeSql(p.slug)},
    ${escapeSql(p.title)},
    ${escapeSql(p.excerpt)},
    ${escapeSql(p.category)},
    ${escapeSql(p.author)},
    ${escapeSql(p.publishedAt)},
    ${p.readTime || 5},
    ${escapeSql(p.image)},
    ${escapeSql(p.content)},
    ${escapeSql(tagsJson)},
    ${escapeSql(specsJson)},
    ${escapeSql(prosJson)},
    ${escapeSql(consJson)},
    ${escapeSql(affJson)}
  );\n\n`;
}

fs.writeFileSync('seed.sql', sql, 'utf8');
console.log('seed.sql generated successfully with ' + POSTS.length + ' posts.');
