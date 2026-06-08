import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

/**
 * Argentum brand mark — matches public/favicon.svg.
 * Sizing is controlled via className (defaults to h-6 w-6).
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Логотип Argentum"
      className={cn("h-6 w-6 shrink-0", className)}
    >
      <defs>
        <linearGradient id="argentum-coin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a259ff" />
          <stop offset="100%" stopColor="#7e14ff" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#argentum-coin)" />
      <circle
        cx="32"
        cy="32"
        r="26"
        fill="none"
        stroke="#ede6ff"
        strokeWidth="1.5"
        opacity="0.55"
      />
      <path
        d="M32 14v6M32 44v6"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M40 24c-1.8-2.6-4.7-4-8-4-4.4 0-8 2.7-8 6.5 0 3.6 2.8 5.5 7.6 6.5l1.6.3c5 1 8.4 2.9 8.4 6.9 0 4-3.8 6.8-9 6.8-3.8 0-7-1.6-9-4.5"
        stroke="#ffffff"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
