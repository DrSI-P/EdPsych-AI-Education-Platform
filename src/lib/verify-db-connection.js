// Database Connection Verification Script
const { PrismaClient } = require('@prisma/client');

async function verifyDatabaseConnection() {
  console.log('=== DATABASE CONNECTION VERIFICATION ===');
  console.log('Environment variables:');
  console.log('DATABASE_URL:', process.env.DATABASE_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  
  try {
    // Initialize Prisma client
    console.log('\nInitializing Prisma client...');
    const prisma = new PrismaClient();
    
    // Test connection
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Successfully connected to database');
    
    // Test basic queries on main models
    console.log('\nTesting basic queries on main models:');
    
    // User model
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ User model: Found ${userCount} users`);
    } catch (error) {
      console.error('❌ User model error:', error.message);
    }
    
    // Blog model
    try {
      const blogCount = await prisma.blogPost.count();
      console.log(`✅ BlogPost model: Found ${blogCount} blog posts`);
    } catch (error) {
      console.error('❌ BlogPost model error:', error.message);
    }
    
    // Course model
    try {
      const courseCount = await prisma.course.count();
      console.log(`✅ Course model: Found ${courseCount} courses`);
    } catch (error) {
      console.error('❌ Course model error:', error.message);
    }
    
    // Assessment model
    try {
      const assessmentCount = await prisma.assessment.count();
      console.log(`✅ Assessment model: Found ${assessmentCount} assessments`);
    } catch (error) {
      console.error('❌ Assessment model error:', error.message);
    }
    
    // CurriculumPlan model
    try {
      const planCount = await prisma.curriculumPlan.count();
      console.log(`✅ CurriculumPlan model: Found ${planCount} curriculum plans`);
    } catch (error) {
      console.error('❌ CurriculumPlan model error:', error.message);
    }
    
    // Disconnect
    await prisma.$disconnect();
    console.log('\n✅ Database verification completed successfully');
    
  } catch (error) {
    console.error('\n❌ Database verification failed:');
    console.error(error);
    return false;
  }
  
  return true;
}

// Run the verification
verifyDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✅ The database connection is working correctly');
      console.log('The application should now be able to access all database features');
    } else {
      console.log('\n❌ There are still issues with the database connection');
      console.log('Please check the error messages above for more details');
    }
  })
  .catch(error => {
    console.error('\n❌ Unexpected error during verification:');
    console.error(error);
  });