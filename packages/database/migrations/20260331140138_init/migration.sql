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
CREATE TABLE "DailyEventsStats" (
    "date" DATE NOT NULL,
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "timeZone" TEXT NOT NULL,

    CONSTRAINT "DailyEventsStats_pkey" PRIMARY KEY ("date","type","timeZone")
);
