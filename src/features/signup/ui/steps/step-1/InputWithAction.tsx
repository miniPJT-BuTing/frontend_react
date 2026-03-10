import type { HTMLInputTypeAttribute } from 'react';
import { RetroButton } from '@/shared/ui/button';

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  type?: HTMLInputTypeAttribute;
  autoComplete?: string;
  buttonText: string;
  disabled?: boolean;
  onChange: (v: string) => void;
  onAction: () => void;
};

export function InputWithAction({
  label,
  placeholder,
  value,
  type = 'text',
  autoComplete,
  buttonText,
  disabled,
  onChange,
  onAction,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold">{label}</label>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onInput={(e) => onChange((e.target as HTMLInputElement).value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-14 w-full rounded-full border border-black px-4 pr-24 text-base outline-none transition-colors"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <RetroButton
            type="button"
            variant="primary"
            onClick={onAction}
            className="h-9 whitespace-nowrap px-4 text-sm"
            disabled={disabled}
          >
            {buttonText}
          </RetroButton>
        </div>
      </div>
    </div>
  );
}
