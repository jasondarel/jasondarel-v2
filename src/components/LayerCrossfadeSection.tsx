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
  { id: 0, bg: 'bg-rose-950',    label: 'Layer A', sub: 'First layer — replace with real content' },
  { id: 1, bg: 'bg-orange-950',  label: 'Layer B', sub: 'Second layer — replace with real content' },
  { id: 2, bg: 'bg-yellow-950',  label: 'Layer C', sub: 'Third layer — replace with real content' },
];

export default function LayerCrossfadeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  // One ref per layer so GSAP can target each individually
  const layerRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // ── Build a scrubbed timeline ──────────────────────────────────────────
      // The timeline is divided into (layers.length - 1) equal segments.
      // Each segment crossfades one layer out and the next one in.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          // Pin for (n - 1) × 100vh of scroll so each transition gets a full viewport-height
          end:     `+=${(layers.length - 1) * window.innerHeight}`,
          pin:     true,
          scrub:   true,
          invalidateOnRefresh: true,
          // markers: true, // ← uncomment to debug trigger positions
        },
      });

      // Set initial state: layer 0 fully visible, rest invisible
      gsap.set(layerRefs.current[0], { opacity: 1 });
      layers.slice(1).forEach((_, i) => {
        gsap.set(layerRefs.current[i + 1], { opacity: 0 });
      });

      // Build crossfade tweens: each occupies 1 unit of timeline progress
      for (let i = 0; i < layers.length - 1; i++) {
        const outLayer = layerRefs.current[i];
        const inLayer  = layerRefs.current[i + 1];

        // Fade out the current layer and fade in the next simultaneously
        tl.to(outLayer, { opacity: 0, duration: 1, ease: 'none' }, i)
          .to(inLayer,  { opacity: 1, duration: 1, ease: 'none' }, i);
      }
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
      <p className="absolute top-6 left-8 z-20 text-xs uppercase tracking-widest text-neutral-500 select-none">
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
          className={`
            absolute inset-0 flex flex-col items-center justify-center
            ${layer.bg}
          `}
        >
          {/* Large label — clearly visible while testing */}
          <span className="text-[15vw] font-black text-white/10 select-none leading-none">
            {layer.label}
          </span>
          <p className="mt-4 text-white/40 text-sm font-mono tracking-wide">
            {layer.sub}
          </p>
        </div>
      ))}
    </section>
  );
}
