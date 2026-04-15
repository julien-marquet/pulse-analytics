'use client';

import { Pie, PieChart, PieSectorShapeProps, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChartConfig, ChartContainer } from '../ui/chart';
import { ChartData } from 'recharts/types/state/chartDataSlice';
import { CircleSmall } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface EventTypes {
  eventType: string;
  count: number;
}

interface TopEventsProps {
  totalEvents: number;
  eventTypes: EventTypes[];
  className?: string;
}

function getChartData(eventTypes: EventTypes[], totalEvents: number) {
  const chartData = [];
  let totalInTop = 0;
  for (let i = 0; i < eventTypes.length; i++) {
    totalInTop += eventTypes[i].count;
    chartData.push({
      count: eventTypes[i].count,
      eventType: eventTypes[i].eventType,
      fill: `var(--chart-${(i % 5) + 1})`,
    });
  }

  chartData.push({
    count: totalEvents - totalInTop,
    eventType: 'other',
    fill: `var(--muted-foreground)`,
  });

  return chartData as ChartData<{
    count: number;
    eventType: string;
    fill: string;
  }>;
}
function getChartConfig(eventTypes: EventTypes[]) {
  const chartConfig: ChartConfig = {};

  for (let i = 0; i < eventTypes.length; i++) {
    chartConfig[eventTypes[i].eventType] = {
      label: eventTypes[i].eventType,
    };
  }

  chartConfig['other'] = {
    label: 'Other',
  };
  return chartConfig;
}

export default function ChartTopEventTypes({
  eventTypes,
  totalEvents,
  className,
}: TopEventsProps) {
  const chartConfig = getChartConfig(eventTypes);
  const chartData = getChartData(eventTypes, totalEvents);

  const [hoveredSector, setHoveredSector] = useState<string | undefined>(
    undefined,
  );

  const handleMouseEnter = (type?: string) => {
    setHoveredSector(type);
  };

  const handleMouseLeave = () => {
    setHoveredSector(undefined);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Top event types for the last 7 days</CardTitle>
      </CardHeader>
      <CardContent className="flex w-full h-full gap-4 min-w-0 min-h-0 items-center">
        <ChartContainer
          config={chartConfig}
          className="-ml-2.5 min-w-0 h-full max-h-full max-w-full aspect-square [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <Pie
              innerRadius={'60%'}
              outerRadius={'100%'}
              data={chartData}
              animationDuration={0}
              paddingAngle={2}
              cornerRadius={2}
              dataKey="count"
              nameKey="eventType"
              isAnimationActive={true}
              shape={(props) =>
                renderSectorShape(
                  props,
                  hoveredSector,
                  chartData.length - 1,
                  handleMouseEnter,
                  handleMouseLeave,
                )
              }
            ></Pie>
          </PieChart>
        </ChartContainer>

        <ul className="basis-60 grow shrink flex flex-col min-w-0">
          {chartData.slice(0, -1).map(({ count, eventType, fill }) => (
            <li
              key={eventType}
              className="flex gap-1 items-center py-2"
              onMouseEnter={() => handleMouseEnter(eventType)}
              onMouseLeave={() => handleMouseLeave()}
            >
              <CircleSmall color={fill} />
              <div
                className={cn(
                  'flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap',
                )}
              >
                <span
                  className={cn(
                    'font-medium text-sm text-foreground',
                    hoveredSector === eventType && 'underline',
                  )}
                >
                  {eventType}
                </span>
              </div>

              <span
                className={cn(
                  'font-bold text-sm text-secondary-foreground',
                  hoveredSector === eventType && 'underline',
                )}
              >
                {count}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function truncateWithEllipses(text: string, max: number) {
  if (text.length <= max) return text;
  return text.slice(0, max - 3) + (text.length > max ? '…' : '');
}

function renderSectorShape(
  props: PieSectorShapeProps,
  activeSector: string | undefined,
  otherSectorIndex: number,
  onMouseEnter: (type?: string) => void,
  onMouseLeave: () => void,
) {
  const pieIsHovered = activeSector != undefined;
  const sectorIsHovered = activeSector === props.name;

  return (
    <Sector
      {...props}
      outerRadius={
        props.index !== otherSectorIndex
          ? props.outerRadius
          : props.outerRadius - 10
      }
      onMouseEnter={() => onMouseEnter(props.name)}
      onMouseLeave={() => onMouseLeave()}
      style={{
        stroke: sectorIsHovered ? props.fill : undefined,
        strokeWidth: 4,
        fillOpacity: pieIsHovered && !sectorIsHovered ? 0.6 : undefined,
      }}
    />
  );
}
