'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProjectItem, PROJECTS_DATA } from '@/constants/projects';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import ContactSection from '@/components/ContactSection';
import { attachEdgeBarrier } from '@/lib/antiOverscroll';

gsap.registerPlugin(ScrollTrigger);

// ── Target Coordinates for 4×2 Grid (relative to stage center) ───────────
// 8 Cards 200×280px arranged in 4 columns × 2 rows. Snug 12px row gap.
const GRID_COORDINATES = [
  // Row 1 (y = -146)
  { x: -330, y: -146, rotation: 0 }, // Card 0: Row 1, Col 0 (FastEats)
  { x: -110, y: -146, rotation: 0 }, // Card 1: Row 1, Col 1 (NourishScan)
  { x: 110, y: -146, rotation: 0 }, // Card 2: Row 1, Col 2 (BoothEase)
  { x: 330, y: -146, rotation: 0 }, // Card 3: Row 1, Col 3 (CodeWave)
  // Row 2 (y = 146)
  { x: -330, y: 146, rotation: 0 }, // Card 4: Row 2, Col 0 (GymMe)
  { x: -110, y: 146, rotation: 0 }, // Card 5: Row 2, Col 1 (Fiomodoro)
  { x: 110, y: 146, rotation: 0 }, // Card 6: Row 2, Col 2 (Calm)
  { x: 330, y: 146, rotation: 0 }, // Card 7: Row 2, Col 3 (StaySeeker)
];

// ── Fan Coordinates for 8 Cards (centered in the stage) ───────────────────
const FAN_COORDINATES = [
  { x: -175, y: 4, rotation: -21 },
  { x: -125, y: -5, rotation: -15 },
  { x: -75, y: -12, rotation: -9 },
  { x: -25, y: -16, rotation: -3 },
  { x: 25, y: -16, rotation: 3 },
  { x: 75, y: -12, rotation: 9 },
  { x: 125, y: -5, rotation: 15 },
  { x: 175, y: 4, rotation: 21 },
];

// ── Scroll & Timing Controls ──────────────────────────────────────────────
// Total scroll distance in pixels that the Projects section stays pinned.
const TOTAL_PINNED_SCROLL = 4600;
// Aligned mobile scroll hold distance (px) before continuing to Contact section
const MOBILE_PINNED_HOLD = 1000;

// Timeline Keyframe Milestones (in seconds):
// 0.0s -> 1.2s: Phase 1 - Fan out
// 1.2s -> 1.6s: Settle in fan
// 1.6s -> 3.69s: Phase 2 - Spread into 4x2 grid
const DEAL_END_TIME = 1.6 + 7 * 0.07 + 1.6; // 3.69s

// 3.69s -> 5.79s: Phase 3 - Stationary cards showcase hold (~2.1s)
const BLUR_START_TIME = DEAL_END_TIME + 2.1; // 5.79s

// 5.79s -> 7.39s: Phase 4 - Full-page blur transition (~1.6s)
const BLUR_DURATION = 1.6;

// Cards stay interactable after blur starts (~0.4s into blur transition)
const CARDS_UNINTERACTABLE_TIME = BLUR_START_TIME + 0.4; // 6.19s

// 6.89s -> 9.19s: Phase 5 - Contact elements fade up (~2.3s total with stagger)
const CONTACT_START_TIME = BLUR_START_TIME + 1.1; // 6.89s (overlaps smoothly with blur)
const CONTACT_ACTIVE_TIME = CONTACT_START_TIME + 1.2; // 8.09s (pointer-events enabled)

