import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import { useSignupStore } from '@/features/signup/model';
import { getCollegesApi, type CollegeItem } from '@/features/signup/api/signup.api';

export function CollegeSelect() {
  const { collegeId, setProfile } = useSignupStore();
  const [colleges, setColleges] = useState<CollegeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;

    const fetchColleges = async () => {
      setLoading(true);
      setErrorMessage('');
      try {
        const result = await getCollegesApi();
        if (!mounted) return;
        setColleges(result);
      } catch (error) {
        if (!mounted) return;
        if (error instanceof AxiosError) {
          const message = (error.response?.data as { message?: string } | undefined)?.message;
          setErrorMessage(message || '단과대 목록을 불러오지 못했습니다.');
        } else {
          setErrorMessage('단과대 목록을 불러오지 못했습니다.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchColleges();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-base font-bold">소속 단과대</label>
      <select
        value={collegeId ? String(collegeId) : ''}
        onChange={(e) => {
          const selectedId = Number(e.target.value);
          const selectedCollege = colleges.find((college) => college.id === selectedId);
          setProfile({
            college: selectedCollege?.name ?? '',
            collegeId: Number.isFinite(selectedId) && selectedId > 0 ? selectedId : null,
          });
        }}
        disabled={loading || colleges.length === 0}
        className="h-14 w-full rounded-full border border-black px-4 text-base outline-none focus:bg-gray-50"
      >
        <option value="">{loading ? '단과대 목록 로딩중...' : '단과대를 선택해주세요'}</option>
        {colleges.map((college) => (
          <option key={college.id} value={college.id}>
            {college.name}
          </option>
        ))}
      </select>
      {errorMessage ? <p className="text-xs text-red-500">{errorMessage}</p> : null}
    </div>
  );
}
