import Link from 'next/link';
import SectionTitle from './ui/SectionTitle';
import CountBadge from './ui/CountBadge';
import EmptyInline from './ui/EmptyInline';

type Friend = {
  id: string;
  name: string;
  school?: string;
};

const mockFriends: Friend[] = [
  { id: 'f1', name: '지연', school: '부산대' },
  { id: 'f2', name: '수빈', school: '동아대' },
  { id: 'f3', name: '현우', school: '경성대' },
];

export default function FriendsSection() {
  const friends = mockFriends;

  return (
    <section>
      <SectionTitle title="FRIENDS" rightSlot={<CountBadge count={friends.length} />} />

      <div className="rounded-[22px] border border-black bg-white p-4">
        {friends.length > 0 ? (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[14px] font-extrabold text-black">내 친구</p>
                <p className="text-[12px] font-semibold text-gray-500">
                  친구 목록을 확인하고, 초대 링크로 친구를 추가할 수 있어요.
                </p>
              </div>

              <div className="shrink-0 flex gap-2">
                <Link
                  href="/friends"
                  className="rounded-full border border-black bg-[#D7F8FF] px-3 py-2 text-[12px] font-extrabold text-black active:translate-y-[1px]"
                >
                  목록 보기
                </Link>
                <Link
                  href="/friends/add"
                  className="rounded-full border border-black bg-primary px-3 py-2 text-[12px] font-extrabold text-black active:translate-y-[1px]"
                >
                  친구 추가
                </Link>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {friends.slice(0, 3).map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-2 rounded-full border border-black bg-[#FFE1EE] px-3 py-2"
                >
                  <div className="size-8 rounded-full border border-black bg-white flex items-center justify-center text-sm">
                    🙂
                  </div>
                  <div className="leading-tight">
                    <p className="text-[12px] font-extrabold text-black">{f.name}</p>
                    <p className="text-[10px] font-semibold text-gray-500">
                      {f.school ?? '학교 미입력'}
                    </p>
                  </div>
                </div>
              ))}

              {friends.length > 3 && (
                <div className="flex items-center rounded-full border border-black bg-white px-3 py-2 text-[12px] font-extrabold text-black">
                  +{friends.length - 3}
                </div>
              )}
            </div>
          </>
        ) : (
          <EmptyInline
            title="아직 친구가 없어요"
            desc="친구를 추가하면 팀 구성/미팅 진행이 더 편해져요!"
            cta={{ label: '친구 추가하기', href: '/friends/add' }}
          />
        )}
      </div>
    </section>
  );
}
