import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create demo users with different roles
  const adminPassword = await hash('admin123', 10);
  const teacherPassword = await hash('teacher123', 10);
  const studentPassword = await hash('student123', 10);
  const parentPassword = await hash('parent123', 10);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edpsychconnect.com' },
    update: {},
    create: {
      email: 'admin@edpsychconnect.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
      profile: {
        create: {
          title: 'Dr',
          firstName: 'Admin',
          lastName: 'User',
          bio: 'Platform administrator with full system access',
          avatarUrl: '/avatars/admin-avatar.png',
        }
      }
    },
  });

  // Create teacher users
  const teacher1 = await prisma.user.upsert({
    where: { email: 'teacher1@edpsychconnect.com' },
    update: {},
    create: {
      email: 'teacher1@edpsychconnect.com',
      name: 'Sarah Williams',
      password: teacherPassword,
      role: 'TEACHER',
      profile: {
        create: {
          title: 'Ms',
          firstName: 'Sarah',
          lastName: 'Williams',
          bio: 'Year 5 teacher with specialization in mathematics and science',
          avatarUrl: '/avatars/teacher1-avatar.png',
          school: 'Oakwood Primary School',
          subjects: ['Mathematics', 'Science'],
          yearGroups: ['Year 5'],
        }
      }
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { email: 'teacher2@edpsychconnect.com' },
    update: {},
    create: {
      email: 'teacher2@edpsychconnect.com',
      name: 'James Thompson',
      password: teacherPassword,
      role: 'TEACHER',
      profile: {
        create: {
          title: 'Mr',
          firstName: 'James',
          lastName: 'Thompson',
          bio: 'Secondary school English teacher with focus on creative writing',
          avatarUrl: '/avatars/teacher2-avatar.png',
          school: 'Riverside Secondary School',
          subjects: ['English', 'Drama'],
          yearGroups: ['Year 8', 'Year 9'],
        }
      }
    },
  });

  // Create student users
  const student1 = await prisma.user.upsert({
    where: { email: 'student1@edpsychconnect.com' },
    update: {},
    create: {
      email: 'student1@edpsychconnect.com',
      name: 'Emily Johnson',
      password: studentPassword,
      role: 'STUDENT',
      profile: {
        create: {
          firstName: 'Emily',
          lastName: 'Johnson',
          bio: 'Year 5 student interested in science and art',
          avatarUrl: '/avatars/student1-avatar.png',
          school: 'Oakwood Primary School',
          yearGroup: 'Year 5',
        }
      }
    },
  });

  const student2 = await prisma.user.upsert({
    where: { email: 'student2@edpsychconnect.com' },
    update: {},
    create: {
      email: 'student2@edpsychconnect.com',
      name: 'James Johnson',
      password: studentPassword,
      role: 'STUDENT',
      profile: {
        create: {
          firstName: 'James',
          lastName: 'Johnson',
          bio: 'Year 8 student with interest in history and technology',
          avatarUrl: '/avatars/student2-avatar.png',
          school: 'Riverside Secondary School',
          yearGroup: 'Year 8',
        }
      }
    },
  });

  // Create parent users
  const parent1 = await prisma.user.upsert({
    where: { email: 'parent1@edpsychconnect.com' },
    update: {},
    create: {
      email: 'parent1@edpsychconnect.com',
      name: 'Robert Johnson',
      password: parentPassword,
      role: 'PARENT',
      profile: {
        create: {
          title: 'Mr',
          firstName: 'Robert',
          lastName: 'Johnson',
          bio: 'Parent of Emily and James Johnson',
          avatarUrl: '/avatars/parent1-avatar.png',
        }
      },
      children: {
        connect: [
          { id: student1.id },
          { id: student2.id }
        ]
      }
    },
  });

  const parent2 = await prisma.user.upsert({
    where: { email: 'parent2@edpsychconnect.com' },
    update: {},
    create: {
      email: 'parent2@edpsychconnect.com',
      name: 'Mary Johnson',
      password: parentPassword,
      role: 'PARENT',
      profile: {
        create: {
          title: 'Mrs',
          firstName: 'Mary',
          lastName: 'Johnson',
          bio: 'Parent of Emily and James Johnson',
          avatarUrl: '/avatars/parent2-avatar.png',
        }
      },
      children: {
        connect: [
          { id: student1.id },
          { id: student2.id }
        ]
      }
    },
  });

  // Create sample assessments
  const assessment1 = await prisma.assessment.create({
    data: {
      title: 'Year 5 Mathematics - Fractions and Decimals',
      description: 'End of unit assessment on fractions and decimals',
      subject: 'Mathematics',
      yearGroup: 'Year 5',
      createdBy: { connect: { id: teacher1.id } },
      questions: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            text: 'What is 1/4 + 1/2?',
            options: ['1/6', '2/6', '3/4', '1'],
            correctOption: 2,
            points: 5
          },
          {
            type: 'MULTIPLE_CHOICE',
            text: 'Which decimal is equal to 3/4?',
            options: ['0.25', '0.5', '0.75', '0.8'],
            correctOption: 2,
            points: 5
          },
          {
            type: 'OPEN_ENDED',
            text: 'Explain how to convert a fraction to a decimal.',
            points: 10
          }
        ]
      }
    }
  });

  const assessment2 = await prisma.assessment.create({
    data: {
      title: 'Year 8 English - Creative Writing',
      description: 'Assessment on narrative techniques and creative writing',
      subject: 'English',
      yearGroup: 'Year 8',
      createdBy: { connect: { id: teacher2.id } },
      questions: {
        create: [
          {
            type: 'OPEN_ENDED',
            text: 'Write a short story (300 words) about a character who discovers something unexpected.',
            points: 20
          },
          {
            type: 'MULTIPLE_CHOICE',
            text: 'Which of the following is an example of personification?',
            options: [
              'He was as brave as a lion.',
              'The wind whispered through the trees.',
              'Her eyes were blue like the ocean.',
              'The room was very quiet.'
            ],
            correctOption: 1,
            points: 5
          }
        ]
      }
    }
  });

  // Create sample assessment results
  await prisma.assessmentResult.create({
    data: {
      assessment: { connect: { id: assessment1.id } },
      student: { connect: { id: student1.id } },
      score: 18,
      maxScore: 20,
      completedAt: new Date(),
      answers: {
        create: [
          {
            questionIndex: 0,
            selectedOption: 2,
            isCorrect: true
          },
          {
            questionIndex: 1,
            selectedOption: 2,
            isCorrect: true
          },
          {
            questionIndex: 2,
            textAnswer: 'To convert a fraction to a decimal, you divide the numerator by the denominator. For example, to convert 3/4 to a decimal, you calculate 3 ÷ 4 = 0.75.',
            score: 8,
            feedback: 'Good explanation, but could have included more examples.'
          }
        ]
      }
    }
  });

  await prisma.assessmentResult.create({
    data: {
      assessment: { connect: { id: assessment2.id } },
      student: { connect: { id: student2.id } },
      score: 18,
      maxScore: 25,
      completedAt: new Date(),
      answers: {
        create: [
          {
            questionIndex: 0,
            textAnswer: 'The old house at the end of the street had always been a mystery to Jake. Every day on his way to school, he would walk past it and wonder who lived there. One rainy afternoon, Jake noticed the front door was slightly open. Curiosity got the better of him, and he decided to peek inside. As he pushed the door open, he was surprised to find not an abandoned house, but a bustling library with people reading books. "Welcome," said an elderly librarian. "We've been expecting you." Jake had discovered a secret community library that had been operating for decades, hidden in plain sight.',
            score: 15,
            feedback: 'Creative story with good narrative structure. Consider developing the character more.'
          },
          {
            questionIndex: 1,
            selectedOption: 1,
            isCorrect: true
          }
        ]
      }
    }
  });

  // Create sample resources
  await prisma.resource.create({
    data: {
      title: 'Fractions and Decimals Interactive Worksheet',
      description: 'Interactive worksheet for practicing conversion between fractions and decimals',
      type: 'WORKSHEET',
      subject: 'Mathematics',
      yearGroups: ['Year 5', 'Year 6'],
      url: '/resources/maths/fractions-decimals-worksheet.pdf',
      createdBy: { connect: { id: teacher1.id } },
      tags: ['fractions', 'decimals', 'conversion', 'practice']
    }
  });

  await prisma.resource.create({
    data: {
      title: 'Creative Writing Techniques Guide',
      description: 'Comprehensive guide to narrative techniques and creative writing for secondary students',
      type: 'GUIDE',
      subject: 'English',
      yearGroups: ['Year 7', 'Year 8', 'Year 9'],
      url: '/resources/english/creative-writing-guide.pdf',
      createdBy: { connect: { id: teacher2.id } },
      tags: ['creative writing', 'narrative', 'techniques', 'storytelling']
    }
  });

  // Create sample curriculum plans
  await prisma.curriculumPlan.create({
    data: {
      title: 'Year 5 Mathematics - Term 2',
      description: 'Curriculum plan covering fractions, decimals, and percentages',
      subject: 'Mathematics',
      yearGroup: 'Year 5',
      createdBy: { connect: { id: teacher1.id } },
      units: {
        create: [
          {
            title: 'Unit 1: Fractions',
            description: 'Understanding fractions and operations with fractions',
            order: 1,
            lessons: {
              create: [
                {
                  title: 'Lesson 1: Introduction to Fractions',
                  description: 'Basic concepts of fractions and their representation',
                  order: 1,
                  objectives: ['Understand what fractions represent', 'Identify fractions in real-life contexts', 'Represent fractions visually'],
                  resources: ['Fraction strips', 'Interactive whiteboard activities', 'Worksheets']
                },
                {
                  title: 'Lesson 2: Equivalent Fractions',
                  description: 'Identifying and creating equivalent fractions',
                  order: 2,
                  objectives: ['Recognize equivalent fractions', 'Create equivalent fractions by multiplying or dividing', 'Compare fractions using equivalence'],
                  resources: ['Fraction walls', 'Fraction circles', 'Online fraction tools']
                }
              ]
            }
          },
          {
            title: 'Unit 2: Decimals',
            description: 'Understanding decimals and their relationship to fractions',
            order: 2,
            lessons: {
              create: [
                {
                  title: 'Lesson 1: Introduction to Decimals',
                  description: 'Understanding decimal notation and place value',
                  order: 1,
                  objectives: ['Understand decimal notation', 'Relate decimals to fractions', 'Order decimals'],
                  resources: ['Place value charts', 'Number lines', 'Decimal cards']
                }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
