"use client";

import { useEffect, useRef, useState } from "react";
import { Compass, Flag, Link2 } from "lucide-react";
import { shouldShowYouTubeGuide } from "@/lib/inAppBrowser";

const YOUTUBE_URL = "https://www.youtube.com/@thenepalibookworm";
const LOOP_DURATION = 9000;

type UiPhase = "step1" | "step2" | "reset";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));
const ease = (value: number) => {
  const t = clamp(value);
  return 1 - Math.pow(1 - t, 3);
};
const mix = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

function pointOnCubic(
  t: number,
  start: [number, number],
  control1: [number, number],
  control2: [number, number],
  end: [number, number],
) {
  const inverse = 1 - t;
  return {
    x:
      inverse ** 3 * start[0] +
      3 * inverse ** 2 * t * control1[0] +
      3 * inverse * t ** 2 * control2[0] +
      t ** 3 * end[0],
    y:
      inverse ** 3 * start[1] +
      3 * inverse ** 2 * t * control1[1] +
      3 * inverse * t ** 2 * control2[1] +
      t ** 3 * end[1],
  };
}

function drawHand(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  press = 0,
  opacity = 1,
) {
  context.save();
  context.globalAlpha = opacity;
  context.translate(x, y + press * 7);
  context.scale(scale, scale);
  context.rotate(-0.12);
  context.shadowColor = "rgba(15, 23, 42, .18)";
  context.shadowBlur = 12;
  context.shadowOffsetY = 5;
  context.beginPath();
  context.moveTo(0, 2);
  context.lineTo(0, -42);
  context.bezierCurveTo(0, -51, 13, -51, 13, -42);
  context.lineTo(13, -17);
  context.lineTo(18, -29);
  context.bezierCurveTo(21, -37, 33, -33, 31, -24);
  context.lineTo(30, -16);
  context.lineTo(35, -25);
  context.bezierCurveTo(39, -32, 49, -27, 46, -19);
  context.lineTo(43, -10);
  context.lineTo(48, -16);
  context.bezierCurveTo(53, -22, 61, -16, 57, -8);
  context.lineTo(48, 12);
  context.bezierCurveTo(43, 25, 32, 31, 18, 29);
  context.bezierCurveTo(7, 27, -3, 19, -10, 10);
  context.lineTo(-22, -4);
  context.bezierCurveTo(-28, -12, -18, -21, -11, -14);
  context.closePath();
  context.fillStyle = "#ffffff";
  context.fill();
  context.shadowColor = "transparent";
  context.strokeStyle = "#111827";
  context.lineWidth = 2.4;
  context.lineJoin = "round";
  context.stroke();
  context.beginPath();
  context.moveTo(13, -17);
  context.quadraticCurveTo(13, -5, 16, 2);
  context.moveTo(30, -16);
  context.quadraticCurveTo(28, -5, 30, 2);
  context.moveTo(43, -10);
  context.quadraticCurveTo(40, -2, 41, 5);
  context.strokeStyle = "rgba(17, 24, 39, .45)";
  context.lineWidth = 1.5;
  context.stroke();
  context.restore();
}

