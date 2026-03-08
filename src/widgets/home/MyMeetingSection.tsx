'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';

import HeartIcon from '@/assets/icons/heart.png';
import MeetingCard from '@/entities/meeting/ui/MeetingCard';
import { getMatchRequests, type MatchRequestSummaryItem } from '@/features/team/api/team.api';
import {
  formatEntryYearRange,
  formatTeamMoodLabel,
  formatTeamSizeCount,
  formatTeamSizeLabel,
} from '@/shared/lib/teamFormat';

const toMeetingStatus = (status?: string): 'matched' | 'waiting' =>
  status?.toUpperCase() === 'ACCEPTED' ? 'matched' : 'waiting';

const toStatusRank = (status?: string): number => {
  const normalized = status?.toUpperCase() ?? '';
  if (normalized === 'ACCEPTED') return 0;
  if (normalized === 'PENDING') return 1;
  if (normalized === 'REJECTED') return 2;
  if (normalized === 'EXPIRED') return 3;
  return 4;
};

const getMeetingMeta = (request: MatchRequestSummaryItem): string[] => {
  const moodLabel = formatTeamMoodLabel(request.opponentPreferredMood);
  const entryYearLabel = formatEntryYearRange(
    request.opponentPreferredEntryYearMin,
    request.opponentPreferredEntryYearMax
  );

  return [formatTeamSizeLabel(request.opponentTeamSize, '팀'), moodLabel, entryYearLabel].filter(
    (value): value is string => Boolean(value)
  );
};

export default function MyMeetingSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['match-requests', 'my-meeting'],
    queryFn: async () => {
      const [sent, received] = await Promise.all([
        getMatchRequests({ type: 'sent' }),
        getMatchRequests({ type: 'received' }),
      ]);

      const merged = new Map<number, MatchRequestSummaryItem>();
      for (const item of [...sent, ...received]) {
        merged.set(item.matchRequestId, item);
      }

      return [...merged.values()].sort((a, b) => toStatusRank(a.status) - toStatusRank(b.status));
    },
  });

  const meeting = data?.[0];

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

      {isLoading && (
        <div className="rounded-[22px] border border-black bg-white p-4 text-center text-sm text-slate-500">
          내 미팅 정보를 불러오는 중...
        </div>
      )}

      {!isLoading && isError && (
        <div className="rounded-[22px] border border-black bg-white p-4 text-center text-sm text-red-500">
          내 미팅 정보를 불러오지 못했어요.
        </div>
      )}

      {!isLoading && !isError && !meeting && (
        <div className="rounded-[22px] border border-black bg-white p-4">
          <p className="text-[14px] font-extrabold text-black">아직 진행 중인 미팅이 없어요</p>
          <p className="mt-1 text-[12px] font-semibold text-gray-500">매칭에서 마음에 드는 팀을 찾아보세요.</p>
          <a
            href="/matching"
            className="mt-4 block w-full rounded-full border border-black bg-primary py-3 text-center text-[14px] font-extrabold text-black active:translate-y-[1px]"
          >
            미팅 상대 찾으러 가기
          </a>
        </div>
      )}

      {!isLoading && !isError && meeting && (
        <MeetingCard
          status={toMeetingStatus(meeting.status)}
          title={meeting.opponentTeamTitle ?? '미팅 팀'}
          meta={getMeetingMeta(meeting)}
          members={formatTeamSizeCount(meeting.opponentTeamSize)}
          primaryAction={{
            label: toMeetingStatus(meeting.status) === 'matched' ? '채팅하러 가기' : '매칭 요청 확인하기',
            href: toMeetingStatus(meeting.status) === 'matched' ? '/chats' : '/notifications',
          }}
        />
      )}
    </section>
  );
}
