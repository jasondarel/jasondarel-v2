'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA } from '@/constants/projects';
import ProjectCard from '@/components/ProjectCard';

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
  { x: -110, y: 146, rotation: 0 }, // Card 5: Row 2, Col 1 (StudyGo)
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
// 1. Total scroll distance in pixels that the Projects section stays pinned.
//    Increase this number to require MORE scrolling before moving to Contact.
//    Decrease this number to require LESS scrolling.
const TOTAL_PINNED_SCROLL = 3000;

// 2. Timeline timing for dealing vs. stationary hold:
//    Cards take 3.69s to deal into place.
//    HOLD_DURATION is the stationary showcase buffer where cards stay still and interactive.
const DEAL_END_TIME = 1.6 + 7 * 0.07 + 1.6; // 3.69s
const HOLD_DURATION = 3.0;
// Automatically compute when cards finish dealing in timeline progress (e.g. ~0.345):
const DEALT_THRESHOLD = DEAL_END_TIME / (DEAL_END_TIME + HOLD_DURATION);

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDealt, setIsDealt] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop) {
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

        // ── 2. Pinned Scroll Timeline ───────────────────────────────────────
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
            onUpdate: (self) => {
              // Enable hover flip once cards have completed the spread into the grid
              const dealt = self.progress >= DEALT_THRESHOLD;
              setIsDealt((prev) => (prev !== dealt ? dealt : prev));
            },
          },
        });

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
        // Buffer keeping the grid firmly pinned & interactive before unpinning to Contact.
        tl.to({}, { duration: HOLD_DURATION }, DEAL_END_TIME);
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      aria-label="Projects Section"
    >
      {/* ── 1. Section Header (Normal Scroll Flow - Scrolls out of POV) ───── */}
      <div
        className="relative border-t px-6 sm:px-10 md:px-14 py-20 md:py-28 min-h-[50vh] flex flex-col justify-center select-none"
        style={{
          background: 'var(--background)',
          borderColor: 'var(--border)',
        }}
        aria-label="Projects Header"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b flex-shrink-0"
            style={{ borderColor: 'var(--border)' }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs sm:text-sm font-mono uppercase tracking-[0.25em]"
                  style={{ color: 'var(--muted)' }}
                >
                  04 / Archive
                </span>
              </div>

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
              Scroll to deal and fan the deck. Hover any card to inspect the details.
            </p>
          </div>
        </div>
      </div>

      {/* ── 2. Desktop Interactive Poker Stage Canvas (Pins full-screen with ONLY the cards) ── */}
      <section
        ref={stageRef}
        className="hidden md:flex relative h-screen w-full overflow-hidden items-center justify-center select-none"
        style={{
          background: 'var(--background)',
        }}
        aria-label="Projects Card Deck Stage"
      >
        {/* Card Anchor Center — items-center places this at the true middle of the full-screen viewport */}
        <div className="relative w-0 h-0 scale-[0.85] lg:scale-100 xl:scale-105 transition-transform duration-300">
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
                  <ProjectCard project={project} interactive={isDealt} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Far Right Scroll Indicator */}
        <div
          className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 pointer-events-none z-20"
          aria-label="Scroll indicator"
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
          <span
            className="text-[9.5px] font-mono tracking-[0.25em] uppercase opacity-60 [writing-mode:vertical-rl]"
            style={{ color: 'var(--muted)' }}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ── 3. Mobile Static Grid Layout (Responsive fall-back) ───────────── */}
      <div
        className="md:hidden px-6 py-12 flex flex-col items-center gap-6"
        style={{ background: 'var(--background)' }}
      >
        <p className="text-sm font-mono text-center mb-2" style={{ color: 'var(--muted)' }}>
          Tap any card to flip and inspect details
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mx-auto justify-items-center">
          {PROJECTS_DATA.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

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

