'use client';

import { OneLinerField } from '@/shared/ui/OneLinerField';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function EditBio({ value, onChange }: Props) {
  return <OneLinerField value={value} onChange={onChange} />;
}
