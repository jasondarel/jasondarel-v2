'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ProjectItem } from '@/constants/projects';
import { TechLogos } from '@/components/icons/TechLogos';
import Button from '@/components/Button';

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
  style?: React.CSSProperties;
  forceFlipped?: boolean;
  interactive?: boolean;
}

function ProjectImagePreview({
  type,
  title,
  imgSrc,
}: {
  type: ProjectItem['imageType'];
  title: string;
  imgSrc?: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="relative w-full h-[140px] sm:h-[150px] md:h-[76px] rounded-lg overflow-hidden border flex flex-col justify-between p-2 md:p-1.5 select-none mb-2 md:mb-1.5"
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--border)',
      }}
    >
      {imgSrc && !imgError ? (
        <Image
          src={imgSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 200px"
          loading="lazy"
          onError={() => setImgError(true)}
          className="object-cover"
        />
      ) : (
        <>
          {/* Top Browser / Canvas Bar */}
          <div className="flex items-center justify-between pb-0.5 border-b border-[var(--border)]">
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--border)' }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--border)' }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--border)' }} />
            </div>
            <span className="text-[9px] font-mono font-semibold tracking-wider uppercase opacity-75" style={{ color: 'var(--accent)' }}>
              {type === 'figma'
                ? 'FIGMA'
                : type === 'ai'
                ? 'AI SCANNER'
                : type === 'food'
                ? 'PERN APP'
                : type === 'booth'
                ? 'EVENT WEB'
                : type === 'code'
                ? 'EDTECH WEB'
                : type === 'store'
                ? 'COMMERCE'
                : type === 'pomodoro'
                ? 'POMODORO'
                : 'WEB APP'}
            </span>
          </div>

          {/* Abstract Minimal Graphic Based on Type */}
          <div className="my-auto flex flex-col items-center justify-center text-center py-0.5">
            {type === 'booth' && (
              <div className="flex items-center gap-1 text-[9px] font-mono">
                <span className="px-2 py-0.5 rounded border font-semibold" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                  Hall A · Booth 14
                </span>
                <span className="px-1.5 py-0.5 rounded font-bold text-emerald-600" style={{ background: 'var(--surface-0)' }}>
                  BOOKED
                </span>
              </div>
            )}

            {type === 'food' && (
              <div className="w-full max-w-[155px] px-2 py-0.5 rounded border flex items-center justify-between text-[9px] font-mono" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
                <span className="font-bold" style={{ color: 'var(--accent)' }}>FastEats Core</span>
                <span className="font-semibold text-emerald-600">Online</span>
              </div>
            )}

            {type === 'code' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <span className="font-bold text-emerald-600">&gt;</span>
                <span className="truncate max-w-[130px]">run(code_wave)</span>
              </div>
            )}

            {type === 'ai' && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="truncate max-w-[130px]">Nutrition Scanner</span>
              </div>
            )}

            {type === 'store' && (
              <div className="flex items-center gap-1.5 text-[9px] font-mono">
                <span className="px-1.5 py-0.5 rounded border font-semibold" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
                  C# .NET
                </span>
                <span style={{ color: 'var(--muted)' }}>⇄</span>
                <span className="px-1.5 py-0.5 rounded border font-semibold" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  Catalogue
                </span>
              </div>
            )}

            {type === 'pomodoro' && (
              <div className="w-full max-w-[155px] space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span style={{ color: 'var(--accent)' }}>25:00 FOCUS</span>
                  <span className="text-emerald-600 font-bold">ACTIVE</span>
                </div>
                <div className="h-1.5 rounded-full w-full overflow-hidden" style={{ background: 'var(--surface-0)' }}>
                  <div className="h-full w-3/4 rounded-full" style={{ background: 'var(--accent)' }} />
                </div>
              </div>
            )}

            {type === 'figma' && (
              <div className="flex items-center gap-1.5">
                <div className="px-1.5 py-0.5 rounded border border-dashed text-[9px] font-mono" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                  Prototype
                </div>
                <div className="px-1.5 py-0.5 rounded border text-[9px] font-mono font-bold" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
                  Auto-Layout
                </div>
              </div>
            )}
          </div>

          {/* Bottom Title Watermark */}
          <div className="flex items-center justify-between text-[8.5px] font-mono" style={{ color: 'var(--muted)' }}>
            <span className="truncate max-w-[125px]">{title}</span>
            <span>2026</span>
          </div>
        </>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  className = '',
  style = {},
  forceFlipped = false,
  interactive = true,
}: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(forceFlipped);
  const cardRef = useRef<HTMLDivElement>(null);

  // Reset flip state when card becomes uninteractable (official React pattern without cascading effect renders)
  const [prevInteractive, setPrevInteractive] = useState(interactive);
  if (prevInteractive !== interactive) {
    setPrevInteractive(interactive);
    if (!interactive) {
      setIsFlipped(false);
    }
  }

  // When flipped, track global pointer movement to reliably unflip whenever cursor leaves the card
  useEffect(() => {
    if (!isFlipped) return;

    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside) {
        setIsFlipped(false);
      }
    };

    const handleWindowLeave = () => {
      setIsFlipped(false);
    };

    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    document.addEventListener('mouseleave', handleWindowLeave);
    window.addEventListener('blur', handleWindowLeave);

    return () => {
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      document.removeEventListener('mouseleave', handleWindowLeave);
      window.removeEventListener('blur', handleWindowLeave);
    };
  }, [isFlipped]);

  // If interactive is disabled, keep card back visible
  const activeFlipped = interactive && isFlipped;

  return (
    <div
      ref={cardRef}
      className={`group/card relative w-full md:w-[200px] h-[380px] md:h-[280px] select-none [perspective:1200px] ${
        interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'
      } ${className}`}
      style={style}
      onMouseEnter={() => interactive && setIsFlipped(true)}
      onPointerEnter={() => interactive && setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onPointerLeave={() => setIsFlipped(false)}
      onClick={() => interactive && setIsFlipped((prev) => !prev)}
      role="region"
      aria-label={`Project card for ${project.title}`}
    >
      {/* ── 3D Flip Container ──────────────────────────────────────────────── */}
      <div
        className="relative w-full h-full rounded-2xl transition-transform duration-700 [transform-style:preserve-3d]"
        style={{
          transform: activeFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* ═════════════════════════════════════════════════════════════════════
            1. MINIMAL PLAYING CARD BACK (Authentic 1:1.4 Aspect Ratio)
           ═════════════════════════════════════════════════════════════════════ */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-4 md:p-3.5 flex flex-col justify-between overflow-hidden border [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${
            activeFlipped ? 'pointer-events-none' : 'pointer-events-auto'
          }`}
          style={{
            background: 'var(--surface-0)',
            borderColor: 'var(--border)',
          }}
        >
          {/* Inner Decorative Border Frame */}
          <div
            className="absolute inset-2 rounded-xl border pointer-events-none"
            style={{ borderColor: 'var(--border)' }}
          />
          <div
            className="absolute inset-3 rounded-lg border border-dashed opacity-40 pointer-events-none"
            style={{ borderColor: 'var(--accent)' }}
          />

          {/* Top Corner Metadata */}
          <div className="relative z-10 flex items-center justify-between px-1 pt-0.5">
            <span
              className="text-[11px] font-mono font-bold tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              {project.cardIndex}
            </span>
          </div>

          {/* Center Luxury Playing Card Pattern & Monogram */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto">
            <div className="relative w-24 h-24 md:w-[88px] md:h-[88px] flex items-center justify-center">
              {/* Background Geometric Lattice SVG */}
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full opacity-35"
                style={{ color: 'var(--accent)' }}
              >
                <rect x="15" y="15" width="70" height="70" fill="none" stroke="currentColor" strokeWidth="0.75" transform="rotate(45 50 50)" />
                <rect x="25" y="25" width="50" height="50" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(45 50 50)" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" />
                <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
              </svg>

              {/* Center Monogram Seal */}
              <div
                className="absolute z-10 w-11 h-11 md:w-10 md:h-10 rounded-full border flex items-center justify-center"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <span
                  className="text-base md:text-sm font-mono font-black tracking-wider pl-0.5"
                  style={{ color: 'var(--accent)' }}
                >
                  JD
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Corner Metadata */}
          <div className="relative z-10 flex items-center justify-end px-1 pb-0.5">
            <span
              className="text-[9.5px] font-mono tracking-widest uppercase opacity-80"
              style={{ color: 'var(--muted)' }}
            >
              2026
            </span>
          </div>
        </div>

        {/* ═════════════════════════════════════════════════════════════════════
            2. POKER CARD FRONT (Revealed on 180deg flip)
           ═════════════════════════════════════════════════════════════════════ */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl p-3.5 md:p-3 flex flex-col justify-between overflow-hidden border [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] ${
            activeFlipped ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{
            background: 'var(--surface-0)',
            borderColor: 'var(--border)',
          }}
        >
          <div>
            {/* Top Bar: Card metadata */}
            <div className="flex items-center justify-between pb-1.5 md:pb-1 mb-1.5 md:mb-1 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[11px] md:text-[10px] font-mono tracking-wider uppercase font-semibold truncate max-w-[180px] md:max-w-[130px]" style={{ color: 'var(--muted)' }}>
                {project.category}
              </span>
              <span className="text-xs md:text-[10.5px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                {project.cardIndex}
              </span>
            </div>

            {/* Image Preview Graphic */}
            <ProjectImagePreview type={project.imageType} title={project.title} imgSrc={project.imgSrc} />

            {/* Title */}
            <h3
              className="text-sm md:text-[13px] font-bold tracking-tight leading-snug mb-1 md:mb-0.5 line-clamp-1"
              style={{ color: 'var(--accent)' }}
              title={project.title}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="text-xs md:text-[10.5px] font-normal leading-relaxed md:leading-snug mb-2 md:mb-1.5 line-clamp-2 md:line-clamp-none"
              style={{ color: 'var(--foreground)' }}
            >
              {project.description}
            </p>
          </div>

          <div>
            {/* Tech Badges */}
            <div className="flex flex-wrap items-center gap-1.5 md:gap-1 mb-2 md:mb-1.5">
              {project.techLogos.slice(0, 4).map((tech, idx) => {
                const LogoComponent = TechLogos[tech.logoKey];
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 md:gap-1 px-2 py-0.5 md:px-1.5 md:py-0.5 rounded border text-[10px] md:text-[9px] font-mono"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                    }}
                    title={tech.name}
                  >
                    {LogoComponent ? (
                      <LogoComponent size={12} className="w-3 h-3 md:w-2.5 md:h-2.5 object-contain" />
                    ) : (
                      <span className="text-[9px] md:text-[8px] font-bold" style={{ color: 'var(--accent)' }}>
                        {tech.name.slice(0, 2)}
                      </span>
                    )}
                    <span className="font-medium" style={{ color: 'var(--foreground)' }}>
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Links */}
            <div
              className="relative z-20 pointer-events-auto flex items-center justify-end pt-1 border-t text-[9.5px] font-mono"
              style={{ borderColor: 'var(--border)' }}
            >
              {project.links?.live ? (
                <Button
                  size="xs"
                  variant="accent"
                  rightIcon={true}
                  href={project.links.live}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Visit project"
                  className="font-mono text-[9.5px]"
                >
                  Visit
                </Button>
              ) : project.links?.figma ? (
                <Button
                  size="xs"
                  variant="accent"
                  rightIcon={true}
                  href={project.links.figma}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View Prototype"
                  className="font-mono text-[9.5px]"
                >
                  Proto
                </Button>
              ) : project.links?.github ? (
                <Button
                  size="xs"
                  variant="accent"
                  rightIcon={true}
                  href={project.links.github}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View Repository"
                  className="font-mono text-[9.5px]"
                >
                  Repo
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProjectCard);
