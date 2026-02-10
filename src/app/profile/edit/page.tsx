'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditProfileHeader } from '@/widgets/profile-edit/EditProfileHeader';
import { EditNickname } from '@/widgets/profile-edit/EditNickname';
import { EditMbti } from '@/widgets/profile-edit/EditMbti';
import { EditKeywords } from '@/widgets/profile-edit/EditKeywords';
import { EditBio } from '@/widgets/profile-edit/EditBio';
import { RetroButton } from '@/shared/ui/button/RetroButton';

// Mock Initial Data
const initialData = {
  nickname: '민희',
  mbti: 'ENFP',
  keywords: ['활발', '솔직', '배려'],
  bio: '재밌게 이야기하고 평하게 진해져요 :)',
};

export default function ProfileEditPage() {
  const router = useRouter();

  // Local State Management
  const [nickname, setNickname] = useState(initialData.nickname);
  const [mbti, setMbti] = useState(initialData.mbti);
  const [keywords, setKeywords] = useState<string[]>(initialData.keywords);
  const [bio, setBio] = useState(initialData.bio);

  const handleSave = () => {
    // TODO: API Call (PUT /profile)
    console.log('Saved:', { nickname, mbti, keywords, bio });
    alert('프로필이 수정되었습니다!');
    router.back();
  };

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <EditProfileHeader />

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32">
        <div className="flex flex-col gap-10">
          {/* Basic Info Section */}
          <section className="space-y-6">
            <h2 className="text-lg font-black text-black">기본 정보</h2>
            <EditNickname value={nickname} onChange={setNickname} />
            <EditMbti value={mbti} onChange={setMbti} />
          </section>

          {/* Details Section */}
          <section className="space-y-6">
            <h2 className="text-lg font-black text-black">상세 정보</h2>
            <EditKeywords value={keywords} onChange={setKeywords} />
            <EditBio value={bio} onChange={setBio} />
          </section>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-100 bg-white px-6 pb-8 pt-4">
        <div className="mx-auto max-w-[480px]">
          <RetroButton onClick={handleSave} variant="primary" className="w-full">
            수정 완료
          </RetroButton>
        </div>
      </div>
    </main>
  );
}
