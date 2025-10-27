import React from 'react';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#home" className="font-semibold tracking-tight text-xl">tempweball</a>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#templates" className="hover:text-neutral-600 transition-colors">Templates</a>
          <a href="#features" className="hover:text-neutral-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-neutral-600 transition-colors">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#templates" className="px-3 py-2 rounded-md text-sm font-medium border border-neutral-300 hover:border-neutral-400 transition-colors">Browse</a>
          <a href="#templates" className="px-3 py-2 rounded-md text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 transition-colors">Get Started</a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
