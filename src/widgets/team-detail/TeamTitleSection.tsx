import { Share2 } from 'lucide-react';

type Props = {
  title: string;
  createdAt: string; // e.g., "01.29"
  onShare?: () => void;
  shareDisabled?: boolean;
};

export function TeamTitleSection({
  title,
  createdAt,
  onShare,
  shareDisabled = false,
}: Props) {
  return (
    <section className="px-5 pt-6 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col items-start gap-2">
          <span className="text-[13px] font-medium text-gray-400">{createdAt}</span>
          <h2 className="text-[24px] font-black leading-tight text-black break-keep">{title}</h2>
        </div>

        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={onShare}
            disabled={!onShare || shareDisabled}
            className="inline-flex items-center gap-1 rounded-full border border-black bg-white px-3 py-1 text-[12px] font-bold text-black disabled:opacity-50"
            aria-label="팀 공유"
          >
            <Share2 size={14} />
            공유
          </button>
        </div>
      </div>
    </section>
  );
}
