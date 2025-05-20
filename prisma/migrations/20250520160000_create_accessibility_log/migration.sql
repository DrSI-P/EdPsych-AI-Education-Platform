-- CreateTable
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

-- AddForeignKey
-- Using DO block to handle potential errors if constraint already exists
DO $$
BEGIN
    BEGIN
        ALTER TABLE "AccessibilityLog" ADD CONSTRAINT "AccessibilityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION
        WHEN duplicate_object THEN
        -- Constraint already exists, do nothing
    END;
END $$;