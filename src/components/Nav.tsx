"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="flex w-full items-center justify-between">
      {/* Logo — top left, larger */}
      <Link href="/" className={isHome ? "pointer-events-none" : ""}>
        <svg
          viewBox="0 0 120 50"
          className="h-11 w-auto md:h-13"
          fill="currentColor"
          aria-label="Ratty Run"
        >
          <text
            x="4"
            y="22"
            fontSize="18"
            fontWeight="800"
            fontFamily="Montserrat, system-ui, sans-serif"
            letterSpacing="-0.5"
          >
            ratty
          </text>
          <text
            x="18"
            y="42"
            fontSize="18"
            fontWeight="800"
            fontFamily="Montserrat, system-ui, sans-serif"
            letterSpacing="-0.5"
          >
            run
          </text>
        </svg>
      </Link>

      {/* Nav links — right side */}
      <nav className="flex items-center gap-6">
        <Link
          href="/shop"
          className="text-[12px] font-medium uppercase tracking-[0.15em]"
        >
          Shop
        </Link>
        <Link
          href="/gallery"
          className="text-[12px] font-medium uppercase tracking-[0.15em]"
        >
          Gallery
        </Link>
      </nav>
    </header>
  );
}
