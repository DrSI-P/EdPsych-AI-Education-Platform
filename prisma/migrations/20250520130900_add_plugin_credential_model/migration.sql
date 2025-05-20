-- CreateTable
CREATE TABLE IF NOT EXISTS "PluginCredential" (
    "id" TEXT NOT NULL,
    "pluginId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "credentials" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PluginCredential_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
-- Using DO block to handle potential errors if index already exists
DO $$
BEGIN
    BEGIN
        CREATE UNIQUE INDEX "PluginCredential_pluginId_userId_key" ON "PluginCredential"("pluginId", "userId");
    EXCEPTION
        WHEN duplicate_table THEN
        -- Index already exists, do nothing
    END;
END $$;

-- AddForeignKey
-- Using DO block to handle potential errors if constraint already exists
DO $$
BEGIN
    BEGIN
        ALTER TABLE "PluginCredential" ADD CONSTRAINT "PluginCredential_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    EXCEPTION
        WHEN duplicate_object THEN
        -- Constraint already exists, do nothing
    END;
END $$;
