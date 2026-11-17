import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { Logo } from '../components/layout/Logo';
import { Button } from '../components/ui/Button';
import { buttonClasses } from '../components/ui/buttonStyles';
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
    <main className="bg-botanical flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <a href="/" aria-label="GOherbal home">
        <Logo />
      </a>
      <h1 className="mt-10 text-balance font-display text-4xl leading-tight text-sage-900 sm:text-5xl">
        {staleBuild ? 'We’ve just updated the site' : 'Something went wrong on this page'}
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-ink-600">
        {staleBuild
          ? 'Reload to get the latest version.'
          : 'Sorry about that. Try reloading; if it keeps happening, email hello@goherbal.health and tell us what you were doing.'}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button onClick={() => window.location.reload()}>Reload the page</Button>
        {/* A full page load rather than in-app navigation, so the broken state is cleared. */}
        <a href="/" className={buttonClasses('outline')}>
          Go to the home page
        </a>
      </div>
    </main>
  );
}
