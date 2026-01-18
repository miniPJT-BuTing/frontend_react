'use client';

import { Suspense } from 'react';
import MatchingListWidget from '@/widgets/matching/ui/MatchingListWidget';

export default function MatchingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MatchingListWidget />
    </Suspense>
  );
}
