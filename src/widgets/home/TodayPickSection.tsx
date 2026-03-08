'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import StarIcon from '@/assets/icons/star.png';
import TeamPickCard from '@/entities/team/ui/TeamPickCard';
import type { MatchingFilters } from '@/features/matching/lib/matchingFilters';
import { resolveTeamMoodKey } from '@/shared/lib/personalityKeyword';
import { getMatchingPosts, requestMatching, type MatchingPostItem } from '@/features/team/api/team.api';

const toTeamSizeLabel = (teamSize?: string, targetCount?: number) => {
  if (teamSize === 'TWO_ON_TWO') return '2:2';
  if (teamSize === 'THREE_ON_THREE') return '3:3';
  if (teamSize === 'FOUR_ON_FOUR') return '4:4';
  if (teamSize === 'FIVE_ON_FIVE') return '5:5';
  if (teamSize === 'SIX_ON_SIX') return '6:6';
  if (targetCount && targetCount > 0) return `${targetCount}:${targetCount}`;
  return '팀';
};

const getStatus = (post: MatchingPostItem, requestedTeamIds: Set<number>): 'idle' | 'waiting' => {
  if (requestedTeamIds.has(post.teamId)) return 'waiting';
  const status = post.status?.toUpperCase() ?? '';
  if (status.includes('WAIT') || status.includes('PENDING')) return 'waiting';
  return 'idle';
};

const isRangeIncluded = (
  targetMin: number | undefined,
  targetMax: number | undefined,
  filterRange: [number, number] | undefined
) => {
  if (!filterRange) return true;
  if (typeof targetMin !== 'number' || typeof targetMax !== 'number') return false;
  const normalizedTargetMin = Math.min(targetMin, targetMax);
  const normalizedTargetMax = Math.max(targetMin, targetMax);
  const normalizedFilterMin = Math.min(filterRange[0], filterRange[1]);
  const normalizedFilterMax = Math.max(filterRange[0], filterRange[1]);

  return normalizedTargetMin >= normalizedFilterMin && normalizedTargetMax <= normalizedFilterMax;
};

type Props = {
  filters?: MatchingFilters;
};

export default function TodayPickSection({ filters }: Props) {
  const [posts, setPosts] = useState<MatchingPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestingTeamId, setRequestingTeamId] = useState<number | null>(null);
  const [requestedTeamIds, setRequestedTeamIds] = useState<Set<number>>(new Set());

  const filteredPosts = useMemo(() => {
    if (!filters) return posts;

    return posts.filter((post) => {
      const postMoodKey = resolveTeamMoodKey(post.preferredMood);
      const matchesMood =
        filters.moodKeys.length === 0 ? true : postMoodKey !== null && filters.moodKeys.includes(postMoodKey);

      if (!matchesMood) return false;

      const matchesEntryYear = isRangeIncluded(
        post.preferredEntryYearMin,
        post.preferredEntryYearMax,
        filters.entryYearRange
      );
      if (!matchesEntryYear) return false;

      return isRangeIncluded(post.preferredAgeMin, post.preferredAgeMax, filters.ageRange);
    });
  }, [filters, posts]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMatchingPosts();
        setPosts(result);
      } catch (e) {
        console.error('Failed to fetch matching posts:', e);
        setError('추천 팀 목록을 불러오지 못했어요.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const mappedCards = useMemo(
    () =>
      filteredPosts.map((post) => {
        const teamSizeLabel = toTeamSizeLabel(post.teamSize, post.targetMemberCount);
        const university = post.universityName ?? '학교 정보 없음';
        const studentIdLabel =
          typeof post.preferredEntryYearMin === 'number' && typeof post.preferredEntryYearMax === 'number'
            ? `${post.preferredEntryYearMin}~${post.preferredEntryYearMax}학번`
            : '학번 조건 없음';
        const ageLabel =
          typeof post.preferredAgeMin === 'number' && typeof post.preferredAgeMax === 'number'
            ? `${post.preferredAgeMin}~${post.preferredAgeMax}세`
            : '나이 조건 없음';

        return {
          id: post.teamId,
          title: post.title,
          meta: [teamSizeLabel, university, studentIdLabel, ageLabel],
          members: post.targetMemberCount || post.currentMemberCount || 0,
          status: getStatus(post, requestedTeamIds),
        };
      }),
    [filteredPosts, requestedTeamIds]
  );

  const handleRequest = async (teamId: number) => {
    try {
      setRequestingTeamId(teamId);
      const response = await requestMatching(teamId);
      if (response.isSuccess) {
        setRequestedTeamIds((prev) => new Set([...prev, teamId]));
      }
      alert(response.message || (response.isSuccess ? '매칭 요청을 보냈습니다.' : '요청이 처리되지 않았습니다.'));
    } catch (e) {
      console.error('Failed to request matching:', e);
      alert('매칭 요청에 실패했습니다.');
    } finally {
      setRequestingTeamId(null);
    }
  };

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

      {loading && (
        <div className="rounded-xl border border-black bg-white p-4 text-center text-sm text-slate-500">
          추천 팀 목록을 불러오는 중...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-black bg-white p-4 text-center text-sm text-red-500">
          {error}
        </div>
      )}

      {!loading && !error && mappedCards.length === 0 && (
        <div className="rounded-xl border border-black bg-white p-4 text-center text-sm text-slate-500">
          현재 조회 가능한 매칭 팀이 없습니다.
        </div>
      )}

      {!loading && !error && mappedCards.length > 0 && (
        <div className="space-y-4">
          {mappedCards.map((card) => (
            <TeamPickCard
              key={card.id}
              title={card.title}
              meta={card.meta}
              members={card.members}
              status={card.status}
              profileLink={`/teams/${card.id}`}
              onClickRequest={() => {
                if (requestingTeamId === card.id) return;
                handleRequest(card.id);
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
