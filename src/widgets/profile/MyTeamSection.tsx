'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyTeamsApi, type MyTeamSummaryItem } from '@/features/team/api/team.api';
import { resolveTeamMoodKey, TEAM_MOOD_KEY_TO_LABEL } from '@/shared/lib/personalityKeyword';
import SectionTitle from './ui/SectionTitle';
import TeamCard from './ui/TeamCard';
import EmptyCard from './ui/EmptyCard';

const toTeamSizeLabel = (teamSize?: string, targetMemberCount?: number) => {
  if (teamSize === 'TWO_ON_TWO') return '2:2';
  if (teamSize === 'THREE_ON_THREE') return '3:3';
  if (teamSize === 'FOUR_ON_FOUR') return '4:4';
  if (teamSize === 'FIVE_ON_FIVE') return '5:5';
  if (teamSize === 'SIX_ON_SIX') return '6:6';
  if (typeof targetMemberCount === 'number' && targetMemberCount > 0) {
    return `${targetMemberCount}:${targetMemberCount}`;
  }
  return '팀';
};

const toMoodLabel = (mood: string | undefined) => {
  const moodKey = resolveTeamMoodKey(mood);
  if (moodKey) return TEAM_MOOD_KEY_TO_LABEL[moodKey];
  return mood;
};

const toEntryYearLabel = (min?: number, max?: number) => {
  if (typeof min !== 'number' || typeof max !== 'number') return undefined;
  return `${min}~${max}학번`;
};

const toTimestamp = (value: string | undefined) => {
  if (!value) return 0;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toRoleRank = (role: string | undefined) => (role?.toUpperCase() === 'LEADER' ? 0 : 1);

const sortMyTeams = (teams: MyTeamSummaryItem[]) =>
  [...teams].sort((a, b) => {
    const roleDiff = toRoleRank(a.role) - toRoleRank(b.role);
    if (roleDiff !== 0) return roleDiff;
    return toTimestamp(b.createdAt) - toTimestamp(a.createdAt);
  });

export default function MyTeamSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['teams', 'me'],
    queryFn: getMyTeamsApi,
  });

  const teams = useMemo(() => sortMyTeams(data ?? []), [data]);

  return (
    <section>
      <SectionTitle title="MY TEAM" />

      {isLoading && (
        <div className="rounded-[22px] border border-black bg-white p-4 text-center text-sm text-slate-500">
          내 팀 정보를 불러오는 중...
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-[22px] border border-black bg-white p-4 text-center text-sm text-red-500">
          내 팀 정보를 불러오지 못했어요.
        </div>
      )}

      {!isLoading && !isError && teams.length === 0 && (
        <EmptyCard
          title="아직 팀이 없어요"
          desc="미팅 팀을 만들고 상대를 찾아볼까요?"
          actionLabel="팀 만들러 가기"
          href="/teams/new"
        />
      )}

      {!isLoading && !isError && teams.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {teams.map((team) => {
            const teamRoleLabel = team.role?.toUpperCase() === 'LEADER' ? '팀장' : '팀원';
            const meta = [
              teamRoleLabel,
              toTeamSizeLabel(team.teamSize, team.targetMemberCount),
              toMoodLabel(team.preferredMood),
              toEntryYearLabel(team.preferredEntryYearMin, team.preferredEntryYearMax),
            ].filter((value): value is string => Boolean(value));

            return (
              <div key={team.teamId} className="w-[320px] shrink-0">
                <TeamCard
                  title={team.title}
                  meta={meta}
                  members={team.targetMemberCount || team.currentMemberCount || 0}
                  primaryAction={{ label: '팀 상세 보기', href: `/teams/${team.teamId}` }}
                  secondaryAction={{ label: '채팅하러 가기', href: '/chats' }}
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
