import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Main() {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get('accessToken')?.value ||
    cookieStore.get('token')?.value ||
    cookieStore.get('buting_token')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (accessToken || refreshToken) {
    redirect('/home');
  }

  redirect('/splash');
}
