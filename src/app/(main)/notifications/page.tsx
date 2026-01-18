'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import NotificationList from '@/widgets/notification-list/NotificationList';

export default function NotificationsPage() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 flex h-[60px] items-center gap-2 border-b border-gray-100 bg-white px-4">
        <button onClick={() => router.back()} className="p-2">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">알림</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <NotificationList />
      </div>
    </div>
  );
}
