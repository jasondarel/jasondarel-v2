'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SKILLS_DATA, FloatingStack } from '@/constants/skills';
import { TechLogos } from '@/components/icons/TechLogos';

gsap.registerPlugin(ScrollTrigger);

function TechLogoDisplay({
  stack,
  skill,
}: {
  stack: FloatingStack;
  skill: (typeof SKILLS_DATA)[0];
}) {
  const [imgError, setImgError] = useState(false);
  const LogoComponent = TechLogos[stack.logoKey];

  if (stack.iconSrc && !imgError) {
    return (
      <Image
        src={stack.iconSrc}
        alt={stack.name}
        width={36}
        height={36}
        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 object-contain transition-transform duration-300 group-hover:scale-110"
        onError={() => setImgError(true)}
      />
    );
  }

  if (LogoComponent) {
    return (
      <LogoComponent
        size={32}
        className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-transform duration-300 group-hover:scale-110"
      />
    );
  }

  return (
    <span
      className="font-mono text-xs sm:text-sm font-bold"
      style={{ color: skill.fallbackTextColor }}
    >
      {stack.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

// ── Timing & Scrub Controls ──────────────────────────────────────────────────
const SCROLL_DISTANCE_PER_SKILL = 975;  // Pixels of scroll travel allocated per skill (3/4 of previous 1300px)
const SCRUB_SMOOTHING = 0.8;            // Snappy scrub smoothing

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStack, setActiveStack] = useState<string | null>(null);

  // Close active tooltip when clicking anywhere outside
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveStack(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const totalScrollDistance = SKILLS_DATA.length * SCROLL_DISTANCE_PER_SKILL;

      // ── Initial Clip-Path & Pointer-Events Setup ──────────────────────────
      // Skill 0 (Frontend): fully open (inset 0 0 0 0) and interactive
      // Skill 1 (Backend) & Skill 2 (Tools): clipped at bottom (inset 100% 0 0 0) and non-interactive
      gsap.set(skillRefs.current[0], { clipPath: 'inset(0% 0% 0% 0%)', pointerEvents: 'auto' });
      gsap.set(skillRefs.current[1], { clipPath: 'inset(100% 0% 0% 0%)', pointerEvents: 'none' });
      gsap.set(skillRefs.current[2], { clipPath: 'inset(100% 0% 0% 0%)', pointerEvents: 'none' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalScrollDistance}`,
          pin: true,
          scrub: SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Dismiss active tooltip when scrolling through stages
            if (Math.abs(self.getVelocity()) > 100) {
              setActiveStack(null);
            }
          },
        },
      });

      tl
        // 1. Hold Frontend
        .to({}, { duration: 0.5 })

        // 2. Flood Backend up from bottom (inset 100% -> 0%) with reversed dark scheme
        .set(skillRefs.current[1], { pointerEvents: 'auto' })
        .to(skillRefs.current[1], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'none',
        })
        .set(skillRefs.current[0], { pointerEvents: 'none' })

        // 3. Hold Backend
        .to({}, { duration: 0.6 })

        // 4. Flood Tools up from bottom (inset 100% -> 0%) reverting to normal light scheme
        .set(skillRefs.current[2], { pointerEvents: 'auto' })
        .to(skillRefs.current[2], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'none',
        })
        .set(skillRefs.current[1], { pointerEvents: 'none' })

        // 5. Hold Tools before unpinning
        .to({}, { duration: 0.5 });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden border-b"
      style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
      aria-label="Skills Flooding Section"
    >
      {SKILLS_DATA.map((skill, index) => (
        <div
          key={skill.id}
          ref={(el) => {
            skillRefs.current[index] = el;
          }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden select-none will-change-[clip-path]"
          style={{
            background: skill.bg,
            zIndex: index + 10,
          }}
        >
          {/* ── Giant Center Headline ────────────────────────────────────────── */}
          <h2
            className="relative z-10 text-7xl sm:text-9xl md:text-[14vw] font-black tracking-tighter leading-none pointer-events-none text-center transition-colors"
            style={{ color: skill.titleColor }}
          >
            {skill.title}
          </h2>

          {/* ── Scattered Floating Stack Boxes (Logo-Only & Enlarged) ───────── */}
          <div className="absolute inset-0 pointer-events-none">
            {skill.stacks.map((stack, sIdx) => {
              const isActive = activeStack === stack.name;
              return (
                <div
                  key={sIdx}
                  className={`absolute pointer-events-auto ${stack.animationClass}`}
                  style={{
                    ...stack.pos,
                    animationDelay: stack.delay,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveStack((prev) => (prev === stack.name ? null : stack.name));
                    }}
                    className={`group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl border shadow-sm transition-all duration-300 cursor-pointer backdrop-blur-md ${
                      isActive
                        ? 'scale-125 shadow-xl ring-2 ring-white/30'
                        : 'hover:scale-125 hover:shadow-xl active:scale-95'
                    }`}
                    style={{
                      background: skill.boxBg,
                      borderColor: isActive ? skill.boxTextColor : skill.boxBorder,
                      color: skill.boxTextColor,
                    }}
                    title={stack.name}
                    aria-label={stack.name}
                    aria-pressed={isActive}
                  >
                    <TechLogoDisplay stack={stack} skill={skill} />

                    {/* Subtle Hover / Tap Tooltip Label */}
                    <div
                      className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg border text-[11px] font-mono whitespace-nowrap transition-all duration-200 pointer-events-none shadow-md z-30 transform ${
                        isActive
                          ? 'opacity-100 translate-y-0 scale-100'
                          : 'opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0'
                      }`}
                      style={{
                        background: skill.boxBg,
                        borderColor: skill.boxBorder,
                        color: skill.boxTextColor,
                      }}
                    >
                      {stack.name}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
