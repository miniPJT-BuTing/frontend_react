import SearchBarLink from '@/shared/ui/SearchBar';
import TodayPickSection from '@/widgets/home/TodayPickSection';

export default function MatchingPage() {
  return (
    <div className="space-y-8">
      <SearchBarLink placeholder="키워드로 미팅 상대 찾기" />
      <TodayPickSection />
    </div>
  );
}
