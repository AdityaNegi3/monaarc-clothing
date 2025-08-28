// import { SitemapStream, streamToPromise } from 'sitemap';
// import { createWriteStream } from 'fs';

// const links = [
//   { url: '/', changefreq: 'weekly', priority: 1.0 },
//   { url: '/collections', changefreq: 'weekly', priority: 0.8 },
//   { url: '/about', changefreq: 'monthly', priority: 0.5 },
//   { url: '/cart', changefreq: 'daily', priority: 0.7 },
// ];

// async function generateSitemap() {
//   const stream = new SitemapStream({ hostname: 'https://monaarcclothing.com' });
//   const writeStream = createWriteStream('./public/sitemap.xml'); // <- public folder
//   stream.pipe(writeStream);

//   links.forEach(link => stream.write(link));
//   stream.end();

//   await streamToPromise(stream);
//   console.log('✅ Sitemap generated at public/sitemap.xml');
// }
// generateSitemap();
