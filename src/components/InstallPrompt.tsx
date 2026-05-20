import React, { useEffect, useState } from 'react';

/**
 * "Add to Home Screen" prompt.
 *
 * Two modes:
 *  - Android / desktop Chromium: the browser fires `beforeinstallprompt`. We
 *    capture it and use it when the user taps Install.
 *  - iOS Safari: that event never fires there, so we detect Safari on iOS and
 *    show instructions for the Share -> Add to Home Screen flow instead.
 *
 * The prompt hides itself once installed, once dismissed for the session, or
 * if it was dismissed before (persisted in localStorage so we don't pester).
 */

// The beforeinstallprompt event isn't in lib.dom yet — declare the shape we use.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'spellotl_install_dismissed_at';
// Re-show the prompt at most every 30 days if the user dismissed it earlier.
const DISMISS_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function isIos(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  // iPad on iOS 13+ reports as Mac, so also check for touch.
  const iPadOS = /Mac/.test(ua) && 'ontouchend' in document;
  return /iPhone|iPad|iPod/.test(ua) || iPadOS;
}

function isInStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS-specific
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navAny = window.navigator as any;
  if (navAny.standalone === true) return true;
  // Everyone else
  return window.matchMedia('(display-mode: standalone)').matches;
}

function recentlyDismissed(): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    const at = parseInt(v, 10);
    if (!Number.isFinite(at)) return false;
    return Date.now() - at < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

export default function InstallPrompt(): React.ReactElement | null {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHelp, setShowIosHelp] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return; // already installed — nothing to do
    if (recentlyDismissed()) return;

    const handler = (e: Event) => {
      // Stop Chrome's mini-infobar — we'll show our own button.
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Reset state once the app is installed (the event fires after install).
    const installed = () => {
      setDeferred(null);
      setVisible(false);
    };
    window.addEventListener('appinstalled', installed);

    // iOS: no event ever fires, so show our help after a short delay
    // (don't pop up the instant the page loads — let the user see the app first).
    let iosTimer: number | undefined;
    if (isIos()) {
      iosTimer = window.setTimeout(() => {
        setShowIosHelp(true);
        setVisible(true);
      }, 4000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installed);
      if (iosTimer) window.clearTimeout(iosTimer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* storage might be blocked — that's fine, just don't persist */
    }
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
    if (outcome === 'dismissed') {
      try {
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
      } catch {
        /* ignore */
      }
    }
  };

  if (!visible) return null;

  return (
    <div className="install-prompt" role="dialog" aria-label="Install Spellotl">
      <div className="install-prompt__icon" aria-hidden="true">⭐</div>
      <div className="install-prompt__body">
        <strong className="install-prompt__title">Install Spellotl</strong>
        {showIosHelp ? (
          <p className="install-prompt__text">
            Tap <span aria-label="Share">⬆️</span> Share, then{' '}
            <strong>Add to Home Screen</strong>.
          </p>
        ) : (
          <p className="install-prompt__text">
            Add it to your home screen for offline practice.
          </p>
        )}
      </div>
      <div className="install-prompt__actions">
        {!showIosHelp && deferred && (
          <button
            type="button"
            className="btn btn--primary install-prompt__install"
            onClick={install}
          >
            Install
          </button>
        )}
        <button
          type="button"
          className="install-prompt__close"
          onClick={dismiss}
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
