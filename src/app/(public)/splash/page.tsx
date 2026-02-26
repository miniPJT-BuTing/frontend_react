import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Splash from '@/widgets/splash/Splash';

export default async function SplashPage() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get('accessToken')?.value ||
    cookieStore.get('token')?.value ||
    cookieStore.get('buting_token')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (accessToken || refreshToken) {
    redirect('/home');
  }

  return <Splash />;
}
