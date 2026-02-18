'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { useCreateTeamStore } from '../../model/createTeam.store';
import { searchFriendsForTeamInvite, type TeamFriendSearchItem } from '@/features/team/api/team.api';

import { Plus, X } from 'lucide-react';
import profileIcon from '@/assets/icons/profile-nav.png';
import starIcon from '@/assets/icons/star.png';

export default function Step3Members() {
  const { memberCount, invitedMembers, setMembers } = useCreateTeamStore();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TeamFriendSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const maxInvites = useMemo(() => Math.max(0, memberCount - 1), [memberCount]); // 본인 제외
  const canInviteMore = invitedMembers.length < maxInvites;

  useEffect(() => {
    const keyword = query.trim();

    if (keyword.length < 2) {
      setResults([]);
      setSearchError(null);
      return;
    }

    const timer = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError(null);
        const searched = await searchFriendsForTeamInvite(keyword);
        setResults(searched);
      } catch (error) {
        console.error('Failed to search friends:', error);
        setSearchError('친구 검색에 실패했어요. 잠시 후 다시 시도해주세요.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  const normalizedResults = useMemo(
    () =>
      (Array.isArray(results) ? results : []).filter(
        (friend) => !invitedMembers.some((invited) => invited.memberId === friend.memberId)
      ),
    [results, invitedMembers]
  );

  const canAdd = canInviteMore && normalizedResults.length > 0;

  const handleMemberCountChange = (count: number) => {
    // 인원 수 줄이면 초대 인원도 잘라내기(UX)
    if (invitedMembers.length > count - 1) {
      setMembers({ memberCount: count, invitedMembers: invitedMembers.slice(0, count - 1) });
      return;
    }
    setMembers({ memberCount: count });
  };

  const handleAdd = (friend: TeamFriendSearchItem) => {
    if (invitedMembers.some((member) => member.memberId === friend.memberId)) return;
    if (!canInviteMore) return;

    setMembers({
      invitedMembers: [...invitedMembers, { memberId: friend.memberId, nickname: friend.nickname }],
    });
    setQuery('');
    setResults([]);
  };

  const handleRemove = (memberId: number) => {
    setMembers({ invitedMembers: invitedMembers.filter((m) => m.memberId !== memberId) });
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={profileIcon} alt="profile" width={34} height={34} />
          <label className="text-base font-bold">인원 수</label>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[2, 3, 4, 5, 6].map((count) => {
            const active = memberCount === count;

            return (
              <button
                key={count}
                type="button"
                onClick={() => handleMemberCountChange(count)}
                className={[
                  'h-12 rounded-full border border-black',
                  'inline-flex items-center justify-center',
                  'text-sm font-extrabold leading-none',
                  'transition-transform transition-colors',
                  'active:translate-y-[1px]',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60',
                  active
                    ? 'bg-[#FEFED0] shadow-[0_2px_0_0_rgba(0,0,0,1)]'
                    : 'bg-white hover:bg-slate-50',
                ].join(' ')}
              >
                {count}:{count}
              </button>
            );
          })}
        </div>

        <p className="text-xs text-right text-slate-500">
          최대 <span className="text-black font-bold">{maxInvites}</span>명까지 초대할 수 있어요.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <Image src={starIcon} alt="star" width={34} height={34} />
          <label className="text-base font-bold">팀원 초대</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canAdd) {
                handleAdd(normalizedResults[0]);
              }
            }}
            placeholder="친구 닉네임 검색"
            className={[
              'h-12 flex-1 rounded-full border border-black bg-white px-4',
              'text-sm font-bold outline-none',
              'placeholder:text-sm placeholder:text-slate-400',
              'focus:bg-gray-50',
            ].join(' ')}
          />

          <button
            type="button"
            onClick={() => {
              if (canAdd) {
                handleAdd(normalizedResults[0]);
              }
            }}
            disabled={!canAdd}
            className={[
              'h-12 w-12 rounded-full border border-black',
              'inline-flex items-center justify-center',
              'transition-transform transition-colors',
              'active:translate-y-[1px]',
              canAdd
                ? 'bg-[#FEFED0] text-black shadow-[0_2px_0_0_rgba(0,0,0,1)]'
                : 'bg-white text-slate-300',
            ].join(' ')}
            aria-label="팀원 추가"
          >
            <Plus size={22} />
          </button>
        </div>

        {(query.trim().length >= 2 || isSearching || searchError) && (
          <div className="rounded-xl border border-black bg-white p-3">
            {isSearching && <p className="text-xs text-slate-500">친구를 검색하고 있어요...</p>}

            {!isSearching && searchError && <p className="text-xs text-red-500">{searchError}</p>}

            {!isSearching && !searchError && normalizedResults.length === 0 && (
              <p className="text-xs text-slate-500">검색 결과가 없거나 이미 초대된 친구예요.</p>
            )}

            {!isSearching && !searchError && normalizedResults.length > 0 && (
              <div className="flex flex-col gap-2">
                {normalizedResults.slice(0, 6).map((friend) => (
                  <button
                    key={friend.memberId}
                    type="button"
                    onClick={() => handleAdd(friend)}
                    className="flex items-center justify-between rounded-lg border border-black/15 bg-slate-50 px-3 py-2 text-left hover:bg-slate-100"
                  >
                    <span className="text-sm font-bold text-black">{friend.nickname}</span>
                    <span className="text-xs text-slate-500">ID {friend.memberId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border border-black bg-white p-4 shadow-[0_3px_0_0_rgba(0,0,0,1)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-extrabold text-black">초대 목록</span>
            <span className="rounded-full border border-black bg-[#FEFED0] px-3 py-1 text-xs font-extrabold text-black">
              {invitedMembers.length} / {maxInvites}
            </span>
          </div>

          {invitedMembers.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-400">아직 초대된 팀원이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {invitedMembers.map((member) => (
                <div
                  key={member.memberId}
                  className="flex items-center justify-between rounded-[14px] border border-black/10 bg-slate-50 px-4 py-3"
                >
                  <span className="text-sm font-extrabold text-black">{member.nickname}</span>

                  <button
                    type="button"
                    onClick={() => handleRemove(member.memberId)}
                    className={[
                      'inline-flex h-8 w-8 items-center justify-center rounded-full',
                      'border border-black/15 bg-white text-slate-500',
                      'active:translate-y-[1px]',
                      'hover:bg-slate-50',
                    ].join(' ')}
                    aria-label={`${member.nickname} 삭제`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {invitedMembers.length >= maxInvites && (
            <p className="mt-3 text-xs text-right text-slate-400">
              선택한 인원 수 기준으로 더 이상 초대할 수 없어요.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
