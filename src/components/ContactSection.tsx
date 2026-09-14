'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Copy, Check, Mail, MapPin, Globe } from 'lucide-react';
import Button from '@/components/Button';

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

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'jdarel21@gmail.com';

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

  return (
    <section
      id="contact"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden border-t px-6 sm:px-12 md:px-16 py-12 sm:py-16 select-none"
      style={{ background: 'var(--surface-0)', borderColor: 'var(--border)' }}
      aria-label="Contact section"
    >
      {/* ── Main Content Container ───────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl w-full mx-auto flex flex-col my-auto">
        {/* Subtle Top Metadata Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: 'var(--accent)' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: 'var(--accent)' }} />
            </span>
            <span
              className="text-xs font-mono uppercase tracking-[0.3em]"
              style={{ color: 'var(--muted)' }}
            >
              Get In Touch
            </span>
          </div>

          <span
            className="text-xs font-mono uppercase tracking-[0.25em]"
            style={{ color: 'var(--muted)' }}
          >
            {'// 05'}
          </span>
        </div>

        {/* ── Left-Aligned Display Headline (Inspired by Reference) ─────────── */}
        <div className="flex flex-col items-start mb-6 sm:mb-8">
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tighter cursor-default text-left"
            style={{ color: 'var(--accent)' }}
          >
            <span className="block">Let&apos;s Work</span>
            <span className="block">Together</span>
          </h2>
        </div>

        {/* ── Social Icons Row (Directly below headline) ─────────────────────── */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-10 sm:mb-12">
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
          className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pt-10 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Column 1: LOCATION */}
          <div className="md:col-span-4 flex flex-col items-start">
            <span
              className="text-xs font-mono uppercase tracking-[0.28em] mb-3 flex items-center gap-1.5"
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
              className="text-xs font-mono uppercase tracking-[0.28em] mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--muted)' }}
            >
              <Mail className="w-3.5 h-3.5" />
              Contact
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
              className="text-xs font-mono uppercase tracking-[0.28em] mb-3 flex items-center gap-1.5"
              style={{ color: 'var(--muted)' }}
            >
              <Globe className="w-3.5 h-3.5" />
              Social
            </span>
            <div className="flex flex-col space-y-2">
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
      <div className="relative z-10 max-w-6xl w-full mx-auto mt-12 sm:mt-16 pt-6 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" style={{ borderColor: 'var(--border)' }}>
        <div>
          <p className="text-sm font-semibold tracking-tight flex items-center gap-2" style={{ color: 'var(--accent)' }}>
            <span>Jason Darel</span>
            <span className="font-mono text-xs font-normal opacity-40">•</span>
            <span className="font-mono text-xs font-normal" style={{ color: 'var(--muted)' }}>
              Full-Stack Developer
            </span>
          </p>
        </div>

        <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
          Portfolio &amp; Archive 2026
        </p>
      </div>

      {/* ── Subtle Background Typography Watermark (Reference: "roku") ─────── */}
      <div
        className="absolute -bottom-6 right-2 sm:right-8 pointer-events-none select-none overflow-hidden leading-none z-0"
        aria-hidden="true"
      >
        <span
          className="text-[20vw] sm:text-[18vw] font-black tracking-tighter inline-block select-none"
          style={{
            color: 'var(--border)',
            opacity: 0.35,
          }}
        >
          jason
        </span>
      </div>
    </section>
  );
}
