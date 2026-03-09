'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, RotateCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { EditNickname } from '@/widgets/profile-edit/EditNickname';
import { EditMbti } from '@/widgets/profile-edit/EditMbti';
import { EditKeywords } from '@/widgets/profile-edit/EditKeywords';
import { EditBio } from '@/widgets/profile-edit/EditBio';
import { RetroButton } from '@/shared/ui/button/RetroButton';
import { getMyProfile } from '@/features/member/api/member.api';
import { PERSONALITY_KEYWORDS, type PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

export default function ProfileEditPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [mbti, setMbti] = useState('');
  const [keywords, setKeywords] = useState<PersonalityKeywordKey[]>([]);
  const [bio, setBio] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['member', 'me'],
    queryFn: getMyProfile,
  });

  useEffect(() => {
    if (!data || isHydrated) return;

    const validKeywordSet = new Set(PERSONALITY_KEYWORDS.map((keyword) => keyword.key));
    const profileKeywords = data.personalityTypes.filter(
      (keyword): keyword is PersonalityKeywordKey => validKeywordSet.has(keyword as PersonalityKeywordKey)
    );

    setNickname(data.nickname);
    setMbti(data.mbtiCode ?? '');
    setKeywords(profileKeywords);
    setBio(data.bio ?? '');
    setIsHydrated(true);
  }, [data, isHydrated]);

  const handleSave = () => {
    console.log('Saved:', { nickname, mbti, keywords, bio });
    alert('프로필이 수정되었습니다!');
    router.back();
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
          <div className="flex h-full min-h-0 items-center justify-center text-center text-sm text-slate-500">
            프로필 정보를 불러오는 중...
          </div>
        )}

        {isError && (
          <div className="flex h-full min-h-0 flex-col items-center justify-center gap-3 text-center">
            <p className="text-sm text-slate-500">프로필 정보를 불러오지 못했어요.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex items-center gap-2 rounded-full border border-black bg-white px-4 py-2 text-xs font-extrabold text-black active:translate-y-[1px]"
            >
              <RotateCw className="h-3.5 w-3.5" />
              다시 시도
            </button>
          </div>
        )}

        <div className={`flex flex-col gap-10 ${isLoading || isError ? 'hidden' : ''}`}>
          <section className="space-y-6">
            <EditNickname value={nickname} onChange={setNickname} />
            <EditMbti value={mbti} onChange={setMbti} />
          </section>
          <section className="space-y-6">
            <EditKeywords value={keywords} onChange={setKeywords} />
            <EditBio value={bio} onChange={setBio} />
          </section>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 mx-auto max-w-[480px] px-6 z-10 pb-[env(safe-area-inset-bottom)]">
        <RetroButton onClick={handleSave} className="w-full" variant="yellow" disabled={isLoading}>
          수정 완료
        </RetroButton>
      </div>
    </main>
  );
}
