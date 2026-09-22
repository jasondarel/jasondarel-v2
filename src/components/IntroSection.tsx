'use client';

import React from 'react';

/**
 * IntroSection
 *
 * First section of the portfolio (Intro Hero).
 * Features a staggered top-to-bottom entrance animation ("hero-fade-up") on initial load:
 *  1. Top Header Meta ("Portfolio & Archive" / "2026")
 *  2. Greeting label ("Hello, I am")
 *  3. Name heading ("Jason Darel")
 *  4. Role title ("Full-Stack Developer")
 *  5. Bio paragraph ("Crafting minimal, high-performance web applications...")
 *  6. Bottom Minimalist Scroll Indicator
 */
export default function IntroSection() {
  return (
    <section
      className="relative flex h-screen flex-col items-center justify-center px-6 text-center select-none"
      style={{ background: 'var(--surface-0)' }}
      aria-label="Intro section"
    >
      {/* 1. Subtle Top Header Meta */}
      <div className="hero-fade-up hero-fade-up-1 absolute top-8 left-8 right-8 flex items-center justify-between pointer-events-none">
        <span
          className="text-xs uppercase tracking-[0.3em] font-mono"
          style={{ color: 'var(--muted)' }}
        >
          Portfolio &amp; Archive
        </span>
        <span
          className="text-xs font-mono"
          style={{ color: 'var(--muted)' }}
        >
          2026
        </span>
      </div>

      {/* Center Intro Block */}
      <div className="max-w-4xl flex flex-col items-center">
        {/* 2. Greeting */}
        <p
          className="hero-fade-up hero-fade-up-2 mb-4 text-xs font-mono uppercase tracking-[0.35em]"
          style={{ color: 'var(--muted)' }}
        >
          Hello, I am
        </p>

        {/* 3. Main Name */}
        <h1
          className="hero-fade-up hero-fade-up-3 text-6xl sm:text-8xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-5"
          style={{ color: 'var(--accent)' }}
        >
          Jason Darel
        </h1>

        {/* 4. Role Title */}
        <p
          className="hero-fade-up hero-fade-up-4 text-xl sm:text-2xl md:text-3xl font-medium tracking-tight mb-4"
          style={{ color: 'var(--foreground)' }}
        >
          Full-Stack Developer
        </p>

        {/* 5. Bio Description */}
        <p
          className="hero-fade-up hero-fade-up-5 max-w-xl text-sm sm:text-base font-normal leading-relaxed"
          style={{ color: 'var(--muted)' }}
        >
          Crafting minimal, high-performance web applications, scalable architectures, and interactive digital experiences.
        </p>
      </div>

      {/* 6. Bottom Minimalist Scroll Icon */}
      <div
        className="hero-fade-up hero-fade-up-6 absolute bottom-8 hidden sm:flex flex-col items-center pointer-events-none"
        aria-label="Scroll down indicator"
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
      </div>
    </section>
  );
}
