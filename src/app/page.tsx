'use client';

import { useLenis } from '@/lib/useLenis';
import AboutSection from '@/components/AboutSection';
import HorizontalPinSection from '@/components/HorizontalPinSection';
import LayerCrossfadeSection from '@/components/LayerCrossfadeSection';

/**
 * Home (App.tsx equivalent)
 *
 * Page layout in order:
 *   1. Intro        — normal scroll, full viewport height
 *   2. AboutSection — pinned scroll with 'About Me' text fade in/out animation
 *   3. HorizontalPinSection — pins + scrolls panels left-to-right, then releases
 *   4. LayerCrossfadeSection — pins + crossfades stacked layers, then releases
 *   5. Outro        — normal scroll, full viewport height
 *
 * useLenis() is called at the page root so Lenis wraps the entire document.
 * All GSAP ScrollTrigger logic lives inside each section component.
 */
export default function Home() {
  // ── Initialise Lenis smooth scroll + GSAP ticker integration ──────────────
  useLenis();

  return (
    <main>
      {/* ── 1. INTRO HERO ─────────────────────────────────────────────────── */}
      <section
        className="relative flex h-screen flex-col items-center justify-center px-6 text-center select-none"
        style={{ background: 'var(--surface-0)' }}
        aria-label="Intro section"
      >
        {/* Subtle Top Header Meta */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between pointer-events-none">
          <span
            className="text-xs uppercase tracking-[0.3em] font-mono"
            style={{ color: 'var(--muted)' }}
          >
            Portfolio &amp; Archive
          </span>
          <span
            className="text-xs font-mono"
            style={{ color: 'var(--muted)' }}
          >
            2026
          </span>
        </div>

        {/* Center Intro Block */}
        <div className="max-w-4xl flex flex-col items-center">
          <p
            className="mb-4 text-xs font-mono uppercase tracking-[0.35em]"
            style={{ color: 'var(--muted)' }}
          >
            Hello, I am
          </p>

          <h1
            className="text-6xl sm:text-8xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-5"
            style={{ color: 'var(--accent)' }}
          >
            Jason Darel
          </h1>

          <p
            className="text-xl sm:text-2xl md:text-3xl font-medium tracking-tight mb-4"
            style={{ color: 'var(--foreground)' }}
          >
            Full-Stack Developer
          </p>

          <p
            className="max-w-xl text-sm sm:text-base font-normal leading-relaxed"
            style={{ color: 'var(--muted)' }}
          >
            Crafting minimal, high-performance web applications, scalable architectures, and interactive digital experiences.
          </p>
        </div>

        {/* Bottom Minimalist Scroll Icon */}
        <div
          className="absolute bottom-8 flex flex-col items-center pointer-events-none"
          aria-label="Scroll down indicator"
        >
          <div
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2"
            style={{ borderColor: 'var(--accent)' }}
          >
            <span
              className="w-1.5 h-2.5 rounded-full animate-scroll-wheel"
              style={{ background: 'var(--accent)' }}
            />
          </div>
        </div>
      </section>

      {/* ── 2. ABOUT ME PINNED SECTION ───────────────────────────────────── */}
      {/*
       * Pinned section with 'About Me' text fading in from left and fading out to right.
       * See src/components/AboutSection.tsx for ScrollTrigger config.
       */}
      <AboutSection />

      {/* ── 3. HORIZONTAL PIN SECTION ─────────────────────────────────────── */}
      {/*
       * Panels scroll left-to-right while section is pinned.
       * See src/components/HorizontalPinSection.tsx for ScrollTrigger config.
       */}
      <HorizontalPinSection />

      {/* ── 4. LAYER CROSSFADE SECTION ────────────────────────────────────── */}
      {/*
       * Stacked layers crossfade in sequence while section is pinned.
       * See src/components/LayerCrossfadeSection.tsx for ScrollTrigger config.
       */}
      <LayerCrossfadeSection />

      {/* ── 5. OUTRO ─────────────────────────────────────────────────────── */}
      <section
        className="flex h-screen flex-col items-center justify-center border-t"
        style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
        aria-label="Outro section"
      >
        <p
          className="text-xs uppercase tracking-[0.3em] mb-4 select-none"
          style={{ color: 'var(--muted)' }}
        >
          End of scroll
        </p>
        <p
          className="text-3xl font-bold"
          style={{ color: 'var(--accent)' }}
        >
          Normal scroll resumed ✓
        </p>
        <p
          className="mt-4 text-sm font-mono text-center max-w-sm"
          style={{ color: 'var(--muted)' }}
        >
          Replace intro, outro, panels, and layers with real content —<br />
          the scroll rig stays intact.
        </p>
      </section>
    </main>
  );
}
