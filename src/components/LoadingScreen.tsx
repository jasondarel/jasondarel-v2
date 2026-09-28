'use client';

import { useEffect, useRef } from 'react';

/**
 * LoadingScreen
 *
 * Full-viewport overlay (surface-0 background) with a slim centred progress
 * bar. Fills left-to-right, then the entire overlay fades away.
 * Calls `onComplete` once the fade is done.
 */
export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }

    const FILL_DURATION = 1400; // ms for the bar to fill
    const FADE_DURATION = 500;  // ms for the overlay to fade out

    let rafId: number;
    let startTime: number | null = null;
    const bar = barRef.current;
    const root = rootRef.current;

    function tick(ts: number) {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / FILL_DURATION, 1);
      // ease-out-quart
      const eased = 1 - Math.pow(1 - t, 4);
      if (bar) bar.style.transform = `scaleX(${eased})`;

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Fade the whole overlay out
        if (root) {
          root.style.transition = `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;
          root.style.opacity = '0';
        }
        setTimeout(onComplete, FADE_DURATION);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--surface-0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'all',
      }}
      aria-hidden="true"
    >
      {/* Centred progress bar */}
      <div
        style={{
          width: 'min(320px, 60vw)',
          height: '2px',
          background: 'var(--border)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barRef}
          style={{
            width: '100%',
            height: '100%',
            background: 'var(--accent)',
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            willChange: 'transform',
          }}
        />
      </div>
    </div>
  );
}
