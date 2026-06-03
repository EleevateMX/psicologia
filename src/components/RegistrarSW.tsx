'use client';

import { useEffect } from 'react';

/** Registra el service worker para habilitar la PWA (instalable y offline). */
export function RegistrarSW() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const onLoad = () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
          /* Sin SW la app sigue funcionando, sólo sin modo offline. */
        });
      };
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  return null;
}
