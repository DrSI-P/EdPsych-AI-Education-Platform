import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding subscription tiers and features...');

  // Create features
  const features = [
    {
      id: 'feature_unlimited_courses',
      name: 'unlimited_courses',
      displayName: 'Unlimited Course Access',
      description: 'Access all courses without limitations',
      category: 'learning',
      creditCost: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'feature_ai_lesson_planning',
      name: 'ai_lesson_planning',
      displayName: 'AI Lesson Planning',
      description: 'Generate lesson plans using AI',
      category: 'teaching',
      creditCost: 5,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'feature_curriculum_builder',
      name: 'curriculum_builder',
      displayName: 'Curriculum Builder',
      description: 'Create and manage curriculum plans',
      category: 'teaching',
      creditCost: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'feature_content_differentiation',
      name: 'content_differentiation',
      displayName: 'Content Differentiation',
      description: 'Automatically differentiate content for different learning needs',
      category: 'inclusion',
      creditCost: 3,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'feature_cpd_tracking',
      name: 'cpd_tracking',
      displayName: 'CPD Tracking',
      description: 'Track and manage professional development',
      category: 'professional',
      creditCost: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'feature_portfolio_builder',
      name: 'portfolio_builder',
      displayName: 'Portfolio Builder',
      description: 'Create and manage professional portfolios',
      category: 'professional',
      creditCost: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'feature_family_accounts',
      name: 'family_accounts',
      displayName: 'Family Accounts',
      description: 'Connect and manage family accounts',
      category: 'access',
      creditCost: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'feature_immersive_experiences',
      name: 'immersive_experiences',
      displayName: 'Immersive Experiences',
      description: 'Access immersive learning experiences',
      category: 'learning',
      creditCost: 10,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Create features in database
  for (const feature of features) {
    await prisma.feature.upsert({
      where: { id: feature.id },
      update: feature,
      create: feature,
    });
  }

  console.log(`Created ${features.length} features`);

  // Get feature IDs for reference in tiers
  const featureRecords = await prisma.feature.findMany();
  const featureMap = featureRecords.reduce((map, feature) => {
    map[feature.name] = feature.id;
    return map;
  }, {} as Record<string, string>);

  // Create subscription tiers
  const tiers = [
    {
      id: 'tier_explorer',
      name: 'explorer',
      displayName: 'Explorer',
      description: 'Basic access to the platform with limited features',
      monthlyPrice: 0,
      yearlyPrice: 0,
      isActive: true,
      features: JSON.stringify([]),
      maxUsers: 1,
      tierType: 'individual',
      stripeMonthlyPriceId: null,
      stripeYearlyPriceId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tier_learner',
      name: 'learner',
      displayName: 'Learner',
      description: 'Full access to all courses and learning resources',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      isActive: true,
      features: JSON.stringify([
        featureMap.unlimited_courses,
      ]),
      maxUsers: 1,
      tierType: 'individual',
      stripeMonthlyPriceId: 'price_learner_monthly',
      stripeYearlyPriceId: 'price_learner_yearly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tier_educator',
      name: 'educator',
      displayName: 'Educator',
      description: 'Full access to all teaching and learning resources',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      isActive: true,
      features: JSON.stringify([
        featureMap.unlimited_courses,
        featureMap.curriculum_builder,
        featureMap.cpd_tracking,
        featureMap.portfolio_builder,
      ]),
      maxUsers: 1,
      tierType: 'individual',
      stripeMonthlyPriceId: 'price_educator_monthly',
      stripeYearlyPriceId: 'price_educator_yearly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tier_educator_plus',
      name: 'educator_plus',
      displayName: 'Educator Plus',
      description: 'Premium access to all features including AI tools',
      monthlyPrice: 29.99,
      yearlyPrice: 299.99,
      isActive: true,
      features: JSON.stringify([
        featureMap.unlimited_courses,
        featureMap.curriculum_builder,
        featureMap.cpd_tracking,
        featureMap.portfolio_builder,
        featureMap.ai_lesson_planning,
        featureMap.content_differentiation,
        featureMap.immersive_experiences,
      ]),
      maxUsers: 1,
      tierType: 'individual',
      stripeMonthlyPriceId: 'price_educator_plus_monthly',
      stripeYearlyPriceId: 'price_educator_plus_yearly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tier_family',
      name: 'family',
      displayName: 'Family Connect',
      description: 'Connect the whole family with shared access',
      monthlyPrice: 24.99,
      yearlyPrice: 249.99,
      isActive: true,
      features: JSON.stringify([
        featureMap.unlimited_courses,
        featureMap.family_accounts,
      ]),
      maxUsers: 5,
      tierType: 'family',
      stripeMonthlyPriceId: 'price_family_monthly',
      stripeYearlyPriceId: 'price_family_yearly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'tier_school',
      name: 'school',
      displayName: 'School',
      description: 'Institutional access for schools',
      monthlyPrice: 199.99,
      yearlyPrice: 1999.99,
      isActive: true,
      features: JSON.stringify([
        featureMap.unlimited_courses,
        featureMap.curriculum_builder,
        featureMap.cpd_tracking,
        featureMap.portfolio_builder,
        featureMap.ai_lesson_planning,
        featureMap.content_differentiation,
        featureMap.immersive_experiences,
      ]),
      maxUsers: 50,
      tierType: 'institutional',
      stripeMonthlyPriceId: 'price_school_monthly',
      stripeYearlyPriceId: 'price_school_yearly',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Create tiers in database
  for (const tier of tiers) {
    await prisma.subscriptionTier.upsert({
      where: { id: tier.id },
      update: tier,
      create: tier,
    });
  }

  console.log(`Created ${tiers.length} subscription tiers`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });