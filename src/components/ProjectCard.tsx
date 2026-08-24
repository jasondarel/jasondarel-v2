'use client';

import React, { useState } from 'react';
import { ProjectItem } from '@/constants/projects';
import { TechLogos } from '@/components/icons/TechLogos';
import { ArrowUpRight, RotateCw } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  className?: string;
  style?: React.CSSProperties;
  forceFlipped?: boolean;
  interactive?: boolean;
}

function ProjectImagePreview({ type, title }: { type: ProjectItem['imageType']; title: string }) {
  return (
    <div
      className="relative w-full h-[80px] rounded-lg overflow-hidden border flex flex-col justify-between p-1.5 select-none mb-1.5"
      style={{
        background: 'var(--surface-2)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Top Browser / Canvas Bar */}
      <div className="flex items-center justify-between pb-0.5 border-b border-[var(--border)]">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--border)' }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--border)' }} />
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--border)' }} />
        </div>
        <span className="text-[7.5px] font-mono tracking-wider uppercase opacity-60" style={{ color: 'var(--accent)' }}>
          {type === 'figma' ? 'FIGMA' : type === 'ai-chat' ? 'AI GATEWAY' : 'WEB APP'}
        </span>
      </div>

      {/* Abstract Minimal Graphic Based on Type */}
      <div className="my-auto flex flex-col items-center justify-center text-center py-0.5">
        {type === 'ai-chat' && (
          <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border text-[8px] font-mono" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="truncate max-w-[120px]">1,100+ Records</span>
          </div>
        )}

        {type === 'figma' && (
          <div className="flex items-center gap-1.5">
            <div className="px-1.5 py-0.5 rounded border border-dashed text-[7.5px] font-mono" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              Canvas
            </div>
            <div className="px-1.5 py-0.5 rounded border text-[7.5px] font-mono font-bold" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              80+ Tokens
            </div>
          </div>
        )}

        {type === 'cms' && (
          <div className="w-full max-w-[140px] space-y-0.5">
            <div className="flex items-center justify-between text-[7.5px] font-mono">
              <span style={{ color: 'var(--accent)' }}>EN · ID · JA</span>
              <span className="text-emerald-600 font-bold">SYNCED</span>
            </div>
            <div className="h-1 rounded-full w-full" style={{ background: 'var(--surface-0)' }} />
          </div>
        )}

        {type === 'transactions' && (
          <div className="w-full max-w-[140px] px-1.5 py-0.5 rounded border flex items-center justify-between" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}>
            <span className="text-[7.5px] font-mono font-bold" style={{ color: 'var(--accent)' }}>&lt; 50ms SSR</span>
            <span className="text-[7.5px] font-mono font-bold px-1 rounded" style={{ background: 'var(--surface-2)', color: 'var(--accent)' }}>
              -99.6%
            </span>
          </div>
        )}

        {type === 'foundry' && (
          <div className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 rounded text-[7.5px] font-mono font-bold" style={{ background: 'var(--accent)', color: 'var(--surface-0)' }}>
              60 FPS
            </span>
            <span className="px-1.5 py-0.5 rounded text-[7.5px] font-mono border" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              Kinetic Engine
            </span>
          </div>
        )}

        {type === 'erp' && (
          <div className="flex items-center gap-1 text-[7.5px] font-mono">
            <span className="px-1.5 py-0.5 rounded border font-semibold" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
              PERN
            </span>
            <span style={{ color: 'var(--muted)' }}>⇄</span>
            <span className="px-1.5 py-0.5 rounded border font-semibold" style={{ background: 'var(--surface-0)', borderColor: 'var(--border)', color: 'var(--accent)' }}>
              .NET
            </span>
          </div>
        )}
      </div>

      {/* Bottom Title Watermark */}
      <div className="flex items-center justify-between text-[7.5px] font-mono" style={{ color: 'var(--muted)' }}>
        <span className="truncate max-w-[110px]">{title}</span>
        <span>2026</span>
      </div>
    </div>
  );
}

