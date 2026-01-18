'use client';

import TeamPickCard from './ui/TeamPickCard';

const picks = [
  {
    id: 't1',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: false,
    status: 'idle' as const,
  },
  {
    id: 't2',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    bookmarked: true,
    status: 'waiting' as const,
  },
];

export default function TodayPickSection() {
  return (
    <section>
      <h2 className="mb-3 text-center text-[18px] font-extrabold tracking-tight text-[#4B57C2]">
        ⭐ TODAY PICK ⭐
      </h2>

      <div className="space-y-4">
        {picks.map((p) => (
          <TeamPickCard
            key={p.id}
            title={p.title}
            meta={p.meta}
            members={p.members}
            bookmarked={p.bookmarked}
            status={p.status}
            onClickProfile={() => console.log('팀 프로필 보기', p.id)}
            onClickRequest={() => console.log('매칭 요청', p.id)}
          />
        ))}
      </div>
    </section>
  );
}
