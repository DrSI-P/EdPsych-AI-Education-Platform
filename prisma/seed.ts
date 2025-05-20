import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Test User',
      role: 'user',
    },
  });
  console.log(`Created test user with id: ${testUser.id}`);

  // Add more seed data as needed for development and testing
  // For example, you could create sample curriculum plans, assessments, etc.

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    // Instead of process.exit(1), we'll just disconnect and let the process end naturally
  })
  .finally(async () => {
    await prisma.$disconnect();
  });