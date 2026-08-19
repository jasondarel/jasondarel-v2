'use client';

import { useLenis } from '@/lib/useLenis';
import HorizontalPinSection from '@/components/HorizontalPinSection';
import LayerCrossfadeSection from '@/components/LayerCrossfadeSection';

/**
 * Home (App.tsx equivalent)
 *
 * Page layout in order:
 *   1. Intro        — normal scroll, full viewport height
 *   2. HorizontalPinSection — pins + scrolls panels left-to-right, then releases
 *   3. LayerCrossfadeSection — pins + crossfades stacked layers, then releases
 *   4. Outro        — normal scroll, full viewport height
 *
 * useLenis() is called at the page root so Lenis wraps the entire document.
 * All GSAP ScrollTrigger logic lives inside each section component.
 */
export default function Home() {
  // ── Initialise Lenis smooth scroll + GSAP ticker integration ──────────────
  useLenis();

  return (
    <main>
      {/* ── 1. INTRO ──────────────────────────────────────────────────────── */}
      <section
        className="flex h-screen flex-col items-center justify-center bg-neutral-950 border-b border-neutral-800"
        aria-label="Intro section"
      >
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-neutral-500">
          Scroll Experiments
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight text-center">
          Jason<br />
          <span className="text-neutral-500">Darel</span>
        </h1>
        <p className="mt-8 text-sm text-neutral-600 font-mono">
          ↓ scroll to see horizontal pin &amp; layer crossfade
        </p>
      </section>

      {/* ── 2. HORIZONTAL PIN SECTION ─────────────────────────────────────── */}
      {/*
       * Panels scroll left-to-right while section is pinned.
       * See src/components/HorizontalPinSection.tsx for ScrollTrigger config.
       */}
      <HorizontalPinSection />

      {/* ── 3. LAYER CROSSFADE SECTION ────────────────────────────────────── */}
      {/*
       * Stacked layers crossfade in sequence while section is pinned.
       * See src/components/LayerCrossfadeSection.tsx for ScrollTrigger config.
       */}
      <LayerCrossfadeSection />

      {/* ── 4. OUTRO ──────────────────────────────────────────────────────── */}
      <section
        className="flex h-screen flex-col items-center justify-center bg-neutral-950 border-t border-neutral-800"
        aria-label="Outro section"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500 mb-4">
          End of scroll
        </p>
        <p className="text-3xl font-bold text-white">
          Normal scroll resumed ✓
        </p>
        <p className="mt-4 text-sm text-neutral-600 font-mono text-center max-w-sm">
          Replace intro, outro, panels, and layers with real content —<br />
          the scroll rig stays intact.
        </p>
      </section>
    </main>
  );
}
