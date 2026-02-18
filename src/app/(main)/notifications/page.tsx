'use client';

import { useState } from 'react';
import { respondMatchRequest, respondTeamInvitation } from '@/features/team/api/team.api';

export default function NotificationsPage() {
  const [matchRequestId, setMatchRequestId] = useState('');
  const [invitationId, setInvitationId] = useState('');
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const handleMatchRespond = async (accept: boolean) => {
    const id = Number(matchRequestId);
    if (!Number.isFinite(id) || id <= 0) {
      alert('유효한 매칭 요청 ID를 입력해주세요.');
      return;
    }

    try {
      setLoadingKey('match');
      const response = await respondMatchRequest(id, accept);
      alert(
        response.message ||
          (response.isSuccess
            ? accept
              ? '매칭 요청을 수락했습니다.'
              : '매칭 요청을 거절했습니다.'
            : '요청이 처리되지 않았습니다.')
      );
    } catch (e) {
      console.error('Failed to respond match request:', e);
      alert('매칭 요청 응답에 실패했습니다.');
    } finally {
      setLoadingKey(null);
    }
  };

  const handleInvitationRespond = async (accept: boolean) => {
    const id = Number(invitationId);
    if (!Number.isFinite(id) || id <= 0) {
      alert('유효한 팀 초대 ID를 입력해주세요.');
      return;
    }

    try {
      setLoadingKey('invite');
      const response = await respondTeamInvitation(id, accept);
      alert(
        response.message ||
          (response.isSuccess
            ? accept
              ? '팀 초대를 수락했습니다.'
              : '팀 초대를 거절했습니다.'
            : '요청이 처리되지 않았습니다.')
      );
    } catch (e) {
      console.error('Failed to respond invitation:', e);
      alert('팀 초대 응답에 실패했습니다.');
    } finally {
      setLoadingKey(null);
    }
  };

  return (
    <div className="space-y-5 py-4">
      <section className="rounded-[18px] border border-black bg-white p-4">
        <h2 className="text-sm font-extrabold text-black">매칭 요청 응답</h2>
        <p className="mt-1 text-xs text-slate-500">`PATCH /v1/match-requests/{'{id}'}/respond`</p>

        <input
          value={matchRequestId}
          onChange={(e) => setMatchRequestId(e.target.value)}
          placeholder="matchRequestId 입력"
          className="mt-3 h-11 w-full rounded-full border border-black px-4 text-sm outline-none"
        />

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleMatchRespond(true)}
            disabled={loadingKey === 'match'}
            className="rounded-full border border-black bg-[#BDE0FE] py-2 text-sm font-bold text-black disabled:opacity-60"
          >
            수락
          </button>
          <button
            type="button"
            onClick={() => handleMatchRespond(false)}
            disabled={loadingKey === 'match'}
            className="rounded-full border border-black bg-[#FFE1EE] py-2 text-sm font-bold text-black disabled:opacity-60"
          >
            거절
          </button>
        </div>
      </section>

      <section className="rounded-[18px] border border-black bg-white p-4">
        <h2 className="text-sm font-extrabold text-black">팀 초대 응답</h2>
        <p className="mt-1 text-xs text-slate-500">`PATCH /v1/teams/invitations/{'{id}'}/respond`</p>

        <input
          value={invitationId}
          onChange={(e) => setInvitationId(e.target.value)}
          placeholder="invitationId 입력"
          className="mt-3 h-11 w-full rounded-full border border-black px-4 text-sm outline-none"
        />

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleInvitationRespond(true)}
            disabled={loadingKey === 'invite'}
            className="rounded-full border border-black bg-[#BDE0FE] py-2 text-sm font-bold text-black disabled:opacity-60"
          >
            수락
          </button>
          <button
            type="button"
            onClick={() => handleInvitationRespond(false)}
            disabled={loadingKey === 'invite'}
            className="rounded-full border border-black bg-[#FFE1EE] py-2 text-sm font-bold text-black disabled:opacity-60"
          >
            거절
          </button>
        </div>
      </section>
    </div>
  );
}
