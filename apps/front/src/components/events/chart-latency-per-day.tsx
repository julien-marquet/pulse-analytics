'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
import { FadingSkeleton } from '../skeletons/FadingSkeleton';

const chartConfig = {
  events: {
    label: 'Events',
    color: 'black',
  },
} satisfies ChartConfig;

type LatencyPerDay = { averageLatencyMs: number; date: string };

function getChartData(
  eventsPerDay: LatencyPerDay[],
  from: string | null,
  to: string | null,
) {
  if (from === null || to === null) {
    return [];
  }
  const start = DateTime.fromFormat(from, 'yyyy-MM-dd');
  const end = DateTime.fromFormat(to, 'yyyy-MM-dd');
  const diff = end.diff(start, 'days');

  const map = eventsPerDay.reduce<Record<string, number>>((acc, curr) => {
    if (acc[curr.date] != undefined)
      throw Error('duplicated entry in chart data');
    acc[curr.date] = curr.averageLatencyMs;
    return acc;
  }, {});

  const chartData = [];
  for (let i = 0; i < diff.days; i++) {
    const date = start.plus({ days: i }).toFormat('yyyy-MM-dd');
    chartData.push({
      day: date,
      latency: map[date] ?? null,
    });
  }
  return chartData;
}

interface ChartLatencyPerDayProps {
  eventsPerDay: LatencyPerDay[];
  from: string | null;
  to: string | null;
  className?: string;
  title: string;
}

export default function ChartLatencyPerDay({
  eventsPerDay,
  from,
  to,
  className,
  title,
}: ChartLatencyPerDayProps) {
  const chartData = getChartData(eventsPerDay, from, to);

  return (
    <FadingSkeleton className={className}>
      <Card className={'h-full w-full'}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="w-full h-full">
          <ChartContainer
            className="w-full h-full -mx-1.5"
            config={chartConfig}
          >
            <AreaChart data={chartData}>
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
                tickFormatter={(v: string) => v.slice(5)}
                padding={{ left: 24, right: 24 }}
              />
              <YAxis width="auto" stroke="var(--color-text-3)" />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                isAnimationActive={false}
                dataKey="latency"
                type="monotone"
                fill="url(#eventsGradient)"
                fillOpacity={1}
                activeDot={false}
                stroke="var(--chart-5)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </FadingSkeleton>
  );
}
