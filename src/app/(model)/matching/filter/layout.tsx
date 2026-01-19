export default function FilterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        flex min-h-screen flex-col items-center
        text-slate-900
bg-gradient-to-b
from-[#FEFED0]
to-[#FBCFE8]
      "
    >
      <div className="w-full max-w-[480px] flex-1">{children}</div>
    </div>
  );
}
