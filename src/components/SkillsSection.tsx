'use client';

import { useEffect, useRef, useState } from 'react';
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
      <img
        src={stack.iconSrc}
        alt={stack.name}
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
const SCROLL_DISTANCE_PER_SKILL = 1300; // Pixels of scroll travel allocated per skill
const SCRUB_SMOOTHING = 0.8;           // Snappy scrub smoothing

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const skillRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const totalScrollDistance = SKILLS_DATA.length * SCROLL_DISTANCE_PER_SKILL;

      // ── Initial Clip-Path Setup ───────────────────────────────────────────
      // Skill 0 (Frontend): fully open (inset 0 0 0 0)
      // Skill 1 (Backend) & Skill 2 (Tools): clipped at bottom (inset 100% 0 0 0)
      gsap.set(skillRefs.current[0], { clipPath: 'inset(0% 0% 0% 0%)' });
      gsap.set(skillRefs.current[1], { clipPath: 'inset(100% 0% 0% 0%)' });
      gsap.set(skillRefs.current[2], { clipPath: 'inset(100% 0% 0% 0%)' });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalScrollDistance}`,
          pin: true,
          scrub: SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
        },
      });

      tl
        // 1. Hold Frontend
        .to({}, { duration: 0.5 })

        // 2. Flood Backend up from bottom (inset 100% -> 0%) with reversed dark scheme
        .to(skillRefs.current[1], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'none',
        })

        // 3. Hold Backend
        .to({}, { duration: 0.6 })

        // 4. Flood Tools up from bottom (inset 100% -> 0%) reverting to normal light scheme
        .to(skillRefs.current[2], {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.4,
          ease: 'none',
        })

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
              return (
                <div
                  key={sIdx}
                  className={`absolute pointer-events-auto ${stack.animationClass}`}
                  style={{
                    ...stack.pos,
                    animationDelay: stack.delay,
                  }}
                >
                  <div
                    className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-125 cursor-pointer backdrop-blur-md"
                    style={{
                      background: skill.boxBg,
                      borderColor: skill.boxBorder,
                      color: skill.boxTextColor,
                    }}
                    title={stack.name}
                    aria-label={stack.name}
                  >
                    <TechLogoDisplay stack={stack} skill={skill} />

                    {/* Subtle Hover Tooltip Label */}
                    <div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg border text-[11px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-md z-30 transform translate-y-1 group-hover:translate-y-0"
                      style={{
                        background: skill.boxBg,
                        borderColor: skill.boxBorder,
                        color: skill.boxTextColor,
                      }}
                    >
                      {stack.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
