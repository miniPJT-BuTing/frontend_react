import ProfileHero from '@/widgets/profile/ProfileHero';
import MyTeamSection from '@/widgets/profile/MyTeamSection';
import FriendsSection from '@/widgets/profile/FriendsSection';
import ProfileMenuSection from '@/widgets/profile/ProfileMenuSection';

export default function ProfilePage() {
  return (
    <div className="space-y-8 py-4">
      <ProfileHero />
      <MyTeamSection />
      <FriendsSection />
      <ProfileMenuSection />
    </div>
  );
}
