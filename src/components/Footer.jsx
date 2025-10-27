import React from 'react';

function Footer() {
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <div className="font-semibold text-lg">tempweball</div>
            <p className="text-sm text-neutral-600 mt-1">A clean, modern way to launch beautiful websites faster.</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-neutral-700">Features</a>
            <a href="#templates" className="hover:text-neutral-700">Templates</a>
            <a href="#pricing" className="hover:text-neutral-700">Pricing</a>
            <a href="#" className="hover:text-neutral-700">Support</a>
          </div>
        </div>
        <div className="mt-8 text-xs text-neutral-500">© {new Date().getFullYear()} tempweball. All rights reserved.</div>
      </div>
    </footer>
  );
}

export default Footer;
