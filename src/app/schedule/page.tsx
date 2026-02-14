import Nav from "@/components/Nav";
import Link from "next/link";

export default function SchedulePage() {
  return (
    <div className="flex min-h-screen flex-col px-[48px] py-[40px] sm:px-[64px] sm:py-[48px] md:px-[72px] md:py-[56px] lg:px-[96px] lg:py-[72px]">
      <Nav />
      <div className="flex flex-1 flex-col items-center justify-center">
        <h1 className="text-[13px] font-semibold uppercase tracking-[0.2em]">
          Coming Soon
        </h1>
        <p className="mt-3 text-[14px] font-light text-muted">
          Schedule details are on the way.
        </p>
        <Link
          href="/"
          className="mt-8 border border-border px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:border-foreground hover:text-foreground"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
