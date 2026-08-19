'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * HorizontalPinSection
 *
 * How it works:
 *  - A full-viewport-height outer wrapper is pinned by ScrollTrigger.
 *  - Inside it sits a flex row of panels (`.panels-track`).
 *  - As the user scrolls through the pinned duration, the track is translated
 *    from x=0 → x=-(totalWidth - viewportWidth), creating the horizontal slide.
 *  - Once the tween reaches 100% progress the section unpins and normal scroll resumes.
 *
 * ━━ ScrollTrigger config lives in the useEffect below ━━
 *
 * To swap placeholder panels for real content: replace the `panels` array and
 * edit the JSX inside the `.panels-track` div.  The trigger math is panel-count-agnostic.
 */

const panels = [
  { id: 1, bg: 'var(--surface-0)', label: '01' },
  { id: 2, bg: 'var(--surface-1)', label: '02' },
  { id: 3, bg: 'var(--surface-2)', label: '03' },
  { id: 4, bg: 'var(--surface-3)', label: '04' },
];

// ── Sensitivity & Timing Controls ───────────────────────────────────────────
// Adjust these values to fine-tune scroll speed and responsiveness:
const DISTANCE_MULTIPLIER = 1.0; // Factor to lengthen scroll distance (e.g. 1.2 = 20% slower/less sensitive)
const SCRUB_SMOOTHING = 1.0;     // Seconds of inertia smoothing on scroll scrub (higher = softer/smoother)

export default function HorizontalPinSection() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const trackRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track   = trackRef.current;
    if (!section || !track) return;

    // ── ScrollTrigger: horizontal pin ────────────────────────────────────────
    const ctx = gsap.context(() => {
      const totalWidth     = track.scrollWidth;   // sum of all panel widths
      const viewportWidth  = window.innerWidth;
      const travelDistance = totalWidth - viewportWidth; // px to translate

      gsap.to(track, {
        // Translate the track leftward by the calculated distance
        x: -travelDistance,
        ease: 'none', // linear — scrub handles easing

        scrollTrigger: {
          trigger: section,
          start:   'top top',           // pin when section hits top of viewport
          end:     () => `+=${travelDistance * DISTANCE_MULTIPLIER}`, // scroll distance required to complete
          pin:     true,                // keep section fixed while scrolling
          scrub:   SCRUB_SMOOTHING,     // smooth inertia
          invalidateOnRefresh: true,    // recalculate on window resize
          // markers: true,             // ← uncomment to debug trigger positions
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    /*
     * Outer wrapper — this is the element ScrollTrigger pins.
     * overflow-hidden prevents the track from causing horizontal page scroll.
     */
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{ background: 'var(--surface-1)' }}
      aria-label="Horizontal scroll section"
    >
      {/* Label */}
      <p
        className="absolute top-6 left-8 z-10 text-xs uppercase tracking-widest select-none"
        style={{ color: 'var(--muted)' }}
      >
        Horizontal Scroll
      </p>

      {/*
       * panels-track — the element that actually moves.
       * Each panel is exactly 100vw wide so the total width = panels.length × 100vw.
       * Swap the panel content below for real components/images.
       */}
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${panels.length * 100}vw` }}
      >
        {panels.map((panel) => (
          <div
            key={panel.id}
            className="relative flex-shrink-0 flex items-center justify-center w-screen h-full"
            style={{
              background: panel.bg,
              borderRight: '1px solid var(--border)',
            }}
          >
            {/* Large number — clearly visible during animation testing */}
            <span
              className="text-[20vw] font-black select-none leading-none"
              style={{ color: 'var(--accent)', opacity: 0.07 }}
            >
              {panel.label}
            </span>

            {/* Swap-point label */}
            <p
              className="absolute bottom-8 left-8 text-sm font-mono"
              style={{ color: 'var(--muted)' }}
            >
              panel {panel.label} — swap for real content
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
