'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS_DATA } from '@/constants/projects';
import ProjectCard from '@/components/ProjectCard';

gsap.registerPlugin(ScrollTrigger);

// ── Target Coordinates for 4-Column Grid (relative to stage center) ─────────
// Cards 200×280px. Section = 710px. Eliminates empty vertical space.
// Row1 center y=-146, Row2 center y=+146. Clean 12px row gap, perfectly snug.
const GRID_COORDINATES = [
  { x: -330, y: -146, rotation: 0 }, // Card 0: Row 1, Col 0
  { x: -110, y: -146, rotation: 0 }, // Card 1: Row 1, Col 1
  { x: 110,  y: -146, rotation: 0 }, // Card 2: Row 1, Col 2
  { x: 330,  y: -146, rotation: 0 }, // Card 3: Row 1, Col 3
  { x: -110, y: 146,  rotation: 0 }, // Card 4: Row 2, Col 1 (centered)
  { x: 110,  y: 146,  rotation: 0 }, // Card 5: Row 2, Col 2 (centered)
];

// ── Fan Coordinates (centered in the stage) ─────────────────────────────
const FAN_COORDINATES = [
  { x: -150, y: 0,   rotation: -20 },
  { x: -90,  y: -10, rotation: -12 },
  { x: -30,  y: -15, rotation: -4  },
  { x: 30,   y: -15, rotation: 4   },
  { x: 90,   y: -10, rotation: 12  },
  { x: 150,  y: 0,   rotation: 20  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [isDealt, setIsDealt] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const isDesktop = window.innerWidth >= 768;

      if (isDesktop) {
        // ── 1. Initial State: Deck Stack in center below header ─────────────
        cardRefs.current.forEach((el, index) => {
          if (!el) return;
          gsap.set(el, {
            x: index * 0.8,
            y: 20 + index * -0.6,
            rotation: (index - 2.5) * 0.4,
            scale: 1,
            opacity: index === 0 ? 1 : 0.85,
            zIndex: 10 + index,
          });
        });

        // ── 2. Pinned Scroll Timeline ───────────────────────────────────────
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=2400',
            pin: true,
            anticipatePin: 1,
            scrub: 1,
            onUpdate: (self) => {
              // Only enable hover flip once cards have completed the spread into the grid
              const dealt = self.progress >= 0.78;
              setIsDealt((prev) => (prev !== dealt ? dealt : prev));
            },
          },
        });

        // ── Phase 1 (0 -> 0.35): Cards Emerge & Fan Out into Hand ───────────
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
            },
            0 // All fan at once
          );
        });

        // Small hold/settle in fan pose before spreading
        tl.to({}, { duration: 0.4 });

        // ── Phase 2 (0.45 -> 1.0): Spread from Fan into 4-Column Grid ───────
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
            },
            1.6 + index * 0.08 // slight stagger for organic dealing feel
          );
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t overflow-hidden md:h-[710px] px-6 sm:px-10 md:px-14 flex flex-col justify-between select-none"
      style={{
        background: 'var(--background)',
        borderColor: 'var(--border)',
      }}
      aria-label="Projects Section"
    >
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col justify-between pt-5 pb-4">
        {/* ── Section Header ───────────────────────────────────────────────── */}
        <div
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b flex-shrink-0"
          style={{ borderColor: 'var(--border)' }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-mono uppercase tracking-[0.25em]"
                style={{ color: 'var(--muted)' }}
              >
                04 / Archive
              </span>
            </div>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-[0.95]"
              style={{ color: 'var(--accent)' }}
            >
              Projects<span className="opacity-40">.</span>
            </h2>
          </div>

          <p
            className="text-xs sm:text-sm font-medium leading-relaxed max-w-md"
            style={{ color: 'var(--muted)' }}
          >
            Scroll to deal and fan the deck. Hover any card to inspect the technical architecture, live preview, and source.
          </p>
        </div>

        {/* ── Desktop Interactive Poker Stage Canvas ────────────────────────── */}
        <div
          ref={stageRef}
          className="hidden md:flex relative flex-1 items-center justify-center"
        >
          {/* Card Anchor Center — items-center places this at the true middle of the flex-1 stage */}
          <div className="relative w-0 h-0">
            {PROJECTS_DATA.map((project, index) => {
              return (
                <div
                  key={project.id}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className="absolute will-change-transform -translate-x-1/2 -translate-y-1/2"
                >
                  {/* Dedicated GPU-accelerated floating wrapper (isolated from GSAP coordinates) */}
                  <div
                    className="will-change-transform"
                    style={{
                      animation: `card-float-smooth ${4.4 + (index % 3) * 0.8}s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite alternate`,
                      animationDelay: `${index * 0.35}s`,
                    }}
                  >
                    <ProjectCard project={project} interactive={isDealt} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile Static Grid Layout (Responsive fall-back) ──────────────── */}
        <div className="md:hidden py-8 flex flex-col items-center gap-6">
          <p className="text-xs font-mono text-center mb-2" style={{ color: 'var(--muted)' }}>
            Tap any card to flip and inspect details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-lg mx-auto justify-items-center">
            {PROJECTS_DATA.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
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
    </section>
  );
}

