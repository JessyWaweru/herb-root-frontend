import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

interface TurnstileApi {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

let scriptLoad: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptLoad ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoad = null;
      reject(new Error('Turnstile failed to load'));
    };
    document.head.appendChild(script);
  });
  return scriptLoad;
}

export interface TurnstileHandle {
  /** Tokens are single-use: call after any failed submit to get a fresh one. */
  reset: () => void;
}

/** Cloudflare's bot check. Reports a token when passed, null when it expires or errors. */
export const Turnstile = forwardRef<TurnstileHandle, { onToken: (token: string | null) => void; action: string }>(
  ({ onToken, action }, ref) => {
    const container = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const onTokenRef = useRef(onToken);
    const [failed, setFailed] = useState(false);
    onTokenRef.current = onToken;

    useImperativeHandle(ref, () => ({
      reset: () => {
        onTokenRef.current(null);
        if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      },
    }));

    useEffect(() => {
      let cancelled = false;
      if (!SITE_KEY) {
        setFailed(true);
        return;
      }
      loadTurnstile()
        .then(() => {
          if (cancelled || !container.current || !window.turnstile) return;
          widgetId.current = window.turnstile.render(container.current, {
            sitekey: SITE_KEY,
            action,
            theme: 'light',
            size: 'flexible',
            callback: (token: string) => onTokenRef.current(token),
            'expired-callback': () => onTokenRef.current(null),
            'error-callback': () => onTokenRef.current(null),
          });
        })
        .catch(() => !cancelled && setFailed(true));

      return () => {
        cancelled = true;
        if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
        widgetId.current = null;
      };
    }, [action]);

    if (failed) {
      return (
        <p role="alert" className="rounded-xl border border-rose-300 bg-rose-300/10 px-3 py-2 text-xs text-rose-600">
          We couldn't load the security check. Check your connection, disable any blocker for this page, and
          refresh.
        </p>
      );
    }

    return <div ref={container} className="min-h-[65px]" />;
  },
);
Turnstile.displayName = 'Turnstile';
