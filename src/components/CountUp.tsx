'use client';

import { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  decimals?: number;
  duration?: number; // In seconds, default 0.7s (fast, snappy count up)
  prefix?: string;
  suffix?: string;
  useGrouping?: boolean; // e.g. 1,100 instead of 1100
  trigger?: boolean; // When true, triggers the count up animation
  className?: string;
  style?: React.CSSProperties;
}

export default function CountUp({
  end,
  start = 0,
  decimals = 0,
  duration = 1.6,
  prefix = '',
  suffix = '',
  useGrouping = true,
  trigger = false,
  className = '',
  style,
}: CountUpProps) {
  const [value, setValue] = useState(start);

  useEffect(() => {
    if (!trigger) {
      setValue(start);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;
    const durationMs = duration * 1000;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Smooth quartic ease-out deceleration
      const easeOutProgress = 1 - Math.pow(1 - progress, 3.5);
      const currentVal = start + (end - start) * easeOutProgress;

      setValue(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, start, duration, trigger]);

  let displayStr = '';
  if (decimals > 0) {
    displayStr = value.toFixed(decimals);
  } else {
    const rounded = Math.round(value);
    displayStr = useGrouping ? rounded.toLocaleString('en-US') : rounded.toString();
  }

  return (
    <span className={className} style={style}>
      {prefix}
      {displayStr}
      {suffix}
    </span>
  );
}
