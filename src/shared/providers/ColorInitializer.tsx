'use client';

import { useEffect } from 'react';
import { applyColors } from '@/shared/styles/applyColors';

export function ColorInitializer() {
  useEffect(() => {
    applyColors();
  }, []);

  return null;
}
