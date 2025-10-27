import React from 'react';
import Spline from '@splinetool/react-spline';

function Hero() {
  return (
    <section id="home" className="relative w-full min-h-[80vh] sm:min-h-[90vh] flex items-center">
      {/* Spline cover background */}
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        {/* subtle gradient edges that don't block interaction */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-white/20 to-white"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 shadow-sm">
              Modern, minimalist templates — customize in minutes
            </span>
            <h1 className="mt-6 text-4xl sm:text-6xl font-semibold tracking-tight">
              Build polished sites fast with <span className="text-neutral-900">tempweball</span>
            </h1>
            <p className="mt-5 text-neutral-600 text-base sm:text-lg leading-relaxed">
              A clean SaaS experience offering a curated library of responsive web templates. Personalize colors, layout, and content — then launch with confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#templates" className="inline-flex justify-center items-center px-5 py-3 rounded-md bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors">
                Browse templates
              </a>
              <a href="#templates" className="inline-flex justify-center items-center px-5 py-3 rounded-md border border-neutral-300 bg-white text-neutral-900 font-medium hover:border-neutral-400 transition-colors">
                Start customizing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
