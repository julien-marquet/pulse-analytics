import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

interface TopEventsProps {
  eventTypes: {
    eventType: string;
    count: number;
  }[];
}

export default function ChartTopEventTypes({ eventTypes }: TopEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top event types for the last 7 days</CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-2">
            {eventTypes.map(({ count, eventType }) => (
              <div key={eventType} className="flex">
                <h1>{eventType}</h1>
                <span>{count}</span>
              </div>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
