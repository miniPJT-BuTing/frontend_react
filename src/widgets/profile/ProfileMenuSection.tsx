'use client';

import SectionTitle from './ui/SectionTitle';
import MenuCard from './ui/MenuCard';
import MenuItem from './ui/MenuItem';
import Divider from './ui/Divider';

export default function ProfileMenuSection() {
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
            title="로그아웃"
            desc="현재 계정에서 로그아웃해요"
            onClick={() => alert('로그아웃')}
            tone="warn"
          />
          <Divider />
          <MenuItem
            title="탈퇴"
            desc="계정을 영구 삭제해요 (복구 불가)"
            onClick={() => alert('탈퇴')}
            tone="danger"
          />
        </MenuCard>
      </div>
    </section>
  );
}
