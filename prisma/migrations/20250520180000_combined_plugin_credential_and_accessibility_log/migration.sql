-- This migration combines the creation of PluginCredential and AccessibilityLog tables
-- It uses IF NOT EXISTS clauses to handle cases where tables might already exist

-- CreateTable for PluginCredential
CREATE TABLE IF NOT EXISTS "PluginCredential" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PluginCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable for AccessibilityLog
CREATE TABLE IF NOT EXISTS "AccessibilityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "settingChanged" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "action" TEXT,
    "feature" TEXT,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccessibilityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for PluginCredential
DO $$
BEGIN
    BEGIN
        CREATE UNIQUE INDEX "PluginCredential_pluginId_userId_key" ON "PluginCredential"("pluginId", "userId");
    EXCEPTION
        WHEN duplicate_table THEN
        -- Index already exists, do nothing
    END;
END $$;

-- AddForeignKey for PluginCredential
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'PluginCredential_userId_fkey'
    ) THEN
        ALTER TABLE "PluginCredential" 
        ADD CONSTRAINT "PluginCredential_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;

-- AddForeignKey for AccessibilityLog
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'AccessibilityLog_userId_fkey'
    ) THEN
        ALTER TABLE "AccessibilityLog" 
        ADD CONSTRAINT "AccessibilityLog_userId_fkey" 
        FOREIGN KEY ("userId") REFERENCES "User"("id") 
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;