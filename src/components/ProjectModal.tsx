'use client';

import React, { useEffect, useState, useCallback, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X, Layers, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { ProjectItem } from '@/constants/projects';
import { TechLogos } from '@/components/icons/TechLogos';
import Button from '@/components/Button';

interface ProjectModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const emptySubscribe = () => () => { };

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [active, setActive] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxActive, setLightboxActive] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Preserve displayed project so content doesn't abruptly unmount during exit animation
  const [displayedProject, setDisplayedProject] = useState<ProjectItem | null>(project);
  if (project && project.id !== displayedProject?.id) {
    setDisplayedProject(project);
    setCurrentImageIndex(0);
    setFailedImages({});
    setDragOffset(0);
    setIsDragging(false);
    setIsLightboxOpen(false);
    setLightboxActive(false);
    setIsHoveringImage(false);
  }

  // Compute available project images from the displayed project
  const projectImages = displayedProject?.images && displayedProject.images.length > 0
    ? displayedProject.images
    : displayedProject?.imgSrc
      ? [displayedProject.imgSrc]
      : [];

  const totalImages = projectImages.length;

  // Handle smooth entrance animation when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => {
        setIsClosing(false);
        setActive(true);
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [isOpen]);

  // Lightbox open / close handlers
  const handleOpenLightbox = useCallback((index?: number) => {
    if (typeof index === 'number') {
      setCurrentImageIndex(index);
    }
    setIsLightboxOpen(true);
    requestAnimationFrame(() => {
      setLightboxActive(true);
    });
  }, []);

  const handleCloseLightbox = useCallback(() => {
    setLightboxActive(false);
    setTimeout(() => {
      setIsLightboxOpen(false);
    }, 250);
  }, []);

  // Request close with smooth exit animation
  const handleRequestClose = useCallback(() => {
    if (isClosing) return;
    if (isLightboxOpen) {
      handleCloseLightbox();
    }
    setIsClosing(true);
    setActive(false);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 350); // Matches CSS transition duration
  }, [isClosing, isLightboxOpen, handleCloseLightbox, onClose]);

  // Lock document scroll and pause Lenis while modal is active
  useEffect(() => {
    if (!isOpen) return;

    window.__lenis?.stop();
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
      window.__lenis?.start();
    };
  }, [isOpen]);

  // Navigation handlers for multi-image gallery
  const handlePrevImage = useCallback(() => {
    if (totalImages <= 1) return;
    setIsHoveringImage(false);
    setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  const handleNextImage = useCallback(() => {
    if (totalImages <= 1) return;
    setIsHoveringImage(false);
    setCurrentImageIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  // Touch swipe support with real-time drag tracking for gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    if (totalImages <= 1) return;
    touchStartX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || totalImages <= 1) return;
    const diff = e.touches[0].clientX - touchStartX.current;
    // Apply soft resistance at boundaries
    if ((currentImageIndex === 0 && diff > 0) || (currentImageIndex === totalImages - 1 && diff < 0)) {
      setDragOffset(diff * 0.35);
    } else {
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    setIsDragging(false);
    if (dragOffset > 45) {
      handlePrevImage();
    } else if (dragOffset < -45) {
      handleNextImage();
    }
    setDragOffset(0);
    touchStartX.current = null;
  };

  // Keyboard accessibility: Escape to close, Left/Right arrows to cycle images
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          handleCloseLightbox();
        } else {
          handleRequestClose();
        }
      } else if (e.key === 'ArrowRight' && totalImages > 1) {
        handleNextImage();
      } else if (e.key === 'ArrowLeft' && totalImages > 1) {
        handlePrevImage();
      }
    },
    [isOpen, isLightboxOpen, handleCloseLightbox, handleRequestClose, totalImages, handleNextImage, handlePrevImage]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isClient || (!isOpen && !active && !isClosing) || !displayedProject) {
    return null;
  }

  const modalContent = (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`modal-title-${displayedProject.id}`}
      aria-describedby={`modal-desc-${displayedProject.id}`}
    >
      {/* ── 1. Frosted Glass Translucent Blur Overlay ─────────────────────── */}
      <div
        onClick={handleRequestClose}
        className="absolute inset-0 transition-all duration-350 ease-out cursor-pointer"
        style={{
          opacity: active ? 1 : 0,
          background: 'rgba(70, 70, 66, 0.14)',
          backdropFilter: 'blur(20px) saturate(130%)',
          WebkitBackdropFilter: 'blur(20px) saturate(130%)',
        }}
        aria-hidden="true"
      />

      {/* ── 2. Modal Dialog Container (2-Column Grid on Desktop) ─────────── */}
      <div
        ref={modalContentRef}
        data-lenis-prevent="true"
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl h-[88vh] md:h-auto max-h-[92vh] md:max-h-[88vh] flex flex-col md:flex-row rounded-2xl md:rounded-3xl border shadow-2xl overflow-hidden"
        style={{
          background: 'var(--surface-0)',
          borderColor: 'var(--border)',
          transform: active ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(18px)',
          opacity: active ? 1 : 0,
          transition: 'transform 350ms cubic-bezier(0.16, 1, 0.3, 1), opacity 350ms ease-out',
        }}
      >
        {/* Floating Top-Right Close Button */}
        <button
          type="button"
          onClick={handleRequestClose}
          aria-label="Close project modal"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md"
          style={{
            borderColor: 'var(--border)',
            background: 'color-mix(in srgb, var(--surface-0) 88%, transparent)',
            color: 'var(--accent)',
          }}
        >
          <X className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </button>

        {/* ═══════════════════════════════════════════════════════════════════
            LEFT COLUMN (~2/3 width): Content, Narrative, Tech Stack, & Actions
           ═══════════════════════════════════════════════════════════════════ */}
        <div
          data-lenis-prevent="true"
          className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden order-2 md:order-1 min-w-0"
        >
          {/* Scrollable Content Body */}
          <div
            data-lenis-prevent="true"
            className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-8 py-5 sm:py-7 space-y-5 sm:space-y-6 select-text modal-scrollbar overscroll-contain"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--border) transparent',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-y',
              overscrollBehaviorY: 'contain',
            }}
          >
            {/* Top Meta Bar */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap pr-10">
              <span
                className="text-xs sm:text-sm font-mono font-bold px-2 py-0.5 rounded border"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--surface-1)',
                  color: 'var(--accent)',
                }}
              >
                {displayedProject.cardIndex}
              </span>
              <span
                className="text-[11px] sm:text-xs font-mono uppercase tracking-wider font-semibold"
                style={{ color: 'var(--muted)' }}
              >
                {displayedProject.category}
              </span>
              {displayedProject.role && (
                <span
                  className="hidden sm:inline-flex items-center text-[10.5px] font-mono px-2 py-0.5 rounded border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface-2)',
                    color: 'var(--foreground)',
                  }}
                >
                  {displayedProject.role}
                </span>
              )}
              {displayedProject.year && (
                <span
                  className="hidden sm:inline-flex items-center text-[10.5px] font-mono px-2 py-0.5 rounded border"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface-2)',
                    color: 'var(--muted)',
                  }}
                >
                  {displayedProject.year}
                </span>
              )}
            </div>

            {/* Title & Detailed Narrative */}
            <div className="space-y-3">
              <h3
                id={`modal-title-${displayedProject.id}`}
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight"
                style={{ color: 'var(--accent)' }}
              >
                {displayedProject.title}
              </h3>

              <p
                id={`modal-desc-${displayedProject.id}`}
                className="text-sm sm:text-base leading-relaxed"
                style={{ color: 'var(--foreground)' }}
              >
                {displayedProject.longDescription || displayedProject.description}
              </p>
            </div>

            {/* Technologies & Tech Stack Badges */}
            <div className="space-y-2.5">
              <h4
                className="text-xs font-mono font-bold uppercase tracking-wider"
                style={{ color: 'var(--muted)' }}
              >
                Tech Stack
              </h4>

              <div className="flex flex-wrap items-center gap-2">
                {displayedProject.techLogos.map((tech, idx) => {
                  const LogoComponent = TechLogos[tech.logoKey];
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
                      style={{
                        background: 'var(--surface-1)',
                        borderColor: 'var(--border)',
                      }}
                    >
                      {LogoComponent ? (
                        <LogoComponent size={15} className="w-3.5 h-3.5 object-contain" />
                      ) : (
                        <span className="text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                          {tech.name.slice(0, 2)}
                        </span>
                      )}
                      <span className="font-medium" style={{ color: 'var(--accent)' }}>
                        {tech.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Unified Footer Actions Bar */}
          <div
            className="flex items-center justify-between px-5 sm:px-8 py-4 border-t flex-shrink-0"
            style={{
              borderColor: 'var(--border)',
              background: 'var(--surface-1)',
            }}
          >
            <div className="text-[11px] font-mono hidden sm:block" style={{ color: 'var(--muted)' }}>
              Press <kbd className="px-1.5 py-0.5 rounded border text-[10px]" style={{ borderColor: 'var(--border)', background: 'var(--surface-0)' }}>Esc</kbd> to close
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap ml-auto">
              {displayedProject.links?.github && (
                <Button
                  size="sm"
                  variant="default"
                  rightIcon={true}
                  href={displayedProject.links.github}
                  aria-label={`View ${displayedProject.title} repository`}
                >
                  GitHub
                </Button>
              )}

              {displayedProject.links?.figma && (
                <Button
                  size="sm"
                  variant="default"
                  rightIcon={true}
                  href={displayedProject.links.figma}
                  aria-label={`View ${displayedProject.title} Figma prototype`}
                >
                  Prototype
                </Button>
              )}

              {displayedProject.links?.live && (
                <Button
                  size="sm"
                  variant="default"
                  rightIcon={true}
                  href={displayedProject.links.live}
                  aria-label={`Visit ${displayedProject.title} live deployment`}
                >
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════
            RIGHT COLUMN (~1/3 width): Multi-Image Interactive Gallery
           ═══════════════════════════════════════════════════════════════════ */}
        <div
          className="relative w-full md:w-5/12 lg:w-4/12 xl:w-1/3 h-[220px] sm:h-[270px] md:h-auto md:min-h-full border-b md:border-b-0 md:border-l flex flex-col justify-between overflow-hidden order-1 md:order-2 group select-none flex-shrink-0"
          style={{
            background: 'var(--surface-1)',
            borderColor: 'var(--border)',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main Visual Carousel Area */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {projectImages.length > 0 ? (
              <div
                className="flex w-full h-full will-change-transform select-none"
                style={{
                  transform: isDragging
                    ? `translateX(calc(-${currentImageIndex * 100}% + ${dragOffset}px))`
                    : `translateX(-${currentImageIndex * 100}%)`,
                  transition: isDragging
                    ? 'none'
                    : 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {projectImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative w-full h-full min-w-full flex-shrink-0 flex items-center justify-center p-3 sm:p-6 md:p-8"
                  >
                    <div
                      className="relative w-full h-full flex items-center justify-center cursor-pointer"
                      onMouseEnter={() => {
                        if (currentImageIndex === idx) setIsHoveringImage(true);
                      }}
                      onMouseLeave={() => {
                        if (currentImageIndex === idx) setIsHoveringImage(false);
                      }}
                      style={{
                        transform: currentImageIndex === idx ? 'scale(1)' : 'scale(0.92)',
                        opacity: currentImageIndex === idx ? 1 : 0.35,
                        transition: 'transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      {!failedImages[img] ? (
                        <>
                          <Image
                            src={img}
                            alt={`${displayedProject.title} preview ${idx + 1}`}
                            fill
                            priority={idx === 0}
                            sizes="(max-width: 768px) 100vw, 450px"
                            onError={() => setFailedImages((prev) => ({ ...prev, [img]: true }))}
                            className="object-contain p-2 sm:p-3 select-none pointer-events-none transition-transform duration-700 ease-out"
                            style={{
                              transform: currentImageIndex === idx && isHoveringImage ? 'scale(1.025)' : 'scale(1)',
                              transition: 'transform 300ms ease-out',
                            }}
                          />
                          {/* Center Zoom / View Icon — always in DOM so backdrop-filter compositor layer is pre-promoted */}
                          {currentImageIndex === idx && (
                            <button
                              type="button"
                              onClick={() => handleOpenLightbox(idx)}
                              aria-label="View enlarged image"
                              className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 bg-transparent border-0 outline-none"
                              style={{
                                opacity: isHoveringImage ? 1 : 0,
                                pointerEvents: isHoveringImage ? 'auto' : 'none',
                                willChange: 'opacity',
                                transition: 'opacity 180ms ease-out',
                              }}
                            >
                              <div
                                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border flex items-center justify-center shadow-lg"
                                style={{
                                  transform: isHoveringImage ? 'scale(1)' : 'scale(0.85)',
                                  backgroundColor: 'color-mix(in srgb, var(--surface-0) 35%, transparent)',
                                  borderColor: 'color-mix(in srgb, var(--border) 50%, transparent)',
                                  color: 'var(--accent)',
                                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                                  backdropFilter: 'blur(40px) saturate(180%)',
                                  willChange: 'transform',
                                  transition: 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
                                }}
                              >
                                <ZoomIn className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                              </div>
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                          <div
                            className="w-12 h-12 rounded-full border flex items-center justify-center"
                            style={{
                              borderColor: 'var(--border)',
                              background: 'var(--surface-0)',
                              color: 'var(--accent)',
                            }}
                          >
                            <Layers className="w-6 h-6" />
                          </div>
                          <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent)' }}>
                            {displayedProject.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div
                  className="w-12 h-12 rounded-full border flex items-center justify-center"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--surface-0)',
                    color: 'var(--accent)',
                  }}
                >
                  <Layers className="w-6 h-6" />
                </div>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent)' }}>
                  {displayedProject.title}
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                  {displayedProject.category}
                </span>
              </div>
            )}

            {/* Top-Left Image Counter Badge (Visible if multiple images exist) */}
            {totalImages > 1 && (
              <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 z-20 pointer-events-none">
                <span
                  className="px-2.5 py-1 rounded-md border text-[11px] font-mono tracking-wider backdrop-blur-md font-bold tabular-nums"
                  style={{
                    background: 'color-mix(in srgb, var(--surface-0) 88%, transparent)',
                    borderColor: 'var(--border)',
                    color: 'var(--accent)',
                  }}
                >
                  {String(currentImageIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Left & Right Arrow Buttons (Visible when multiple images exist) */}
            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  aria-label="Previous project image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100 shadow-sm"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'color-mix(in srgb, var(--surface-0) 88%, transparent)',
                    color: 'var(--accent)',
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNextImage}
                  aria-label="Next project image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md opacity-80 group-hover:opacity-100 shadow-sm"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'color-mix(in srgb, var(--surface-0) 88%, transparent)',
                    color: 'var(--accent)',
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Bottom Controls Bar (Indicator Dots) */}
            {totalImages > 1 && (
              <div
                className="absolute bottom-3 inset-x-0 z-20 flex items-center justify-center gap-1.5 pointer-events-auto"
              >
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-md"
                  style={{
                    background: 'color-mix(in srgb, var(--surface-0) 85%, transparent)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {projectImages.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentImageIndex(idx)}
                      className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                      style={{
                        width: currentImageIndex === idx ? '18px' : '5px',
                        background: currentImageIndex === idx ? 'var(--accent)' : 'var(--muted)',
                      }}
                      aria-label={`Jump to image ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3. Fullscreen Lightbox / Enlarged Image View ───────────────────── */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-6 md:p-10 select-none cursor-zoom-out"
          onClick={handleCloseLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged image view"
          style={{
            opacity: lightboxActive ? 1 : 0,
            background: 'rgba(50, 50, 48, 0.65)',
            backdropFilter: 'blur(28px) saturate(130%)',
            WebkitBackdropFilter: 'blur(28px) saturate(130%)',
            transition: 'opacity 250ms ease-out',
          }}
        >
          {/* Top Bar inside Lightbox */}
          <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-8 z-30 flex items-center justify-between pointer-events-none">
            {/* Title & Index Pill */}
            <div
              className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border backdrop-blur-md pointer-events-auto shadow-md"
              style={{
                background: 'color-mix(in srgb, var(--surface-0) 90%, transparent)',
                borderColor: 'var(--border)',
                color: 'var(--accent)',
              }}
            >
              <span className="text-xs font-mono font-bold">
                {displayedProject.title}
              </span>
              {totalImages > 1 && (
                <>
                  <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>•</span>
                  <span className="text-xs font-mono font-bold tabular-nums">
                    {String(currentImageIndex + 1).padStart(2, '0')} / {String(totalImages).padStart(2, '0')}
                  </span>
                </>
              )}
            </div>

            {/* Close Lightbox Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCloseLightbox();
              }}
              aria-label="Close enlarged view"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-md pointer-events-auto shadow-md"
              style={{
                borderColor: 'var(--border)',
                background: 'color-mix(in srgb, var(--surface-0) 90%, transparent)',
                color: 'var(--accent)',
              }}
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Large Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-[94vw] max-h-[85vh] w-[90vw] md:w-[80vw] lg:w-[72vw] h-[82vh] flex items-center justify-center cursor-default"
            style={{
              transform: lightboxActive ? 'scale(1)' : 'scale(0.94)',
              opacity: lightboxActive ? 1 : 0,
              transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), opacity 250ms ease-out',
            }}
          >
            {projectImages[currentImageIndex] && (
              <Image
                key={projectImages[currentImageIndex]}
                src={projectImages[currentImageIndex]}
                alt={`${displayedProject.title} enlarged view ${currentImageIndex + 1}`}
                fill
                priority
                sizes="95vw"
                className="object-contain select-none drop-shadow-2xl"
              />
            )}
          </div>

          {/* Navigation Arrows inside Lightbox (if multiple images) */}
          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                aria-label="Previous enlarged image"
                className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md shadow-lg"
                style={{
                  borderColor: 'var(--border)',
                  background: 'color-mix(in srgb, var(--surface-0) 90%, transparent)',
                  color: 'var(--accent)',
                }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                aria-label="Next enlarged image"
                className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full border flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md shadow-lg"
                style={{
                  borderColor: 'var(--border)',
                  background: 'color-mix(in srgb, var(--surface-0) 90%, transparent)',
                  color: 'var(--accent)',
                }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Bottom Dots inside Lightbox (if multiple images) */}
          {totalImages > 1 && (
            <div
              className="absolute bottom-5 inset-x-0 z-30 flex items-center justify-center gap-1.5 pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border backdrop-blur-md shadow-lg"
                style={{
                  background: 'color-mix(in srgb, var(--surface-0) 90%, transparent)',
                  borderColor: 'var(--border)',
                }}
              >
                {projectImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    className="h-1.5 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      width: currentImageIndex === idx ? '22px' : '6px',
                      background: currentImageIndex === idx ? 'var(--accent)' : 'var(--muted)',
                    }}
                    aria-label={`Jump to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
}
