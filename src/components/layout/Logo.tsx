import { useId } from 'react';
import clsx from 'clsx';

const MINT = '#8fd2b1';
const DEEP_GREEN = '#0e4d3a';
const GOLD = '#e8b751';

export function Logo({
  className,
  tagline = false,
  dark = false,
}: {
  className?: string;
  tagline?: boolean;
  dark?: boolean;
}) {
  const maskId = `leaf-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const color = dark ? MINT : DEEP_GREEN;

  // Units mirror the reference artwork: G and O are both 89 tall.
  return (
    <svg
      viewBox={tagline ? '-2 0 270 122' : '-2 0 270 90'}
      className={clsx(tagline ? 'h-24' : 'h-10', 'w-auto', className)}
      role="img"
      aria-label="GO herbal"
    >
      <defs>
        <mask id={maskId}>
          <rect x="0" y="0" width="320" height="144" fill="white" />
          <g stroke="black" strokeWidth="2.8" strokeLinecap="round" fill="none">
            <path d="M137.5 70V31" />
            <path d="M137.5 46L130 38.5" />
            <path d="M137.5 56.5L145.5 48" />
          </g>
        </mask>
      </defs>

      <g fill={color} fontFamily="Poppins, sans-serif">
        <g transform="translate(0 12.35) scale(0.7225)">
          <text x="-3.66" y="87.8" fontSize="121.9" fontWeight="700">
            G
          </text>

          <circle cx="137.5" cy="44.5" r="41" fill="none" stroke={color} strokeWidth="7" />
          <path
            d="M137.5 19.7C154 28 158 50 137.5 69.3 117 50 121 28 137.5 19.7Z"
            mask={`url(#${maskId})`}
          />
          <circle cx="166.74" cy="15.76" r="10.1" fill={GOLD} />
        </g>

        <text x="135.8" y="59" fontSize="39.2" fontWeight="500">
          herbal
        </text>

        {tagline && (
          <text x="-0.9" y="118" fontSize="13.4" fontWeight="500" textLength="189" lengthAdjust="spacing">
            HERBAL WELLNESS
          </text>
        )}
      </g>
    </svg>
  );
}
