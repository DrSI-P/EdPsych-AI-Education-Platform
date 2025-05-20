-- CreateTable
CREATE TABLE "PluginCredential" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PluginCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PluginCredential_pluginId_userId_key" ON "PluginCredential"("pluginId", "userId");

-- AddForeignKey
ALTER TABLE "PluginCredential" ADD CONSTRAINT "PluginCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "AccessibilityLog" ADD COLUMN "action" TEXT,
ADD COLUMN "feature" TEXT,
ADD COLUMN "details" TEXT;