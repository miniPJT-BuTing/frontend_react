'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { EditNickname } from '@/widgets/profile-edit/EditNickname';
import { EditMbti } from '@/widgets/profile-edit/EditMbti';
import { EditKeywords } from '@/widgets/profile-edit/EditKeywords';
import { EditBio } from '@/widgets/profile-edit/EditBio';
import { RetroButton } from '@/shared/ui/button/RetroButton';
import type { PersonalityKeywordKey } from '@/shared/lib/personalityKeyword';

const initialData: {
  nickname: string;
  mbti: string;
  keywords: PersonalityKeywordKey[];
  bio: string;
} = {
  nickname: '민희',
  mbti: 'ENFP',
  keywords: ['LIVELINESS', 'HONESTY', 'CONSIDERATION'],
  bio: '재밌게 이야기하고 편하게 진해져요 :)',
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState(initialData.nickname);
  const [mbti, setMbti] = useState(initialData.mbti);
  const [keywords, setKeywords] = useState<PersonalityKeywordKey[]>(initialData.keywords);
  const [bio, setBio] = useState(initialData.bio);

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
        <div className="flex flex-col gap-10">
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
        <RetroButton onClick={handleSave} className="w-full" variant="yellow">
          수정 완료
        </RetroButton>
      </div>
    </main>
  );
}
