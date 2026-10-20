import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Plugin } from 'vite';
import {
  CONCERN_SAFETY_NOTE,
  CRUMBS,
  PAGES,
  PUBLIC_PAGES,
  SITE,
  absoluteUrl,
  breadcrumbJsonLd,
  concernCrumbs,
  concernJsonLd,
  concernMeta,
  concernPath,
  fullTitle,
  graph,
  isShareableImage,
  pageJsonLd,
  productJsonLd,
  summarize,
  type Crumb,
  type PageMeta,
} from '../src/seo/site.ts';

/**
 * After the build, writes a separate HTML file for every public page (and every product and
 * expert the API lists) with that page's own title, description, canonical link, link-preview
 * tags, structured data and a no-JavaScript summary, so search engines, link previews and AI
 * crawlers see real content in the page source. Also writes sitemap.xml, robots.txt, llms.txt
 * and 404.html. If the API can't be reached the build still succeeds with the fixed pages.
 */
export function seoPages({ apiBaseUrl }: { apiBaseUrl: string }): Plugin {
  let outDir = 'dist';
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const template = await readFile(path.join(outDir, 'index.html'), 'utf8');
      const data = await fetchCatalogue(apiBaseUrl);
      const pages = [
        ...fixedPages(data),
        ...data.symptoms.map((symptom) => concernPage(symptom, data)),
        ...data.products.map((product) => productPage(product, data.mediaOrigin)),
        ...data.experts.map((expert) => expertPage(expert, data.mediaOrigin)),
      ];

      for (const page of pages) {
        const html = renderHtml(template, page);
        // Both /about/index.html and /about.html, since static hosts differ in which one they serve for /about.
        const files =
          page.path === '/' ? ['index.html'] : page.path === '/404' ? ['404.html'] : [`${page.path.slice(1)}/index.html`, `${page.path.slice(1)}.html`];
        for (const file of files) {
          const target = path.join(outDir, file);
          await mkdir(path.dirname(target), { recursive: true });
          await writeFile(target, html);
        }
      }

      const indexed = pages.filter((page) => !page.noindex);
      await writeFile(path.join(outDir, 'sitemap.xml'), sitemap(indexed.map((page) => page.path)));
      await writeFile(path.join(outDir, 'robots.txt'), robots());
      await writeFile(path.join(outDir, 'llms.txt'), llmsTxt(data));
      this.info?.(`SEO: wrote ${pages.length} pages (${data.products.length} products, ${data.experts.length} experts), sitemap.xml, robots.txt, llms.txt`);
    },
  };
}

// ---- Data from the API ----

interface ApiProduct {
  name: string;
  slug: string;
  sku?: string;
  short_description: string;
  description?: string;
  how_it_helps?: string;
  usage_instructions?: string;
  price: string;
  currency: string;
  is_in_stock: boolean;
  average_rating: string;
  review_count: number;
  primary_image_url: string;
  gallery_images?: { image_url: string }[];
  ingredients?: { name: string }[];
  symptoms: { name: string; slug: string }[];
  category: { name: string; slug: string } | null;
}

interface ApiExpert {
  slug: string;
  name: string;
  title: string;
  kind_label: string;
  bio: string;
  photo_url: string;
  session_minutes: number;
  modes: string[];
}

interface ApiSymptom {
  name: string;
  slug: string;
  description: string;
  intro?: string;
  icon?: string;
}

interface Catalogue {
  products: ApiProduct[];
  experts: ApiExpert[];
  symptoms: ApiSymptom[];
  mediaOrigin: string;
}

