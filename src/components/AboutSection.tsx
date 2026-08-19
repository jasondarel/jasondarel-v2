'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * AboutSection
 *
 * How it works:
 *  - Outer section is pinned when it hits the top of the viewport.
 *  - As the user scrolls:
 *      1. Section starts blank/clean with 'About Me' hidden (opacity: 0).
 *      2. 'About Me' fades in at the center of the viewport at large scale.
 *      3. Heading shrinks down to scale 1.0 and translates to the left column.
 *      4. Paragraph text on the right smoothly fades in and slides into position.
 *      5. Holds in place for comfortable reading.
 *  - Once scroll finishes, the pin releases and normal scroll / horizontal section continues.
 */

// ── Sensitivity & Timing Controls ───────────────────────────────────────────
const SCROLL_DISTANCE = 1800; // Scroll travel in px for smooth multi-step choreography
const SCRUB_SMOOTHING = 1.0;  // Inertia smoothing on scroll scrub

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const headingWrapper = headingWrapperRef.current;
    const heading = headingRef.current;
    const bio = bioRef.current;
    if (!section || !container || !headingWrapper || !heading || !bio) return;

    const ctx = gsap.context(() => {
      // Calculate dynamic offset from container center to the resting left column
      const getOffsets = () => {
        const cRect = container.getBoundingClientRect();
        const hRect = headingWrapper.getBoundingClientRect();

        const centerX = cRect.left + cRect.width / 2;
        const centerY = cRect.top + cRect.height / 2;
        const targetX = hRect.left + hRect.width / 2;
        const targetY = hRect.top + hRect.height / 2;

        return {
          deltaX: centerX - targetX,
          deltaY: centerY - targetY,
        };
      };

      const { deltaX, deltaY } = getOffsets();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${SCROLL_DISTANCE}`,
          pin: true,
          scrub: SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
        },
      });

      // 1. Initial state: 'About Me' hidden at center with scale 1.8
      // 2. Fade in at center
      tl.fromTo(
        heading,
        {
          opacity: 0,
          x: deltaX,
          y: deltaY,
          scale: 1.8,
          transformOrigin: 'center center',
        },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power1.out',
        }
      )
        // 3. Shrink and glide to the left column
        .to(heading, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'power2.inOut',
        })
        // 4. Paragraph fades in and slides into place on the right side
        .fromTo(
          bio,
          {
            opacity: 0,
            x: 40,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1.0,
            ease: 'power2.out',
          },
          '-=0.2'
        )
        // 5. Resting hold phase so the user can comfortably read before unpinning
        .to({}, { duration: 1.5 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden flex flex-col justify-center border-b px-6 sm:px-12 md:px-16"
      style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
      aria-label="About Me section"
    >
      {/* Main Content Layout Container */}
      <div
        ref={containerRef}
        className="relative max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center"
      >
        {/* Left Column: Heading Anchor */}
        <div
          ref={headingWrapperRef}
          className="md:col-span-5 flex items-center justify-center md:justify-start"
        >
          <h2
            ref={headingRef}
            className="text-5xl sm:text-7xl md:text-8xl font-black leading-none tracking-tighter will-change-transform select-none opacity-0"
            style={{ color: 'var(--accent)' }}
          >
            About Me
          </h2>
        </div>

        {/* Right Column: Bio Paragraph */}
        <div
          ref={bioRef}
          className="md:col-span-7 flex flex-col justify-center will-change-transform opacity-0"
        >
          <p
            className="text-lg sm:text-xl md:text-2xl font-normal leading-relaxed tracking-normal"
            style={{ color: 'var(--foreground)' }}
          >
            Throughout my studies and experience, I have learned new skills, as well as sharpened my existing ones through projects, both individual and collaborative. My journey has been defined by continuous growth and a passion for applying theoretical knowledge to real-world solutions.
          </p>
        </div>
      </div>
    </section>
  );
}
