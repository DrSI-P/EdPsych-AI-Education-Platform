import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Verifying subscription data...');
  
  // Query subscription tiers
  const tiers = await prisma.subscriptionTier.findMany();
  
  console.log(`\nFound ${tiers.length} subscription tiers:`);
  
  for (const tier of tiers) {
    console.log(`\n${tier.name} (${tier.displayName})`);
    console.log(`Description: ${tier.description}`);
    console.log(`Monthly Price: ${tier.monthlyPrice}`);
    console.log(`Yearly Price: ${tier.yearlyPrice}`);
    console.log(`Max Users: ${tier.maxUsers}`);
    console.log(`Tier Type: ${tier.tierType}`);
    
    // Features are stored as JSON string in the features field
    console.log('Features:');
    try {
      const featureIds = JSON.parse(tier.features as string);
      if (Array.isArray(featureIds) && featureIds.length > 0) {
        for (const featureId of featureIds) {
          const feature = await prisma.feature.findUnique({
            where: { id: featureId }
          });
          if (feature) {
            console.log(`- ${feature.name} (${feature.displayName}): ${feature.description}`);
          } else {
            console.log(`- Unknown feature ID: ${featureId}`);
          }
        }
      } else {
        console.log('No features assigned to this tier');
      }
    } catch (error: any) {
      console.log('Error parsing features JSON:', error.message);
    }
  }
  
  // Query features
  const features = await prisma.feature.findMany();
  console.log(`\nFound ${features.length} features:`);
  
  for (const feature of features) {
    console.log(`- ${feature.name} (${feature.displayName}): ${feature.description}`);
    console.log(`  Category: ${feature.category}, Credit Cost: ${feature.creditCost || 'N/A'}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });