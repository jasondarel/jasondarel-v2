'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LayerCrossfadeSection
 *
 * How it works:
 *  - Three layers are stacked with position:absolute, filling the same space.
 *  - The section is pinned for (layers.length × 100vh) of scroll travel.
 *  - A single GSAP timeline scrubs through the pin duration and:
 *      · fades layer 0 out while layer 1 fades in
 *      · fades layer 1 out while layer 2 fades in
 *  - Each crossfade occupies an equal share of the total scrub duration.
 *
 * ━━ ScrollTrigger config lives in the useEffect below ━━
 *
 * To add more layers: push to the `layers` array below.
 * To use real content: replace the div interiors — the crossfade logic is layer-count-agnostic.
 */

// ── Placeholder layer data ────────────────────────────────────────────────────
// Replace bg / label with real content later.
const layers = [
  { id: 0, bg: 'var(--surface-0)', label: 'Layer A', sub: 'First layer — replace with real content' },
  { id: 1, bg: 'var(--surface-1)', label: 'Layer B', sub: 'Second layer — replace with real content' },
  { id: 2, bg: 'var(--surface-2)', label: 'Layer C', sub: 'Third layer — replace with real content' },
];

// ── Sensitivity & Timing Controls ───────────────────────────────────────────
// Adjust these values to fine-tune how long layers stay visible and how fast they transition:
const SCROLL_DISTANCE_PER_LAYER = 1200; // Pixels of scroll travel allocated per layer (higher = slower/less sensitive)
const HOLD_RATIO = 0.5;                // Proportion of time a layer stays fully visible before fading (0 = immediate fade, 1 = long hold)
const FADE_RATIO = 1.0;                // Duration of the crossfade transition
const SCRUB_SMOOTHING = 1.2;           // Seconds of inertia smoothing on scroll scrub (higher = softer/smoother)

export default function LayerCrossfadeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // One ref per layer so GSAP can target each individually
  const layerRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ── Total pin distance ─────────────────────────────────────────────────
      // We give every layer (including the last one) its own scroll distance
      // so the user has time to view each layer before it crossfades or unpins.
      const totalScrollDistance = layers.length * SCROLL_DISTANCE_PER_LAYER;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          end:     `+=${totalScrollDistance}`,
          pin:     true,
          scrub:   SCRUB_SMOOTHING, // Smooths out wheel flicks so it doesn't jump abruptly
          invalidateOnRefresh: true,
          // markers: true, // ← uncomment to debug trigger positions
        },
      });

      // Set initial state: layer 0 fully visible, rest invisible
      gsap.set(layerRefs.current[0], { opacity: 1 });
      layers.slice(1).forEach((_, i) => {
        gsap.set(layerRefs.current[i + 1], { opacity: 0 });
      });

      // ── Build sequence with resting "hold" zones ───────────────────────────
      // For each transition:
      //  1. Hold current layer at 100% opacity
      //  2. Crossfade current layer out (opacity 1 -> 0) and next layer in (opacity 0 -> 1)
      for (let i = 0; i < layers.length - 1; i++) {
        const outLayer = layerRefs.current[i];
        const inLayer  = layerRefs.current[i + 1];

        // 1. Hold period: empty tween that consumes scroll distance while holding current state
        tl.to({}, { duration: HOLD_RATIO });

        // 2. Crossfade period: fade out old layer & fade in new layer simultaneously
        tl.to(outLayer, { opacity: 0, duration: FADE_RATIO, ease: 'power1.inOut' })
          .to(inLayer,  { opacity: 1, duration: FADE_RATIO, ease: 'power1.inOut' }, `<`);
      }

      // Final hold period: keep the last layer fully visible before unpinning
      tl.to({}, { duration: HOLD_RATIO });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    /*
     * Outer wrapper — this is what ScrollTrigger pins.
     * position:relative + overflow:hidden ensures stacked layers clip correctly.
     */
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      aria-label="Layer crossfade section"
    >
      {/* Label */}
      <p
        className="absolute top-6 left-8 z-20 text-xs uppercase tracking-widest select-none"
        style={{ color: 'var(--muted)' }}
      >
        Layer Crossfade
      </p>

      {/*
       * Layers — stacked absolutely, same dimensions.
       * Swap div interiors for real JSX/images below.
       */}
      {layers.map((layer, i) => (
        <div
          key={layer.id}
          ref={(el) => { layerRefs.current[i] = el; }}
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ background: layer.bg }}
        >
          {/* Large label — clearly visible while testing */}
          <span
            className="text-[15vw] font-black select-none leading-none"
            style={{ color: 'var(--accent)', opacity: 0.06 }}
          >
            {layer.label}
          </span>
          <p
            className="mt-4 text-sm font-mono tracking-wide"
            style={{ color: 'var(--muted)' }}
          >
            {layer.sub}
          </p>
        </div>
      ))}
    </section>
  );
}
