import Nav from "@/components/Nav";
import Link from "next/link";
import Image from "next/image";
import { getContent, type ScheduleEvent } from "@/lib/content";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventCard({ event }: { event: ScheduleEvent }) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-8 last:border-0 last:pb-0 sm:flex-row sm:gap-8">
      {event.image && (
        <div className="relative aspect-[4/3] w-full flex-shrink-0 overflow-hidden sm:w-[240px]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col gap-2">
        <h3 className="text-[15px] font-medium">{event.title}</h3>
        {event.date && (
          <p className="text-[13px] font-light text-muted">
            {formatDate(event.date)} &middot; {formatTime(event.date)}
          </p>
        )}
        {event.location && (
          <p className="text-[13px] font-light text-muted">{event.location}</p>
        )}
        {event.description && (
          <p className="mt-1 text-[14px] font-light leading-relaxed text-muted">
            {event.description}
          </p>
        )}
      </div>
    </div>
  );
}

export default async function SchedulePage() {
  const content = await getContent();
  const now = new Date();

  const events = [...(content.schedule || [])].filter((e) => e.date);

  const futureEvents = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const hasEvents = futureEvents.length > 0 || pastEvents.length > 0;

  return (
    <div className="flex min-h-screen flex-col px-[48px] py-[40px] sm:px-[64px] sm:py-[48px] md:px-[72px] md:py-[56px] lg:px-[96px] lg:py-[72px]">
      <Nav />

      {!hasEvents ? (
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
      ) : (
        <div className="mx-auto mt-12 w-full max-w-[800px]">
          {futureEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-8 border-b border-border pb-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
                Upcoming Events
              </h2>
              <div className="flex flex-col gap-8">
                {futureEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}

          {pastEvents.length > 0 && (
            <section className="mb-16">
              <h2 className="mb-8 border-b border-border pb-3 text-[11px] font-semibold uppercase tracking-[0.2em]">
                Past Events
              </h2>
              <div className="flex flex-col gap-8">
                {pastEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
