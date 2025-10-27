import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/70">
        <div>© {new Date().getFullYear()} tempweball. All rights reserved.</div>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-white">Docs</a>
          <a href="#" className="hover:text-white">Changelog</a>
          <a href="#" className="hover:text-white">Support</a>
        </div>
      </div>
    </footer>
  );
}
