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
  const edPsychPassword = await hash('edpsych123', 10);

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

  // Create Educational Psychologist user
  const edPsych = await prisma.user.upsert({
    where: { email: 'edpsych@edpsychconnect.com' },
    update: {},
    create: {
      email: 'edpsych@edpsychconnect.com',
      name: 'Emma Richards',
      password: edPsychPassword,
      role: 'EDUCATIONAL_PSYCHOLOGIST',
      profile: {
        create: {
          title: 'Dr',
          firstName: 'Emma',
          lastName: 'Richards',
          bio: 'Educational Psychologist with 12 years of experience specializing in SEMH and neurodevelopmental assessments',
          avatarUrl: '/avatars/edpsych-avatar.png',
          qualifications: ['PhD Educational Psychology', 'MSc Child Development', 'HCPC Registered'],
          specializations: ['SEMH', 'Autism', 'ADHD', 'Dyslexia', 'Trauma-Informed Practice'],
          yearsOfExperience: 12
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
          teachingApproach: 'Visual and hands-on learning with differentiated instruction',
          senExperience: ['Dyslexia', 'ADHD', 'Autism']
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
          teachingApproach: 'Project-based learning with emphasis on peer collaboration',
          senExperience: ['Dyslexia', 'Social Communication Difficulties']
        }
      }
    },
  });

  // Create student users with detailed learning preferences
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
          learningPreferences: {
            create: {
              primaryLearningStyle: 'VISUAL',
              secondaryLearningStyle: 'KINESTHETIC',
              preferredSubjects: ['Science', 'Art'],
              challengeAreas: ['Mathematics - Division', 'Spelling'],
              strengths: ['Creative thinking', 'Scientific curiosity', 'Detailed observation'],
              accommodations: ['Visual aids', 'Hands-on activities', 'Extra time for writing tasks'],
              motivators: ['Recognition for creative work', 'Exploration opportunities', 'Connection to real-world applications']
            }
          },
          emotionalProfile: {
            create: {
              selfRegulationLevel: 'DEVELOPING',
              emotionalAwareness: 'MODERATE',
              stressResponses: ['Withdrawal', 'Fidgeting'],
              copingStrategies: ['Deep breathing', 'Drawing', 'Quiet time'],
              supportNeeds: ['Check-ins during transitions', 'Clear expectations', 'Positive reinforcement']
            }
          }
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
          learningPreferences: {
            create: {
              primaryLearningStyle: 'AUDITORY',
              secondaryLearningStyle: 'READING_WRITING',
              preferredSubjects: ['History', 'Computing'],
              challengeAreas: ['Modern Foreign Languages', 'Physical Education'],
              strengths: ['Verbal reasoning', 'Logical thinking', 'Memory for facts'],
              accommodations: ['Verbal instructions', 'Note-taking templates', 'Structured tasks'],
              motivators: ['Technology integration', 'Historical contexts', 'Independent research']
            }
          },
          emotionalProfile: {
            create: {
              selfRegulationLevel: 'ADVANCED',
              emotionalAwareness: 'HIGH',
              stressResponses: ['Verbal processing', 'Seeking clarification'],
              copingStrategies: ['Self-talk', 'Organization systems', 'Breaking tasks down'],
              supportNeeds: ['Advance notice of changes', 'Opportunities for discussion', 'Recognition of effort']
            }
          }
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
          parentingApproach: 'Supportive and structured, with emphasis on developing independence',
          homeEnvironment: 'Quiet study space available, regular routines established',
          communicationPreference: 'Email for regular updates, phone for urgent matters'
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
          parentingApproach: 'Nurturing with focus on emotional wellbeing and creative expression',
          homeEnvironment: 'Access to books, art supplies, and educational games',
          communicationPreference: 'Parent portal for updates, face-to-face meetings for discussions'
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

  // Create SEMH assessments
  const semhAssessment1 = await prisma.semhAssessment.create({
    data: {
      title: 'Emotional Regulation Assessment - Emily Johnson',
      description: 'Comprehensive assessment of emotional regulation skills and strategies',
      student: { connect: { id: student1.id } },
      assessor: { connect: { id: edPsych.id } },
      dateCompleted: new Date('2025-03-15'),
      areas: {
        create: [
          {
            name: 'Self-Awareness',
            score: 3,
            maxScore: 5,
            observations: 'Emily can identify basic emotions but struggles with more complex feelings. She is beginning to recognize physical signs of anxiety.',
            recommendations: 'Use emotion cards and body mapping activities to develop emotional vocabulary and awareness of physiological responses.'
          },
          {
            name: 'Self-Regulation',
            score: 2,
            maxScore: 5,
            observations: 'Emily finds it difficult to manage strong emotions, particularly frustration during challenging tasks. She sometimes withdraws or becomes tearful.',
            recommendations: 'Teach specific calming strategies such as deep breathing and counting. Provide a quiet space for regulation when needed.'
          },
          {
            name: 'Social Awareness',
            score: 4,
            maxScore: 5,
            observations: 'Emily shows good empathy and can recognize how others are feeling. She is sensitive to classroom atmosphere.',
            recommendations: 'Build on this strength through peer mentoring opportunities and collaborative projects.'
          }
        ]
      },
      summary: 'Emily shows a mixed profile of SEMH skills with strengths in social awareness and empathy. She would benefit from targeted support to develop emotional vocabulary and self-regulation strategies. Regular check-ins and a consistent approach between home and school are recommended.',
      followUpDate: new Date('2025-06-15')
    }
  });

  const semhAssessment2 = await prisma.semhAssessment.create({
    data: {
      title: 'Social Skills Assessment - James Johnson',
      description: 'Assessment of social communication and interaction skills',
      student: { connect: { id: student2.id } },
      assessor: { connect: { id: edPsych.id } },
      dateCompleted: new Date('2025-04-02'),
      areas: {
        create: [
          {
            name: 'Verbal Communication',
            score: 4,
            maxScore: 5,
            observations: 'James communicates clearly and can express his thoughts well. He sometimes uses overly formal language with peers.',
            recommendations: 'Role-play activities to practice casual conversation. Provide feedback on social language appropriate for different contexts.'
          },
          {
            name: 'Non-verbal Communication',
            score: 3,
            maxScore: 5,
            observations: 'James has limited facial expression and sometimes stands too close to others. He misses some social cues.',
            recommendations: 'Explicit teaching of non-verbal cues through video modeling and social stories. Practice appropriate personal space.'
          },
          {
            name: 'Friendship Skills',
            score: 3,
            maxScore: 5,
            observations: 'James has a small group of friends with shared interests. He struggles to join new groups or activities.',
            recommendations: 'Structured social opportunities with clear roles. Teach specific strategies for joining groups and starting conversations.'
          }
        ]
      },
      summary: 'James demonstrates good verbal communication skills but would benefit from support with non-verbal communication and social flexibility. A structured social skills group focusing on reading social cues and adapting to different social contexts is recommended.',
      followUpDate: new Date('2025-07-02')
    }
  });

  // Create biofeedback session records
  await prisma.biofeedbackSession.create({
    data: {
      student: { connect: { id: student1.id } },
      facilitator: { connect: { id: edPsych.id } },
      date: new Date('2025-04-10'),
      duration: 30,
      focusArea: 'ANXIETY_MANAGEMENT',
      baselineMeasures: {
        heartRate: 92,
        respirationRate: 18,
        skinConductance: 8.4
      },
      endMeasures: {
        heartRate: 78,
        respirationRate: 12,
        skinConductance: 5.2
      },
      techniques: ['DEEP_BREATHING', 'PROGRESSIVE_MUSCLE_RELAXATION'],
      observations: 'Emily was initially anxious but responded well to guided breathing. She reported feeling calmer after the session and was able to identify physical changes in her body.',
      studentFeedback: 'I liked the breathing exercise. It helped me feel less worried about my math test.',
      recommendations: 'Continue with daily 5-minute breathing practice. Introduce visualization techniques in next session.'
    }
  });

  await prisma.biofeedbackSession.create({
    data: {
      student: { connect: { id: student2.id } },
      facilitator: { connect: { id: edPsych.id } },
      date: new Date('2025-04-12'),
      duration: 25,
      focusArea: 'FOCUS_ENHANCEMENT',
      baselineMeasures: {
        heartRate: 85,
        respirationRate: 16,
        skinConductance: 7.1,
        eegAttention: 42
      },
      endMeasures: {
        heartRate: 80,
        respirationRate: 14,
        skinConductance: 6.8,
        eegAttention: 68
      },
      techniques: ['ATTENTION_TRAINING', 'MINDFULNESS'],
      observations: 'James showed good engagement with the attention training exercises. He was able to sustain focus for increasing periods and noticed when his attention drifted.',
      studentFeedback: 'The attention meter helped me see when I was concentrating. I want to try using this during homework time.',
      recommendations: 'Practice mindful attention for 10 minutes daily. Use visual feedback tools to reinforce progress.'
    }
  });

  // Create emotional pattern recognition data
  await prisma.emotionalPatternRecord.create({
    data: {
      student: { connect: { id: student1.id } },
      recorder: { connect: { id: teacher1.id } },
      period: 'TERM_1_2025',
      patterns: {
        create: [
          {
            triggerContext: 'Mathematics lessons - when faced with division problems',
            emotionalResponse: 'Anxiety, frustration',
            behavioralSigns: 'Pencil tapping, asking to use bathroom, reluctance to start work',
            intensity: 'MODERATE',
            frequency: 'WEEKLY',
            duration: 'SHORT_TERM',
            impactOnLearning: 'MODERATE',
            effectiveSupports: 'Visual aids, breaking problems into steps, check-ins before independent work'
          },
          {
            triggerContext: 'Playground - unstructured social time',
            emotionalResponse: 'Excitement, occasional overwhelm',
            behavioralSigns: 'Increased movement, louder voice, sometimes withdraws to quiet area',
            intensity: 'MILD_TO_MODERATE',
            frequency: 'DAILY',
            duration: 'SHORT_TERM',
            impactOnLearning: 'MINIMAL',
            effectiveSupports: 'Check-in after break times, sensory tools available, buddy system'
          }
        ]
      },
      summary: 'Emily shows a pattern of anxiety specifically related to mathematical challenges and occasional sensory overwhelm during unstructured times. She responds well to visual supports, predictability, and adult check-ins. Her emotional regulation is improving with consistent support.',
      recommendations: 'Continue with visual supports for mathematics. Implement a 5-minute calming routine before challenging tasks. Provide a quiet space option during break times.'
    }
  });

  await prisma.emotionalPatternRecord.create({
    data: {
      student: { connect: { id: student2.id } },
      recorder: { connect: { id: teacher2.id } },
      period: 'TERM_1_2025',
      patterns: {
        create: [
          {
            triggerContext: 'Group work - when roles are not clearly defined',
            emotionalResponse: 'Frustration, withdrawal',
            behavioralSigns: 'Reduced participation, brief verbal protests, physical distancing from group',
            intensity: 'MODERATE',
            frequency: 'WEEKLY',
            duration: 'MEDIUM_TERM',
            impactOnLearning: 'SIGNIFICANT',
            effectiveSupports: 'Clear role assignments, visual task cards, check-ins during transitions'
          },
          {
            triggerContext: 'Modern Foreign Languages - speaking activities',
            emotionalResponse: 'Anxiety, embarrassment',
            behavioralSigns: 'Requests to leave room, physical tension, reluctance to participate',
            intensity: 'HIGH',
            frequency: 'WEEKLY',
            duration: 'MEDIUM_TERM',
            impactOnLearning: 'SIGNIFICANT',
            effectiveSupports: 'Advance practice time, written prompts, recording instead of live speaking initially'
          }
        ]
      },
      summary: 'James experiences significant anxiety during language speaking activities and frustration during unstructured group work. He benefits from clear expectations, preparation time, and alternative ways to demonstrate skills. His anxiety decreases significantly when structure and predictability are provided.',
      recommendations: 'Implement structured group roles with visual supports. Provide advance notice and preparation time for speaking activities. Consider a gradual approach to oral language practice.'
    }
  });

  // Create parent-teacher communications with realistic scenarios
  await prisma.parentTeacherCommunication.create({
    data: {
      parent: { connect: { id: parent1.id } },
      teacher: { connect: { id: teacher1.id } },
      student: { connect: { id: student1.id } },
      date: new Date('2025-03-20'),
      subject: 'Mathematics support strategies',
      content: 'Dear Ms. Williams, I\'ve noticed Emily becoming increasingly anxious about her maths homework, particularly division problems. She often says she "can\'t do it" before trying. We\'ve been using the visual fraction guides you sent home, which help somewhat. Could we discuss additional strategies to build her confidence? I\'m available for a meeting next week. Kind regards, Robert Johnson',
      attachments: ['/communications/emily_math_work_sample.pdf'],
      responseDate: new Date('2025-03-21'),
      responseContent: 'Dear Mr. Johnson, Thank you for reaching out about Emily\'s maths anxiety. I\'ve noticed similar patterns in class. I\'d be happy to meet next week to discuss strategies. In the meantime, I\'ve attached some additional visual supports and a game that makes division practice more engaging. I\'ve found that Emily responds well to the "concrete-pictorial-abstract" approach, so we\'ll continue emphasizing this in class. Would Tuesday at 4pm work for a meeting? Best regards, Sarah Williams',
      responseAttachments: ['/communications/division_visual_aids.pdf', '/communications/math_games_at_home.pdf'],
      followUpActions: 'Scheduled meeting for Tuesday, March 25th. Teacher to provide daily check-ins before maths lessons. Parent to try recommended games and report back on effectiveness.',
      outcome: 'After implementing consistent visual supports and the suggested games at home, Emily showed reduced anxiety and improved willingness to attempt division problems. Her accuracy improved by approximately 30% over three weeks.'
    }
  });

  await prisma.parentTeacherCommunication.create({
    data: {
      parent: { connect: { id: parent2.id } },
      teacher: { connect: { id: teacher2.id } },
      student: { connect: { id: student2.id } },
      date: new Date('2025-04-05'),
      subject: 'Concerns about French class participation',
      content: 'Dear Mr. Thompson, James has been expressing significant anxiety about his French lessons, particularly when asked to speak in front of the class. Last night he was reluctant to go to school, mentioning an oral presentation scheduled for today. He enjoys the written aspects of languages but becomes extremely anxious about pronunciation. Could we discuss possible accommodations? Thank you, Mary Johnson',
      responseDate: new Date('2025-04-05'),
      responseContent: 'Dear Mrs. Johnson, Thank you for bringing this to my attention. I\'ve spoken with James\'s French teacher, and we\'ve agreed on some immediate accommodations. Today, James will be able to record his presentation rather than deliver it live, and we\'ll gradually work toward speaking in smaller groups before whole-class presentations. I\'ve also arranged for him to have some additional practice time with the language assistant during lunch on Tuesdays. Could we schedule a meeting next week to develop a longer-term plan? Best regards, James Thompson',
      followUpActions: 'French teacher to provide speaking practice in small groups. Weekly check-ins with James about anxiety levels. Parents to use French language app at home for additional practice in a low-pressure environment.',
      outcome: 'James began participating in small group speaking activities after three weeks of recorded submissions and practice sessions. His French teacher reported improved confidence in familiar contexts, though whole-class speaking remains challenging.'
    }
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
