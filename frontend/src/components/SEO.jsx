import { Helmet } from 'react-helmet-async';
import { absoluteUrl, defaultSeoImage } from '../utils/seo';

const SEO = ({
  title = 'BRIBECO',
  description = 'BRIBECO — Dépannage rapide 7j/7, réservation en ligne et gestion des partenaires.',
  path = '/',
  canonical,
  image = defaultSeoImage,
  type = 'website',
  jsonLd = [],
  alternateLocales = [],
  meta = [],
  links = [],
}) => {
  const canonicalUrl = canonical || absoluteUrl(path);

  const baseMeta = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: 'BRIBECO' },
    { property: 'og:image', content: image },
    { property: 'og:image:alt', content: `${title} | BRIBECO` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: image },
    { name: 'twitter:url', content: canonicalUrl },
    { name: 'theme-color', content: '#007BFF' },
  ];

  const baseLinks = [
    { rel: 'canonical', href: canonicalUrl },
    ...alternateLocales.map((alt) => ({
      rel: 'alternate',
      hrefLang: alt.hrefLang,
      href: alt.href || canonicalUrl,
    })),
  ];

  const structuredData = Array.isArray(jsonLd)
    ? jsonLd.filter(Boolean)
    : jsonLd
    ? [jsonLd]
    : [];

  return (
    <Helmet>
      <title>{title}</title>
      {[...baseMeta, ...meta]
        .filter((tag) => tag.content)
        .map((tag, idx) => (
          <meta key={`${tag.name || tag.property}-${idx}`} {...tag} />
        ))}
      {[...baseLinks, ...links]
        .filter((link) => link.href)
        .map((link, idx) => (
          <link key={`${link.rel}-${link.href}-${idx}`} {...link} />
        ))}
      {structuredData.map((schema, idx) => (
        <script type="application/ld+json" key={`jsonld-${idx}`}>
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;

