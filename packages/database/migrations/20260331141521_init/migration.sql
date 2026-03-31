-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "receivedAt" TIMESTAMPTZ(3) NOT NULL,
    "processedAt" TIMESTAMPTZ(3) NOT NULL,
    "properties" JSONB,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyEventStat" (
    "date" DATE NOT NULL,
    "eventType" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "timeZone" TEXT NOT NULL,

    CONSTRAINT "DailyEventStat_pkey" PRIMARY KEY ("date","eventType","timeZone")
);
