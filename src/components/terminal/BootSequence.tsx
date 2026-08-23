"use client";

import { useEffect, useState } from "react";

const STEPS = ["Establishing connection...", "Loading identity...", "Loading knowledge base...", "Loading interface..."];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const timer = window.setTimeout(onComplete, 80);
      return () => window.clearTimeout(timer);
    }
    const timers = STEPS.map((_, index) => window.setTimeout(() => setVisible(index + 1), 180 + index * 190));
    const done = window.setTimeout(onComplete, 1250);
    return () => { timers.forEach(window.clearTimeout); window.clearTimeout(done); };
  }, [onComplete]);

  return (
    <div className="boot" role="status" aria-live="polite">
      <p className="boot-title">SYNC://INITIALIZING</p>
      <div className="boot-lines">{STEPS.slice(0, visible).map((step) => <p key={step}><span>›</span> {step} <b>OK</b></p>)}</div>
      <div className="progress" aria-hidden="true"><span style={{ width: `${Math.max(8, (visible / STEPS.length) * 100)}%` }} /></div>
      <p className="boot-percent">{Math.round((visible / STEPS.length) * 100)}%</p>
    </div>
  );
}
