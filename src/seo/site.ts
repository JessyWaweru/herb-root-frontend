// Page titles, descriptions and structured data, shared by the app (which updates the
// <head> as you navigate) and the build (which writes them into each page's HTML so
// search engines and link previews see them without running JavaScript).
// Keep this file free of browser and Node APIs: both sides import it.
//
// Wording: describe what herbs are *traditionally used for*; never claim a remedy treats,
// cures or prevents a condition (Kenya's Pharmacy and Poisons Board and Consumer
// Protection Act both bite on unsupported health claims).

export const SITE = {
  name: 'GOherbal',
  url: 'https://goherbal.health',
  locale: 'en_KE',
  language: 'en-KE',
  themeColor: '#0e4d3a',
  shareImage: { path: '/og/goherbal-share.png', width: 1200, height: 630, alt: 'GOherbal — herbal remedies chosen by how you feel' },
  logo: '/brand/goherbal-o-512.png',
  email: 'hello@goherbal.health',
  phone: '+254115393779',
  locality: 'Nairobi',
  country: 'KE',
} as const;

export interface PageMeta {
  path: string;
  /** Page name without the site suffix; the home page uses its full title. */
  title: string;
  description: string;
  noindex?: boolean;
}

export interface Crumb {
  label: string;
  to: string;
}

export function absoluteUrl(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith('/') ? '' : '/'}${path}`;
}

export function fullTitle(title: string) {
  return title.includes(SITE.name) ? title : `${title} | ${SITE.name}`;
}

/** Trims text to a meta-description length on a word boundary. */
export function summarize(text: string, max = 158) {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, clean.lastIndexOf(' ', max - 1))}…`;
}

export const PAGES = {
  home: {
    path: '/',
    title: 'GOherbal | Herbal Remedies in Kenya, Chosen by How You Feel',
    description:
      'Shop herbal teas, tinctures and balms grown in our Senses Garden in Kenya. Search by how you feel, see every ingredient, and pay with M-Pesa or card.',
  },
  shop: {
    path: '/shop',
    title: 'Shop All Herbal Remedies',
    description:
      'Browse every GOherbal remedy — herbal teas, tinctures, balms and more — with full ingredient lists, plant origins and prices in KES. Delivery across Kenya.',
  },
  concerns: {
    path: '/concerns',
    title: 'Shop Herbal Remedies by Concern',
    description:
      'Pick how you feel — stress, sleep, digestion, colds and more — and see the herbs traditionally used for it, or describe it in your own words.',
  },
  experts: {
    path: '/experts',
    title: 'Talk to a Herbal Coach or Medical Specialist',
    description:
      'Book a one-to-one session by email, phone or video with a GOherbal herbal coach or a licensed medical specialist, and get help choosing a remedy.',
  },
  about: {
    path: '/about',
    title: 'Our Story',
    description:
      'Why GOherbal shows you where every remedy comes from: herbs grown in our own Senses Garden, full ingredient lists and honest, plain-language labels.',
  },
  contact: {
    path: '/contact',
    title: 'Contact Us',
    description:
      'Questions about a remedy, an order or a partnership? Email hello@goherbal.health, call 0115 393 779, or send us a message. Based in Nairobi, Kenya.',
  },
  privacy: {
    path: '/privacy',
    title: 'Privacy Policy',
    description:
      'How GOherbal collects, uses and protects your personal data under the Kenya Data Protection Act 2019, and how to exercise your rights.',
  },
  terms: {
    path: '/terms',
    title: 'Terms & Conditions',
    description: 'The terms that apply when you buy from GOherbal or book a consultation: orders, payment, delivery and your rights.',
  },
  cookies: {
    path: '/cookies',
    title: 'Cookie Policy',
    description: 'The few essential cookies and browser storage GOherbal uses to keep you signed in and your basket working — no tracking.',
  },
  refunds: {
    path: '/refunds',
    title: 'Refund Policy',
    description: 'How returns, refunds and cancellations work at GOherbal, for remedies and for expert consultations.',
  },
  // Pages that are private or only useful mid-task: kept out of search results.
  cart: { path: '/cart', title: 'Your Basket', description: 'Review the remedies in your basket.', noindex: true },
  checkout: { path: '/checkout', title: 'Checkout', description: 'Choose delivery and pay for your order.', noindex: true },
  login: { path: '/login', title: 'Sign In', description: 'Sign in to your GOherbal account.', noindex: true },
  register: { path: '/register', title: 'Create an Account', description: 'Create a GOherbal account.', noindex: true },
  forgotPassword: { path: '/forgot-password', title: 'Reset Your Password', description: 'Get a link to reset your password.', noindex: true },
  resetPassword: { path: '/reset-password', title: 'Choose a New Password', description: 'Set a new password.', noindex: true },
  revertEmail: { path: '/revert-email', title: 'Undo Email Change', description: 'Restore your previous email address.', noindex: true },
  unsubscribe: { path: '/newsletter/unsubscribe', title: 'Unsubscribe', description: 'Stop receiving the garden letter.', noindex: true },
  account: { path: '/account', title: 'My Account', description: 'Your GOherbal profile.', noindex: true },
  addresses: { path: '/account/addresses', title: 'My Addresses', description: 'Your saved delivery addresses.', noindex: true },
  orders: { path: '/account/orders', title: 'My Orders', description: 'Your orders.', noindex: true },
  wishlist: { path: '/account/wishlist', title: 'My Wishlist', description: 'Remedies you have saved.', noindex: true },
  consultations: { path: '/account/consultations', title: 'My Consultations', description: 'Your expert bookings.', noindex: true },
  order: { path: '/orders', title: 'Order Details', description: 'Your order.', noindex: true },
  consultation: { path: '/consultations', title: 'Consultation Booking', description: 'Your booking.', noindex: true },
  rider: { path: '/r', title: 'Delivery', description: 'Delivery confirmation.', noindex: true },
  notFound: {
    path: '/404',
    title: 'Page Not Found',
    description: "We couldn't find that page. Browse our herbal remedies or search by how you feel.",
    noindex: true,
  },
} satisfies Record<string, PageMeta>;

