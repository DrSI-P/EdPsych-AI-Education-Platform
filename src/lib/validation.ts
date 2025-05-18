import { z } from 'zod';

// User validation schema
export const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address format" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT']),
});

// Profile validation schema
export const profileSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  bio: z.string().optional(),
  avatarUrl: z.string().url({ message: "Avatar URL must be a valid URL" }).optional(),
  school: z.string().optional(),
  subjects: z.array(z.string()).optional(),
  yearGroups: z.array(z.string()).optional(),
  yearGroup: z.string().optional(),
});

// Assessment validation schema
export const assessmentSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  yearGroup: z.string().min(1, { message: "Year group is required" }),
  questions: z.array(
    z.object({
      type: z.enum(['MULTIPLE_CHOICE', 'OPEN_ENDED', 'MATCHING', 'FILE_UPLOAD']),
      text: z.string().min(5, { message: "Question text must be at least 5 characters" }),
      options: z.array(z.string()).optional(),
      correctOption: z.number().optional(),
      points: z.number().min(1, { message: "Points must be at least 1" }),
    })
  ).min(1, { message: "At least one question is required" }),
});

// Resource validation schema
export const resourceSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  type: z.enum(['WORKSHEET', 'GUIDE', 'VIDEO', 'PRESENTATION', 'ACTIVITY', 'OTHER']),
  subject: z.string().min(1, { message: "Subject is required" }),
  yearGroups: z.array(z.string()).min(1, { message: "At least one year group is required" }),
  url: z.string().url({ message: "URL must be a valid URL" }),
  tags: z.array(z.string()).optional(),
});

// Curriculum plan validation schema
export const curriculumPlanSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  yearGroup: z.string().min(1, { message: "Year group is required" }),
  units: z.array(
    z.object({
      title: z.string().min(5, { message: "Unit title must be at least 5 characters" }),
      description: z.string().min(10, { message: "Unit description must be at least 10 characters" }),
      order: z.number().min(1, { message: "Order must be at least 1" }),
      lessons: z.array(
        z.object({
          title: z.string().min(5, { message: "Lesson title must be at least 5 characters" }),
          description: z.string().min(10, { message: "Lesson description must be at least 10 characters" }),
          order: z.number().min(1, { message: "Order must be at least 1" }),
          objectives: z.array(z.string()).min(1, { message: "At least one objective is required" }),
          resources: z.array(z.string()).optional(),
        })
      ).optional(),
    })
  ).optional(),
});

// Data sanitization function
export function sanitizeInput(input: string): string {
  // Remove potentially dangerous HTML tags
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
  
  return sanitized;
}

// Function to validate and sanitize user input
export function validateAndSanitizeUser(userData: any) {
  // Validate with Zod schema
  const validatedData = userSchema.parse(userData);
  
  // Sanitize string fields
  return {
    ...validatedData,
    email: sanitizeInput(validatedData.email),
    name: sanitizeInput(validatedData.name),
    // Don't sanitize password as it would change the value
  };
}

// Function to validate and sanitize profile input
export function validateAndSanitizeProfile(profileData: any) {
  // Validate with Zod schema
  const validatedData = profileSchema.parse(profileData);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: validatedData.title ? sanitizeInput(validatedData.title) : undefined,
    firstName: sanitizeInput(validatedData.firstName),
    lastName: sanitizeInput(validatedData.lastName),
    bio: validatedData.bio ? sanitizeInput(validatedData.bio) : undefined,
    school: validatedData.school ? sanitizeInput(validatedData.school) : undefined,
    subjects: validatedData.subjects ? validatedData.subjects.map(sanitizeInput) : undefined,
    yearGroups: validatedData.yearGroups ? validatedData.yearGroups.map(sanitizeInput) : undefined,
    yearGroup: validatedData.yearGroup ? sanitizeInput(validatedData.yearGroup) : undefined,
  };
}

// Function to validate and sanitize assessment input
export function validateAndSanitizeAssessment(assessmentData: any) {
  // Validate with Zod schema
  const validatedData = assessmentSchema.parse(assessmentData);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: sanitizeInput(validatedData.title),
    description: sanitizeInput(validatedData.description),
    subject: sanitizeInput(validatedData.subject),
    yearGroup: sanitizeInput(validatedData.yearGroup),
    questions: validatedData.questions.map(q => ({
      ...q,
      text: sanitizeInput(q.text),
      options: q.options ? q.options.map(sanitizeInput) : undefined,
    })),
  };
}

// Function to validate and sanitize resource input
export function validateAndSanitizeResource(resourceData: any) {
  // Validate with Zod schema
  const validatedData = resourceSchema.parse(resourceData);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: sanitizeInput(validatedData.title),
    description: sanitizeInput(validatedData.description),
    subject: sanitizeInput(validatedData.subject),
    yearGroups: validatedData.yearGroups.map(sanitizeInput),
    tags: validatedData.tags ? validatedData.tags.map(sanitizeInput) : undefined,
  };
}

// Function to validate and sanitize curriculum plan input
export function validateAndSanitizeCurriculumPlan(planData: any) {
  // Validate with Zod schema
  const validatedData = curriculumPlanSchema.parse(planData);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: sanitizeInput(validatedData.title),
    description: sanitizeInput(validatedData.description),
    subject: sanitizeInput(validatedData.subject),
    yearGroup: sanitizeInput(validatedData.yearGroup),
    units: validatedData.units ? validatedData.units.map(unit => ({
      ...unit,
      title: sanitizeInput(unit.title),
      description: sanitizeInput(unit.description),
      lessons: unit.lessons ? unit.lessons.map(lesson => ({
        ...lesson,
        title: sanitizeInput(lesson.title),
        description: sanitizeInput(lesson.description),
        objectives: lesson.objectives.map(sanitizeInput),
        resources: lesson.resources ? lesson.resources.map(sanitizeInput) : undefined,
      })) : undefined,
    })) : undefined,
  };
}
