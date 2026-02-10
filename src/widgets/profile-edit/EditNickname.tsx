'use client';

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function EditNickname({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold text-black">닉네임</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="닉네임을 입력해주세요"
        className="h-14 w-full rounded-full border-2 border-black px-4 text-base outline-none focus:bg-gray-50 placeholder:text-gray-400"
      />
    </div>
  );
}