function GuideCanvas({ reducedMotion }: { reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<UiPhase>(reducedMotion ? "step2" : "step1");
  const [menuPressed, setMenuPressed] = useState(reducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    let startTime = performance.now();
    let lastPhase: UiPhase = reducedMotion ? "step2" : "step1";
    let wasMenuPressed = reducedMotion;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (now: number) => {
      context.clearRect(0, 0, width, height);
      const elapsed = reducedMotion ? 6200 : (now - startTime) % LOOP_DURATION;
      const target = {
        x: width - (width < 640 ? 28 : 44),
        y: width < 640 ? 32 : 42,
      };
      const start: [number, number] = [width * 0.38, Math.min(height * 0.38, 330)];
      const control1: [number, number] = [width * 0.56, height * 0.32];
      const control2: [number, number] = [target.x - 90, target.y + 120];
      const end: [number, number] = [target.x - 4, target.y + 8];
      const arrowProgress = reducedMotion ? 1 : ease(elapsed / 1800);

      context.save();
      context.strokeStyle = "#111827";
      context.lineWidth = width < 640 ? 4 : 5;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.beginPath();
      const segments = 60;
      for (let index = 0; index <= Math.floor(segments * arrowProgress); index++) {
        const point = pointOnCubic(index / segments, start, control1, control2, end);
        if (index === 0) context.moveTo(point.x, point.y);
        else context.lineTo(point.x, point.y);
      }
      context.stroke();
      if (arrowProgress > 0.92) {
        const angle = Math.atan2(end[1] - control2[1], end[0] - control2[0]);
        context.translate(end[0], end[1]);
        context.rotate(angle);
        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(-18, -9);
        context.lineTo(-14, 11);
        context.closePath();
        context.fillStyle = "#111827";
        context.fill();
      }
      context.restore();

      const sheetHeight = Math.min(292, Math.max(238, height * 0.32));
      const rowCenterY = height - sheetHeight + sheetHeight / 2;
      let handX = start[0] + 18;
      let handY = start[1] + 42;
      let handOpacity = 0;
      let press = 0;

      if (reducedMotion) {
        handX = width < 640 ? width * 0.4 : width * 0.55;
        handY = rowCenterY + 5;
        handOpacity = 1;
      } else if (elapsed >= 1200 && elapsed < 3000) {
        const movement = ease((elapsed - 1200) / 1150);
        handX = mix(start[0] + 18, target.x - 10, movement);
        handY = mix(start[1] + 42, target.y + 57, movement);
        handOpacity = clamp((elapsed - 1200) / 250) * clamp((3000 - elapsed) / 220);
        press = Math.sin(clamp((elapsed - 2250) / 520) * Math.PI);
      } else if (elapsed >= 3300 && elapsed < 7600) {
        const movement = ease((elapsed - 3800) / 1800);
        handX = mix(target.x - 10, width < 640 ? width * 0.42 : width * 0.56, movement);
        handY = mix(target.y + 57, rowCenterY + 5, movement);
        handOpacity = clamp((elapsed - 3300) / 300) * clamp((7600 - elapsed) / 400);
        press = Math.sin(clamp((elapsed - 5800) / 650) * Math.PI);
      }

      if ((elapsed > 2260 && elapsed < 2780) || (elapsed > 5820 && elapsed < 6500)) {
        const local = elapsed < 3000 ? (elapsed - 2260) / 520 : (elapsed - 5820) / 680;
        const radius = 10 + ease(local) * 28;
        context.beginPath();
        context.arc(handX, handY - 43, radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(17, 24, 39, ${0.2 * (1 - clamp(local))})`;
        context.lineWidth = 2;
        context.stroke();
      }
      drawHand(context, handX, handY, width < 420 ? 0.82 : 0.92, press, handOpacity);

      const nextPhase: UiPhase =
        elapsed >= 7500 ? "reset" : elapsed >= 2850 ? "step2" : "step1";
      if (nextPhase !== lastPhase) {
        lastPhase = nextPhase;
        setPhase(nextPhase);
      }
      const nextMenuPressed = reducedMotion || (elapsed >= 5800 && elapsed < 6800);
      if (nextMenuPressed !== wasMenuPressed) {
        wasMenuPressed = nextMenuPressed;
        setMenuPressed(nextMenuPressed);
      }
      if (!reducedMotion) frame = requestAnimationFrame(render);
    };

    resize();
    render(performance.now());
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("orientationchange", resize, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
      startTime = 0;
    };
  }, [reducedMotion]);

  const showSheet = reducedMotion || phase === "step2" || phase === "reset";

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden bg-[#fbfbfa] text-slate-950">
      <div
        className={`relative z-10 mx-auto flex h-full max-w-3xl flex-col items-center px-6 pt-[max(6rem,env(safe-area-inset-top))] text-center transition-opacity duration-700 ${phase === "reset" ? "opacity-0" : "opacity-100"}`}
      >
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-bold tracking-tight text-slate-700 shadow-sm sm:text-lg">
          {phase === "step1" ? (
            <>
              <span className="block text-lg font-extrabold text-slate-950 sm:text-xl">Step 1</span>
              <span className="mt-1 block">तीनवटा थोप्ला थिच्नुहोस्</span>
              <span className="mt-0.5 block text-[0.92em] font-bold text-slate-500">Tap the three dots</span>
            </>
          ) : (
            <>
              <span className="block text-lg font-extrabold text-slate-950 sm:text-xl">Step 2</span>
              <span className="mt-1 block">“Open in browser” छान्नुहोस्</span>
              <span className="mt-0.5 block text-[0.92em] font-bold text-slate-500">Select Open in browser</span>
            </>
          )}
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
          Open in Browser
        </h1>
        <p className="mt-5 max-w-xl text-lg font-bold leading-relaxed text-slate-600 sm:text-xl lg:text-2xl">
          {phase === "step1" ? (
            <>
              <span className="block font-extrabold text-slate-900">माथिल्लो दायाँ कुनामा रहेका तीनवटा थोप्ला थिच्नुहोस्</span>
              <span className="mt-1.5 block text-slate-600">Tap the three dots in the top-right corner</span>
            </>
          ) : (
            <>
              <span className="block font-extrabold text-slate-900">त्यसपछि “Open in browser” छान्नुहोस्</span>
              <span className="mt-1.5 block text-slate-600">Then select “Open in browser”</span>
            </>
          )}
        </p>
      </div>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-20 bg-slate-950 transition-opacity duration-500 ${showSheet ? "opacity-35" : "opacity-0"}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-0 z-30 mx-auto max-w-2xl rounded-t-[2rem] bg-white pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-16px_55px_rgba(15,23,42,0.18)] transition-all duration-700 ease-out ${showSheet ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      >
        <div className="mx-auto my-3 h-1 w-10 rounded-full bg-slate-200" />
        <div className="divide-y divide-slate-100 px-3 pb-2 sm:px-5">
          <MenuRow icon={<Flag />} label="Report" />
          <MenuRow icon={<Compass />} label="Open in browser" highlighted={menuPressed} />
          <MenuRow icon={<Link2 />} label="Copy link" />
        </div>
      </div>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-40" />

      <div className="sr-only" aria-live="polite">
        {phase === "step1"
          ? "चरण १: माथिल्लो दायाँ कुनामा रहेको TikTok को तीनवटा थोप्लाको मेनु थिच्नुहोस्। Step 1: Tap TikTok’s three-dot menu in the top-right corner."
          : "चरण २: मेनुबाट Open in browser छान्नुहोस्। Step 2: Select Open in browser from the menu."}
      </div>
    </div>
  );
}

function MenuRow({
  icon,
  label,
  highlighted = false,
}: {
  icon: React.ReactNode;
  label: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`flex h-[72px] items-center gap-4 rounded-2xl px-4 transition-colors duration-200 sm:h-[78px] sm:px-6 ${highlighted ? "bg-slate-100" : "bg-white"}`}
    >
      <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-800 [&_svg]:size-5 [&_svg]:stroke-[1.8]">
        {icon}
      </span>
      <span className="text-base font-medium text-slate-900 sm:text-lg">{label}</span>
    </div>
  );
}

export default function YouTubeRedirectGuide() {
  const [mode, setMode] = useState<"checking" | "guide" | "redirecting">("checking");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);

    const showGuide = shouldShowYouTubeGuide({
      hostname: window.location.hostname,
      search: window.location.search,
      userAgent: navigator.userAgent,
      referrer: document.referrer,
    });
    const modeTimer = window.setTimeout(
      () => setMode(showGuide ? "guide" : "redirecting"),
      0,
    );
    const redirectTimer = showGuide
      ? undefined
      : window.setTimeout(() => window.location.replace(YOUTUBE_URL), 350);
    return () => {
      window.clearTimeout(modeTimer);
      if (redirectTimer !== undefined) window.clearTimeout(redirectTimer);
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  if (mode === "guide") return <GuideCanvas reducedMotion={reducedMotion} />;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#fbfbfa] px-6 text-center text-slate-950">
      <div className="mb-6 size-8 rounded-full border-2 border-slate-200 border-t-slate-800 motion-safe:animate-spin" />
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Opening YouTube…</h1>
      <p className="mt-3 text-base text-slate-500 sm:text-lg">Taking you to The Nepali Book Worm</p>
      <noscript>
        <a className="mt-6 underline" href={YOUTUBE_URL}>Continue to YouTube</a>
      </noscript>
    </div>
  );
}