// 9.2s -> 11.5s: Phase 6 - Rock-solid hold for Contact section (~2.3s buffer)
const TOTAL_TIMELINE_DURATION = 11.5;

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cardsAnchorRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const blurOverlayRef = useRef<HTMLDivElement>(null);
  const contactOverlayRef = useRef<HTMLDivElement>(null);
  const contactSectionRef = useRef<HTMLDivElement>(null);
  const mobileBlurOverlayRef = useRef<HTMLDivElement>(null);
  const mobileContactOverlayRef = useRef<HTMLDivElement>(null);
  const mobileContactSectionRef = useRef<HTMLDivElement>(null);
  const [isDealt, setIsDealt] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const handleOpenModal = (project: ProjectItem) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  // Mobile horizontal snap carousel state & refs
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const mobileStageRef = useRef<HTMLElement>(null);
  const mobileCarouselRef = useRef<HTMLDivElement>(null);
  const mobileScrollRaf = useRef<number | null>(null);

  const handleMobileScroll = () => {
    if (mobileScrollRaf.current !== null) return;
    mobileScrollRaf.current = requestAnimationFrame(() => {
      mobileScrollRaf.current = null;
      const container = mobileCarouselRef.current;
      if (!container) return;
      const containerCenter = container.scrollLeft + container.clientWidth / 2;
      const children = Array.from(container.children) as HTMLElement[];
      let closestIdx = 0;
      let minDistance = Infinity;

      children.forEach((child, idx) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(containerCenter - childCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      const clamped = Math.max(0, Math.min(closestIdx, PROJECTS_DATA.length - 1));
      setMobileActiveIndex((prev) => (prev !== clamped ? clamped : prev));
    });
  };

  const scrollToMobileCard = (index: number) => {
    const container = mobileCarouselRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(index, PROJECTS_DATA.length - 1));
    const targetChild = container.children[clamped] as HTMLElement | null;
    if (targetChild) {
      targetChild.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
      setMobileActiveIndex(clamped);
    }
  };


  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const mm = gsap.matchMedia(container);

    // ── Desktop Viewports (>= 1024px): Pinned Poker Deal Stage ───────────
    mm.add('(min-width: 1024px)', () => {
      // ── 1. Initial State: Deck Stack in center of full-screen stage ─────
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          x: index * 0.8,
          y: index * -0.6,
          rotation: (index - 3.5) * 0.4,
          scale: 1,
          opacity: index === 0 ? 1 : 0.85,
          zIndex: 10 + index,
          force3D: true,
        });
      });

      // Initial state for full-page blur overlay
      if (blurOverlayRef.current) {
        gsap.set(blurOverlayRef.current, {
          opacity: 0,
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        });
      }

      // Initial state for contact animatable elements
      const contactElements = contactSectionRef.current
        ? contactSectionRef.current.querySelectorAll('[data-contact-animate]')
        : [];
      if (contactElements.length > 0) {
        gsap.set(contactElements, {
          opacity: 0,
          y: 35,
        });
      }

      // ── 2. Pinned Scroll Timeline ───────────────────────────────────────
      const updateInteractiveState = (currentTime: number) => {
        // 1. Enable hover flip while stationary in grid, until AFTER blur starts
        const dealt = currentTime >= DEAL_END_TIME && currentTime < CARDS_UNINTERACTABLE_TIME;
        setIsDealt((prev) => (prev !== dealt ? dealt : prev));

        // 2. Enable contact section pointer-events once contact has faded in
        const contactActive = currentTime >= CONTACT_ACTIVE_TIME;
        if (contactOverlayRef.current) {
          contactOverlayRef.current.style.pointerEvents = contactActive ? 'auto' : 'none';
        }
      };

      // Scrub: 0.15 provides instant sync with Lenis smooth scroll without double-lag
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: `+=${TOTAL_PINNED_SCROLL}`,
          pin: true,
          anticipatePin: 1,
          scrub: 0.15,
          fastScrollEnd: true,
          preventOverlaps: true,
          onUpdate: () => updateInteractiveState(tl.time()),
        },
        onUpdate: () => updateInteractiveState(tl.time()),
      });

      updateInteractiveState(tl.time());

      // ── Phase 1: Cards Emerge & Fan Out into Hand ────────────────────────
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const fan = FAN_COORDINATES[index];

        tl.to(
          el,
          {
            x: fan.x,
            y: fan.y,
            rotation: fan.rotation,
            opacity: 1,
            scale: 1,
            ease: 'power1.out',
            duration: 1.2,
            force3D: true,
          },
          0 // All fan at once
        );
      });

      // Small hold/settle in fan pose before spreading
      tl.to({}, { duration: 0.4 }, 1.2);

      // ── Phase 2: Spread from Fan into 4-Column Grid ──────────────────────
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const grid = GRID_COORDINATES[index];

        tl.to(
          el,
          {
            x: grid.x,
            y: grid.y,
            rotation: 0,
            ease: 'power2.inOut',
            duration: 1.6,
            force3D: true,
          },
          1.6 + index * 0.07 // slight stagger for organic dealing feel
        );
      });

      // ── Phase 3: Pinned Stationary Showcase Hold ─────────────────────────
      tl.to({}, { duration: 2.1 }, DEAL_END_TIME);

      // ── Phase 4: Full-Page Blur Transition ───────────────────────────────
      // 1. Full-screen backdrop overlay blurs the entire visible viewport
      if (blurOverlayRef.current) {
        tl.to(
          blurOverlayRef.current,
          {
            opacity: 1,
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            duration: BLUR_DURATION,
            ease: 'power2.inOut',
          },
          BLUR_START_TIME
        );
      }

      // 2. The background cards underneath blur and dim for depth
      if (cardsAnchorRef.current) {
        tl.to(
          cardsAnchorRef.current,
          {
            filter: 'blur(14px)',
            opacity: 0.28,
            scale: 0.96,
            duration: BLUR_DURATION,
            ease: 'power2.inOut',
          },
          BLUR_START_TIME
        );
      }

      // 3. Scroll indicator fades out cleanly
      if (scrollIndicatorRef.current) {
        tl.to(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: 'power1.out',
          },
          BLUR_START_TIME
        );
      }

      // ── Phase 5: Contact Contents Fade-Up Animation ──────────────────────
      if (contactElements.length > 0) {
        tl.to(
          contactElements,
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            stagger: 0.18,
            ease: 'power2.out',
          },
          CONTACT_START_TIME
        );
      }

      // ── Phase 6: Pinned Contact Section Showcase Hold ─────────────────────
      tl.to({}, { duration: 2.3 }, TOTAL_TIMELINE_DURATION - 2.3);

      // Anti-overscroll barrier at boundaries
      const cleanupBarrier = tl.scrollTrigger ? attachEdgeBarrier(tl.scrollTrigger) : undefined;
      return () => cleanupBarrier?.();
    });

    // ── Tablet & Mobile Viewports (< 1024px): Swipeable Carousel & Scroll Delay ──
    mm.add('(max-width: 1023.98px)', () => {
      const mobileStage = mobileStageRef.current;
      if (!mobileStage) return;

      // Initial state for mobile blur overlay
      if (mobileBlurOverlayRef.current) {
        gsap.set(mobileBlurOverlayRef.current, {
          opacity: 0,
          backdropFilter: 'blur(0px)',
          WebkitBackdropFilter: 'blur(0px)',
        });
      }

      // Initial state for mobile contact elements
      const mobileContactElements = mobileContactSectionRef.current
        ? mobileContactSectionRef.current.querySelectorAll('[data-contact-animate]')
        : [];
      if (mobileContactElements.length > 0) {
        gsap.set(mobileContactElements, { opacity: 0, y: 35 });
      }

      // Pointer-events: off until contact fades in
      if (mobileContactOverlayRef.current) {
        mobileContactOverlayRef.current.style.pointerEvents = 'none';
      }

      const mobileTl = gsap.timeline({
        scrollTrigger: {
          trigger: mobileStage,
          start: 'top top',
          end: `+=${MOBILE_PINNED_HOLD}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.15,
          onUpdate: (self) => {
            // Enable contact pointer-events once past 85% through the pinned scroll
            if (mobileContactOverlayRef.current) {
              mobileContactOverlayRef.current.style.pointerEvents =
                self.progress >= 0.85 ? 'auto' : 'none';
            }
          },
        },
      });

      // Blur + dim the carousel stage (starts at 30% progress)
      if (mobileBlurOverlayRef.current) {
        mobileTl.fromTo(
          mobileBlurOverlayRef.current,
          { opacity: 0, backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' },
          { opacity: 1, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', ease: 'power2.inOut' },
          0.3
        );
      }

      // Fade-up contact elements (starts at 50% progress, staggered)
      if (mobileContactElements.length > 0) {
        mobileTl.to(
          mobileContactElements,
          { opacity: 1, y: 0, stagger: 0.12, ease: 'power2.out' },
          0.5
        );
      }

      // Anti-overscroll barrier at boundaries
      const cleanupBarrier = mobileTl.scrollTrigger ? attachEdgeBarrier(mobileTl.scrollTrigger) : undefined;
      return () => cleanupBarrier?.();
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      aria-label="Projects Section"
    >
      {/* ── 1. Section Header (Normal Scroll Flow - Desktop viewports only) ── */}
      <div
        className="hidden lg:flex relative border-t px-6 sm:px-10 md:px-14 py-8 sm:py-12 md:py-24 md:min-h-[45vh] flex-col justify-center select-none"
        style={{
          background: 'var(--background)',
          borderColor: 'var(--border)',
        }}
        aria-label="Projects Header"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 pb-5 sm:pb-6 border-b flex-shrink-0"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <h2
                className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.95]"
                style={{ color: 'var(--accent)' }}
              >
                Projects<span className="opacity-40">.</span>
              </h2>
            </div>

            <p
              className="text-sm sm:text-base font-medium leading-relaxed max-w-lg"
              style={{ color: 'var(--muted)' }}
            >
              <span className="hidden lg:inline">
                Scroll to deal and fan the deck. Click any card to inspect full details.
              </span>
              <span className="lg:hidden">
                Swipe to browse the deck. Tap any card to inspect full details.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Desktop Interactive Poker Stage Canvas (Pins full-screen with cards & overlay) ── */}
      <section
        ref={stageRef}
        className="hidden lg:flex relative h-screen w-full overflow-hidden items-center justify-center select-none"
        style={{
          background: 'var(--background)',
        }}
        aria-label="Projects Card Deck Stage"
      >
        {/* Card Anchor Center — items-center places this at the true middle of the full-screen viewport */}
        <div
          ref={cardsAnchorRef}
          className="relative z-10 w-0 h-0 scale-[0.85] lg:scale-100 xl:scale-105 transition-transform duration-300 will-change-[filter,opacity]"
        >
          {PROJECTS_DATA.map((project, index) => {
            return (
              <div
                key={project.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className="absolute"
              >
                {/* Dedicated GPU-accelerated floating wrapper (only active when cards are stationary in grid) */}
                <div
                  style={{
                    animation: isDealt
                      ? `card-float-smooth ${4.4 + (index % 4) * 0.7}s cubic-bezier(0.45, 0.05, 0.55, 0.95) ${index * 0.25}s infinite alternate`
                      : 'none',
                  }}
                >
                  <ProjectCard
                    project={project}
                    interactive={isDealt}
                    onOpenModal={handleOpenModal}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Far Right Scroll Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 pointer-events-none z-20 transition-opacity duration-300"
          aria-label="Scroll indicator"
        >
          <div
            className="w-6 h-10 rounded-full border-2 flex justify-center pt-2 opacity-60"
            style={{ borderColor: 'var(--muted)' }}
          >
            <span
              className="w-1.5 h-2.5 rounded-full animate-scroll-wheel"
              style={{ background: 'var(--muted)' }}
            />
          </div>
          <span
            className="text-[9.5px] font-mono tracking-[0.25em] uppercase opacity-60 [writing-mode:vertical-rl]"
            style={{ color: 'var(--muted)' }}
          >
            Scroll
          </span>
        </div>

        {/* ── 3. Full-Page Frosted Glass Blur Overlay ───────────────────────── */}
        <div
          ref={blurOverlayRef}
          className="absolute inset-0 w-full h-full z-25 pointer-events-none"
          style={{
            opacity: 0,
            background: 'color-mix(in srgb, var(--surface-0) 82%, transparent)',
          }}
          aria-hidden="true"
        />

        {/* ── 4. Contact Section Overlapping Canvas ─────────────────────────── */}
        <div
          ref={contactOverlayRef}
          className="absolute inset-0 w-full h-full z-30 pointer-events-none"
        >
          <ContactSection isOverlay ref={contactSectionRef} />
        </div>
      </section>

      {/* ── 5. Mobile & Tablet Full-Screen Showcase Stage with Scroll Delay ── */}
      <section
        ref={mobileStageRef}
        className="lg:hidden relative w-full h-screen h-[100dvh] overflow-hidden flex flex-col justify-between select-none py-6 px-4 sm:px-6 md:px-10"
        style={{ background: 'var(--background)' }}
        aria-label="Mobile & Tablet Projects Showcase"
      >
        {/* ── Top Bar: Title, Subtitle, Counter ────────────────────────────── */}
        <div
          className="flex items-center justify-between w-full max-w-lg md:max-w-4xl mx-auto pb-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter leading-none"
              style={{ color: 'var(--accent)' }}
            >
              Projects<span className="opacity-40">.</span>
            </h2>
            <p className="text-[11px] md:text-xs font-mono mt-1" style={{ color: 'var(--muted)' }}>
              Swipe to browse • Tap to inspect
            </p>
          </div>

          {/* Numerical Counter Pill */}
          <div
            className="flex items-center gap-1.5 font-mono text-xs sm:text-sm md:text-base px-2.5 py-1 rounded-md border"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface-1)',
            }}
          >
            <span className="font-bold tracking-wider" style={{ color: 'var(--accent)' }}>
              {String(mobileActiveIndex + 1).padStart(2, '0')}
            </span>
            <span className="opacity-40 text-xs" style={{ color: 'var(--muted)' }}>/</span>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {String(PROJECTS_DATA.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* ── Middle: Horizontal Swipeable Snap Carousel ──────────────────── */}
        <div
          ref={mobileCarouselRef}
          onScroll={handleMobileScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory px-[calc(50%-135px)] sm:px-[calc(50%-145px)] md:px-[calc(50%-160px)] py-4 my-auto touch-pan-x"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {PROJECTS_DATA.map((project) => (
            <div
              key={project.id}
              className="snap-center flex-shrink-0"
            >
              <ProjectCard project={project} onOpenModal={handleOpenModal} forceFlipped={true} />
            </div>
          ))}
        </div>

        {/* ── Bottom Controls: Centered Dash Progress Indicators ────────── */}
        <div
          className="flex items-center justify-center w-full max-w-lg md:max-w-4xl mx-auto pt-3 border-t flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Dash Progress Indicators */}
          <div className="flex items-center gap-1.5 py-1">
            {PROJECTS_DATA.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToMobileCard(idx)}
                aria-label={`Jump to project card ${idx + 1}`}
                className="h-1 rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: mobileActiveIndex === idx ? '22px' : '6px',
                  background: mobileActiveIndex === idx ? 'var(--accent)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>
        {/* ── 6. Mobile Frosted Glass Blur Overlay ─────────────────────── */}
        <div
          ref={mobileBlurOverlayRef}
          className="absolute inset-0 w-full h-full z-25 pointer-events-none"
          style={{
            opacity: 0,
            background: 'color-mix(in srgb, var(--surface-0) 82%, transparent)',
          }}
          aria-hidden="true"
        />

        {/* ── 7. Mobile Contact Section Overlay ────────────────────────── */}
        <div
          ref={mobileContactOverlayRef}
          className="absolute inset-0 w-full h-full z-30 pointer-events-none"
        >
          <ContactSection isOverlay ref={mobileContactSectionRef} />
        </div>
      </section>

      {/* ── 7. Project Full Details Modal ─────────────────────────────── */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={handleCloseModal}
      />

      {/* Hardware-Accelerated Floating Levitation CSS */}
      <style jsx global>{`
        @keyframes card-float-smooth {
          0% {
            transform: translate3d(0, 0px, 0);
          }
          100% {
            transform: translate3d(0, -7px, 0);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}