async function getJson<T>(url: string): Promise<T | undefined> {
  try {
    // Generous timeout: a sleeping free-tier API can take a while to wake up.
    const response = await fetch(url, { signal: AbortSignal.timeout(45_000), headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[seo-pages] Couldn't fetch ${url}: ${(error as Error).message}`);
    return undefined;
  }
}

async function fetchCatalogue(apiBaseUrl: string): Promise<Catalogue> {
  const base = apiBaseUrl.replace(/\/$/, '');
  const mediaOrigin = base.replace(/\/api$/, '');

  const summaries: { slug: string }[] = [];
  let next: string | null | undefined = `${base}/products/`;
  for (let i = 0; next && i < 100; i++) {
    const page: { results: { slug: string }[]; next: string | null } | undefined = await getJson(next);
    if (!page) break;
    summaries.push(...page.results);
    next = page.next;
  }

  const products: ApiProduct[] = [];
  for (let i = 0; i < summaries.length; i += 6) {
    const batch = await Promise.all(summaries.slice(i, i + 6).map((p) => getJson<ApiProduct>(`${base}/products/${p.slug}/`)));
    products.push(...batch.filter((p): p is ApiProduct => !!p));
  }

  const [experts, symptoms] = await Promise.all([
    getJson<ApiExpert[]>(`${base}/consultations/experts/`),
    getJson<ApiSymptom[]>(`${base}/symptoms/`),
  ]);
  return { products, experts: experts ?? [], symptoms: symptoms ?? [], mediaOrigin };
}

function mediaUrl(origin: string, url: string) {
  if (!url || /^https?:\/\//i.test(url)) return url;
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
}

// ---- Pages ----

interface StaticPage {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  type?: 'website' | 'product';
  image?: string;
  imageAlt?: string;
  jsonLd?: object;
  /** HTML shown to visitors and crawlers that don't run JavaScript. */
  body: string;
}

function fixedPage(meta: PageMeta, extraBody = ''): StaticPage {
  const crumbs = CRUMBS[meta.path];
  return {
    ...meta,
    jsonLd: meta.noindex ? undefined : pageJsonLd(meta.path),
    body: `${crumbs ? breadcrumbHtml(crumbs) : ''}<h1>${esc(meta.path === '/' ? 'Herbal remedies, chosen by how you feel' : meta.title)}</h1><p>${esc(meta.description)}</p>${extraBody}`,
  };
}

function fixedPages({ products, experts, symptoms }: Catalogue): StaticPage[] {
  const productList = products.length
    ? `<h2>Remedies</h2><ul>${products
        .map((p) => `<li><a href="/shop/${esc(p.slug)}">${esc(p.name)}</a> — ${esc(p.short_description)}</li>`)
        .join('')}</ul>`
    : '';
  const concernList = symptoms.length
    ? `<h2>Shop by concern</h2><ul>${symptoms
        .map((s) => `<li><a href="${concernPath(esc(s.slug))}">${esc(s.name)}</a> — ${esc(s.description)}</li>`)
        .join('')}</ul>`
    : '';
  const expertList = experts.length
    ? `<h2>Our experts</h2><ul>${experts
        .map((e) => `<li><a href="/experts/${esc(e.slug)}">${esc(e.name)}</a>, ${esc(e.title)} (${esc(e.kind_label)})</li>`)
        .join('')}</ul>`
    : '';
  const contact = `<p>Email <a href="mailto:${SITE.email}">${SITE.email}</a> or call <a href="tel:${SITE.phone}">0115 393 779</a>. ${SITE.locality}, Kenya.</p>`;

  const extra: Partial<Record<string, string>> = {
    '/': concernList + productList,
    '/shop': productList,
    '/concerns': concernList,
    '/experts': expertList,
    '/contact': contact,
  };

  // Private pages get a file too, so they never inherit the home page's canonical link.
  return [
    ...PUBLIC_PAGES.map((meta) => fixedPage(meta, extra[meta.path])),
    ...Object.values(PAGES)
      .filter((meta: PageMeta) => meta.noindex && !['/orders', '/consultations', '/r', '/reset-password'].includes(meta.path))
      .map((meta) => fixedPage(meta)),
  ];
}

function productPage(product: ApiProduct, mediaOrigin: string): StaticPage {
  const images = [product.primary_image_url, ...(product.gallery_images ?? []).map((img) => img.image_url)]
    .filter(Boolean)
    .map((url) => mediaUrl(mediaOrigin, url));
  const crumbs: Crumb[] = [
    { label: 'Shop', to: '/shop' },
    ...(product.category ? [{ label: product.category.name, to: `/shop?category=${product.category.slug}` }] : []),
    { label: product.name, to: `/shop/${product.slug}` },
  ];
  const section = (heading: string, text?: string) => (text ? `<h2>${heading}</h2><p>${esc(text)}</p>` : '');
  const price = `${product.currency} ${Number(product.price).toLocaleString('en-KE')}`;

  return {
    path: `/shop/${product.slug}`,
    title: product.category ? `${product.name} — ${product.category.name}` : product.name,
    description: summarize(`${product.short_description} ${product.description ?? ''}`),
    type: 'product',
    image: images[0],
    imageAlt: product.name,
    jsonLd: graph(productJsonLd({ ...product, images }), breadcrumbJsonLd(crumbs)),
    body: [
      breadcrumbHtml(crumbs),
      `<h1>${esc(product.name)}</h1>`,
      `<p>${esc(product.short_description)}</p>`,
      `<p>${esc(price)} — ${product.is_in_stock ? 'In stock' : 'Out of stock'}</p>`,
      product.ingredients?.length ? `<h2>Ingredients</h2><p>${esc(product.ingredients.map((i) => i.name).join(', '))}</p>` : '',
      section('About this remedy', product.description),
      section('What it helps with', product.how_it_helps),
      section('How to use', product.usage_instructions),
      product.symptoms.length
        ? `<p>Traditionally used for: ${product.symptoms
            .map((s) => `<a href="${concernPath(esc(s.slug))}">${esc(s.name)}</a>`)
            .join(', ')}</p>`
        : '',
    ].join(''),
  };
}

function concernPage(concern: ApiSymptom, { products, symptoms }: Catalogue): StaticPage {
  const remedies = products.filter((p) => p.symptoms.some((s) => s.slug === concern.slug));
  const meta = concernMeta(concern, remedies.map((p) => p.name));
  const others = symptoms.filter((s) => s.slug !== concern.slug);
  return {
    path: concernPath(concern.slug),
    title: meta.title,
    description: meta.description,
    jsonLd: concernJsonLd(concern, remedies),
    body: [
      breadcrumbHtml(concernCrumbs(concern)),
      `<h1>${esc(meta.heading)}</h1>`,
      concern.description ? `<p>${esc(concern.description)}</p>` : '',
      concern.intro ? concern.intro.split(/\n\s*\n/).map((para) => `<p>${esc(para.trim())}</p>`).join('') : '',
      `<h2>Remedies for ${esc(concern.name.toLowerCase())}</h2>`,
      remedies.length
        ? `<ul>${remedies.map((p) => `<li><a href="/shop/${esc(p.slug)}">${esc(p.name)}</a> — ${esc(p.short_description)}</li>`).join('')}</ul>`
        : '<p>No remedies listed for this concern yet.</p>',
      `<p>${esc(CONCERN_SAFETY_NOTE)} <a href="/experts">Talk to an expert</a>.</p>`,
      others.length
        ? `<h2>Other concerns</h2><ul>${others.map((s) => `<li><a href="${concernPath(esc(s.slug))}">${esc(s.name)}</a></li>`).join('')}</ul>`
        : '',
    ].join(''),
  };
}

function expertPage(expert: ApiExpert, mediaOrigin: string): StaticPage {
  const crumbs: Crumb[] = [
    { label: 'Experts', to: '/experts' },
    { label: expert.name, to: `/experts/${expert.slug}` },
  ];
  return {
    path: `/experts/${expert.slug}`,
    title: `${expert.name}, ${expert.title}`,
    description: summarize(
      `Book a ${expert.session_minutes}-minute session with ${expert.name} (${expert.kind_label}) by ${expert.modes.join(', ')}. ${expert.bio}`,
    ),
    image: expert.photo_url ? mediaUrl(mediaOrigin, expert.photo_url) : undefined,
    imageAlt: expert.name,
    jsonLd: graph(breadcrumbJsonLd(crumbs)),
    body: `${breadcrumbHtml(crumbs)}<h1>${esc(expert.name)}</h1><p>${esc(expert.title)} — ${esc(expert.kind_label)}</p><p>${esc(expert.bio)}</p>`,
  };
}

// ---- HTML ----

function esc(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function breadcrumbHtml(crumbs: Crumb[]) {
  const trail = [{ label: 'Home', to: '/' }, ...crumbs];
  return `<nav aria-label="Breadcrumb"><ol>${trail
    .map((c, i) => (i === trail.length - 1 ? `<li aria-current="page">${esc(c.label)}</li>` : `<li><a href="${esc(c.to)}">${esc(c.label)}</a></li>`))
    .join('')}</ol></nav>`;
}

const NAV_HTML = `<nav aria-label="Main"><ul>${[
  ['/', 'Home'],
  ['/shop', 'Shop'],
  ['/concerns', 'Shop by concern'],
  ['/experts', 'Talk to an expert'],
  ['/about', 'Our story'],
  ['/contact', 'Contact'],
]
  .map(([href, label]) => `<li><a href="${href}">${label}</a></li>`)
  .join('')}</ul></nav>`;

function renderHtml(template: string, page: StaticPage) {
  const title = fullTitle(page.title);
  const description = summarize(page.description);
  const canonical = page.noindex ? undefined : absoluteUrl(page.path);
  const image = isShareableImage(page.image) ? page.image! : SITE.shareImage.path;
  const siteImage = image === SITE.shareImage.path;

  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    page.noindex ? `<meta name="robots" content="noindex, nofollow" />` : '',
    canonical ? `<link rel="canonical" href="${esc(canonical)}" />` : '',
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="${page.type ?? 'website'}" />`,
    canonical ? `<meta property="og:url" content="${esc(canonical)}" />` : '',
    `<meta property="og:image" content="${esc(absoluteUrl(image))}" />`,
    `<meta property="og:image:alt" content="${esc(siteImage ? SITE.shareImage.alt : page.imageAlt ?? page.title)}" />`,
    siteImage ? `<meta property="og:image:width" content="${SITE.shareImage.width}" />` : '',
    siteImage ? `<meta property="og:image:height" content="${SITE.shareImage.height}" />` : '',
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(absoluteUrl(image))}" />`,
    // "<" is escaped so text from the API can't close the script tag.
    page.jsonLd ? `<script type="application/ld+json" data-seo>${JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n    ');

  const fallback = `<noscript><div class="noscript-page">${NAV_HTML}<main>${page.body}</main><p>Turn on JavaScript to shop, sign in and check out.</p></div></noscript>`;

  return template
    .replace(/\s*<!--[\s\S]*?-->/g, '')
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace('</head>', `    ${tags}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root"></div>\n    ${fallback}`);
}

// ---- sitemap.xml, robots.txt, llms.txt ----

function sitemap(paths: string[]) {
  const urls = paths.map((p) => `  <url><loc>${esc(absoluteUrl(p))}</loc></url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function robots() {
  return [
    'User-agent: *',
    'Allow: /',
    // Private or per-customer pages; they're also marked noindex.
    'Disallow: /account',
    'Disallow: /cart',
    'Disallow: /checkout',
    'Disallow: /orders/',
    'Disallow: /consultations/',
    'Disallow: /r/',
    'Disallow: /reset-password/',
    'Disallow: /revert-email',
    'Disallow: /newsletter/',
    // Free-text search results would be endless near-duplicate pages.
    'Disallow: /shop?q=',
    'Disallow: /shop?search=',
    '',
    `Sitemap: ${SITE.url}/sitemap.xml`,
    '',
  ].join('\n');
}

function llmsTxt({ products, experts, symptoms }: Catalogue) {
  const link = (label: string, p: string, note?: string) => `- [${label}](${absoluteUrl(p)})${note ? `: ${note}` : ''}`;
  const lines = [
    `# ${SITE.name}`,
    '',
    `> ${SITE.name} is an online herbal remedy shop based in ${SITE.locality}, Kenya. It sells herbal teas, tinctures, balms and other remedies grown in its own Senses Garden, lets customers search by how they feel, shows full ingredient lists and plant origins, takes payment by M-Pesa or card, and offers consultations with herbal coaches and licensed medical specialists.`,
    '',
    'Notes for AI assistants:',
    '- Product pages describe what herbs are traditionally used for. They are not medical advice, and no remedy is claimed to diagnose, treat or cure a condition. Anyone pregnant, on medication or with a long-term condition should speak to a doctor first.',
    '- Prices are in Kenyan shillings (KES). Orders are delivered within Kenya.',
    `- Contact: ${SITE.email}, 0115 393 779.`,
    '',
    '## Main pages',
    ...PUBLIC_PAGES.filter((p) => !['/privacy', '/terms', '/cookies', '/refunds'].includes(p.path)).map((p) =>
      link(p.path === '/' ? 'Home' : p.title, p.path, p.description),
    ),
  ];
  if (products.length) {
    lines.push('', '## Remedies');
    for (const p of products) {
      lines.push(link(p.name, `/shop/${p.slug}`, `${p.short_description} (${p.currency} ${Number(p.price).toLocaleString('en-KE')}${p.is_in_stock ? '' : ', out of stock'})`));
    }
  }
  if (symptoms.length) {
    lines.push('', '## Shop by concern');
    for (const s of symptoms) lines.push(link(s.name, concernPath(s.slug), s.intro ? summarize(s.intro, 200) : s.description));
  }
  if (experts.length) {
    lines.push('', '## Experts');
    for (const e of experts) lines.push(link(e.name, `/experts/${e.slug}`, `${e.title}, ${e.kind_label}`));
  }
  lines.push(
    '',
    '## Optional',
    ...[PAGES.privacy, PAGES.terms, PAGES.cookies, PAGES.refunds].map((p) => link(p.title, p.path, p.description)),
    '',
  );
  return lines.join('\n');
}
