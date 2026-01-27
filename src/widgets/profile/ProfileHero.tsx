type MyInfo = {
  nickname: string;
  school: string;
  age: number;
  mbti: string;
  keywords: string[];
  intro: string;
  aiAnimal: string;
};

const mockMyInfo: MyInfo = {
  nickname: '민희',
  school: '동아대',
  age: 22,
  mbti: 'ENFP',
  keywords: ['활발', '솔직', '배려'],
  intro: '재밌게 이야기하고 편하게 친해져요 :)',
  aiAnimal: '🦊 여우상',
};

export default function ProfileHero() {
  const me = mockMyInfo;

  return (
    <section className="rounded-[22px] border border-black bg-white p-5">
      <div className="flex flex-col items-center text-center">
        <div className="relative size-28 overflow-hidden rounded-full border border-black bg-[#EAF4FF]">
          <div className="absolute inset-0 flex items-center justify-center text-4xl">🙂</div>
        </div>

        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-black bg-[#FF9BC2] px-3 py-[4px] text-[12px] font-extrabold text-black">
          <span>AI 분석 결과</span>
          <span className="font-black">{me.aiAnimal}</span>
        </div>

        <h1 className="mt-3 text-[18px] font-extrabold text-black leading-tight">
          {me.nickname}님의 프로필
        </h1>

        <p className="mt-1 text-[12px] font-semibold text-gray-500">
          {me.school} · {me.age}세 · {me.mbti}
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {me.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-black bg-[#FFE1EE] px-3 py-[4px] text-[12px] font-extrabold text-black"
            >
              #{k}
            </span>
          ))}
        </div>

        <p className="mt-3 w-full rounded-[16px] border border-black bg-[#F7F7F7] px-4 py-3 text-[13px] font-semibold text-black">
          {me.intro}
        </p>
      </div>
    </section>
  );
}
