export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        flex min-h-screen flex-col items-center
        text-slate-900
bg-gradient-to-b
from-[var(--color-yellow)]
to-[var(--color-primary)]
      "
    >
      <div className="w-full max-w-[480px] flex-1">{children}</div>
    </div>
  );
}
