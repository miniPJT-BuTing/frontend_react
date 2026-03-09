'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AxiosError } from 'axios';
import SectionTitle from './ui/SectionTitle';
import MenuCard from './ui/MenuCard';
import MenuItem from './ui/MenuItem';
import Divider from './ui/Divider';
import { logoutApi } from '@/features/auth/api/auth.api';
import { deleteMyAccountApi } from '@/features/member/api/member.api';
import { useCurrentUserStore } from '@/shared/auth/currentUser.store';
import { tokenStore } from '@/shared/auth/tokenStore';

export default function ProfileMenuSection() {
  const router = useRouter();
  const clearCurrentUser = useCurrentUserStore((state) => state.clear);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      await logoutApi();
      alert('로그아웃 되었습니다.');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        alert(message || '로그아웃 처리 중 오류가 발생했습니다.');
      } else {
        alert('로그아웃 처리 중 오류가 발생했습니다.');
      }
    } finally {
      clearCurrentUser();
      tokenStore.clear();
      router.replace('/splash');
      setIsLoggingOut(false);
    }
  };

  const handleWithdraw = async () => {
    if (isDeleting) return;
    if (!confirm('정말 탈퇴하시겠어요? 탈퇴 후에는 복구할 수 없습니다.')) return;

    try {
      setIsDeleting(true);
      await deleteMyAccountApi();
      alert('회원 탈퇴가 완료되었습니다.');
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        alert(message || '탈퇴 처리 중 오류가 발생했습니다.');
        return;
      }
      alert('탈퇴 처리 중 오류가 발생했습니다.');
      return;
    } finally {
      setIsDeleting(false);
    }

    clearCurrentUser();
    tokenStore.clear();
    router.replace('/splash');
  };

  return (
    <section>
      <SectionTitle title="MY MENU" />

      <div className="space-y-3">
        <MenuCard>
          <MenuItem
            title="AI 얼굴 분석"
            desc="얼굴 분석으로 동물상 결과를 업데이트해요"
            href="/profile/ai"
          />
          <Divider />
          <MenuItem
            title="내 프로필 수정하기"
            desc="닉네임/키워드/자기소개 등을 수정해요"
            href="/profile/edit"
          />
        </MenuCard>

        <MenuCard>
          <MenuItem
            title={isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            desc="현재 계정에서 로그아웃해요"
            onClick={handleLogout}
            tone="warn"
          />
          <Divider />
          <MenuItem
            title={isDeleting ? '탈퇴 처리 중...' : '탈퇴'}
            desc="계정을 영구 삭제해요 (복구 불가)"
            onClick={handleWithdraw}
            tone="danger"
          />
        </MenuCard>
      </div>
    </section>
  );
}
