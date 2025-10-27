import React from 'react';
import Spline from '@splinetool/react-spline';
import { Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/6p9j3Kk0hJfXkC7e/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-950/10 via-neutral-950/40 to-neutral-950" />

      <div className="relative mx-auto max-w-6xl px-4 pt-28 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900/60 px-3 py-1 text-xs text-white/80">
          <Star size={14} className="text-yellow-400" />
          Drag & drop website builder now in beta
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight">
          Design. Edit. Ship. Faster.
        </h1>
        <p className="mt-4 max-w-2xl text-white/70">
          Build beautiful pages in minutes with a live editor, full-width 3D hero, and exportable code. No setup required.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#builder" className="rounded-lg bg-white text-neutral-900 px-4 py-2 font-medium hover:bg-white/90">Open Builder</a>
          <a href="#templates" className="rounded-lg border border-white/15 px-4 py-2 text-white/90 hover:border-white/25">Browse Templates</a>
        </div>
      </div>
    </section>
  );
}
