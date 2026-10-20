import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { isStaleBuildError, reloadForNewVersion } from '../lib/staleBuild';

/** Shown instead of a blank page when something on a page crashes. */
export function RouteError() {
  const error = useRouteError();
  const staleBuild = isStaleBuildError(error);

  useEffect(() => {
    // Leaves the details in the browser console for whoever is investigating.
    console.error('Page crashed:', error);
    if (staleBuild) reloadForNewVersion();
  }, [error, staleBuild]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream-100 px-4 text-center">
      <a href="/" aria-label="GOherbal home">
        <Logo />
      </a>
      <h1 className="mt-10 font-display text-3xl text-sage-900">
        {staleBuild ? 'We’ve just updated the site' : 'Something went wrong on this page'}
      </h1>
      <p className="mt-3 max-w-md text-ink-600">
        {staleBuild
          ? 'Reload to get the latest version.'
          : 'Sorry about that. Try reloading; if it keeps happening, email hello@goherbal.health and tell us what you were doing.'}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button onClick={() => window.location.reload()}>Reload the page</Button>
        {/* A full page load rather than in-app navigation, so the broken state is cleared. */}
        <a
          href="/"
          className="inline-flex items-center rounded-full border border-sage-400 px-5 py-2.5 text-sm font-semibold text-sage-800 hover:bg-sage-50"
        >
          Go to the home page
        </a>
      </div>
    </main>
  );
}
