// Service worker registration.
//
// CRA does NOT run any build step on files in `public/`, so we register
// our hand-written service-worker.js from the build root. The scope is
// inherited from its location (e.g. /spellotl/service-worker.js => /spellotl/),
// which matches the manifest's scope.

type UpdateCallback = (registration: ServiceWorkerRegistration) => void;

export function registerServiceWorker(onUpdateAvailable?: UpdateCallback): void {
  if (!('serviceWorker' in navigator)) return;
  // Only register in production. The dev server doesn't serve the static
  // service-worker.js the same way, and a SW caching HMR responses is a
  // recipe for confusion.
  if (process.env.NODE_ENV !== 'production') return;

  // Use the public URL as the base so this works on GitHub Pages where the
  // app is hosted under /spellotl/.
  const publicUrl = new URL(
    process.env.PUBLIC_URL || '',
    window.location.href,
  );
  // If the page is on a different origin than where the assets live, abort.
  if (publicUrl.origin !== window.location.origin) return;

  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        // Listen for the case where an update is found AFTER the initial
        // install — that means there's a new version sitting in `waiting`.
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // A new SW is installed and the page is currently controlled
              // by an older one — i.e. an update is ready.
              onUpdateAvailable?.(registration);
            }
          });
        });
      })
      .catch((err) => {
        // Don't throw — failure to register a SW should never break the app.
        // eslint-disable-next-line no-console
        console.warn('Service worker registration failed:', err);
      });

    // When the new SW takes control, reload so the user sees the new version.
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
}

/** Tell the waiting SW to activate immediately. The controllerchange listener
 * above will then reload the page. */
export function applyServiceWorkerUpdate(
  registration: ServiceWorkerRegistration,
): void {
  registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
}
