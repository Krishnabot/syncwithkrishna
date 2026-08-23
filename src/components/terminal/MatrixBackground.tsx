"use client";

import { useEffect, useRef } from "react";

export default function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastDraw = 0;
    let drops: number[] = [];
    let columns = 0;
    let visible = !document.hidden;
    const glyphs = "01アイウエオカキクケコKRISHNASYNC";

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(window.innerWidth * ratio);
      canvas.height = Math.floor(window.innerHeight * ratio);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const fontSize = window.innerWidth < 640 ? 18 : 16;
      columns = Math.ceil(window.innerWidth / fontSize);
      drops = Array.from({ length: columns }, (_, index) => drops[index] ?? Math.random() * -50);
    };

    const drawStatic = () => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = "rgba(51, 255, 142, 0.045)";
      context.font = "15px monospace";
      for (let x = 20; x < window.innerWidth; x += 52) {
        for (let y = 30; y < window.innerHeight; y += 90) context.fillText(glyphs[(x + y) % glyphs.length], x, y);
      }
    };

    const draw = (time: number) => {
      if (!visible || reduced.matches) { frame = window.requestAnimationFrame(draw); return; }
      const interval = window.innerWidth < 640 ? 95 : 70;
      if (time - lastDraw >= interval) {
        lastDraw = time;
        context.fillStyle = "rgba(3, 9, 7, 0.09)";
        context.fillRect(0, 0, window.innerWidth, window.innerHeight);
        context.font = (window.innerWidth < 640 ? 18 : 16) + "px monospace";
        for (let index = 0; index < columns; index += window.innerWidth < 640 ? 2 : 1) {
          const text = glyphs[Math.floor(Math.random() * glyphs.length)];
          context.fillStyle = Math.random() > 0.985 ? "rgba(181,255,211,.55)" : "rgba(43,217,119,.14)";
          const size = window.innerWidth < 640 ? 18 : 16;
          context.fillText(text, index * size, drops[index] * size);
          if (drops[index] * size > window.innerHeight && Math.random() > 0.985) drops[index] = 0;
          drops[index] += 0.45;
        }
      }
      frame = window.requestAnimationFrame(draw);
    };

    const onVisibility = () => { visible = !document.hidden; };
    const onMotion = () => { if (reduced.matches) drawStatic(); };
    resize();
    if (reduced.matches) drawStatic();
    else frame = window.requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    reduced.addEventListener("change", onMotion);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      reduced.removeEventListener("change", onMotion);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" aria-hidden="true" />;
}
