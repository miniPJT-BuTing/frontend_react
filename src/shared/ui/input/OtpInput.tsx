import { useEffect, useRef } from 'react';

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

export function OtpInput({ length = 6, value, onChange }: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const values = Array.from({ length }, (_, i) => value[i] ?? '');

  const focus = (index: number) => {
    inputsRef.current[index]?.focus();
  };

  const update = (next: string[]) => {
    onChange(next.join('').slice(0, length));
  };

  const handleChange = (index: number, v: string) => {
    if (!/^\d?$/.test(v)) return;

    const next = [...values];
    next[index] = v;
    update(next);

    if (v && index < length - 1) {
      focus(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      focus(index - 1);
    }
  };

  return (
    <div className="flex gap-2">
      {values.map((v, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="
            h-14 w-12 rounded-xl border-2 border-black
            text-center text-xl font-bold
            outline-none focus:bg-gray-50
          "
        />
      ))}
    </div>
  );
}
