/**
 * Sitemap Generator Script for EdPsych Connect
 * 
 * This script generates a sitemap.xml file based on the current content in the database.
 * It should be run periodically to keep the sitemap up-to-date.
 * 
 * Usage: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Base URL for the site
const BASE_URL = 'https://edpsychconnect.com';

// Current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

/**
 * Generate the XML content for the sitemap
 */
async function generateSitemap() {
  try {
    console.log('Generating sitemap.xml...');
    
    // Start XML content
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    // Add static pages
    const staticPages = [
      { url: '/', changefreq: 'weekly', priority: '1.0' },
      { url: '/about', changefreq: 'monthly', priority: '0.8' },
      { url: '/contact', changefreq: 'monthly', priority: '0.7' },
      { url: '/blog', changefreq: 'daily', priority: '0.9' },
      { url: '/blog/categories', changefreq: 'weekly', priority: '0.7' },
      { url: '/resources', changefreq: 'weekly', priority: '0.9' },
      { url: '/courses', changefreq: 'weekly', priority: '0.9' },
      { url: '/auth/signin', changefreq: 'monthly', priority: '0.6' },
      { url: '/auth/signup', changefreq: 'monthly', priority: '0.6' },
      { url: '/privacy', changefreq: 'monthly', priority: '0.4' },
      { url: '/terms', changefreq: 'monthly', priority: '0.4' },
      { url: '/accessibility', changefreq: 'monthly', priority: '0.4' },
    ];

    staticPages.forEach(page => {
      xmlContent += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add blog posts
    console.log('Fetching blog posts...');
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        status: 'published',
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    blogPosts.forEach(post => {
      const lastmod = post.updatedAt.toISOString().split('T')[0];
      xmlContent += `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Add blog categories
    console.log('Fetching blog categories...');
    const blogCategories = await prisma.blogCategory.findMany({
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    blogCategories.forEach(category => {
      const lastmod = category.updatedAt.toISOString().split('T')[0];
      xmlContent += `  <url>
    <loc>${BASE_URL}/blog/category/${category.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    });

    // Add courses
    console.log('Fetching courses...');
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        updatedAt: true,
      },
    });

    courses.forEach(course => {
      const lastmod = course.updatedAt.toISOString().split('T')[0];
      xmlContent += `  <url>
    <loc>${BASE_URL}/courses/${course.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    });

    // Close XML content
    xmlContent += `</urlset>`;

    // Write to file
    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xmlContent);

    console.log(`Sitemap generated successfully at ${outputPath}`);
  } catch (error) {
    console.error('Error generating sitemap:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the generator
generateSitemap()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });