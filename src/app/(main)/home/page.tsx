import MyMeetingSection from '@/widgets/home/MyMeetingSection';
import TodayPickSection from '@/widgets/home/TodayPickSection';
import { SearchBar } from '@/shared/ui/SearchBar';

export default function HomePage() {
  return (
    <div className="space-y-8">
      <SearchBar placeholder="키워드로 미팅 상대 찾기" />
      <MyMeetingSection />
      <TodayPickSection />
    </div>
  );
}
