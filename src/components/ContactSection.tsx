'use client';

import React, { useState, useEffect, useRef, forwardRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUp, ArrowUpRight, Copy, Check, Mail, MapPin, Globe } from 'lucide-react';
import Button from '@/components/Button';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom SVG Social Icons adhering to currentColor and design tokens
 */
type SocialIconProps = React.SVGProps<SVGSVGElement>;

function InstagramIcon({ className = 'w-5 h-5', ...props }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2" />
    </svg>
  );
}

function GithubIcon({ className = 'w-5 h-5', ...props }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className = 'w-5 h-5', ...props }: SocialIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    name: 'Instagram',
    handle: '@jasondarel',
    url: 'https://instagram.com/jdarel_',
    icon: InstagramIcon,
  },
  {
    name: 'GitHub',
    handle: 'jasondarel',
    url: 'https://github.com/jasondarel',
    icon: GithubIcon,
  },
  {
    name: 'LinkedIn',
    handle: 'Jason Darel',
    url: 'https://www.linkedin.com/in/jason-darel-528b13247',
    icon: LinkedinIcon,
  },
];

export interface ContactSectionProps {
  isOverlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(
  ({ isOverlay = false, className = '', style, id = 'contact' }, ref) => {
    const [copied, setCopied] = useState(false);
    const emailAddress = 'jdarel21@gmail.com';
    const localRef = useRef<HTMLElement | null>(null);

    const setRefs = (node: HTMLElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') {
        ref(node as unknown as HTMLDivElement);
      } else if (ref && typeof ref === 'object') {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node as unknown as HTMLDivElement;
      }
    };

    useEffect(() => {
      // In desktop overlay mode, ProjectsSection handles animation via pinned timeline
      if (isOverlay) return;

      const section = localRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add('(max-width: 767.98px)', () => {
        const contactElements = section.querySelectorAll('[data-contact-animate]');
        if (contactElements.length === 0) return;

        gsap.fromTo(
          contactElements,
          {
            opacity: 0,
            y: 35,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      return () => mm.revert();
    }, [isOverlay]);

    const handleCopyEmail = async () => {
      try {
        await navigator.clipboard.writeText(emailAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handleScrollToTop = () => {
      if (typeof window === 'undefined') return;
      window.dispatchEvent(new CustomEvent('fade-to-top'));
    };

    return (
      <section
        ref={setRefs}
        id={id}
        className={`relative flex flex-col justify-between overflow-hidden select-none ${
          isOverlay
            ? 'w-full h-full px-6 sm:px-12 md:px-16 py-8 md:py-12'
            : 'w-full min-h-screen min-h-[100dvh] border-t px-6 sm:px-12 md:px-16 py-8 sm:py-12 md:py-16'
        } ${className}`}
        style={{
          background: isOverlay ? 'transparent' : 'var(--surface-0)',
          borderColor: isOverlay ? 'transparent' : 'var(--border)',
          ...style,
        }}
        aria-label="Contact section"
      >
        {/* ── Main Content Container ───────────────────────────────────────────── */}
        <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col md:my-auto">

          {/* ── Left-Aligned Display Headline (Inspired by Reference) ─────────── */}
          <div data-contact-animate className="flex flex-col items-start mb-4 sm:mb-6 md:mb-8">
            <h2
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tighter cursor-default text-left"
              style={{ color: 'var(--accent)' }}
            >
              <span className="block">Let&apos;s Work</span>
              <span className="block">Together</span>
            </h2>
          </div>

          {/* ── Social Icons Row (Directly below headline) ─────────────────────── */}
          <div data-contact-animate className="flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3 mb-6 sm:mb-8 md:mb-12">
            {SOCIAL_LINKS.map((social) => {
              const Icon = social.icon;
              return (
                <Button
                  key={social.name}
                  href={social.url}
                  leftIcon={<Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                  rightIcon={true}
                  aria-label={`Visit Jason's ${social.name}`}
                >
                  {social.name}
                </Button>
              );
            })}

            {/* Quick Copy Email Action Pill */}
            <Button
              onClick={handleCopyEmail}
              leftIcon={
                copied ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: 'var(--accent)' }} />
                ) : (
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                )
              }
              rightIcon={
                copied ? undefined : (
                  <Copy className="w-3.5 h-3.5" style={{ color: 'var(--muted)' }} />
                )
              }
              aria-label="Copy email address"
            >
              {copied ? (
                <span style={{ color: 'var(--accent)' }}>Copied Email!</span>
              ) : (
                'Copy Email'
              )}
            </Button>
          </div>

          {/* ── 3 Reference Columns: LOCATION / CONTACT / SOCIAL ───────────────── */}
          <div
            data-contact-animate
            className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 md:gap-8 pt-6 sm:pt-8 md:pt-10 border-t"
            style={{ borderColor: 'var(--border)' }}
          >
            {/* Column 1: LOCATION */}
            <div className="md:col-span-4 flex flex-col items-start">
              <span
                className="text-xs font-mono uppercase tracking-[0.28em] mb-2 md:mb-3 flex items-center gap-1.5"
                style={{ color: 'var(--muted)' }}
              >
                <MapPin className="w-3.5 h-3.5" />
                Location
              </span>
              <p
                className="text-lg sm:text-xl font-medium tracking-tight mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                Tangerang, Indonesia
              </p>
              <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                UTC+7 (WIB) • Remote &amp; Worldwide
              </p>
            </div>

            {/* Column 2: CONTACT */}
            <div className="md:col-span-4 flex flex-col items-start">
              <span
                className="text-xs font-mono uppercase tracking-[0.28em] mb-2 md:mb-3 flex items-center gap-1.5"
                style={{ color: 'var(--muted)' }}
              >
                <Mail className="w-3.5 h-3.5" />
                Email
              </span>
              <a
                href={`mailto:${emailAddress}`}
                className="group inline-flex items-center gap-1.5 text-lg sm:text-xl font-medium tracking-tight mb-1 transition-colors hover:opacity-80"
                style={{ color: 'var(--foreground)' }}
              >
                <span>{emailAddress}</span>
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  style={{ color: 'var(--muted)' }}
                />
              </a>
              <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                Open for full-time roles &amp; select contracts
              </p>
            </div>

            {/* Column 3: SOCIAL */}
            <div className="md:col-span-4 flex flex-col items-start">
              <span
                className="text-xs font-mono uppercase tracking-[0.28em] mb-2 md:mb-3 flex items-center gap-1.5"
                style={{ color: 'var(--muted)' }}
              >
                <Globe className="w-3.5 h-3.5" />
                Social
              </span>
              <div className="flex flex-col space-y-1.5 md:space-y-2">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-base font-normal tracking-tight transition-colors hover:opacity-80"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <Icon className="w-4 h-4 transition-transform group-hover:scale-110" style={{ color: 'var(--muted)' }} />
                      <span className="group-hover:underline underline-offset-4">{social.name}</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 opacity-60 transition-transform group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: 'var(--muted)' }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ──────────────────────────────────────────────────────── */}
        <div
          data-contact-animate
          className="hidden md:flex relative z-10 max-w-6xl w-full mx-auto mt-10 sm:mt-14 pt-6 border-t flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
            <p className="text-sm font-semibold tracking-tight flex items-center justify-center sm:justify-start gap-2" style={{ color: 'var(--accent)' }}>
              <span>Jason Darel</span>
              <span className="font-mono text-xs font-normal opacity-40">•</span>
              <span className="font-mono text-xs font-normal" style={{ color: 'var(--muted)' }}>
                Full-Stack Developer
              </span>
            </p>
          </div>

          {/* Back To Top Bouncing Widget */}
          <div className="flex-shrink-0 flex items-center justify-center">
            <button
              type="button"
              onClick={handleScrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="animate-bounce-y group flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface-1 text-accent hover:bg-surface-2 hover:border-accent hover:[animation-play-state:paused] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer shadow-xs"
            >
              <ArrowUp className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <div className="flex-1 w-full sm:w-auto text-center sm:text-right">
            <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
              Portfolio &amp; Archive 2026
            </p>
          </div>
        </div>

        {/* ── Subtle Background Typography Watermark (Reference: "roku") ─────── */}
        <div
          data-contact-animate
          className="absolute -bottom-2 md:-bottom-6 right-2 sm:right-8 pointer-events-none select-none overflow-hidden leading-none z-0"
          aria-hidden="true"
        >
          <span
            className="text-[20vw] sm:text-[18vw] font-black tracking-tighter inline-block select-none"
            style={{
              color: 'var(--border)',
              opacity: 0.35,
            }}
          >
            Jason
          </span>
        </div>
      </section>
    );
  });

ContactSection.displayName = 'ContactSection';
export default ContactSection;