/** Public pages, in the order they appear in the sitemap and llms.txt. */
export const PUBLIC_PAGES: PageMeta[] = Object.values(PAGES).filter((page: PageMeta) => !page.noindex);

/** Breadcrumb trails for the public pages that have one (home is implied at the start). */
export const CRUMBS: Record<string, Crumb[]> = {
  '/shop': [{ label: 'Shop', to: '/shop' }],
  '/concerns': [
    { label: 'Shop', to: '/shop' },
    { label: 'By concern', to: '/concerns' },
  ],
  '/experts': [{ label: 'Experts', to: '/experts' }],
  '/about': [{ label: 'Our story', to: '/about' }],
  '/contact': [{ label: 'Contact', to: '/contact' }],
  '/privacy': [{ label: 'Privacy Policy', to: '/privacy' }],
  '/terms': [{ label: 'Terms & Conditions', to: '/terms' }],
  '/cookies': [{ label: 'Cookie Policy', to: '/cookies' }],
  '/refunds': [{ label: 'Refund Policy', to: '/refunds' }],
};

// ---- Structured data (schema.org JSON-LD) ----

type JsonLd = Record<string, unknown>;

const ORG_ID = `${SITE.url}/#organization`;

export function organizationJsonLd(): JsonLd {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    email: SITE.email,
    telephone: SITE.phone,
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: SITE.language,
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE.url}/shop?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

// Only the city is published: add a street address, opening hours and map coordinates
// here once there's a shop or pickup point customers can visit.
export function localBusinessJsonLd(): JsonLd {
  return {
    '@type': 'Store',
    '@id': `${SITE.url}/#store`,
    name: SITE.name,
    description: PAGES.home.description,
    url: SITE.url,
    image: absoluteUrl(SITE.shareImage.path),
    logo: absoluteUrl(SITE.logo),
    email: SITE.email,
    telephone: SITE.phone,
    priceRange: 'KES',
    currenciesAccepted: 'KES',
    paymentAccepted: 'M-Pesa, Credit Card, Debit Card',
    address: { '@type': 'PostalAddress', addressLocality: SITE.locality, addressCountry: SITE.country },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    parentOrganization: { '@id': ORG_ID },
  };
}

export function breadcrumbJsonLd(crumbs: Crumb[]): JsonLd {
  const trail = [{ label: 'Home', to: '/' }, ...crumbs];
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.label,
      item: absoluteUrl(crumb.to),
    })),
  };
}

export interface ProductForJsonLd {
  name: string;
  slug: string;
  short_description: string;
  description?: string;
  price: string;
  currency: string;
  is_in_stock: boolean;
  average_rating: string;
  review_count: number;
  sku?: string;
  category?: { name: string } | null;
  images: string[];
}

export function productJsonLd(product: ProductForJsonLd): JsonLd {
  const url = absoluteUrl(`/shop/${product.slug}`);
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    description: summarize(product.description || product.short_description, 500),
    url,
    // Search engines don't accept SVGs (the backend's placeholders) as product photos.
    ...(product.images.some(isShareableImage) ? { image: product.images.filter(isShareableImage) } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    ...(product.category ? { category: product.category.name } : {}),
    brand: { '@type': 'Brand', name: SITE.name },
    offers: {
      '@type': 'Offer',
      url,
      price: product.price,
      priceCurrency: product.currency,
      availability: product.is_in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': ORG_ID },
    },
    // Ratings only once there are real reviews; an empty rating is invalid markup.
    ...(product.review_count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.average_rating,
            reviewCount: product.review_count,
          },
        }
      : {}),
  };
}

export function graph(...items: JsonLd[]) {
  return { '@context': 'https://schema.org', '@graph': items };
}

/** Structured data for a fixed page: who we are on the home and contact pages, plus its breadcrumb trail. */
export function pageJsonLd(path: string) {
  const items: JsonLd[] = [];
  if (path === '/') items.push(organizationJsonLd(), websiteJsonLd(), localBusinessJsonLd());
  if (path === '/contact') items.push(localBusinessJsonLd());
  const crumbs = CRUMBS[path];
  if (crumbs) items.push(breadcrumbJsonLd(crumbs));
  return items.length ? graph(...items) : undefined;
}

/** Social platforms can't show SVGs (the backend's placeholders), so those fall back to the site image. */
export function isShareableImage(url: string | undefined) {
  return !!url && !/\.svg(\?|$)/i.test(url);
}
