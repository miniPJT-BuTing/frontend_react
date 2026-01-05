import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Splash from './Splash';

export default async function SplashPage() {
  const cookieStore = await cookies();

  const accessToken =
    cookieStore.get('accessToken')?.value ||
    cookieStore.get('token')?.value ||
    cookieStore.get('buting_token')?.value;

  if (accessToken) {
    redirect('/');
  }

  return <Splash />;
}
