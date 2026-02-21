import { useSignupStore } from '@/features/signup/model';
import { OneLinerField } from '@/shared/ui/OneLinerField';

export function OneLiner() {
  const { oneLiner, setPersonality } = useSignupStore();

  return (
    <OneLinerField value={oneLiner} onChange={(nextValue) => setPersonality({ oneLiner: nextValue })} />
  );
}
