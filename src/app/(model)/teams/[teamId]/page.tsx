'use client';

import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';

import { TeamDetailHeader } from '@/widgets/team-detail/TeamDetailHeader';
import { TeamTitleSection } from '@/widgets/team-detail/TeamTitleSection';
import { TeamMembersRow } from '@/widgets/team-detail/TeamMembersRow';
import { TeamSpecs } from '@/widgets/team-detail/TeamSpecs';
import { TeamIntroduction } from '@/widgets/team-detail/TeamIntroduction';
import { TeamActionFooter } from '@/widgets/team-detail/TeamActionFooter';

import { getTeamDetail, deleteTeam, requestMatching } from '@/features/team/api/team.api';
import { getMyProfile } from '@/features/member/api/member.api';
import { formatDateToMonthDay } from '@/shared/lib/date';
import { useCurrentUserStore } from '@/shared/auth/currentUser.store';
import { useShare } from '@/shared/hooks/useShare';

// UI용 데이터 타입 정의
interface TeamData {
  id: number;
  leaderId: number;
  title: string;
  createdAt: string;
  specs: {
    memberCount: number;
    university: string;
    avgStudentId: number;
    avgAge: number;
    prefMood: string;
    prefStudentId: string;
    prefAge: string;
  };
  introduction: string;
  members: Array<{
    id: number;
    nickname: string;
    isLeader: boolean;
    schoolName: string;
    major: string;
    avatarColor: string;
  }>;
}

// Mock Data (Fallback)
const FALLBACK_TEAM_DATA: TeamData = {
  id: 1,
  leaderId: 1,
  title: '동아대 디자인과랑 4:4 미팅해요! 🎨 (Mock)',
  createdAt: '01.29',
  specs: {
    memberCount: 4,
    university: '동아대 등',
    avgStudentId: 23,
    avgAge: 22.5,
    prefMood: '활발한, 술게임, 맛집탐방',
    prefStudentId: '20~24학번',
    prefAge: '20~25세',
  },
  introduction:
    'API 호출 실패로 인한 Mock 데이터입니다.\n안녕하세요! 저희는 동아대학교 산업디자인과 재학 중인 4명입니다.',
  members: [
    {
      id: 1,
      nickname: '디자인요정',
      isLeader: true,
      schoolName: '동아대',
      major: '산업디자인',
      avatarColor: '#FFE1EE',
    },
    {
      id: 2,
      nickname: '과제지옥',
      isLeader: false,
      schoolName: '동아대',
      major: '시각디자인',
      avatarColor: '#E1F5FF',
    },
  ],
};

export default function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  const router = useRouter();
  const { teamId } = use(params);
  const myMemberId = useCurrentUserStore((state) => state.memberId);
  const setMyMemberId = useCurrentUserStore((state) => state.setMemberId);

  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const { isSharing, share } = useShare();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [teamResult, profileResult] = await Promise.allSettled([
          getTeamDetail(teamId),
          getMyProfile(),
        ]);

        if (profileResult.status === 'fulfilled') {
          setMyMemberId(profileResult.value.memberId);
        }

        if (teamResult.status !== 'fulfilled') {
          throw teamResult.reason;
        }

        const data = teamResult.value;

        // API Response -> UI Data 변환
        const formattedData: TeamData = {
          id: data.teamId,
          leaderId: data.leaderInfo.memberId,
          title: data.title,
          createdAt: formatDateToMonthDay(data.createdAt) ?? '날짜미상',
          specs: {
            memberCount: data.currentMemberCount,
            university: data.leaderInfo.universityName,
            avgStudentId: 23, // TODO: Calculate from members
            avgAge: 22, // TODO: Calculate from members
            prefMood: data.preferredMood,
            prefStudentId: `${data.preferredEntryYearMin}~${data.preferredEntryYearMax}학번`,
            prefAge: `${data.preferredAgeMin}~${data.preferredAgeMax}세`,
          },
          introduction: data.description,
          members:
            (data.members || []).length > 0
              ? data.members!.map((m) => ({
                  id: m.id,
                  nickname: m.nickname,
                  isLeader: m.role === 'LEADER',
                  schoolName: m.university,
                  major: m.department,
                  avatarColor: '#FFE1EE',
                }))
              : [
                  // 멤버 데이터가 없을 경우 리더 정보라도 표시 (Fallback)
                  {
                    id: data.leaderInfo.memberId,
                    nickname: data.leaderInfo.nickname,
                    isLeader: true,
                    schoolName: data.leaderInfo.universityName,
                    major: data.leaderInfo.collegeName,
                    avatarColor: '#FFE1EE',
                  },
                ],
        };

        setTeamData(formattedData);
      } catch (error) {
        console.error('Failed to fetch team detail:', error);
        setTeamData(FALLBACK_TEAM_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [setMyMemberId, teamId]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF9BC2] border-t-transparent" />
      </div>
    );
  }

  if (!teamData) return null;

  const isMyTeam = myMemberId !== null && teamData.leaderId === myMemberId;

  const handleRequest = async () => {
    try {
      if (requesting) return;
      setRequesting(true);
      const targetTeamId = Number(teamId) || teamData.id;
      if (!targetTeamId) {
        alert('유효하지 않은 팀 ID입니다.');
        return;
      }
      const response = await requestMatching(targetTeamId);
      alert(
        response.message ||
          (response.isSuccess ? '매칭 요청을 보냈습니다.' : '요청이 처리되지 않았습니다.')
      );
    } catch (error) {
      console.error('Failed to request matching:', error);
      alert('매칭 요청에 실패했습니다.');
    } finally {
      setRequesting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/teams/${teamId}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('정말 팀을 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')) return;

    try {
      await deleteTeam(teamId);
      alert('팀이 삭제되었습니다.');
      router.replace('/home'); // 홈으로 이동
    } catch (error) {
      console.error('Failed to delete team:', error);
      const message = error instanceof Error ? error.message : '팀 삭제에 실패했습니다.';
      alert(message);
    }
  };

  const handleShare = async () => {
    if (!teamData) return;

    const shareUrl = window.location.href;
    const shareTitle = `${teamData.title} | 부팅`;

    const result = await share({
      url: shareUrl,
      title: shareTitle,
      text: '부팅 팀 프로필을 확인해보세요.',
    });

    if (result === 'copied') {
      alert('팀 링크가 복사되었습니다.');
      return;
    }

    if (result === 'error') {
      alert('공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <main className="flex min-h-full flex-col">
      <TeamDetailHeader />

      <div className="flex-1 pb-4">
        <TeamTitleSection
          title={teamData.title}
          createdAt={teamData.createdAt}
          onShare={handleShare}
          shareDisabled={isSharing}
        />
        <TeamMembersRow members={teamData.members} />
        <div className="h-px w-full bg-gray-100 my-2" /> {/* Divider */}
        <TeamSpecs data={teamData.specs} />
        <TeamIntroduction content={teamData.introduction} />
      </div>

      <TeamActionFooter
        onRequest={handleRequest}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isOwnTeam={isMyTeam}
      />
    </main>
  );
}
