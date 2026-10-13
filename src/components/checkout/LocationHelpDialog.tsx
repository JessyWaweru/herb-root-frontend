import { Crosshair } from 'lucide-react';
import { Dialog } from '../ui/Dialog';
import { Button } from '../ui/Button';

type Platform = 'ios-safari' | 'ios-chrome' | 'android' | 'mac-safari' | 'firefox' | 'desktop';

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  const iOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (iOS) return /CriOS/.test(ua) ? 'ios-chrome' : 'ios-safari';
  if (/Android/.test(ua)) return 'android';
  if (/Firefox\//.test(ua)) return 'firefox';
  if (/Safari\//.test(ua) && !/Chrome\/|Chromium\/|Edg\//.test(ua)) return 'mac-safari';
  return 'desktop';
}

// A site can't grant itself location access, and once it's blocked the browser won't ask
// again, so the visitor has to turn it back on themselves.
const STEPS: Record<Platform, string[]> = {
  // Safari's in-page "aA" menu moved or changed in newer iOS versions, so use the Settings app.
  'ios-safari': [
    'Open the Settings app → Privacy & Security → Location Services. Make sure it is on, then tap Safari Websites and choose “While Using the App”.',
    'Go back to the main Settings screen → Apps → Safari → Location (on older iPhones: Settings → Safari → Location), and choose Allow or Ask.',
    'Come back here, refresh the page, and tap Try again.',
  ],
  'ios-chrome': [
    'Open the Settings app → Privacy & Security → Location Services, and make sure it is on.',
    'In the same list, tap Chrome and choose “While Using the App”.',
    'Come back here and tap Try again.',
  ],
  android: [
    'Swipe down from the top of your screen and make sure Location is switched on.',
    'In your browser, tap the icon to the left of the web address → Permissions (or Site settings) → Location → Allow.',
    'Come back here and tap Try again.',
  ],
  'mac-safari': [
    'In the menu bar choose Safari → Settings for This Website… and set Location to Allow.',
    'If that doesn’t help: System Settings → Privacy & Security → Location Services → turn on Safari.',
  ],
  firefox: [
    'Click the icon to the left of the web address.',
    'Next to “Access your location”, click the × to clear the block.',
    'Tap Try again and choose Allow when asked.',
  ],
  desktop: [
    'Click the icon to the left of the web address (a slider or padlock).',
    'Turn Location on, or open Site settings and set Location to Allow.',
    'Reload the page if asked, then tap Try again.',
  ],
};

export function LocationHelpDialog({
  open,
  onClose,
  onRetry,
}: {
  open: boolean;
  onClose: () => void;
  onRetry: () => void;
}) {
  const steps = STEPS[detectPlatform()];

  return (
    <Dialog open={open} onClose={onClose} title="Turn on location">
      <div className="flex flex-col gap-4 text-sm text-ink-700">
        <p>
          Your browser is blocking location for this site, so we can't place the pin for you. It only takes a moment to
          turn back on:
        </p>
        <ol className="flex flex-col gap-2.5">
          {steps.map((step, i) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-100 text-xs font-semibold text-sage-800">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-ink-600">
          Rather not? Close this and search for your estate or street, or tap the map where you are.
        </p>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
          <Button type="button" icon={<Crosshair size={15} />} onClick={onRetry}>
            Try again
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
