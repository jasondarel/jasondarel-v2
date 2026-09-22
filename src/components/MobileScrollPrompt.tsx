'use client';

import React, { useEffect, useState } from 'react';

/**
 * MobileScrollPrompt
 *
 * A subtle, floating mobile widget prompting visitors to "Scroll Slowly"
 * with an animated miniature mouse scroll wheel indicator.
 *
 * - Only rendered on mobile screens (md:hidden).
 * - Horizontally centered using flex inset-x-0.
 * - Non-intrusive (pointer-events-none) so touch gestures pass right through.
 * - Visible on initial load, smoothly disappears once the user starts scrolling.
 */
export default function MobileScrollPrompt() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Disappear once user starts scrolling (past 50px)
      const scrolled = window.scrollY > 50;
      setHasScrolled(scrolled);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside
      className="fixed inset-x-0 bottom-[calc(1.25rem+env(safe-area-inset-bottom,0px))] z-40 md:hidden flex justify-center pointer-events-none select-none px-4 transition-all duration-500 ease-out"
      style={{
        opacity: hasScrolled ? 0 : 1,
        transform: hasScrolled ? 'translateY(12px)' : 'translateY(0)',
      }}
      aria-label="Scroll advice: Scroll Slowly"
      aria-hidden={hasScrolled}
    >
      <div
        className="hero-fade-up hero-fade-up-6 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border shadow-sm backdrop-blur-md"
        style={{
          background: 'color-mix(in srgb, var(--surface-0) 90%, transparent)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Text Prompt */}
        <span
          className="text-[11px] font-mono uppercase tracking-[0.18em] font-medium flex-shrink-0"
          style={{ color: 'var(--accent)' }}
        >
          Scroll Slowly
        </span>

        {/* Miniature Animated Mouse Scroll Wheel */}
        <div
          className="w-3.5 h-5 rounded-full border flex justify-center pt-0.5 flex-shrink-0"
          style={{ borderColor: 'var(--accent)', opacity: 0.75 }}
          aria-hidden="true"
        >
          <span
            className="w-1 h-1.5 rounded-full animate-scroll-wheel-mini"
            style={{ background: 'var(--accent)' }}
          />
        </div>
      </div>
    </aside>
  );
}
