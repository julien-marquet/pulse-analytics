'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '../ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';

import { type ChartConfig } from '@/components/ui/chart';
import { DateTime } from 'luxon';

const chartConfig = {
  events: {
    label: 'Events',
    color: 'black',
  },
} satisfies ChartConfig;

type EventPerDay = { count: number; date: string };

interface ChartEventsPerDayProps {
  eventsPerDay: EventPerDay[];
  from: string;
  to: string;
}

function getChartData(eventsPerDay: EventPerDay[], from: string, to: string) {
  const start = DateTime.fromFormat(from, 'yyyy-MM-dd');
  const end = DateTime.fromFormat(to, 'yyyy-MM-dd');
  const diff = end.diff(start, 'days');

  const map = eventsPerDay.reduce<Record<string, number>>((acc, curr) => {
    if (acc[curr.date] != undefined)
      throw Error('duplicated entry in chart data');
    acc[curr.date] = curr.count;
    return acc;
  }, {});

  const chartData = [];
  for (let i = 0; i < diff.days; i++) {
    const date = start.plus({ days: i }).toFormat('yyyy-MM-dd');
    chartData.push({
      day: date,
      events: map[date] ?? 0,
    });
  }
  return chartData;
}

export default function ChartEventsPerDay({
  eventsPerDay,
  from,
  to,
}: ChartEventsPerDayProps) {
  const chartData = getChartData(eventsPerDay, from, to);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Number of events for the last 7 days</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <defs>
              <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              type="category"
              dataKey="day"
              padding={{ left: 24, right: 24 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="events"
              type="monotone"
              fill="url(#eventsGradient)"
              fillOpacity={1}
              animationDuration={0}
              activeDot={false}
              stroke="var(--chart-5)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
