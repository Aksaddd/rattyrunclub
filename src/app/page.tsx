import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="relative flex w-full flex-col justify-between p-6 sm:p-8 md:w-[42%] md:p-10 lg:p-12">
        {/* Top: Nav */}
        <header className="flex w-full items-start justify-between">
          <Link
            href="/shop"
            className="text-[11px] font-medium uppercase tracking-[0.15em]"
          >
            Shop
          </Link>

          {/* Wordmark — centered on mobile, left-offset on desktop */}
          <div className="absolute left-1/2 top-6 -translate-x-1/2 sm:top-8 md:static md:translate-x-0">
            <svg
              viewBox="0 0 120 50"
              className="h-8 w-auto md:h-9"
              fill="currentColor"
              aria-label="ratty run"
            >
              <text
                x="4"
                y="22"
                fontSize="18"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-0.5"
              >
                ratty
              </text>
              <text
                x="18"
                y="42"
                fontSize="18"
                fontWeight="800"
                fontFamily="system-ui, sans-serif"
                letterSpacing="-0.5"
              >
                run
              </text>
            </svg>
          </div>

          <Link
            href="/gallery"
            className="text-[11px] font-medium uppercase tracking-[0.15em]"
          >
            Gallery
          </Link>
        </header>

        {/* Middle: Navigation links */}
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

        {/* Bottom: Club info */}
        <div className="mt-auto flex flex-col gap-6">
          {/* Butterfly icon placeholder */}
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

          {/* Schedule info */}
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em]">
              Weekly Runs
            </p>
            <p className="text-[12px] font-light leading-relaxed text-muted">
              Every Saturday — 8:00 AM
            </p>
            <p className="text-[12px] font-light leading-relaxed text-muted">
              Central Park, NYC
            </p>
          </div>

          {/* Description */}
          <p className="max-w-[280px] text-[12px] font-light leading-[1.7] text-muted">
            A community run club in New York City. All paces welcome. We run
            together, we grow together.
          </p>

          {/* Social handle */}
          <div className="flex items-center gap-4 border-t border-border pt-4">
            <a
              href="https://instagram.com/therattyrun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-light tracking-[0.08em] text-muted"
            >
              @therattyrun
            </a>
            <span className="text-[11px] text-muted">·</span>
            <a
              href="https://strava.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-light tracking-[0.08em] text-muted"
            >
              Strava
            </a>
            <span className="text-[11px] text-muted">·</span>
            <span className="text-[11px] font-light tracking-[0.08em] text-muted">
              NYC
            </span>
          </div>
        </div>
      </div>

      {/* ── Right Panel: Video ── */}
      <div className="hidden md:block md:w-[58%]">
        <div className="relative h-full w-full overflow-hidden bg-surface">
          {/* Video — replace src with your actual video file */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            poster="/poster.jpg"
          >
            {/* <source src="/hero.mp4" type="video/mp4" /> */}
          </video>

          {/* Placeholder when no video is loaded */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <svg
                viewBox="0 0 200 80"
                className="w-48 opacity-[0.06]"
                fill="currentColor"
              >
                <text
                  x="10"
                  y="35"
                  fontSize="30"
                  fontWeight="900"
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="-1"
                >
                  ratty
                </text>
                <text
                  x="30"
                  y="68"
                  fontSize="30"
                  fontWeight="900"
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="-1"
                >
                  run
                </text>
              </svg>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                Video coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile: Full-screen video behind content ── */}
      <div className="pointer-events-none fixed inset-0 -z-10 md:hidden">
        <div className="h-full w-full bg-surface opacity-30">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover"
            poster="/poster.jpg"
          >
            {/* <source src="/hero.mp4" type="video/mp4" /> */}
          </video>
        </div>
      </div>
    </div>
  );
}
