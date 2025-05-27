-- Create _prisma_migrations table
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
  "id" character varying(36) NOT NULL,
  "checksum" character varying(64) NOT NULL,
  "finished_at" timestamp with time zone,
  "migration_name" character varying(255) NOT NULL,
  "logs" text,
  "rolled_back_at" timestamp with time zone,
  "started_at" timestamp with time zone NOT NULL DEFAULT now(),
  "applied_steps_count" integer NOT NULL DEFAULT 0,
  CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id")
);

-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "password" TEXT,
  "role" TEXT DEFAULT 'user',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Create Account table
CREATE TABLE IF NOT EXISTS "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,
  CONSTRAINT "Account_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Create Session table
CREATE TABLE IF NOT EXISTS "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Session_sessionToken_key" ON "Session"("sessionToken");

-- Create VerificationToken table
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  "identifier" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier", "token")
);
CREATE UNIQUE INDEX IF NOT EXISTS "VerificationToken_token_key" ON "VerificationToken"("token");

-- Create Course table
CREATE TABLE IF NOT EXISTS "Course" (
  "id" TEXT NOT NULL,
  "creatorId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "gradeLevel" TEXT NOT NULL,
  "difficulty" TEXT DEFAULT 'intermediate',
  "learningObjectives" TEXT[] NOT NULL,
  "prerequisites" TEXT[] NOT NULL,
  "duration" INTEGER,
  "imageUrl" TEXT,
  "isPublished" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Course_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id")
);

-- Create Enrollment table
CREATE TABLE IF NOT EXISTS "Enrollment" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "status" TEXT DEFAULT 'active',
  "progress" INTEGER DEFAULT 0,
  "startDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "completionDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Enrollment_userId_courseId_key" ON "Enrollment"("userId", "courseId");

-- Create CourseProgress table
CREATE TABLE IF NOT EXISTS "CourseProgress" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "moduleId" TEXT DEFAULT '',
  "contentId" TEXT DEFAULT '',
  "progress" INTEGER DEFAULT 0,
  "completed" BOOLEAN DEFAULT false,
  "timeSpent" INTEGER DEFAULT 0,
  "lastAccessed" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseProgress_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CourseProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CourseProgress_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "CourseProgress_userId_courseId_moduleId_contentId_key" ON "CourseProgress"("userId", "courseId", "moduleId", "contentId");

-- Create Certificate table
CREATE TABLE IF NOT EXISTS "Certificate" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "certificateUrl" TEXT,
  "issueDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Certificate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id"),
  CONSTRAINT "Certificate_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id")
);

-- Create Profile table
CREATE TABLE IF NOT EXISTS "Profile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "bio" TEXT,
  "address" TEXT,
  "birthDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "gender" TEXT,
  "interests" TEXT[],
  "location" TEXT,
  "phoneNumber" TEXT,
  "skills" TEXT[],
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "website" TEXT,
  CONSTRAINT "Profile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "Profile_userId_key" ON "Profile"("userId");

-- Create Lesson table
CREATE TABLE IF NOT EXISTS "Lesson" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "creatorId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "videoUrl" TEXT,
  "audioUrl" TEXT,
  "imageUrl" TEXT,
  "order" INTEGER DEFAULT 0,
  "duration" INTEGER,
  "isPublished" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Lesson_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Lesson_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id")
);

-- Create Notification table
CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT false,
  "link" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);