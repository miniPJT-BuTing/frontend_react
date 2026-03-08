'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import ButingLogoTitle from '@/assets/logos/buting-logo-title.png';
import { getMatchRequests, getReceivedTeamInvitations } from '@/features/team/api/team.api';

export default function MainHeader() {
  const router = useRouter();
  const { data: pendingMatchRequests = [] } = useQuery({
    queryKey: ['match-requests', 'notifications', 'received', 'pending'],
    queryFn: () => getMatchRequests({ type: 'received', status: 'PENDING' }),
    staleTime: 30_000,
  });
  const { data: receivedInvitations = [] } = useQuery({
    queryKey: ['teams', 'invitations', 'received'],
    queryFn: getReceivedTeamInvitations,
    staleTime: 30_000,
  });

  const hasNotification = useMemo(() => {
    if (pendingMatchRequests.length > 0) return true;
    return receivedInvitations.some((invitation) => invitation.status?.toUpperCase() === 'PENDING');
  }, [pendingMatchRequests, receivedInvitations]);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-14 max-w-[480px] items-center px-5 pt-3">
        <div className="flex items-center">
          <Image src={ButingLogoTitle} alt="부팅" priority className="h-10 w-auto" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/notifications')}
            aria-label="알림"
            className="relative flex h-8 w-8 items-center justify-center"
          >
            <Bell size={22} className="text-[#0F172A]" />
            {hasNotification && (
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FF6FAE]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
