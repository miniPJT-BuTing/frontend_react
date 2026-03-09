import SearchBarLink from '@/shared/ui/SearchBar';
import TodayPickSection from '@/widgets/home/TodayPickSection';

export default function MatchingPage() {
  return (
    <div className="flex h-full min-h-full flex-col">
      <SearchBarLink placeholder="키워드로 미팅 상대 찾기" />

      <div className="flex min-h-0 flex-1">
        <TodayPickSection />
      </div>
    </div>
  );
}
