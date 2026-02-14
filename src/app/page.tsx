import Link from "next/link";
import Nav from "@/components/Nav";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  const { home, instagram, instagramHandle, strava, location } = content;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="relative flex w-full flex-col justify-between p-6 sm:p-8 md:w-[42%] md:p-10 lg:p-12">
        <Nav />

        <nav className="mt-16 flex flex-col gap-3 md:mt-0">
          <Link
            href="/about"
            className="text-[13px] font-light tracking-[0.08em] text-foreground"
          >
            About
          </Link>
          <Link
            href="/schedule"
            className="text-[13px] font-light tracking-[0.08em] text-foreground"
          >
            Schedule
          </Link>
          <Link
            href="/shop"
            className="text-[13px] font-light tracking-[0.08em] text-foreground"
          >
            Collections
          </Link>
          <Link
            href="/connect"
            className="text-[13px] font-light tracking-[0.08em] text-foreground"
          >
            Connect
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 21c0 0-8-6-8-12C4 5 7 3 12 6c5-3 8-1 8 3 0 6-8 12-8 12z" />
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em]">
              Weekly Runs
            </p>
            <p className="text-[12px] font-light leading-relaxed text-muted">
              {home.weeklyRuns.day} — {home.weeklyRuns.time}
            </p>
            <p className="text-[12px] font-light leading-relaxed text-muted">
              {home.weeklyRuns.location}
            </p>
          </div>

          <p className="max-w-[280px] text-[12px] font-light leading-[1.7] text-muted">
            {home.description}
          </p>

          <div className="flex items-center gap-4 border-t border-border pt-4">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-light tracking-[0.08em] text-muted"
            >
              {instagramHandle}
            </a>
            <span className="text-[11px] text-muted">·</span>
            <a
              href={strava}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-light tracking-[0.08em] text-muted"
            >
              Strava
            </a>
            <span className="text-[11px] text-muted">·</span>
            <span className="text-[11px] font-light tracking-[0.08em] text-muted">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Image ── */}
      <div className="hidden md:block md:w-[58%]">
        <div className="relative h-full w-full overflow-hidden bg-surface">
          <img
            src={home.heroImage || "/default-hero.svg"}
            alt="Ratty Run"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* ── Mobile: Full-screen image behind content ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 md:hidden">
        <div className="relative h-full w-full bg-surface opacity-30">
          <img
            src={home.heroImage || "/default-hero.svg"}
            alt="Ratty Run"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
