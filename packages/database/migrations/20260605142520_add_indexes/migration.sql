-- CreateIndex
CREATE INDEX "DailyEventStat_timeZone_date_idx" ON "DailyEventStat"("timeZone", "date");

-- CreateIndex
CREATE INDEX "Event_emittedAt_idx" ON "Event"("emittedAt" DESC);

-- CreateIndex
CREATE INDEX "Event_type_idx" ON "Event"("type");
