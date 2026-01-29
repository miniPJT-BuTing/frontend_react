type TeamSpecData = {
  memberCount: number; // 인원
  university: string; // 대학교 (대표)
  avgStudentId: number; // 평균학번
  avgAge: number; // 평균나이
  prefMood: string; // 선호분위기
  prefStudentId: string; // 선호학번 (e.g. 20~24학번)
  prefAge: string; // 선호나이대 (e.g. 20~25세)
};

type Props = {
  data: TeamSpecData;
};

export function TeamSpecs({ data }: Props) {
  const specs = [
    { label: '인원', value: `${data.memberCount}명` },
    { label: '대학교', value: data.university },
    { label: '평균학번', value: `${data.avgStudentId}학번` },
    { label: '평균나이', value: `${data.avgAge}세` },
    { label: '선호분위기', value: data.prefMood },
    { label: '선호 학번', value: data.prefStudentId },
    { label: '선호 나이대', value: data.prefAge },
  ];

  return (
    <section className="px-6 py-2">
      <div className="space-y-3">
        {specs.map((item) => (
          <div key={item.label} className="flex items-start justify-between text-[14px]">
            <span className="shrink-0 font-bold text-black">{item.label}</span>
            <span className="font-medium text-gray-500 text-right break-all max-w-[60%]">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
