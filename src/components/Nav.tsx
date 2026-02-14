"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteContent } from "@/lib/content";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="flex w-full items-center justify-between">
      {/* Left nav link */}
      <Link
        href="/shop"
        className="text-[11px] font-medium uppercase tracking-[0.15em]"
      >
        Shop
      </Link>

      {/* Wordmark */}
      <Link href="/" className={isHome ? "pointer-events-none" : ""}>
        <svg
          viewBox="0 0 120 50"
          className="h-8 w-auto md:h-9"
          fill="currentColor"
          aria-label={siteContent.clubName}
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
      </Link>

      {/* Right nav link */}
      <Link
        href="/gallery"
        className="text-[11px] font-medium uppercase tracking-[0.15em]"
      >
        Gallery
      </Link>
    </header>
  );
}
