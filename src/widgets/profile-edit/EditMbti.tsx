'use client';

import { MbtiSelector } from '@/shared/ui/MbtiSelector';

type Props = {
  value: string; // e.g., 'ENFP'
  onChange: (val: string) => void;
};

export function EditMbti({ value, onChange }: Props) {
  return <MbtiSelector value={value} onChange={onChange} />;
}
