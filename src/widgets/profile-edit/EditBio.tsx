'use client';

const MAX_LENGTH = 50;

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export function EditBio({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-base font-bold text-black">한줄 소개</label>
        <span className="rounded-full border-2 border-black bg-[#FBE264] px-3 py-1 text-xs font-extrabold">
          {value.length}/{MAX_LENGTH}
        </span>
      </div>

      <textarea
        value={value}
        maxLength={MAX_LENGTH}
        onChange={(e) => onChange(e.target.value)}
        placeholder="나를 표현하는 한마디를 적어주세요! (최대 50자)"
        className="h-40 w-full resize-none rounded-xl border-2 border-black p-4 text-base outline-none transition-colors focus:bg-gray-50 placeholder:text-gray-400"
      />
    </div>
  );
}
