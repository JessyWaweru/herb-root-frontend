import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { googleLogin, type AuthResponse } from '../../lib/auth';
import { apiErrorMessage } from '../../lib/api';

interface GoogleIdApi {
  initialize: (options: Record<string, unknown>) => void;
  renderButton: (container: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdApi } };
  }
}

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

let scriptLoad: Promise<void> | null = null;

function loadGoogle(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  scriptLoad ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptLoad = null;
      reject(new Error('Google sign-in failed to load'));
    };
    document.head.appendChild(script);
  });
  return scriptLoad;
}

/** "Continue with Google", plus an "or" divider. Renders nothing until a client ID is configured. */
export function GoogleSignIn({ onSignedIn }: { onSignedIn: (data: AuthResponse) => void }) {
  const container = useRef<HTMLDivElement>(null);
  const onSignedInRef = useRef(onSignedIn);
  const [failed, setFailed] = useState(false);
  onSignedInRef.current = onSignedIn;

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    loadGoogle()
      .then(() => {
        if (cancelled || !container.current || !window.google) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: async ({ credential }: { credential: string }) => {
            try {
              onSignedInRef.current(await googleLogin(credential));
            } catch (error) {
              toast.error(apiErrorMessage(error, "Google sign-in didn't work. Please try again."));
            }
          },
        });
        window.google.accounts.id.renderButton(container.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          width: container.current.offsetWidth || 320,
        });
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (!CLIENT_ID || failed) return null;

  return (
    <div className="flex flex-col gap-5">
      <div ref={container} className="flex min-h-[44px] w-full justify-center" />
      <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-ink-600/70">
        <span className="h-px flex-1 bg-cream-300" />
        or
        <span className="h-px flex-1 bg-cream-300" />
      </div>
    </div>
  );
}
