import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function SplashActions() {
  return (
    <footer className="pb-10">
      <div className="flex flex-col gap-3">
        <Link
          href="/auth/signup"
          className="group inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-primary text-sm font-semibold text-white shadow-sm transition hover:bg-primaryHover active:bg-primaryActive"
        >
          시작하기
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>

        <Link
          href="/auth/login"
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-border bg-surface/80 text-sm font-semibold text-foreground shadow-sm backdrop-blur transition hover:bg-surfaceSoft"
        >
          로그인
        </Link>

        <p className="mt-2 text-center text-xs text-textMuted">
          계속하면 이용약관 및 개인정보처리방침에 동의하게 됩니다.
        </p>
      </div>
    </footer>
  );
}
