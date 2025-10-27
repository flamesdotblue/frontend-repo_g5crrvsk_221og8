import React, { useMemo, useState } from 'react';

const baseTemplates = [
  {
    id: 'saas-clean',
    name: 'SaaS Clean',
    category: 'SaaS',
    description: 'Minimal landing page with gradient accents and pricing blocks.',
    accent: '#60a5fa',
  },
  {
    id: 'portfolio-modern',
    name: 'Portfolio Modern',
    category: 'Portfolio',
    description: 'Split hero, project grid, testimonials, and contact section.',
    accent: '#34d399',
  },
  {
    id: 'startup-bold',
    name: 'Startup Bold',
    category: 'Startup',
    description: 'Bold typography, angled sections, and call-to-action focus.',
    accent: '#f472b6',
  },
];

export default function Templates({ onSelectTemplate }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    return baseTemplates.filter((t) => {
      const q = query.toLowerCase();
      const matchesQ = t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchesC = category === 'All' || t.category === category;
      return matchesQ && matchesC;
    });
  }, [query, category]);

  return (
    <section id="templates" className="relative py-16 border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold">Templates</h2>
            <p className="mt-1 text-white/60">Pick a starting point. Edit anything later in the builder.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              className="h-10 w-56 rounded-lg border border-white/15 bg-neutral-900/60 px-3 text-sm outline-none focus:border-white/30"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-lg border border-white/15 bg-neutral-900/60 px-3 text-sm outline-none focus:border-white/30"
            >
              <option>All</option>
              <option>SaaS</option>
              <option>Portfolio</option>
              <option>Startup</option>
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTemplate?.(t)}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/40 text-left"
            >
              <div
                className="h-36 w-full"
                style={{
                  background: `linear-gradient(135deg, ${t.accent}33, transparent), radial-gradient(600px 200px at 0% 0%, ${t.accent}22, transparent), radial-gradient(600px 200px at 100% 100%, ${t.accent}22, transparent)`,
                }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{t.name}</h3>
                  <span className="text-xs text-white/60">{t.category}</span>
                </div>
                <p className="mt-1 text-sm text-white/70">{t.description}</p>
                <div className="mt-3 h-2 w-16 rounded-full" style={{ background: t.accent }} />
              </div>
              <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform">
                <div className="p-3 text-center text-sm bg-white/5">Click to open in builder</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
