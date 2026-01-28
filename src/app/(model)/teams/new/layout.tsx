export default function FilterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center text-slate-900">
      <div
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-1/2
          bg-gradient-to-b
          from-[#FBCFE8]
          to-transparent
        "
      />

      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0
          h-1/4
          bg-gradient-to-t
          from-[#FBCFE8]
          to-transparent
        "
      />

      <div className="relative w-full max-w-[480px] flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
