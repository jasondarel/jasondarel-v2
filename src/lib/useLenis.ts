'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin once
gsap.registerPlugin(ScrollTrigger);

/**
 * useLenis
 *
 * Initialises Lenis smooth scroll on mount. Key decisions:
 *  - Lenis's own RAF is disabled (`autoRaf: false`) — gsap.ticker drives the loop instead.
 *    This keeps Lenis and GSAP animations in the same frame, avoiding drift.
 *  - On every Lenis scroll event ScrollTrigger.update() is called so pinned panels
 *    respond to the smoothed scroll position rather than the native scroll position.
 *  - Returns the Lenis instance so callers can programmatically scroll if needed.
 */
export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // ── 1. Create Lenis instance ──────────────────────────────────────────────
    const lenis = new Lenis({
      // Duration of the smooth deceleration (seconds).  Tune to taste.
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // Disable built-in RAF; we tick manually via gsap.ticker (see below).
      autoRaf: false,
    });

    lenisRef.current = lenis;

    // ── 2. Sync ScrollTrigger with Lenis ─────────────────────────────────────
    // Each time Lenis scrolls, notify ScrollTrigger so pinned sections
    // update their progress correctly.
    lenis.on('scroll', ScrollTrigger.update);

    // ── 3. Drive the loop with gsap.ticker ────────────────────────────────────
    // gsap.ticker fires every animation frame (replaces requestAnimationFrame).
    // `time` is in seconds (elapsed since page load).
    const onTick = (time: number) => {
      lenis.raf(time * 1000); // Lenis.raf() expects milliseconds
    };

    gsap.ticker.add(onTick);
    // Prevent GSAP from adding its own lag-smoothing on top of Lenis's easing
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}
