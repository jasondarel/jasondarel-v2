'use client';

import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * attachEdgeBarrier
 *
 * Hard-clamps Lenis targetScroll at the start and end boundaries of a pinned
 * ScrollTrigger section. Works by unconditionally clamping targetScroll while
 * lenis.scroll has not yet crossed the boundary — even on a very fast swipe
 * where targetScroll and scroll both move in the same RAF frame.
 *
 * Disarming:  each direction's clamp is disarmed by a fresh touchstart or
 * wheel event that begins while the user is already resting AT the boundary.
 * This ensures a separate, intentional gesture is always required.
 */
export function attachEdgeBarrier(st: ScrollTrigger): () => void {
  // Armed = clamp is active. Disarmed = user is at the edge and starting fresh.
  let downArmed = true; // prevents blowing past endCap going downward
  let upArmed = true;   // prevents blowing past startCap going upward

  const getPositions = () => ({
    startCap: st.start,
    endCap: st.end,
  });

  // On every fresh gesture start, check if user is resting at a boundary and disarm
  const disarmIfAtEdge = () => {
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    if (!lenis || !st) return;
    const { startCap, endCap } = getPositions();
    const pos = lenis.scroll;

    if (Math.abs(pos - endCap) <= 16 || pos > endCap) {
      downArmed = false;
    }
    if (Math.abs(pos - startCap) <= 16 || pos < startCap) {
      upArmed = false;
    }
  };

  let lastWheelTs = 0;
  const handleGestureStart = () => {
    disarmIfAtEdge();
  };
  const handleWheel = () => {
    const now = performance.now();
    if (now - lastWheelTs > 200) {
      disarmIfAtEdge(); // new wheel burst = new gesture
    }
    lastWheelTs = now;
  };

  const handleLenisScroll = () => {
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    if (!lenis || !st) return;
    const { startCap, endCap } = getPositions();
    const pos = lenis.scroll;

    // Re-arm when well inside the section
    if (pos < endCap - 60) downArmed = true;
    if (pos > startCap + 60) upArmed = true;

    // ── Hard clamp: while scroll hasn't reached endCap, pin targetScroll there ──
    // This catches even ultra-fast swipes where targetScroll overshoots by hundreds of px.
    if (downArmed && pos < endCap) {
      if (lenis.targetScroll > endCap) {
        lenis.targetScroll = endCap;
      }
    }

    // ── Hard clamp going upward: while scroll hasn't crossed startCap ──
    if (upArmed && pos > startCap) {
      if (lenis.targetScroll < startCap) {
        lenis.targetScroll = startCap;
      }
    }
  };

  let lenisAttached = false;
  let rafId: number | null = null;

  const tryAttachLenis = () => {
    const lenis = typeof window !== 'undefined' ? window.__lenis : null;
    if (lenis) {
      lenis.on('scroll', handleLenisScroll);
      lenisAttached = true;
    } else {
      rafId = requestAnimationFrame(tryAttachLenis);
    }
  };

  if (typeof window !== 'undefined') {
    tryAttachLenis();
    window.addEventListener('touchstart', handleGestureStart, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
  }

  return () => {
    if (typeof window !== 'undefined') {
      if (rafId !== null) cancelAnimationFrame(rafId);
      const lenis = window.__lenis;
      if (lenis && lenisAttached) lenis.off('scroll', handleLenisScroll);
      window.removeEventListener('touchstart', handleGestureStart);
      window.removeEventListener('wheel', handleWheel);
    }
  };
}
