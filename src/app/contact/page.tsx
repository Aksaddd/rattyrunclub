import Nav from "@/components/Nav";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col px-[48px] py-[40px] sm:px-[64px] sm:py-[48px] md:px-[72px] md:py-[56px] lg:px-[96px] lg:py-[72px]">
      <Nav />

      <div className="mx-auto mt-16 flex w-full max-w-[520px] flex-1 flex-col justify-center md:mt-0">
        <h1 className="text-[14px] font-semibold uppercase tracking-[0.2em]">
          Contact
        </h1>
        <p className="mt-4 text-[15px] font-light leading-relaxed text-muted">
          Have a question, want to collaborate, or just want to say hey? Reach
          out through any of the channels below.
        </p>

        <div className="mt-12 flex flex-col gap-8">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
              Email
            </p>
            <a
              href="mailto:therattyrunclub@gmail.com"
              className="text-[15px] font-light underline underline-offset-4 decoration-border transition-colors hover:text-foreground hover:decoration-foreground"
            >
              therattyrunclub@gmail.com
            </a>
          </div>

          {/* Instagram */}
          <div className="flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted">
              Instagram
            </p>
            <a
              href="https://instagram.com/lahhdrew"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-light underline underline-offset-4 decoration-border transition-colors hover:text-foreground hover:decoration-foreground"
            >
              @lahhdrew
            </a>
          </div>
        </div>

        <div className="mt-16 border-t border-border pt-6">
          <Link
            href="/"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted transition-colors hover:text-foreground"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
