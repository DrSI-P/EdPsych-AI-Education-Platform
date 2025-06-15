import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/lib/security/password-utils';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create subscription tiers
  const tiers = await Promise.all([
    prisma.subscriptionTier.upsert({
      where: { id: 'tier-free' },
      update: {},
      create: {
        id: 'tier-free',
        name: 'Free',
        features: JSON.stringify([
          'basic-dashboard',
          'limited-assessments',
          'basic-reports'
        ]),
        creditLimit: 10,
        price: 0,
      },
    }),
    prisma.subscriptionTier.upsert({
      where: { id: 'tier-basic' },
      update: {},
      create: {
        id: 'tier-basic',
        name: 'Basic',
        features: JSON.stringify([
          'full-dashboard',
          'unlimited-assessments',
          'advanced-reports',
          'parent-communication',
          'basic-ai-features'
        ]),
        creditLimit: 100,
        price: 9.99,
      },
    }),
    prisma.subscriptionTier.upsert({
      where: { id: 'tier-professional' },
      update: {},
      create: {
        id: 'tier-professional',
        name: 'Professional',
        features: JSON.stringify([
          'all-basic-features',
          'advanced-ai-features',
          'curriculum-planning',
          'collaboration-tools',
          'priority-support',
          'data-export'
        ]),
        creditLimit: 500,
        price: 29.99,
      },
    }),
    prisma.subscriptionTier.upsert({
      where: { id: 'tier-school' },
      update: {},
      create: {
        id: 'tier-school',
        name: 'School',
        features: JSON.stringify([
          'all-professional-features',
          'unlimited-users',
          'school-dashboard',
          'custom-branding',
          'api-access',
          'dedicated-support'
        ]),
        creditLimit: 10000,
        price: 299.99,
      },
    }),
  ]);

  console.log(`✅ Created ${tiers.length} subscription tiers`);

  // Create test users with different roles
  const testPassword = await hashPassword('Test123!@#');
  
  // DSL User (Designated Safeguarding Lead)
  const dslUser = await prisma.user.upsert({
    where: { email: 'dsl@school.test' },
    update: {},
    create: {
      email: 'dsl@school.test',
      name: 'Sarah Johnson',
      password: testPassword,
      role: 'DSL',
      isActive: true,
      ageVerified: true,
      emailVerified: new Date(),
    },
  });

  // Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@school.test' },
    update: {},
    create: {
      email: 'admin@school.test',
      name: 'John Smith',
      password: testPassword,
      role: 'ADMIN',
      isActive: true,
      ageVerified: true,
      emailVerified: new Date(),
    },
  });

  // Teacher User
  const teacherUser = await prisma.user.upsert({
    where: { email: 'teacher@school.test' },
    update: {},
    create: {
      email: 'teacher@school.test',
      name: 'Emma Wilson',
      password: testPassword,
      role: 'TEACHER',
      isActive: true,
      ageVerified: true,
      emailVerified: new Date(),
    },
  });

  // SENCO User
  const sencoUser = await prisma.user.upsert({
    where: { email: 'senco@school.test' },
    update: {},
    create: {
      email: 'senco@school.test',
      name: 'David Brown',
      password: testPassword,
      role: 'SENCO',
      isActive: true,
      ageVerified: true,
      emailVerified: new Date(),
    },
  });

  // Parent User
  const parentUser = await prisma.user.upsert({
    where: { email: 'parent@test.com' },
    update: {},
    create: {
      email: 'parent@test.com',
      name: 'Lisa Davis',
      password: testPassword,
      role: 'PARENT',
      isActive: true,
      ageVerified: true,
      emailVerified: new Date(),
    },
  });

  // Student User (age verified)
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@school.test' },
    update: {},
    create: {
      email: 'student@school.test',
      name: 'Alex Johnson',
      password: testPassword,
      role: 'STUDENT',
      isActive: true,
      ageVerified: true,
      dateOfBirth: new Date('2010-05-15'), // 14 years old
      emailVerified: new Date(),
    },
  });

  // Student User (not age verified - for testing)
  const unverifiedStudent = await prisma.user.upsert({
    where: { email: 'unverified@school.test' },
    update: {},
    create: {
      email: 'unverified@school.test',
      name: 'Sam Taylor',
      password: testPassword,
      role: 'STUDENT',
      isActive: true,
      ageVerified: false,
      emailVerified: new Date(),
    },
  });

  console.log('✅ Created test users');

  // Create profiles for users
  await Promise.all([
    prisma.profile.upsert({
      where: { userId: teacherUser.id },
      update: {},
      create: {
        userId: teacherUser.id,
        bio: 'Experienced primary school teacher specializing in SEN support.',
        location: 'London, UK',
        skills: ['Teaching', 'SEN Support', 'Curriculum Planning'],
      },
    }),
    prisma.studentProfile.upsert({
      where: { userId: studentUser.id },
      update: {},
      create: {
        userId: studentUser.id,
        yearGroup: 'Year 9',
        keyStage: 'KS3',
      },
    }),
    prisma.parentProfile.upsert({
      where: { userId: parentUser.id },
      update: {},
      create: {
        userId: parentUser.id,
        childrenIds: [studentUser.id],
        relationship: 'Mother',
        preferredContactMethod: 'Email',
      },
    }),
  ]);

  console.log('✅ Created user profiles');

  // Create some features
  const features = await Promise.all([
    prisma.feature.upsert({
      where: { id: 'ai-lesson-planning' },
      update: {},
      create: {
        id: 'ai-lesson-planning',
        name: 'AI Lesson Planning',
        description: 'Generate comprehensive lesson plans using AI',
        creditCost: 5,
        isActive: true,
      },
    }),
    prisma.feature.upsert({
      where: { id: 'content-differentiation' },
      update: {},
      create: {
        id: 'content-differentiation',
        name: 'Content Differentiation',
        description: 'Adapt content for different learning needs',
        creditCost: 3,
        isActive: true,
      },
    }),
    prisma.feature.upsert({
      where: { id: 'assessment-generation' },
      update: {},
      create: {
        id: 'assessment-generation',
        name: 'Assessment Generation',
        description: 'Create assessments tailored to curriculum',
        creditCost: 4,
        isActive: true,
      },
    }),
    prisma.feature.upsert({
      where: { id: 'safeguarding-reports' },
      update: {},
      create: {
        id: 'safeguarding-reports',
        name: 'Safeguarding Reports',
        description: 'Generate and manage safeguarding reports',
        creditCost: 0, // Free for safeguarding
        isActive: true,
      },
    }),
  ]);

  console.log(`✅ Created ${features.length} features`);

  // Create subscriptions for users
  await Promise.all([
    prisma.subscription.create({
      data: {
        userId: teacherUser.id,
        tierId: 'tier-professional',
        status: 'active',
        startDate: new Date(),
      },
    }),
    prisma.subscription.create({
      data: {
        userId: parentUser.id,
        tierId: 'tier-basic',
        status: 'active',
        startDate: new Date(),
      },
    }),
    prisma.subscription.create({
      data: {
        userId: studentUser.id,
        tierId: 'tier-free',
        status: 'active',
        startDate: new Date(),
      },
    }),
  ]);

  console.log('✅ Created user subscriptions');

  // Create initial credits for users
  await Promise.all([
    prisma.credit.create({
      data: {
        userId: teacherUser.id,
        amount: 500,
        type: 'subscription',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
    prisma.credit.create({
      data: {
        userId: parentUser.id,
        amount: 100,
        type: 'subscription',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.credit.create({
      data: {
        userId: studentUser.id,
        amount: 10,
        type: 'subscription',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
  ]);

  console.log('✅ Created initial credits');

  // Create example safeguarding alert (for testing)
  await prisma.safeguardingAlert.create({
    data: {
      userId: studentUser.id,
      content: 'Test alert content - this is encrypted in production',
      context: 'test-seed',
      flags: JSON.stringify([{
        type: 'TEST',
        severity: 'LOW'
      }]),
      status: 'RESOLVED',
      severity: 'LOW',
      reviewedBy: dslUser.id,
      reviewedAt: new Date(),
    },
  });

  console.log('✅ Created test safeguarding alert');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📋 Test Accounts:');
  console.log('DSL: dsl@school.test / Test123!@#');
  console.log('Admin: admin@school.test / Test123!@#');
  console.log('Teacher: teacher@school.test / Test123!@#');
  console.log('SENCO: senco@school.test / Test123!@#');
  console.log('Parent: parent@test.com / Test123!@#');
  console.log('Student: student@school.test / Test123!@#');
  console.log('Unverified Student: unverified@school.test / Test123!@#');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
