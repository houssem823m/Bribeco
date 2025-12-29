const defaultSiteUrl =
  import.meta.env.VITE_SITE_URL ||
  (typeof window !== 'undefined' && window.location?.origin) ||
  'https://bribeco.com';

export const absoluteUrl = (path = '/') => {
  if (!path) return defaultSiteUrl;
  if (path.startsWith('http')) return path;
  return `${defaultSiteUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

export const buildAlternateLocales = (url, locales = ['fr', 'en']) => {
  const href = url || defaultSiteUrl;
  const entries = locales.map((lang) => ({ hrefLang: lang, href }));
  entries.push({ hrefLang: 'x-default', href });
  return entries;
};

export const buildBreadcrumbJsonLd = (items = []) => {
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
};

export const buildServiceJsonLd = (service, { url }) => {
  if (!service) return null;
  const cleanPrice =
    typeof service.price_range === 'string'
      ? service.price_range.replace(/[^0-9.,-]/g, '').split('-')[0]?.trim()
      : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.description,
    serviceType: service.category?.name,
    provider: {
      '@type': 'Organization',
      name: 'BRIBECO',
      url: defaultSiteUrl,
    },
    url: url || absoluteUrl(`/services/${service._id}`),
    areaServed: 'France',
    image: service.images?.[0],
    offers: cleanPrice
      ? {
          '@type': 'Offer',
          priceCurrency: 'EUR',
          price: cleanPrice,
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  };

  if (service.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: service.aggregateRating.ratingValue,
      reviewCount: service.aggregateRating.reviewCount,
    };
  }

  return JSON.parse(JSON.stringify(schema));
};

export const defaultSeoImage = absoluteUrl('/favicon.svg');

export default {
  absoluteUrl,
  buildAlternateLocales,
  buildBreadcrumbJsonLd,
  buildServiceJsonLd,
  defaultSeoImage,
  defaultSiteUrl,
};

