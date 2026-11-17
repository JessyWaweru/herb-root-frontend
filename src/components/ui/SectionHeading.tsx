import type { ReactNode } from 'react';
import clsx from 'clsx';

/** The small capitals line above a heading, led by a short rule. */
export function Eyebrow({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <span className={clsx('eyebrow inline-flex items-center gap-3', dark && 'text-gold-400', className)}>
      <span className="h-px w-7 bg-current opacity-50" aria-hidden="true" />
      {children}
    </span>
  );
}

/**
 * Eyebrow, serif heading and a line of supporting text, with room for a link on the right.
 * `title` can hold an <em> for the italic accent word.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  as: Heading = 'h2',
  id,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <div
      className={clsx(
        'mb-10 flex gap-6',
        centered ? 'flex-col items-center text-center' : 'flex-col sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={clsx('max-w-2xl', centered && 'flex flex-col items-center')}>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading
          id={id}
          className={clsx(
            'text-balance font-display leading-[1.05] text-sage-900 [&_em]:accent-italic',
            Heading === 'h1' ? 'text-4xl sm:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl lg:text-[2.75rem]',
            eyebrow && 'mt-4',
          )}
        >
          {title}
        </Heading>
        {description && <p className="mt-4 max-w-xl text-pretty leading-relaxed text-ink-600">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