export default function ProjectCard({
  project,
  className = '',
  style = {},
  forceFlipped = false,
  interactive = true,
}: ProjectCardProps) {
  const [isFlipped, setIsFlipped] = useState(forceFlipped);

  // If interactive is disabled, keep card back visible
  const activeFlipped = interactive && isFlipped;

  return (
    <div
      className={`group/card relative w-[190px] h-[266px] select-none [perspective:1200px] ${
        interactive ? 'cursor-pointer' : 'cursor-default pointer-events-none'
      } ${className}`}
      style={style}
      onMouseEnter={() => interactive && setIsFlipped(true)}
      onMouseLeave={() => interactive && setIsFlipped(false)}
      onClick={() => interactive && setIsFlipped(!isFlipped)}
      role="region"
      aria-label={`Project card for ${project.title}`}
    >
      {/* ── 3D Flip Container ──────────────────────────────────────────────── */}
      <div
        className="relative w-full h-full rounded-xl transition-transform duration-700 [transform-style:preserve-3d]"
        style={{
          transform: activeFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          boxShadow: activeFlipped
            ? '0 14px 24px -6px rgba(70, 70, 66, 0.2), 0 0 0 1px var(--border)'
            : '0 6px 14px -4px rgba(70, 70, 66, 0.1), 0 0 0 1px var(--border)',
        }}
      >
        {/* ═════════════════════════════════════════════════════════════════════
            1. MINIMAL PLAYING CARD BACK (Authentic 1:1.4 Aspect Ratio)
           ═════════════════════════════════════════════════════════════════════ */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
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
          <div className="relative z-10 flex items-center justify-between px-0.5 pt-0.5">
            <span
              className="text-[9px] font-mono font-bold tracking-widest"
              style={{ color: 'var(--accent)' }}
            >
              № {project.cardIndex}
            </span>

            <span
              className="text-[8px] font-mono tracking-[0.15em] uppercase opacity-70"
              style={{ color: 'var(--muted)' }}
            >
              ARCHIVE
            </span>
          </div>

          {/* Center Luxury Playing Card Pattern & Monogram */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-auto">
            <div className="relative w-[88px] h-[88px] flex items-center justify-center">
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
                className="absolute z-10 w-10 h-10 rounded-full border flex flex-col items-center justify-center shadow-inner"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <span
                  className="text-[11px] font-mono font-black tracking-widest"
                  style={{ color: 'var(--accent)' }}
                >
                  JD
                </span>
                <span
                  className="text-[5.5px] font-mono tracking-tighter opacity-60 -mt-0.5"
                  style={{ color: 'var(--foreground)' }}
                >
                  STUDIO
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Corner Metadata & Flip Prompt */}
          <div className="relative z-10 flex items-center justify-between px-0.5 pb-0.5">
            <div className="flex items-center gap-0.5">
              <RotateCw size={9} className="opacity-60" style={{ color: 'var(--muted)' }} />
              <span
                className="text-[7px] font-mono tracking-widest uppercase font-semibold"
                style={{ color: 'var(--muted)' }}
              >
                Reveal
              </span>
            </div>

            <span
              className="text-[8px] font-mono tracking-widest uppercase opacity-70"
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
          className="absolute inset-0 w-full h-full rounded-2xl p-3 flex flex-col justify-between overflow-hidden [transform:rotateY(180deg)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          style={{
            background: 'var(--surface-0)',
            borderColor: 'var(--border)',
          }}
        >
          <div>
            {/* Top Bar: Card metadata */}
            <div className="flex items-center justify-between pb-0.5 mb-0.5 border-b" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[8px] font-mono tracking-wider uppercase font-semibold truncate max-w-[120px]" style={{ color: 'var(--muted)' }}>
                {project.category}
              </span>
              <span className="text-[8.5px] font-mono font-bold" style={{ color: 'var(--accent)' }}>
                № {project.cardIndex}
              </span>
            </div>

            {/* Image Preview Graphic */}
            <ProjectImagePreview type={project.imageType} title={project.title} />

            {/* Title */}
            <h3
              className="text-[11px] font-bold tracking-tight leading-snug mb-0.5 line-clamp-1"
              style={{ color: 'var(--accent)' }}
              title={project.title}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p
              className="text-[9px] font-normal leading-tight mb-1.5 line-clamp-2"
              style={{ color: 'var(--foreground)' }}
            >
              {project.description}
            </p>
          </div>

          <div>
            {/* Tech Badges */}
            <div className="flex flex-wrap items-center gap-0.5 mb-1">
              {project.techLogos.slice(0, 3).map((tech, idx) => {
                const LogoComponent = TechLogos[tech.logoKey];
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-0.5 px-1.5 py-0.5 rounded border text-[7.5px] font-mono"
                    style={{
                      background: 'var(--surface-1)',
                      borderColor: 'var(--border)',
                    }}
                    title={tech.name}
                  >
                    {LogoComponent ? (
                      <LogoComponent size={9} className="w-2.5 h-2.5 object-contain" />
                    ) : (
                      <span className="text-[6.5px] font-bold" style={{ color: 'var(--accent)' }}>
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
              className="flex items-center justify-between pt-0.5 border-t text-[7.5px] font-mono"
              style={{ borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-1">
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-semibold hover:underline"
                    style={{ color: 'var(--accent)' }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View Code"
                  >
                    {TechLogos.github && <TechLogos.github size={8} />}
                    <span>Code</span>
                  </a>
                )}
                {project.links?.figma && (
                  <a
                    href={project.links.figma}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 font-semibold hover:underline"
                    style={{ color: 'var(--accent)' }}
                    onClick={(e) => e.stopPropagation()}
                    aria-label="View Figma"
                  >
                    {TechLogos.figma && <TechLogos.figma size={8} />}
                    <span>Figma</span>
                  </a>
                )}
              </div>

              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded border font-bold hover:opacity-85 transition-opacity"
                  style={{
                    background: 'var(--surface-2)',
                    borderColor: 'var(--border)',
                    color: 'var(--accent)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Visit project"
                >
                  <span>Visit</span>
                  <ArrowUpRight size={7} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
