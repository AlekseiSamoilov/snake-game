const APP_METRICA_ID = Number(process.env.REACT_APP_YA_METRIKA_ID || 0);

let initializationPromise: Promise<void> | null = null;

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

const loadMetricaScript = () =>
  new Promise<void>((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }

    if (window.ym || APP_METRICA_ID === 0) {
      resolve();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://mc.yandex.ru/metrika/tag.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });

export const initializeAnalytics = async () => {
  if (!initializationPromise) {
    initializationPromise = loadMetricaScript().then(() => {
      if (window.ym && APP_METRICA_ID) {
        window.ym(APP_METRICA_ID, "init", {
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true
        });
      }
    });
  }

  return initializationPromise;
};

export const trackEvent = (
  name: string,
  payload: { gameTime: number; result: number }
) => {
  if (!window.ym || !APP_METRICA_ID) {
    return;
  }

  window.ym(APP_METRICA_ID, "reachGoal", name, payload);
};
