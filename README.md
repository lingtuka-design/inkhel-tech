# Inkhel Tech (tech.inkhel.com)

**Inkhel Tech** is a modern, minimalist, high-converting technology and gadget publication designed for speed, mobile readability, SEO dominance, and effortless solo maintenance.

---

## ⚡ Tech Stack

* **Vite** — Instant HMR and lightning-fast builds
* **React 19 + TypeScript** — Strict type safety with `verbatimModuleSyntax`
* **TanStack Router** — Type-safe client-side routing (`/` and `/post/:slug`)
* **Tailwind CSS** — Dark-first minimalist editorial styling (`#0d1117`, emerald accents, `border-white/10`)
* **lucide-react** — Lightweight icons
* **SEO & JSON-LD** — Dynamic metadata generation (OpenGraph, Twitter Cards, Article Schema, Breadcrumbs)

---

## 📁 Project Architecture

```text
C:\antigravity project\Tech/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Sticky header, logo, network pills (Inkhel News, Inkhel Quiz)
│   │   ├── CategoryNav.tsx         # Horizontally scrollable topic pills (All, Smartphones, Audio, etc.)
│   │   ├── SearchBar.tsx           # Instant search bar filtering titles, excerpts, tags, categories
│   │   ├── FeaturedPost.tsx        # Hero 2-column featured story layout
│   │   ├── PostCard.tsx            # Chronological article list card (horizontal desktop / stacked mobile)
│   │   ├── AffiliateDealCard.tsx   # Amazon.in and Flipkart CTA buttons with highlight badges
│   │   ├── QuickSpecs.tsx          # Compact hardware specification matrix
│   │   ├── ProsCons.tsx            # Two-column Pros (✓) & Cons (×) section
│   │   ├── AdBanner.tsx            # Fluid Google AdSense banner placeholder
│   │   ├── InArticleAd.tsx         # Natural in-article ad slot
│   │   ├── ShareButtons.tsx        # WhatsApp, Facebook & Copy Link (with "Copied!" toast)
│   │   ├── AuthorBio.tsx           # Author credentials and publication bio
│   │   └── Footer.tsx              # Clean footer with category links, network, and legal modals
│   │
│   ├── data/
│   │   └── posts.ts                # Type-safe article store (all articles maintained in one file)
│   │
│   ├── lib/
│   │   ├── search.ts               # Multi-field search and category filtering utility
│   │   └── seo.ts                  # Dynamic SEO tags and JSON-LD structured data hook
│   │
│   ├── routes/
│   │   ├── index.tsx               # Homepage route with hero, search, feed, and ad slots
│   │   └── post.$slug.tsx          # Dynamic article route with full reading experience & 404 state
│   │
│   ├── router.tsx                  # TanStack Router route tree and scroll restoration
│   ├── index.css                   # Custom typography, dark palette, and prose styling
│   └── main.tsx                    # Entry point mounting RouterProvider
│
├── index.html                      # HTML template with SEO tags and preconnected fonts
├── tailwind.config.js              # Editorial color palette and font configuration
└── package.json
```

---

## ✍️ How to Add a New Article

Adding an article is as simple as adding an object into [`src/data/posts.ts`](file:///C:/antigravity%20project/Tech/src/data/posts.ts):

```ts
{
  id: "7",
  slug: "google-pixel-9a-first-look",
  title: "Google Pixel 9a First Impressions: Flagship AI for Less",
  excerpt: "Google's upcoming budget champion brings the Tensor G4 and flagship camera smarts to the mid-tier.",
  category: "Smartphones", // 'Smartphones' | 'Audio & Gadgets' | 'Buying Guides' | 'Deals'
  author: "Inkhel Tech Editorial",
  publishedAt: "Sep 27, 2026",
  readTime: 5,
  image: "https://images.unsplash.com/photo-...",
  tags: ["pixel", "google", "smartphones", "ai"],
  specs: {
    display: "6.3-inch OLED 120Hz",
    processor: "Google Tensor G4",
    camera: "48MP OIS + 13MP Ultra-wide",
    battery: "5,000mAh",
    charging: "27W Wired Fast Charge",
  },
  pros: [
    "Clean Google Pixel software with 7 years of updates",
    "Best-in-class computational photography",
  ],
  cons: [
    "Charging speed is conservative",
  ],
  affiliateLinks: {
    amazon: "https://www.amazon.in/dp/...",
    flipkart: "https://www.flipkart.com/...",
  },
  content: `
    <p class="lead">Introductory paragraph here...</p>
    <h2>Heading 2</h2>
    <p>Detailed breakdown...</p>
  `,
}
```

The article will automatically:
1. Appear in the chronological feed on the homepage.
2. Be indexed in live search.
3. Be accessible at `/post/:slug`.
4. Generate dynamic Open Graph, Twitter cards, and JSON-LD TechArticle schema.

---

## 🛒 Affiliate Deals Setup

In any article, define `affiliateLinks`:

```ts
affiliateLinks: {
  amazon: "https://www.amazon.in/dp/...?tag=yourtag-21",
  flipkart: "https://www.flipkart.com/...?affid=youraffid",
}
```

The `<AffiliateDealCard />` component will automatically display prominent yet elegant Amazon and Flipkart CTA buttons with compliant `rel="noopener noreferrer sponsored"` attributes and an affiliate disclosure note.

---

## 📢 Google AdSense Integration

The components `<AdBanner />` and `<InArticleAd />` are structured ready for AdSense:
- Simply replace the placeholder `div` inside `src/components/AdBanner.tsx` and `src/components/InArticleAd.tsx` with your `<ins class="adsbygoogle" ...>` snippet once your AdSense account is approved.

---

## 🚀 Running the Project

### 1. Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173).

### 2. Production Build
```bash
npm run build
```
Generates a minified, optimized production bundle inside `dist/`.

### 3. Local Preview
```bash
npm run preview
```
Previews the production build locally on [http://localhost:4173](http://localhost:4173).

---

## 🌐 Deployment to tech.inkhel.com

### Cloudflare Pages / Vercel / Netlify
- Build command: `npm run build`
- Output directory: `dist`
- Single Page App rewrite rule: Redirect all requests (`/*`) to `/index.html`.

*(A [`public/_redirects`](file:///C:/antigravity%20project/Tech/public/_redirects) file is provided for Cloudflare Pages / Netlify).*
