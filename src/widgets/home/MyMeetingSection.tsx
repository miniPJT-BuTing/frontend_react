import Image from 'next/image';

import HeartIcon from '@/assets/icons/heart.png';

import MeetingCard from './ui/MeetingCard';

const mock = {
  status: 'matched' as const,
  title: '동아대 디자인과랑 4:4 미팅해요',
  meta: ['4:4', '동아대 등', '23학번', '22세'],
  members: 4,
};

export default function MyMeetingSection() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-center gap-3">
        <Image src={HeartIcon} alt="heart" width={28} height={28} priority />

        <h2
          className="
            font-['DNFBit']
            text-lg
            tracking-wide
            text-black
            drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]
          "
        >
          MY MEETING
        </h2>

        <Image src={HeartIcon} alt="heart" width={28} height={28} priority />
      </div>

      <MeetingCard
        status={mock.status}
        title={mock.title}
        meta={mock.meta}
        members={mock.members}
        primaryAction={{ label: '채팅하러 가기', href: '/chats' }}
      />
    </section>
  );
}
