'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERIENCE_DATA } from '@/constants/experience';
import CountUp from '@/components/CountUp';

gsap.registerPlugin(ScrollTrigger);

function formatHighlight(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold" style={{ color: 'var(--accent)' }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

// ── Sensitivity & Timing Controls ───────────────────────────────────────────
const DISTANCE_MULTIPLIER = 1.15; // Balanced scroll travel
const SCRUB_SMOOTHING = 0.8;      // Inertia smoothing on scroll scrub

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePanelIndex, setActivePanelIndex] = useState(1);
  const [panel1Visible, setPanel1Visible] = useState(false);
  const [panel2Visible, setPanel2Visible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth;
      const viewportWidth = window.innerWidth;
      const travelDistance = totalWidth - viewportWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${(travelDistance + viewportWidth * 1.5) * DISTANCE_MULTIPLIER}`,
          pin: true,
          scrub: SCRUB_SMOOTHING,
          invalidateOnRefresh: true,
          onEnter: () => {
            // Initiate Panel 1 count up when section pins into full view
            setPanel1Visible(true);
          },
          onLeaveBack: () => {
            // Reset counters when scrolling back above section
            setPanel1Visible(false);
            setPanel2Visible(false);
          },
          onUpdate: (self) => {
            // Track active panel index based on timeline progress
            const progress = self.progress;
            if (progress < 0.28) {
              setActivePanelIndex(1);
              if (progress > 0.01) setPanel1Visible(true);
            } else if (progress < 0.72) {
              setActivePanelIndex(2);
              setPanel2Visible(true);
            } else {
              setActivePanelIndex(3);
            }
          },
        },
      });

      tl
        // 1. Initial stationary hold on Panel 1 (Intro)
        .to({}, { duration: 0.5 })
        // 2. Smooth transition from Panel 1 -> Panel 2 (Center Panel)
        .to(track, {
          x: () => -viewportWidth,
          duration: 1.0,
          ease: 'power2.inOut',
        })
        // 3. CENTER PANEL SCROLL LOCK: Dedicated stationary hold on Panel 2 (Gositus)
        .to({}, { duration: 0.8 })
        // 4. Smooth transition from Panel 2 -> Panel 3 (KPSG Group)
        .to(track, {
          x: () => -travelDistance,
          duration: 1.0,
          ease: 'power2.inOut',
        })
        // 5. Final stationary hold on Panel 3 before unpinning
        .to({}, { duration: 0.5 });
    }, section);

    return () => ctx.revert();
  }, []);

  const gositus = EXPERIENCE_DATA[0];
  const kpsg = EXPERIENCE_DATA[1];

  return (
    <section
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
      style={{ background: 'var(--surface-0)' }}
      aria-label="Experience timeline section"
    >
      {/* Top Header Panel Progress Indicator */}
      {activePanelIndex > 1 && (
        <div className="absolute top-8 right-8 z-20 flex items-center gap-2 pointer-events-none select-none">
          <span
            className="text-xs font-mono font-medium"
            style={{ color: 'var(--accent)' }}
          >
            0{activePanelIndex - 1}
          </span>
          <span className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
            / 02
          </span>
          <div className="flex gap-1 ml-2">
            {[2, 3].map((idx) => (
              <span
                key={idx}
                className="w-4 h-1 rounded-full transition-all duration-300"
                style={{
                  background:
                    activePanelIndex === idx ? 'var(--accent)' : 'var(--border)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Track of 3 Panels */}
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: '300vw' }}
      >
        {/* ── PANEL 01: SECTION COVER & TITLE ─────────────────────────────── */}
        <div
          className="relative flex-shrink-0 flex flex-col justify-center px-8 sm:px-16 md:px-24 w-screen h-full"
          style={{
            background: 'var(--surface-0)',
            borderRight: '1px solid var(--border)',
          }}
        >
          <div className="max-w-4xl z-10">
            <h2
              className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-[0.95] mb-6"
              style={{ color: 'var(--accent)' }}
            >
              Experience<span className="opacity-40">.</span>
            </h2>

            <p
              className="text-lg sm:text-xl md:text-2xl font-medium leading-relaxed max-w-2xl mb-8"
              style={{ color: 'var(--foreground)' }}
            >
              A track record of engineering production-grade web systems, optimizing performance bottlenecks, and building scalable backend architectures.
            </p>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl">
              <div
                className="p-4 rounded-xl border"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                  style={{ color: 'var(--accent)' }}
                >
                  <CountUp
                    end={99.6}
                    decimals={1}
                    suffix="%"
                    duration={1.6}
                    trigger={panel1Visible}
                  />
                </div>
                <div
                  className="text-xs font-mono uppercase tracking-wider mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Load Time Cut
                </div>
              </div>

              <div
                className="p-4 rounded-xl border"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                  style={{ color: 'var(--accent)' }}
                >
                  <CountUp
                    end={1100}
                    decimals={0}
                    suffix="+"
                    duration={1.8}
                    trigger={panel1Visible}
                  />
                </div>
                <div
                  className="text-xs font-mono uppercase tracking-wider mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Participant Records
                </div>
              </div>

              <div
                className="p-4 rounded-xl border col-span-2 sm:col-span-1"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <div
                  className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                  style={{ color: 'var(--accent)' }}
                >
                  <CountUp
                    end={2}
                    decimals={0}
                    suffix=" Roles"
                    duration={1.2}
                    trigger={panel1Visible}
                  />
                </div>
                <div
                  className="text-xs font-mono uppercase tracking-wider mt-1"
                  style={{ color: 'var(--muted)' }}
                >
                  Full-Stack Experience
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── PANEL 02: ROLE 01 (PT. GO ONLINE SOLUSI - GOSITUS) ──────────── */}
        <div
          className="relative flex-shrink-0 flex flex-col justify-center px-8 sm:px-14 md:px-20 w-screen h-full overflow-y-auto sm:overflow-hidden"
          style={{
            background: 'var(--surface-1)',
            borderRight: '1px solid var(--border)',
          }}
        >
          {/* Subtle Watermark Number */}
          <span
            className="absolute right-12 bottom-6 text-[22vw] font-black select-none leading-none pointer-events-none"
            style={{ color: 'var(--accent)', opacity: 0.04 }}
          >
            01
          </span>

          <div className="max-w-5xl z-10 py-16 sm:py-0">
            {/* Header: Company & Meta */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3.5 border-b mb-4.5"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--muted)' }}
                >
                  {gositus.location}
                </p>
                <h3
                  className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight"
                  style={{ color: 'var(--accent)' }}
                >
                  {gositus.role}
                </h3>
                <p
                  className="text-base sm:text-lg font-medium mt-0.5"
                  style={{ color: 'var(--foreground)' }}
                >
                  {gositus.company}
                </p>
              </div>

              <div
                className="px-3.5 py-1.5 rounded-xl border flex flex-col items-end"
                style={{
                  background: 'var(--surface-0)',
                  borderColor: 'var(--border)',
                }}
              >
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  Duration
                </span>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent)' }}>
                  {gositus.period}
                </span>
              </div>
            </div>

            {/* Content Grid: Key Metric & Bullets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[18px] mb-4.5">
              {/* Left Column Metric / Focus */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div
                  className="p-5 rounded-2xl border"
                  style={{
                    background: 'var(--surface-0)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <span
                    className="text-xs font-mono uppercase tracking-wider block mb-1"
                    style={{ color: 'var(--muted)' }}
                  >
                    Key Performance Impact
                  </span>
                  <div
                    className="text-3xl sm:text-4xl font-black font-mono tracking-tight"
                    style={{ color: 'var(--accent)' }}
                  >
                    <CountUp
                      end={99.6}
                      decimals={1}
                      suffix="%"
                      duration={1.6}
                      trigger={panel2Visible}
                    />
                  </div>
                  <p
                    className="text-xs sm:text-sm mt-1.5 leading-relaxed"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {gositus.keyMetric?.label}
                  </p>
                </div>
              </div>

              {/* Right Column Bullet Points */}
              <div className="lg:col-span-8 flex flex-col justify-center">
                <ul className="space-y-2.5">
                  {gositus.highlights.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--accent)' }}
                      />
                      <span>{formatHighlight(bullet)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ── PANEL 03: ROLE 02 (PT. KPSG GROUP) ──────────────────────────── */}
        <div
          className="relative flex-shrink-0 flex flex-col justify-center px-8 sm:px-14 md:px-20 w-screen h-full overflow-y-auto sm:overflow-hidden"
          style={{
            background: 'var(--surface-2)',
            borderRight: '1px solid var(--border)',
          }}
        >
          {/* Subtle Watermark Number */}
          <span
            className="absolute right-12 bottom-6 text-[22vw] font-black select-none leading-none pointer-events-none"
            style={{ color: 'var(--accent)', opacity: 0.04 }}
          >
            02
          </span>

          <div className="max-w-5xl z-10 py-16 sm:py-0">
            {/* Header: Company & Meta */}
            <div className="flex flex-wrap items-start justify-between gap-3 pb-3.5 border-b mb-4.5"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <p
                  className="text-xs font-mono uppercase tracking-widest mb-1.5"
                  style={{ color: 'var(--muted)' }}
                >
                  {kpsg.location}
                </p>
                <h3
                  className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight"
                  style={{ color: 'var(--accent)' }}
                >
                  {kpsg.role}
                </h3>
                <p
                  className="text-base sm:text-lg font-medium mt-0.5"
                  style={{ color: 'var(--foreground)' }}
                >
                  {kpsg.company}
                </p>
              </div>

              <div
                className="px-3.5 py-1.5 rounded-xl border flex flex-col items-end"
                style={{
                  background: 'var(--surface-1)',
                  borderColor: 'var(--border)',
                }}
              >
                <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--muted)' }}>
                  Duration
                </span>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--accent)' }}>
                  {kpsg.period}
                </span>
              </div>
            </div>

            {/* Content Grid: Key Metric & Bullets */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-[18px] mb-4.5">
              {/* Left Column Metric / Focus */}
              <div className="lg:col-span-4 flex flex-col gap-3">
                <div
                  className="p-5 rounded-2xl border"
                  style={{
                    background: 'var(--surface-1)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <span
                    className="text-xs font-mono uppercase tracking-wider block mb-1"
                    style={{ color: 'var(--muted)' }}
                  >
                    Core Engineering Domain
                  </span>
                  <div
                    className="text-2xl sm:text-3xl font-black font-mono tracking-tight"
                    style={{ color: 'var(--accent)' }}
                  >
                    {kpsg.keyMetric?.value}
                  </div>
                  <p
                    className="text-xs sm:text-sm mt-1.5 leading-relaxed"
                    style={{ color: 'var(--foreground)' }}
                  >
                    {kpsg.keyMetric?.label}
                  </p>
                </div>
              </div>

              {/* Right Column Bullet Points */}
              <div className="lg:col-span-8 flex flex-col justify-center">
                <ul className="space-y-3">
                  {kpsg.highlights.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: 'var(--accent)' }}
                      />
                      <span>{formatHighlight(bullet)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
