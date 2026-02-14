import Link from "next/link";
import Nav from "@/components/Nav";
import Countdown from "@/components/Countdown";
import MapModal from "@/components/MapModal";
import DraggableLogo from "@/components/DraggableLogo";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function Home() {
  const content = await getContent();
  const { clubName, home, instagram, instagramHandle, strava, location } = content;

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* ── Left Panel ── */}
      <div className="relative flex w-full flex-col justify-between px-[24px] py-[32px] sm:px-[32px] sm:py-[40px] md:w-[42%] md:px-[40px] md:py-[48px] lg:px-[48px] lg:py-[56px]">
        <Nav />

        <nav className="mt-16 flex flex-col gap-4 md:mt-0">
          <Link
            href="/about"
            className="text-[15px] font-light tracking-[0.06em] text-foreground"
          >
            About
          </Link>
          <Link
            href="/schedule"
            className="text-[15px] font-light tracking-[0.06em] text-foreground"
          >
            Schedule
          </Link>
          <Link
            href="/shop"
            className="text-[15px] font-light tracking-[0.06em] text-foreground"
          >
            Collections
          </Link>
          <Link
            href="/connect"
            className="text-[15px] font-light tracking-[0.06em] text-foreground"
          >
            Connect
          </Link>
        </nav>

        <div className="mt-auto flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-[13px] font-medium uppercase tracking-[0.15em]">
              Upcoming Run
            </p>
            <Countdown targetDate={home.upcomingRun.date} />
            <p className="text-[14px] font-light leading-relaxed text-muted">
              {home.upcomingRun.time}
            </p>
            <MapModal
              mapEmbedUrl={home.upcomingRun.mapEmbedUrl}
              locationName={home.upcomingRun.location}
            />
          </div>

          <p className="max-w-[320px] text-[14px] font-light leading-[1.7] text-muted">
            {home.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 border-t border-border pt-4">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-light tracking-[0.06em] text-muted"
            >
              {instagramHandle}
            </a>
            <span className="text-[13px] text-muted">·</span>
            <a
              href={strava}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-light tracking-[0.06em] text-muted"
            >
              Strava
            </a>
            <span className="text-[13px] text-muted">·</span>
            <span className="text-[13px] font-light tracking-[0.06em] text-muted">
              {location}
            </span>
            <span className="text-[13px] text-muted">·</span>
            <Link
              href="/admin"
              className="text-[13px] font-light tracking-[0.06em] text-muted/40 transition-colors hover:text-muted"
            >
              Manage
            </Link>
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
          {home.logoImage && (
            <DraggableLogo
              src={home.logoImage}
              alt={clubName}
              position={home.logoPosition ?? { x: 50, y: 50 }}
            />
          )}
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
