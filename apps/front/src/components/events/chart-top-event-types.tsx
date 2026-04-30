'use client';

import { Bar, BarChart, LabelList, LabelProps, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../ui/chart';
import { ChartData } from 'recharts/types/state/chartDataSlice';
import { FadingSkeleton } from '../skeletons/FadingSkeleton';

function getChartData(eventTypes: EventTypes[], totalEvents: number) {
  const chartData = [];
  for (let i = 0; i < eventTypes.length; i++) {
    chartData.push({
      count: eventTypes[i].count,
      percent: (eventTypes[i].count / totalEvents) * 100,
      eventType: eventTypes[i].eventType,
    });
  }

  return chartData as ChartData<{
    count: number;
    percent: number;
    eventType: string;
  }>;
}
function getChartConfig(eventTypes: EventTypes[]) {
  const chartConfig: ChartConfig = {};

  for (let i = 0; i < eventTypes.length; i++) {
    chartConfig[eventTypes[i].eventType] = {
      label: eventTypes[i].eventType,
    };
  }

  return chartConfig;
}

interface EventTypes {
  eventType: string;
  count: number;
}

interface TopEventsProps {
  eventTypes: EventTypes[];
  totalEvents: number;
  className?: string;
  title: string;
}

export default function ChartTopEventTypes({
  eventTypes,
  className,
  totalEvents,
  title,
}: TopEventsProps) {
  const chartConfig = getChartConfig(eventTypes);
  const chartData = getChartData(eventTypes, totalEvents);
  return (
    <FadingSkeleton className={className}>
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex w-full gap-4 min-w-0 min-h-0 items-center">
          <ChartContainer
            config={chartConfig}
            className="w-full min-w-0 min-h-full max-h-full max-w-full aspect-square [&_.recharts-pie-label-text]:fill-foreground"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{ top: 2, right: 64, bottom: -20 }}
            >
              <XAxis type="number" dataKey="count" hide />
              <YAxis type="category" display="none" axisLine={false} mirror />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                isAnimationActive={false}
                dataKey="count"
                fill="var(--chart-2)"
                radius={5}
                barSize={24}
              >
                <LabelList
                  dataKey="count"
                  position="right"
                  content={({ x, height, y, value }: LabelProps) => (
                    <text
                      x={Number(x) + 8}
                      y={Number(y) + Number(height) / 2}
                      fill="var(--primary-foreground)"
                      textAnchor="start"
                      dominantBaseline="central"
                    >
                      {value}
                    </text>
                  )}
                />
                <LabelList
                  dataKey="eventType"
                  position="left"
                  content={({ x, y, value }: LabelProps) => (
                    <text
                      x={Number(x)}
                      y={Number(y) - 12}
                      fill="var(--foreground)"
                      textAnchor="start"
                    >
                      {value}
                    </text>
                  )}
                />
                <LabelList
                  dataKey="percent"
                  formatter={(v: number) => `${v.toFixed(2)} %`}
                  position="right"
                  fill="var(--foreground)"
                  content={({
                    y,
                    height,
                    parentViewBox,
                    value,
                    formatter,
                  }: LabelProps) => {
                    const { x: vx = 0, width: vw = 0 } =
                      (parentViewBox as { x: number; width: number }) ?? {};
                    return (
                      <text
                        x={vx + vw}
                        y={Number(y) + Number(height) / 2}
                        fill="var(--foreground)"
                        textAnchor="end"
                        dominantBaseline="central"
                      >
                        {formatter ? formatter(value) : value}
                      </text>
                    );
                  }}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </FadingSkeleton>
  );
}
