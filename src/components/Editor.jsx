import React, { useMemo, useState } from 'react';

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-neutral-800">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function PreviewCard({ data, accent }) {
  return (
    <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-sm">
      <div
        className="aspect-video w-full"
        style={{
          background: `linear-gradient(135deg, ${accent} 0%, rgba(255,255,255,0.9) 100%)`,
        }}
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-medium text-lg">{data.name}</h3>
            <p className="text-sm text-neutral-600 mt-1">{data.description}</p>
          </div>
          <span className="inline-flex items-center text-xs font-medium rounded-full border border-neutral-200 px-2 py-1 bg-white text-neutral-700">
            {data.category}
          </span>
        </div>
      </div>
    </div>
  );
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function Editor({ initial, accent, onAccentChange, onClose }) {
  const [data, setData] = useState(initial);

  const htmlExport = useMemo(() => {
    const safe = {
      name: (data.name || '').replace(/</g, '&lt;'),
      description: (data.description || '').replace(/</g, '&lt;'),
      category: (data.category || '').replace(/</g, '&lt;'),
    };
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safe.name}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; margin: 0; background: #f6f6f6; }
    .card { max-width: 960px; margin: 40px auto; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
    .banner { aspect-ratio: 16 / 9; background: linear-gradient(135deg, ${accent} 0%, rgba(255,255,255,0.9) 100%); }
    .content { padding: 16px; }
    .title { font-size: 20px; font-weight: 600; margin: 0; }
    .desc { margin-top: 4px; color: #525252; font-size: 14px; line-height: 1.6; }
    .chip { display: inline-flex; align-items: center; font-size: 12px; border: 1px solid #e5e7eb; border-radius: 9999px; padding: 4px 8px; background: #fff; color: #404040; }
  </style>
</head>
<body>
  <div class="card">
    <div class="banner"></div>
    <div class="content">
      <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;">
        <div>
          <h1 class="title">${safe.name}</h1>
          <p class="desc">${safe.description}</p>
        </div>
        <span class="chip">${safe.category}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  }, [data, accent]);

  return (
    <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Editor</h3>
          <button onClick={onClose} className="text-sm px-3 py-1.5 rounded-md border border-neutral-300 hover:border-neutral-400">Close</button>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4">
          <Field label="Template name">
            <input
              type="text"
              value={data.name}
              onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              value={data.description}
              onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </Field>
          <Field label="Category">
            <select
              value={data.category}
              onChange={(e) => setData((d) => ({ ...d, category: e.target.value }))}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900 bg-white"
            >
              {['Landing', 'Portfolio', 'Dashboard', 'Blog'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Accent color">
            <input
              type="color"
              value={accent}
              onChange={(e) => onAccentChange(e.target.value)}
              className="h-10 w-16 rounded-md border border-neutral-300 p-1"
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => downloadFile(`${data.name.replace(/\s+/g, '-').toLowerCase() || 'template'}.html`, htmlExport)}
            className="px-4 py-2 rounded-md border border-neutral-300 bg-white hover:border-neutral-400 text-sm"
          >
            Export HTML
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(htmlExport)}
            className="px-4 py-2 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 text-sm"
          >
            Copy HTML
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="font-semibold">Live preview</h3>
        <div className="mt-4">
          <PreviewCard data={data} accent={accent} />
        </div>
      </div>
    </div>
  );
}

export default Editor;
