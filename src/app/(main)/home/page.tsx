'use client';

import { Suspense } from 'react';
import HomeWidget from '@/widgets/home/ui/HomeWidget';

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeWidget />
    </Suspense>
  );
}