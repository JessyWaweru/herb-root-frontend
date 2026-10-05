import { Check } from 'lucide-react';
import clsx from 'clsx';
import { PASSWORD_RULES } from '../../lib/passwordRules';

export function PasswordChecklist({ password, id }: { password: string; id?: string }) {
  const passed = PASSWORD_RULES.filter((rule) => rule.test(password)).length;
  const strength = passed / PASSWORD_RULES.length;

  return (
    <div id={id} className="rounded-xl border border-cream-300 bg-cream-50/70 p-3">
      <div className="mb-2.5 flex gap-1" aria-hidden="true">
        {PASSWORD_RULES.map((rule, i) => (
          <span
            key={rule.id}
            className={clsx(
              'h-1 flex-1 rounded-full transition-colors duration-300',
              i < passed
                ? strength === 1
                  ? 'bg-sage-600'
                  : strength >= 0.5
                    ? 'bg-gold-500'
                    : 'bg-rose-400'
                : 'bg-cream-300',
            )}
          />
        ))}
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2" aria-live="polite">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.id}
              className={clsx('flex items-center gap-2 text-xs transition-colors', ok ? 'text-sage-700' : 'text-ink-600')}
            >
              <span
                className={clsx(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200',
                  ok ? 'scale-100 border-sage-600 bg-sage-600 text-cream-50' : 'border-cream-300 bg-cream-50',
                )}
              >
                {ok && <Check size={11} strokeWidth={3} />}
              </span>
              {rule.label}
              <span className="sr-only">{ok ? '(met)' : '(not met)'}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
