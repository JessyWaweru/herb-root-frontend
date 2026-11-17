import { useId, type CSSProperties } from 'react';
import clsx from 'clsx';

/*
 * Decorative line drawings used around the site in place of emoji. All are aria-hidden and
 * take their colour from the text colour, so `text-sage-300` and friends tint them.
 */

type Point = { x: number; y: number };

/** A point and its direction (degrees) along a cubic curve. */
function along(p0: Point, p1: Point, p2: Point, p3: Point, t: number) {
  const u = 1 - t;
  const x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
  const y = u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y;
  const dx = 3 * u * u * (p1.x - p0.x) + 6 * u * t * (p2.x - p1.x) + 3 * t * t * (p3.x - p2.x);
  const dy = 3 * u * u * (p1.y - p0.y) + 6 * u * t * (p2.y - p1.y) + 3 * t * t * (p3.y - p2.y);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

const round = (n: number) => Math.round(n * 10) / 10;

/** An almond leaf of the given length lying along the x axis, with its midrib. */
function leaf(length: number) {
  const w = length * 0.3;
  const l = round(length);
  return {
    blade: `M0 0C${round(length * 0.28)} ${round(-w)} ${round(length * 0.74)} ${round(-w * 0.9)} ${l} 0C${round(length * 0.74)} ${round(w * 0.9)} ${round(length * 0.28)} ${round(w)} 0 0Z`,
    rib: `M0 0L${round(length * 0.82)} 0`,
  };
}

const STEM = [
  { x: 60, y: 196 },
  { x: 44, y: 136 },
  { x: 78, y: 76 },
  { x: 60, y: 14 },
] as const;

/** A stem with paired leaves that get smaller towards the tip. `leaves` is the number of pairs. */
export function Sprig({ className, leaves = 6, style }: { className?: string; leaves?: number; style?: CSSProperties }) {
  const [p0, p1, p2, p3] = STEM;
  const pairs = Array.from({ length: leaves }, (_, i) => {
    const t = 0.16 + (i / leaves) * 0.74;
    const at = along(p0, p1, p2, p3, t);
    const length = 44 - (i / leaves) * 22;
    return { ...at, shape: leaf(length), key: i };
  });
  const tip = along(p0, p1, p2, p3, 1);

  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={clsx('w-auto', className)}
      style={style}
    >
      <path d={`M${p0.x} ${p0.y}C${p1.x} ${p1.y} ${p2.x} ${p2.y} ${p3.x} ${p3.y}`} />
      {pairs.map(({ x, y, angle, shape, key }) =>
        [-1, 1].map((side) => (
          <g key={`${key}${side}`} transform={`translate(${round(x)} ${round(y)}) rotate(${round(angle + side * 52)})`}>
            <path d={shape.blade} fill="currentColor" fillOpacity="0.14" />
            <path d={shape.rib} strokeWidth="1" opacity="0.7" />
          </g>
        )),
      )}
      <g transform={`translate(${round(tip.x)} ${round(tip.y)}) rotate(${round(tip.angle)})`}>
        <path d={leaf(20).blade} fill="currentColor" fillOpacity="0.14" />
      </g>
    </svg>
  );
}

/** The leaf from inside the "O" of the GOherbal mark, veins and all. */
export function BrandLeaf({ className, veins = true }: { className?: string; veins?: boolean }) {
  const maskId = `brand-leaf-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <svg viewBox="0 0 40 52" aria-hidden="true" className={clsx('w-auto', className)}>
      {veins && (
        <defs>
          <mask id={maskId}>
            <rect width="40" height="52" fill="white" />
            <g stroke="black" strokeWidth="2.4" strokeLinecap="round" fill="none">
              <path d="M20 52V12" />
              <path d="M20 27l-7.5-7.5" />
              <path d="M20 37.5l8-8.5" />
            </g>
          </mask>
        </defs>
      )}
      <path
        d="M20 .7C36.5 9 40.5 31 20 50.3-.5 31 3.5 9 20 .7Z"
        fill="currentColor"
        mask={veins ? `url(#${maskId})` : undefined}
      />
    </svg>
  );
}

/** Words set around a slowly turning ring, with the brand leaf at the centre. */
export function Seal({ text, className }: { text: string; className?: string }) {
  const pathId = `seal-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return (
    <div className={clsx('relative', className)} aria-hidden="true">
      <svg viewBox="0 0 120 120" className="h-full w-full animate-spin-slow">
        <defs>
          <path id={pathId} d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" />
        </defs>
        <circle cx="60" cy="60" r="59" fill="currentColor" />
        <text
          fontSize="9.2"
          fontWeight="700"
          letterSpacing="2.6"
          fill="var(--seal-ink, #fffdf8)"
          style={{ fontFamily: 'var(--font-sans)', textTransform: 'uppercase' }}
        >
          <textPath href={`#${pathId}`} textLength="282" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-[46%] w-[46%] items-center justify-center rounded-full bg-[var(--seal-ink,#fffdf8)]">
          <BrandLeaf className="h-[62%] text-[var(--seal-leaf,#0e4d3a)]" />
        </span>
      </span>
    </div>
  );
}

/** A thin rule with the brand leaf at its centre, to close a section. */
export function LeafRule({ className }: { className?: string }) {
  return (
    <div className={clsx('flex items-center gap-4 text-sage-400', className)} aria-hidden="true">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-cream-400" />
      <BrandLeaf className="h-5" veins={false} />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-cream-400" />
    </div>
  );
}
