'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * FadeToTopOverlay
 *
 * Provides a cinematic, seamless cross-fade transition back to the top of the portfolio.
 * Listens for the 'fade-to-top' event dispatched by the back-to-top button in ContactSection.
 *
 * Flow:
 *  1. Full-screen overlay fades in over 0.32s to 'var(--surface-0)'
 *  2. Scroll position snaps immediately to 0 (top = 0) with zero visual rewind
 *  3. Scrub timelines settle cleanly during a brief 0.15s hold behind the curtain
 *  4. Overlay smoothly fades out over 0.45s, making the Intro Hero fade in
 */
export default function FadeToTopOverlay() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFadeToTop = () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      // Lock interaction during the transition
      overlay.style.pointerEvents = 'auto';
      gsap.killTweensOf(overlay);

      const tl = gsap.timeline();
      tl.to(overlay, {
        opacity: 1,
        duration: 0.32,
        ease: 'power2.inOut',
        onComplete: () => {
          if (window.__lenis) {
            window.__lenis.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo(0, 0);
          }
          ScrollTrigger.refresh();
        },
      }).to(overlay, {
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        delay: 0.15, // Let GSAP scrub catch up and settle behind the curtain
        onComplete: () => {
          if (overlay) {
            overlay.style.pointerEvents = 'none';
          }
        },
      });
    };

    window.addEventListener('fade-to-top', handleFadeToTop);
    return () => window.removeEventListener('fade-to-top', handleFadeToTop);
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-none opacity-0"
      style={{ background: 'var(--surface-0)' }}
      aria-hidden="true"
    />
  );
}
