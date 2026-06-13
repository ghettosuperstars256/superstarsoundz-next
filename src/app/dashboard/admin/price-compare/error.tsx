'use client';

import DashboardError from '@/components/DashboardError';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <DashboardError error={error} reset={reset} />;
}
