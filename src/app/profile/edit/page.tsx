'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { AxiosError } from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { EditNickname } from '@/widgets/profile-edit/EditNickname';
import { EditMbti } from '@/widgets/profile-edit/EditMbti';
import { EditKeywords } from '@/widgets/profile-edit/EditKeywords';
import { EditBio } from '@/widgets/profile-edit/EditBio';
import { RetroButton } from '@/shared/ui/button/RetroButton';
import {
  getMyProfile,
  getPersonalityKeywordsApi,
  updateMyProfile,
} from '@/features/member/api/member.api';
import { PERSONALITY_KEYWORDS, type PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

export default function ProfileEditPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState('');
  const [mbti, setMbti] = useState('');
  const [keywords, setKeywords] = useState<PersonalityKeywordKey[]>([]);
  const [bio, setBio] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['member', 'me'],
    queryFn: getMyProfile,
  });
  const { data: personalityKeywords } = useQuery({
    queryKey: ['member', 'personality-keywords'],
    queryFn: getPersonalityKeywordsApi,
  });

  const availableKeywordOptions =
    personalityKeywords && personalityKeywords.length > 0
      ? personalityKeywords
      : PERSONALITY_KEYWORDS.map((keyword) => ({ code: keyword.key, description: keyword.label }));

  useEffect(() => {
    if (!data || isHydrated) return;

    const validKeywordSet = new Set(availableKeywordOptions.map((keyword) => keyword.code));
    const profileKeywords = data.personalityTypes.filter(
      (keyword): keyword is PersonalityKeywordKey => validKeywordSet.has(keyword as PersonalityKeywordKey)
    );

    setNickname(data.nickname);
    setMbti(data.mbtiCode ?? '');
    setKeywords(profileKeywords);
    setBio(data.bio ?? '');
    setIsHydrated(true);
  }, [availableKeywordOptions, data, isHydrated]);

  const handleSave = async () => {
    if (isSaving || isLoading) return;

    const trimmedNickname = nickname.trim();
    const normalizedMbti = mbti.trim().toUpperCase();

    if (!trimmedNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (normalizedMbti.length !== 4) {
      alert('MBTI 4글자를 선택해주세요.');
      return;
    }

    if (keywords.length === 0) {
      alert('성격 키워드를 1개 이상 선택해주세요.');
      return;
    }

    try {
      setIsSaving(true);
      await updateMyProfile({
        nickname: trimmedNickname,
        mbti: normalizedMbti,
        personalityTypes: keywords,
        bio,
      });

      await queryClient.invalidateQueries({ queryKey: ['member', 'me'] });
      alert('프로필이 수정되었습니다!');
      router.back();
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = (error.response?.data as { message?: string } | undefined)?.message;
        alert(message || '프로필 수정에 실패했습니다.');
      } else {
        alert('프로필 수정에 실패했습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex min-h-full flex-col p-6 pb-[calc(96px+env(safe-area-inset-bottom))]">
      <header className="mb-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="h-10 w-10 rounded-full border border-black bg-white flex items-center justify-center"
        >
          <ChevronLeft className="h-6 w-6 stroke-[3] text-black" />
        </button>

        <div className="rounded-full border border-black bg-gradient-to-b from-white to-[var(--color-blueGreen)] px-4 py-2 text-sm font-bold uppercase">
          edit profile
        </div>
      </header>

      <div className="flex-1 animate-fade-in-up pb-6">
        {isLoading && (
          <div className="rounded-[16px] border border-black bg-white p-4 text-center text-sm text-gray-500">
            프로필 정보를 불러오는 중...
          </div>
        )}

        {isError && (
          <div className="rounded-[16px] border border-black bg-white p-4 text-center text-sm text-red-500">
            프로필 정보를 불러오지 못했어요.
          </div>
        )}

        <div className="flex flex-col gap-10">
          <section className="space-y-6">
            <EditNickname value={nickname} onChange={setNickname} />
            <EditMbti value={mbti} onChange={setMbti} />
          </section>
          <section className="space-y-6">
            <EditKeywords value={keywords} onChange={setKeywords} options={availableKeywordOptions} />
            <EditBio value={bio} onChange={setBio} />
          </section>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 mx-auto max-w-[480px] px-6 z-10 pb-[env(safe-area-inset-bottom)]">
        <RetroButton
          onClick={handleSave}
          className="w-full"
          variant="yellow"
          disabled={isLoading || isSaving}
        >
          {isSaving ? '수정 중...' : '수정 완료'}
        </RetroButton>
      </div>
    </main>
  );
}
