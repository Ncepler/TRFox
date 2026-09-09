"use client";

import { useEffect, useRef, useState } from "react";

type DimensionLineProps = {
  sf: number;
  className?: string;
};

export default function DimensionLine({ sf, className }: DimensionLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDrawn(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const formatted = `${sf.toLocaleString("en-US")} sf`;

  return (
    <div ref={ref} className={`dimension-line${drawn ? " is-drawn" : ""}${className ? ` ${className}` : ""}`}>
      <div className="dimension-label font-display text-[0.8125rem] font-medium text-ink-soft" aria-hidden="true">
        {formatted}
      </div>
      <div className="dimension-rule-track">
        <svg
          className="dimension-rule"
          width="100%"
          height="1"
          viewBox="0 0 100 1"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="var(--color-line)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        <svg className="dimension-tick dimension-tick-start" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <line x1="1" y1="9" x2="9" y2="1" stroke="var(--color-accent)" strokeWidth="1" />
        </svg>
        <svg className="dimension-tick dimension-tick-end" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <line x1="1" y1="9" x2="9" y2="1" stroke="var(--color-accent)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
