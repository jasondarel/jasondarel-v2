'use client';

import { useLenis } from '@/lib/useLenis';
import IntroSection from '@/components/IntroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ExperienceSection from '@/components/ExperienceSection';
import ProjectsSection from '@/components/ProjectsSection';
import FadeToTopOverlay from '@/components/FadeToTopOverlay';
import MobileScrollPrompt from '@/components/MobileScrollPrompt';

/**
 * Home (App.tsx equivalent)
 *
 * Page layout in order:
 *   1. Intro            — normal scroll, full viewport height
 *   2. AboutSection     — pinned scroll with 'About Me' text fade in/out animation
 *   3. SkillsSection    — pins + bottom-up flooding color reveal across Frontend, Backend, Tools
 *   4. ExperienceSection — pins + scrolls experience panels left-to-right with center scroll lock
 *   5. ProjectsSection  — multi-layered parallax depth stream with differential scroll speeds
 *   6. Outro            — normal scroll, full viewport height
 *
 * useLenis() is called at the page root so Lenis wraps the entire document.
 * All GSAP ScrollTrigger logic lives inside each section component.
 */
export default function Home() {
  // ── Initialise Lenis smooth scroll + GSAP ticker integration ──────────────
  useLenis();

  return (
    <main>
      {/* ── Global Fade-to-Top Overlay ─────────────────────────────────────── */}
      <FadeToTopOverlay />

      {/* ── Mobile Floating "Scroll Slowly" Widget ─────────────────────────── */}
      <MobileScrollPrompt />

      {/* ── 1. INTRO HERO ─────────────────────────────────────────────────── */}
      <IntroSection />

      {/* ── 2. ABOUT ME PINNED SECTION ───────────────────────────────────── */}
      {/*
       * Pinned section with 'About Me' text fading in from left and fading out to right.
       * See src/components/AboutSection.tsx for ScrollTrigger config.
       */}
      <AboutSection />

      {/* ── 3. SKILLS SECTION (FLOODING COLOR REVEAL) ────────────────────── */}
      {/*
       * Flooding bottom-up reveal with inverted color scheme across Frontend, Backend, Tools.
       * See src/components/SkillsSection.tsx for ScrollTrigger config.
       */}
      <SkillsSection />

      {/* ── 4. EXPERIENCE HORIZONTAL PIN SECTION ──────────────────────────── */}
      {/*
       * Pinned 3-panel experience timeline with center-panel scroll lock.
       * See src/components/ExperienceSection.tsx for ScrollTrigger config.
       */}
      <ExperienceSection />

      {/* ── 5. PROJECTS & OVERLAPPING CONTACT SECTION ───────────────────── */}
      {/*
       * Pinned poker-deck deal into 4x2 grid, full-page frosted blur, and overlapping Contact section.
       * See src/components/ProjectsSection.tsx for ScrollTrigger config.
       */ }
      <ProjectsSection />
    </main>
  );
}
