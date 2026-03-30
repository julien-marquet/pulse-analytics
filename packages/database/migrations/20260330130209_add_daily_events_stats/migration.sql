-- CreateTable
CREATE TABLE "DailyEventsStats" (
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "DailyEventsStats_pkey" PRIMARY KEY ("date","type")
);
