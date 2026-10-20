import { useEffect } from 'react';
import { SITE, absoluteUrl, fullTitle, isShareableImage, pageJsonLd, summarize, type PageMeta } from '../../seo/site';

interface SeoProps {
  title: string;
  description: string;
  /** Canonical path; leave out for pages that shouldn't be indexed. */
  path?: string;
  noindex?: boolean;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'product';
  jsonLd?: object;
}

function setMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (content === undefined) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(href: string | undefined) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  link.href = href;
}

function setJsonLd(data: object | undefined) {
  let script = document.head.querySelector<HTMLScriptElement>('script[data-seo]');
  if (!data) {
    script?.remove();
    return;
  }
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.seo = '';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

/**
 * Sets the tab title, description, canonical link, link-preview tags and structured data
 * for the current page. The build writes the same tags into each public page's HTML; this
 * keeps them right as the visitor moves around without reloading.
 */
export function Seo({ title, description, path, noindex, image, imageAlt, type = 'website', jsonLd }: SeoProps) {
  const jsonLdKey = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    const pageTitle = fullTitle(title);
    const desc = summarize(description);
    const url = path && !noindex ? absoluteUrl(path) : undefined;
    const shareImage = isShareableImage(image) ? image! : SITE.shareImage.path;
    const usingSiteImage = shareImage === SITE.shareImage.path;

    document.title = pageTitle;
    setMeta('name', 'description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : undefined);
    setCanonical(url);

    setMeta('property', 'og:title', pageTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', absoluteUrl(shareImage));
    setMeta('property', 'og:image:alt', usingSiteImage ? SITE.shareImage.alt : imageAlt ?? title);
    setMeta('property', 'og:image:width', usingSiteImage ? String(SITE.shareImage.width) : undefined);
    setMeta('property', 'og:image:height', usingSiteImage ? String(SITE.shareImage.height) : undefined);
    setMeta('name', 'twitter:title', pageTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'twitter:image', absoluteUrl(shareImage));

    setJsonLd(jsonLdKey ? (JSON.parse(jsonLdKey) as object) : undefined);
  }, [title, description, path, noindex, image, imageAlt, type, jsonLdKey]);

  return null;
}

/** Seo for one of the fixed pages listed in seo/site.ts. */
export function PageSeo({ page }: { page: PageMeta }) {
  return (
    <Seo
      title={page.title}
      description={page.description}
      path={page.noindex ? undefined : page.path}
      noindex={page.noindex}
      jsonLd={page.noindex ? undefined : pageJsonLd(page.path)}
    />
  );
}
