-- CreateTable
CREATE TABLE "CommunicationSettings" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "preferredMethod" TEXT NOT NULL DEFAULT 'email',
  "notificationFrequency" TEXT NOT NULL DEFAULT 'daily',
  "enableMessageNotifications" BOOLEAN NOT NULL DEFAULT true,
  "enableMeetingNotifications" BOOLEAN NOT NULL DEFAULT true,
  "enableReportNotifications" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "CommunicationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunicationMessage" (
  "id" TEXT NOT NULL,
  "senderId" TEXT NOT NULL,
  "recipientId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "CommunicationMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunicationMeeting" (
  "id" TEXT NOT NULL,
  "organizerId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "meetingType" TEXT NOT NULL DEFAULT 'parent_teacher',
  "scheduledDate" TIMESTAMP(3) NOT NULL,
  "duration" INTEGER NOT NULL DEFAULT 30,
  "location" TEXT NOT NULL DEFAULT 'Virtual',
  "status" TEXT NOT NULL DEFAULT 'scheduled',
  "participantIds" TEXT[],
  "virtualMeetingUrl" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "CommunicationMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunicationReportRequest" (
  "id" TEXT NOT NULL,
  "requesterId" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  CONSTRAINT "CommunicationReportRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommunicationLog" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "details" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT "CommunicationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CommunicationSettings_userId_key" ON "CommunicationSettings"("userId");

-- AddForeignKey
ALTER TABLE "CommunicationSettings" ADD CONSTRAINT "CommunicationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationMessage" ADD CONSTRAINT "CommunicationMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationMessage" ADD CONSTRAINT "CommunicationMessage_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationMeeting" ADD CONSTRAINT "CommunicationMeeting_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationMeeting" ADD CONSTRAINT "CommunicationMeeting_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationReportRequest" ADD CONSTRAINT "CommunicationReportRequest_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationReportRequest" ADD CONSTRAINT "CommunicationReportRequest_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunicationLog" ADD CONSTRAINT "CommunicationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;