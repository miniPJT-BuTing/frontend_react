'use client';

import Image from 'next/image';

import StarIcon from '@/assets/icons/star.png';

import TeamPickCard from '@/entities/team/ui/TeamPickCard';

const mock = [
  {
    id: 't1',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    status: 'idle' as const,
  },
  {
    id: 't2',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    status: 'waiting' as const,
  },
  {
    id: 't3',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    status: 'idle' as const,
  },
  {
    id: 't4',
    title: '동아대 디자인과랑 4:4 미팅해요',
    meta: ['4:4', '동아대 등', '23학번', '22세'],
    members: 4,
    status: 'waiting' as const,
  },
];

export default function TodayPickSection() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-center gap-3">
        <Image src={StarIcon} alt="star" width={28} height={28} priority />

        <h2
          className="
            font-['DNFBit']
            text-lg
            tracking-wide
            text-black
            drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]
          "
        >
          TODAY PICK
        </h2>

        <Image src={StarIcon} alt="star" width={28} height={28} priority />
      </div>

      <div className="space-y-4">
        {mock.map((p) => (
          <TeamPickCard
            key={p.id}
            title={p.title}
            meta={p.meta}
            members={p.members}
            status={p.status}
            profileLink={`/teams/${p.id}`}
            onClickRequest={() => console.log('매칭 요청', p.id)}
          />
        ))}
      </div>
    </section>
  );
}
