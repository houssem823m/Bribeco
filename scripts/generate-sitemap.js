#!/usr/bin/env node
/**
 * Generates sitemap.xml in frontend/public based on static routes and live data.
 */
const fs = require('fs');
const path = require('path');

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://bribeco.com').replace(
  /\/$/,
  ''
);
const API_URL = (process.env.SERVER_URL || process.env.VITE_API_URL || 'http://localhost:5000').replace(
  /\/$/,
  ''
);

const staticRoutes = [
  '/',
  '/services',
  '/contact',
  '/login',
  '/register',
  '/profile',
  '/partner/dashboard',
  '/admin/dashboard',
  '/become-partner',
];

const fetchJSON = async (endpoint) => {
  try {
    const res = await fetch(`${API_URL}${endpoint}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.warn(`Skipping ${endpoint}: ${error.message}`);
    return [];
  }
};

const buildUrlEntry = (loc, { priority = 0.7, changefreq = 'weekly', lastmod = new Date() } = {}) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const run = async () => {
  const urls = new Map();

  staticRoutes.forEach((route) => {
    urls.set(`${SITE_URL}${route}`, {});
  });

  const [services, categories] = await Promise.all([
    fetchJSON('/api/services'),
    fetchJSON('/api/categories'),
  ]);

  services.forEach((service) => {
    urls.set(`${SITE_URL}/services/${service._id}`, {
      priority: 0.9,
      changefreq: 'monthly',
      lastmod: service.updatedAt || service.createdAt || new Date(),
    });
  });

  categories.forEach((category) => {
    urls.set(`${SITE_URL}/services?category=${category.slug}`, {
      priority: 0.6,
      changefreq: 'monthly',
      lastmod: category.updatedAt || category.createdAt || new Date(),
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Array.from(urls.entries())
  .map(([loc, options]) => buildUrlEntry(loc, options))
  .join('\n')}
</urlset>`;

  const destination = path.join(__dirname, '../frontend/public/sitemap.xml');
  fs.writeFileSync(destination, xml.trim());
  console.log(`Sitemap generated with ${urls.size} URLs → ${destination}`);
};

run();

