import SectionTitle from './ui/SectionTitle';
import TeamCard from './ui/TeamCard';
import EmptyCard from './ui/EmptyCard';

type Team = {
  id: string;
  title: string;
  meta: string[];
  members: number;
};

const mockTeam: Team | null = {
  id: 't1',
  title: '동아대 디자인과랑 4:4 미팅해요',
  meta: ['4:4', '동아대 등', '23학번', '22세'],
  members: 4,
};
// const mockTeam: Team | null = null;

export default function MyTeamSection() {
  const team = mockTeam;

  return (
    <section>
      <SectionTitle title="MY TEAM" />

      {team ? (
        <TeamCard
          title={team.title}
          meta={team.meta}
          members={team.members}
          primaryAction={{ label: '팀 상세 보기', href: '/team' }}
          secondaryAction={{ label: '채팅하러 가기', href: '/chats' }}
        />
      ) : (
        <EmptyCard
          title="아직 팀이 없어요"
          desc="미팅 팀을 만들고 상대를 찾아볼까요?"
          cta={{ label: '팀 만들러 가기', href: '/team/create' }}
        />
      )}
    </section>
  );
}
