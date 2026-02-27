'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { X } from 'lucide-react';
import { deleteChatNotice, getChatNotice, upsertChatNotice } from '@/features/chat/api/chat.api';

const toDateTimeLocalWithSeconds = (value: string): string => {
  if (!value) return value;
  return value.length === 16 ? `${value}:00` : value;
};

const getDefaultMeetAt = () => {
  const nextHour = new Date(Date.now() + 60 * 60 * 1000);
  const year = nextHour.getFullYear();
  const month = String(nextHour.getMonth() + 1).padStart(2, '0');
  const day = String(nextHour.getDate()).padStart(2, '0');
  const hour = String(nextHour.getHours()).padStart(2, '0');
  const minute = String(nextHour.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const toDateTimeLocalInput = (isoString: string): string => {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString.slice(0, 16);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

export default function CreateNoticePage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;

  const [place, setPlace] = useState('');
  const [meetAt, setMeetAt] = useState(getDefaultMeetAt());
  const [description, setDescription] = useState('');
  const [loadingNotice, setLoadingNotice] = useState(true);
  const [hasExistingNotice, setHasExistingNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchExistingNotice = async () => {
      setLoadingNotice(true);
      try {
        const notice = await getChatNotice(roomId);
        if (!mounted) return;
        setPlace(notice.place);
        setMeetAt(toDateTimeLocalInput(notice.meetAt));
        setDescription(notice.description);
        setHasExistingNotice(true);
      } catch {
        if (!mounted) return;
        setHasExistingNotice(false);
      } finally {
        if (mounted) {
          setLoadingNotice(false);
        }
      }
    };

    fetchExistingNotice();
    return () => {
      mounted = false;
    };
  }, [roomId]);

  const handleSubmit = async () => {
    const trimmedPlace = place.trim();
    const trimmedDescription = description.trim();

    if (!trimmedPlace || !trimmedDescription || !meetAt) {
      setError('장소, 시간, 내용을 모두 입력해 주세요.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await upsertChatNotice(roomId, {
        place: trimmedPlace,
        meetAt: toDateTimeLocalWithSeconds(meetAt),
        description: trimmedDescription,
      });
      router.back();
    } catch {
      setError('공지 저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!hasExistingNotice) return;
    if (!window.confirm('현재 공지를 삭제하시겠어요?')) return;

    setDeleting(true);
    setError(null);
    try {
      await deleteChatNotice(roomId);
      router.back();
    } catch {
      setError('공지 삭제에 실패했습니다. 다시 시도해 주세요.');
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex h-14 w-full items-center justify-between border-b border-gray-100 px-4">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-black">
          <X size={26} />
        </button>

        <h1 className="text-lg font-bold text-black">공지사항 등록</h1>

        <div className="flex items-center gap-3">
          {hasExistingNotice && (
            <button
              onClick={handleDelete}
              disabled={submitting || deleting || loadingNotice}
              className={`text-[14px] font-bold ${deleting ? 'text-gray-300' : 'text-red-500'}`}
            >
              삭제
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={submitting || deleting || loadingNotice}
            className={`text-[15px] font-bold ${submitting ? 'text-gray-300' : 'text-[#FF9BC2]'}`}
          >
            완료
          </button>
        </div>
      </header>

      <div className="flex-1 p-5 space-y-4">
        {loadingNotice && <p className="text-sm text-gray-400">기존 공지를 확인하는 중...</p>}

        <input
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          placeholder="모임 장소를 입력해주세요"
          className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black transition-colors"
        />

        <input
          type="datetime-local"
          value={meetAt}
          onChange={(e) => setMeetAt(e.target.value)}
          className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-black transition-colors bg-gray-50"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="공지할 내용을 입력해주세요. (최대 300자)"
          maxLength={300}
          className="w-full h-64 resize-none text-[16px] leading-relaxed rounded-xl border border-gray-200 p-4 outline-none focus:border-black transition-colors placeholder:text-gray-400"
          autoFocus
        />

        <div className="flex items-center justify-between">
          <div className="text-xs text-red-500">{error}</div>
          <div className="text-right text-xs text-gray-400 font-medium">{description.length} / 300</div>
        </div>
      </div>
    </div>
  );
}
