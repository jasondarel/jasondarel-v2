'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Recognizable international translations for rapid skimming:
 * Skims rapidly across ~8 languages in ~1.2 seconds, then settles back on "About Me".
 */
const SKIM_LANGUAGES = [
  'About Me',
  'À Propos',
  'Sobre Mí',
  'Über Mich',
  'Tentang Saya',
  'Chi Sono',
  'Over Mij',
  'Sobre Mim',
  'Om Mig',
  'About Me',
];

// ── Sensitivity & Timing Controls ───────────────────────────────────────────
const SCROLL_DISTANCE = 1150; // Balanced scroll distance
const SCRUB_SMOOTHING = 0.8;  // Snappy scrub response

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  const [displayText, setDisplayText] = useState('About Me');
  const isAnimatingRef = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── Rapid Skim Effect (skims through languages once in ~1.2s total) ───────
  const triggerRapidSkim = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;

    if (intervalRef.current) clearInterval(intervalRef.current);

    let step = 0;
    const totalSteps = SKIM_LANGUAGES.length;
    const stepDuration = 130; // 130ms * 9 steps = ~1.17s total

    intervalRef.current = setInterval(() => {
      step++;
      if (step < totalSteps) {
        setDisplayText(SKIM_LANGUAGES[step]);
      } else {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        setDisplayText('About Me');
        if (textRef.current) {
          gsap.set(textRef.current, { y: 0, scale: 1, opacity: 1 });
        }
        isAnimatingRef.current = false;
      }
    }, stepDuration);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ── GSAP ScrollTrigger intro & pinning timeline ───────────────────────────
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
          onEnter: () => {
            triggerRapidSkim();
          },
          onLeaveBack: () => {
            // When user scrolls back up to the top, reset so it replays on next scroll down
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            isAnimatingRef.current = false;
            setDisplayText('About Me');
          },
        },
      });

      // 1. Initial state: heading hidden at center with scale 1.8
      // 2. Fast fade in at center
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
          duration: 0.5,
          ease: 'power1.out',
        }
      )
        // 3. Shrink and glide to the left column
        .to(heading, {
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power2.inOut',
        })
        // 4. Paragraph fades in and slides into place on the right side
        .fromTo(
          bio,
          {
            opacity: 0,
            x: 30,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: 'power2.out',
          },
          '-=0.25'
        )
        // 5. Balanced reading pause hold before switching
        .to({}, { duration: 0.65 });

      // ── 6. Anti-Overscroll Barrier at Fully-Loaded Cap Position ────────────
      // When scrolling down from above, scroll momentum is capped at the fully
      // loaded state (tl.scrollTrigger.end). The user must initiate a separate,
      // subsequent scroll gesture to release into the next section.
      let capArmed = true;
      let idleTimer: ReturnType<typeof setTimeout> | null = null;

      const handleWheelOrTouch = () => {
        const lenis = (window as any).__lenis;
        if (!lenis || !tl.scrollTrigger) return;
        const capPos = tl.scrollTrigger.end;

        // If user is resting at the cap position, disarm so the new scroll gesture can proceed
        if (Math.abs(lenis.scroll - capPos) <= 4 || lenis.scroll > capPos) {
          capArmed = false;
        }

        if (idleTimer) clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
          if (!lenis || !tl.scrollTrigger) return;
          if (Math.abs(lenis.scroll - capPos) <= 4 || lenis.scroll > capPos) {
            capArmed = false;
          }
        }, 150);
      };

      const handleLenisScroll = () => {
        const lenis = (window as any).__lenis;
        if (!lenis || !tl.scrollTrigger) return;

        const capPos = tl.scrollTrigger.end;

        // If user scrolls back up above the cap, re-arm the barrier
        if (lenis.scroll < capPos - 50) {
          capArmed = true;
        }

        // Clamp momentum at the fully loaded cap position
        if (capArmed && lenis.targetScroll > capPos && lenis.scroll <= capPos) {
          lenis.targetScroll = capPos;
        }
      };

      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.on('scroll', handleLenisScroll);
      }
      window.addEventListener('wheel', handleWheelOrTouch, { passive: true });
      window.addEventListener('touchmove', handleWheelOrTouch, { passive: true });

      return () => {
        if (idleTimer) clearTimeout(idleTimer);
        if (lenis) {
          lenis.off('scroll', handleLenisScroll);
        }
        window.removeEventListener('wheel', handleWheelOrTouch);
        window.removeEventListener('touchmove', handleWheelOrTouch);
      };
    }, section);

    return () => ctx.revert();
  }, [triggerRapidSkim]);

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
          className="md:col-span-5 flex flex-col items-center md:items-start justify-center"
        >
          <div
            ref={headingRef}
            className="flex flex-col items-center md:items-start will-change-transform select-none opacity-0"
          >
            {/* Dynamic Rapid Skimming Headline */}
            <h2
              className={`font-black leading-none tracking-tighter min-h-[1.15em] flex items-center cursor-default ${
                displayText === 'Tentang Saya'
                  ? 'text-3xl sm:text-5xl md:text-5xl lg:text-6xl'
                  : 'text-4xl sm:text-6xl md:text-7xl lg:text-8xl'
              }`}
              style={{ color: 'var(--accent)' }}
              onMouseEnter={triggerRapidSkim}
              title="About Me"
            >
              <span ref={textRef} className="inline-block whitespace-nowrap">
                {displayText}
              </span>
            </h2>
          </div>
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
