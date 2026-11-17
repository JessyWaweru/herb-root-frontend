import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ReviewPrompt } from './ReviewPrompt';

/** The strip above the header. It scrolls away; the header below it stays. */
function AnnouncementBar() {
  return (
    <div className="bg-sage-950 text-cream-100">
      <p className="mx-auto flex max-w-7xl items-center justify-center gap-x-3 px-4 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.16em] sm:text-xs">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
        <span>Packed to order across Kenya</span>
        <span className="hidden text-sage-300 sm:inline" aria-hidden="true">
          ·
        </span>
        <span className="hidden sm:inline">Pay with M-Pesa or card</span>
      </p>
    </div>
  );
}

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-sage-800 px-4 py-2 text-sm font-semibold text-cream-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <AnnouncementBar />
      <Navbar />
      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <ReviewPrompt />
    </div>
  );
}
