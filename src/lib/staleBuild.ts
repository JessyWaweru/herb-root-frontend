// After a deploy, the old build's page files are gone. A tab opened before it (or a slow
// one still loading) asks for them, gets nothing, and the page breaks. Reloading fetches
// the new version. Messages differ by browser: Chrome, Safari, Firefox.
const STALE_BUILD = /dynamically imported module|Importing a module script failed|error loading dynamically imported module/i;

export function isStaleBuildError(error: unknown) {
  return error instanceof Error && STALE_BUILD.test(error.message);
}

/** Reloads to pick up the new version, unless this page load already was a reload (so it can't loop). */
export function reloadForNewVersion() {
  const [navigation] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  if (navigation?.type === 'reload') return false;
  window.location.reload();
  return true;
}
