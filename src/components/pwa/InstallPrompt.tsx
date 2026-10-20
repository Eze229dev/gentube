"use client";

import { useEffect, useState } from "react";

import { product } from "@/config/product";

const DISMISS_KEY = "relancepro-install-dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone(): boolean {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  const nav = window.navigator as Navigator & { standalone?: boolean };
  return Boolean(nav.standalone);
}

function isIos(): boolean {
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [iosHint, setIosHint] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || sessionStorage.getItem(DISMISS_KEY) === "1") {
      return;
    }

    if (isIos()) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    function onPrompt(event: Event) {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setDeferred(null);
  }

  async function install() {
    if (!deferred) {
      return;
    }

    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }

  if (!visible) {
    return null;
  }

  return (
    <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
      <p className="text-sm font-semibold text-slate-900">
        Installer {product.name}
      </p>
      {iosHint ? (
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Appuyez sur Partager, puis sur « Sur l’écran d’accueil ».
        </p>
      ) : (
        <p className="mt-1 text-sm leading-relaxed text-slate-600">
          Ajoutez l’app à l’écran d’accueil.
        </p>
      )}
      <div className="mt-3 flex gap-2">
        {deferred ? (
          <button
            type="button"
            onClick={() => void install()}
            className="min-h-12 flex-1 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white"
          >
            Installer
          </button>
        ) : null}
        <button
          type="button"
          onClick={dismiss}
          className="min-h-12 flex-1 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800"
        >
          Plus tard
        </button>
      </div>
    </div>
  );
}
