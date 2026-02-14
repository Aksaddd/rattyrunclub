import Nav from "@/components/Nav";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const content = await getContent();
  const { about, instagram, instagramHandle } = content;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* ── Left Panel: Text ── */}
      <div className="flex w-full flex-col justify-between p-8 md:w-[45%] md:p-12 lg:p-16">
        <Nav />

        <div className="mt-16 flex flex-1 flex-col justify-center md:mt-0">
          <h1 className="text-[13px] font-medium uppercase tracking-[0.15em]">
            {about.heading}
          </h1>

          <div className="mt-8 flex flex-col gap-5">
            {about.paragraphs.map((text, i) => (
              <p
                key={i}
                className="max-w-[420px] text-[13px] font-light leading-[1.8] text-muted"
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center gap-4 border-t border-border pt-4 md:mt-0">
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-light tracking-[0.08em] text-muted"
          >
            {instagramHandle}
          </a>
          <span className="text-[11px] text-muted">·</span>
          <span className="text-[11px] font-light tracking-[0.08em] text-muted">
            NYC
          </span>
        </div>
      </div>

      {/* ── Right Panel: Image ── */}
      <div className="relative hidden md:block md:w-[55%]">
        {about.image ? (
          <img
            src={about.image}
            alt={about.heading}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
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
                Image coming soon
              </p>
            </div>
          </div>
        )}

        {about.imageCaption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-6">
            <p className="text-[11px] font-light tracking-[0.08em] text-white">
              {about.imageCaption}
            </p>
          </div>
        )}
      </div>

      {/* ── Mobile: Image below text ── */}
      <div className="relative h-[50vh] w-full md:hidden">
        {about.image ? (
          <img
            src={about.image}
            alt={about.heading}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Image coming soon
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
