// Import PrismaClient
const { PrismaClient } = require('@prisma/client');

// Log the environment variables
console.log('Environment variables:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Try to connect to the database using the environment variable
async function testEnvConnection() {
  console.log('\nTesting connection using environment variable...');
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
    
    await prisma.$connect();
    console.log('✅ Successfully connected to database using environment variable');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect using environment variable:');
    console.error(error);
    return false;
  }
}

// Try to connect to the database using the hardcoded Railway URL
async function testRailwayConnection() {
  console.log('\nTesting connection using hardcoded Railway URL...');
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "postgresql://postgres:cfrIRoriddjsJuEKMMHenOkSGveikIvb@hopper.proxy.rlwy.net:27107/railway",
        },
      },
    });
    
    await prisma.$connect();
    console.log('✅ Successfully connected to database using Railway URL');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect using Railway URL:');
    console.error(error);
    return false;
  }
}

// Try to connect to the database using the current Supabase URL from .env
async function testCurrentSupabaseConnection() {
  console.log('\nTesting connection using current Supabase URL...');
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "postgresql://postgres:Kanopatrick1971*@db.dztcpontxfaaklsinzhp.supabase.co:5432/postgres?schema=public&sslmode=require",
        },
      },
    });
    
    await prisma.$connect();
    console.log('✅ Successfully connected to database using current Supabase URL');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect using current Supabase URL:');
    console.error(error);
    return false;
  }
}

// Try to connect to the database using the old Supabase URL from docs
async function testOldSupabaseConnection() {
  console.log('\nTesting connection using old Supabase URL...');
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: "postgresql://postgres:Kanopatrick1@db.vrailhsvlqdavpbrkxy.supabase.co:5432/postgres?schema=public&sslmode=require",
        },
      },
    });
    
    await prisma.$connect();
    console.log('✅ Successfully connected to database using old Supabase URL');
    
    // Try a simple query
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Failed to connect using old Supabase URL:');
    console.error(error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== DATABASE CONNECTION TESTS ===');
  
  const envResult = await testEnvConnection();
  const railwayResult = await testRailwayConnection();
  const currentSupabaseResult = await testCurrentSupabaseConnection();
  const oldSupabaseResult = await testOldSupabaseConnection();
  
  console.log('\n=== TEST RESULTS SUMMARY ===');
  console.log('Environment Variable Connection:', envResult ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Railway Connection:', railwayResult ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Current Supabase Connection:', currentSupabaseResult ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Old Supabase Connection:', oldSupabaseResult ? '✅ SUCCESS' : '❌ FAILED');
  
  if (!envResult && !railwayResult && !currentSupabaseResult && !oldSupabaseResult) {
    console.log('\n❌ All connection attempts failed. Please check your database credentials and network connectivity.');
  } else {
    console.log('\n✅ At least one connection method succeeded. Update your configuration to use the working connection string.');
  }
}

// Run the tests
runTests().catch(console.error);