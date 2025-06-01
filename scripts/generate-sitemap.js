/**
 * Enhanced Sitemap Generator with Tenant Context Middleware
 * This script generates a sitemap.xml file with proper tenant context handling
 */

const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { createPrismaClientWithTenant, withTenantContext } = require('../lib/prisma-tenant-middleware');

// Create a Prisma client with tenant middleware
const prisma = createPrismaClientWithTenant();
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://edpsychconnect.com';

// Generate sitemap with proper error handling
async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  // Static routes that don't require database access
  const staticRoutes = [
    '/',
    '/analytics',
    '/analytics-dashboard',
    '/avatar-library',
    '/css-test',
    '/educator',
    '/resources/adaptive-learning',
    '/resources/learning-styles',
    '/resources/restorative-justice',
    '/resources/special-needs',
    '/settings',
    '/student',
    '/testpage',
    '/professional-development',
    '/professional-development/foundations',
    '/professional-development/trauma-informed-practice',
    '/professional-development/technology-in-education',
    '/professional-development/teaching-assistant-development',
    '/professional-development/leadership-in-educational-psychology',
    '/professional-development/parent-family-engagement',
    '/professional-development/certification',
    '/professional-development/micro-learning',
    '/professional-development/emotionally-based-school-non-attendance',
    '/professional-development/analytics',
    '/professional-development/certificates',
    '/professional-development/cpd-tracking',
    '/professional-development/learning-communities',
    '/professional-development/mentor-matching',
    '/professional-development/portfolio',
    '/professional-development/research-collaboration',
    '/professional-development/webinars'
  ];
  
  // Dynamic routes from database (with error handling)
  let dynamicRoutes = [];
  
  // Blog posts
  console.log('Fetching blog posts...');
  try {
    // Use withTenantContext to ensure tenant context is set for this operation
    const blogPosts = await withTenantContext(prisma, async () => {
      return await prisma.blogPost.findMany({
        where: { published: true },
        select: { slug: true }
      });
    });
    
    const blogPostRoutes = blogPosts.map(post => `/blog/${post.slug}`);
    dynamicRoutes = [...dynamicRoutes, ...blogPostRoutes];
    console.log(`Found ${blogPostRoutes.length} blog posts`);
  } catch (error) {
    console.log(`Warning: Could not fetch blog posts. Skipping blog posts in sitemap. \n${error.message}`);
  }
  
  // Blog categories
  console.log('Fetching blog categories...');
  try {
    // Use withTenantContext to ensure tenant context is set for this operation
    const blogCategories = await withTenantContext(prisma, async () => {
      return await prisma.blogCategory.findMany({
        select: { slug: true }
      });
    });
    
    const blogCategoryRoutes = blogCategories.map(category => `/blog/category/${category.slug}`);
    dynamicRoutes = [...dynamicRoutes, ...blogCategoryRoutes];
    console.log(`Found ${blogCategoryRoutes.length} blog categories`);
  } catch (error) {
    console.log(`Warning: Could not fetch blog categories. Skipping blog categories in sitemap. \n${error.message}`);
  }
  
  // Courses
  console.log('Fetching courses...');
  try {
    // Use withTenantContext to ensure tenant context is set for this operation
    const courses = await withTenantContext(prisma, async () => {
      return await prisma.course.findMany({
        select: { slug: true }
      });
    });
    
    const courseRoutes = courses.map(course => `/course/${course.slug}`);
    dynamicRoutes = [...dynamicRoutes, ...courseRoutes];
    console.log(`Found ${courseRoutes.length} courses`);
  } catch (error) {
    console.log(`Warning: Could not fetch courses. Skipping courses in sitemap. \n${error.message}`);
  }
  
  // Combine all routes
  const allRoutes = [...staticRoutes, ...dynamicRoutes];
  
  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${siteUrl}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Write sitemap to file
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log(`Sitemap generated successfully at ${path.join(publicDir, 'sitemap.xml')}`);
}

// Run the sitemap generator
generateSitemap()
  .catch(error => {
    console.error('Error generating sitemap:', error);
    // Create a minimal sitemap with just static routes to prevent build failure
    const staticSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
    
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), staticSitemap);
    console.log('Created minimal fallback sitemap due to errors');
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
