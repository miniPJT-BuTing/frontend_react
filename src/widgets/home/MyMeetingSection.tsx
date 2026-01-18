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
      <h2 className="mb-3 text-center text-[18px] font-extrabold tracking-tight text-[#4B57C2]">
        ♡ MY MEETING ♡
      </h2>

      <MeetingCard
        status={mock.status}
        title={mock.title}
        meta={mock.meta}
        members={mock.members}
        primaryAction={{ label: '채팅하러 가기', href: '/chats' }}
        ribbon={{ side: 'right', color: 'pink' }}
      />
    </section>
  );
}
