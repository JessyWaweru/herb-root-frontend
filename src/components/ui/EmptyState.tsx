import type { ReactNode } from 'react';

export function EmptyState({
  icon = '🌿',
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-sage-300 bg-sage-50/50 px-6 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="font-display text-xl text-sage-900">{title}</h3>
      {description && <p className="max-w-sm text-sm text-ink-600">{description}</p>}
      {action}
    </div>
  );
}
