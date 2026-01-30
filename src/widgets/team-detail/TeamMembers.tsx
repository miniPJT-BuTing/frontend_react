type Member = {
  id: string;
  nickname: string;
  age: number;
  mbti: string;
  studentId: number; // e.g., 23
  department: string;
  avatarColor: string;
};

type Props = {
  members: Member[];
};

export function TeamMembers({ members }: Props) {
  return (
    <section>
      <h3 className="mb-3 ml-1 text-[18px] font-extrabold text-black">
        멤버 소개 <span className="text-[#FF6FAE]">{members.length}</span>
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 rounded-[20px] border border-black bg-white p-4 active:translate-y-[1px]"
          >
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-black text-2xl"
              style={{ backgroundColor: member.avatarColor }}
            >
              {/* Placeholder Avatar Emoji based on ID/Random for now */}
              🐣
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[16px] font-extrabold text-black">
                  {member.nickname}
                </span>
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[11px] font-bold text-gray-500">
                  {member.mbti}
                </span>
              </div>
              <span className="text-[13px] font-semibold text-gray-500">
                {member.department} · {member.studentId}학번 · {member.age}세
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
