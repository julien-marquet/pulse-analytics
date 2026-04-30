'use client';

import { Button } from '@/components/ui/button';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
        <h3 className="mb-1.5 text-3xl font-semibold">Something went wrong</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The page you&apos;re looking for isn&apos;t found, we suggest you back
          to home.
        </p>
        <Button onClick={reset} size="lg" className="rounded-lg text-base">
          Retry
        </Button>
      </div>
    </div>
  );
}
