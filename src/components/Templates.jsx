import React, { useMemo, useState } from 'react';

const CATEGORIES = ['All', 'Landing', 'Portfolio', 'Dashboard', 'Blog'];

const TEMPLATES = [
  { id: 'alpha', name: 'Alpha Landing', category: 'Landing', description: 'Hero-led layout with feature grid and testimonials.' },
  { id: 'folio', name: 'Folio Personal', category: 'Portfolio', description: 'Case-study cards with sticky project sidebar.' },
  { id: 'insight', name: 'Insight Blog', category: 'Blog', description: 'Editorial style with featured story carousel.' },
  { id: 'pulse', name: 'Pulse Dashboard', category: 'Dashboard', description: 'KPIs, charts, and modular widgets.' },
  { id: 'signal', name: 'Signal SaaS', category: 'Landing', description: 'Conversion-focused layout with pricing switcher.' },
  { id: 'studio', name: 'Studio Portfolio', category: 'Portfolio', description: 'Masonry gallery with smooth filtering.' },
];

function TemplateCard({ template, accent, onSelect }) {
  return (
    <div className="group rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
      <div
        className="aspect-video w-full"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, rgba(255,255,255,0.9) 100%)`,
        }}
      >
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/0 via-white/0 to-white/50"></div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-medium text-lg">{template.name}</h3>
            <p className="text-sm text-neutral-600 mt-1">{template.description}</p>
          </div>
          <span className="inline-flex items-center text-xs font-medium rounded-full border border-neutral-200 px-2 py-1 bg-white text-neutral-700">
            {template.category}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => onSelect(template)}
            className="px-3 py-2 text-sm rounded-md bg-neutral-900 text-white hover:bg-neutral-800 transition-colors"
          >
            Use this template
          </button>
          <a href="#" className="text-sm text-neutral-700 hover:text-neutral-900">Preview</a>
        </div>
      </div>
    </div>
  );
}

function ColorSwatch({ color, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={`Choose ${color}`}
      className={`h-8 w-8 rounded-full border ${selected ? 'ring-2 ring-offset-2 ring-neutral-900' : 'border-neutral-300'}`}
      style={{ backgroundColor: color }}
    />
  );
}

function Templates() {
  const [category, setCategory] = useState('All');
  const [accent, setAccent] = useState('#ef4444'); // soft red accent by default
  const [selected, setSelected] = useState(null);

  const colors = ['#ef4444', '#0ea5e9', '#22c55e', '#a855f7', '#f59e0b', '#111827'];

  const filtered = useMemo(() => {
    if (category === 'All') return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === category);
  }, [category]);

  return (
    <section id="templates" className="relative py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Customizable Web Templates</h2>
            <p className="mt-2 text-neutral-600 max-w-2xl">
              Choose a starting point, tweak colors and layout, then export. All templates are responsive and production-ready.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  category === c
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white text-neutral-900 border-neutral-300 hover:border-neutral-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 p-4 rounded-xl border border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-700">Accent</span>
              <div className="flex items-center gap-2">
                {colors.map((c) => (
                  <ColorSwatch key={c} color={c} selected={accent === c} onClick={() => setAccent(c)} />
                ))}
              </div>
            </div>
            <div className="text-sm text-neutral-600">
              Tip: The accent updates the preview gradient so you can feel the vibe.
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <TemplateCard key={t.id} template={t} accent={accent} onSelect={setSelected} />
          ))}
        </div>

        {selected && (
          <div className="mt-10 rounded-xl border border-neutral-200 p-6 bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-medium">Selected: {selected.name}</h3>
                <p className="text-sm text-neutral-600">Category: {selected.category}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 rounded-md border border-neutral-300 bg-white hover:border-neutral-400 text-sm">Export HTML</button>
                <button className="px-4 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 text-sm">Continue to customize</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Templates;
