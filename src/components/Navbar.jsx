import React from 'react';
import { Rocket, Settings, Github } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur bg-neutral-950/60">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-semibold text-white">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-500 to-cyan-400">
            <Rocket size={18} />
          </span>
          tempweball
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a className="hover:text-white" href="#templates">Templates</a>
          <a className="hover:text-white" href="#builder">Builder</a>
          <a className="hover:text-white" href="#pricing">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:border-white/20"
          >
            <Github size={16} />
            Star
          </a>
          <button className="inline-flex items-center gap-2 rounded-lg bg-white text-neutral-900 px-3 py-1.5 text-sm font-medium hover:bg-white/90">
            <Settings size={16} />
            Dashboard
          </button>
        </div>
      </div>
    </header>
  );
}
