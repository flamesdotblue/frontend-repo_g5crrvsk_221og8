import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Type, Square, MousePointer2, Trash2, Copy, Download, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from 'lucide-react';

// Simple ID generator
const uid = () => Math.random().toString(36).slice(2, 9);

const PALETTE = ['#60a5fa', '#34d399', '#f472b6', '#f59e0b', '#a78bfa', '#22d3ee', '#ef4444'];

// Element defaults per type
const DEFAULTS = {
  heading: { content: 'Headline', styles: { fontSize: 36, fontWeight: 700, color: '#ffffff' } },
  text: { content: 'Start typing your content...', styles: { fontSize: 16, fontWeight: 400, color: '#e5e7eb' } },
  button: { content: 'Get Started', styles: { fontSize: 16, fontWeight: 600, color: '#111827', backgroundColor: '#ffffff', paddingX: 16, paddingY: 10, borderRadius: 10 } },
  box: { content: '', styles: { backgroundColor: '#111827', width: 240, height: 120, borderRadius: 16, borderColor: '#ffffff22', borderWidth: 1 } },
};

export default function Editor({ activeTemplate, onClose }) {
  const [open, setOpen] = useState(false);
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [accent, setAccent] = useState('#60a5fa');
  const canvasRef = useRef(null);
  const dragRef = useRef({ id: null, offsetX: 0, offsetY: 0, dragging: false });

  useEffect(() => {
    if (activeTemplate) {
      // Initialize with a few elements based on template
      const seed = [
        mk('heading', 60, 40, { content: activeTemplate.name || 'Your Headline' }),
        mk('text', 60, 100, { content: activeTemplate.description || 'A short, punchy description goes right here.' }),
        mk('button', 60, 160),
      ];
      setElements(seed);
      setAccent(activeTemplate.accent || '#60a5fa');
      setOpen(true);
      setSelectedId(seed[0].id);
    }
  }, [activeTemplate]);

  const selected = useMemo(() => elements.find((e) => e.id === selectedId), [elements, selectedId]);

  function mk(type, x, y, overrides = {}) {
    const base = DEFAULTS[type];
    return {
      id: uid(),
      type,
      x,
      y,
      ...('styles' in base ? { styles: { ...base.styles } } : {}),
      content: base.content ?? '',
      ...overrides,
    };
  }

  function addElement(type) {
    const rect = canvasRef.current?.getBoundingClientRect();
    const x = Math.round((rect?.width || 800) / 2 - 120);
    const y = 60;
    setElements((els) => [...els, mk(type, x, y)]);
  }

  function onDragStartNew(type, e) {
    e.dataTransfer.setData('application/x-eltype', type);
    e.dataTransfer.effectAllowed = 'copy';
  }

  function onDropNew(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData('application/x-eltype');
    if (!type) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left - 40);
    const y = Math.round(e.clientY - rect.top - 20);
    const el = mk(type, Math.max(8, x), Math.max(8, y));
    setElements((els) => [...els, el]);
    setSelectedId(el.id);
  }

  function onMouseDownEl(e, id) {
    const rect = canvasRef.current.getBoundingClientRect();
    const el = elements.find((x) => x.id === id);
    if (!el) return;
    const offsetX = e.clientX - rect.left - el.x;
    const offsetY = e.clientY - rect.top - el.y;
    dragRef.current = { id, offsetX, offsetY, dragging: true };
    setSelectedId(id);
  }

  function onMouseMoveCanvas(e) {
    if (!dragRef.current.dragging) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left - dragRef.current.offsetX);
    const y = Math.round(e.clientY - rect.top - dragRef.current.offsetY);
    setElements((els) => els.map((el) => (el.id === dragRef.current.id ? { ...el, x: Math.max(4, x), y: Math.max(4, y) } : el)));
  }

  function onMouseUpCanvas() {
    dragRef.current.dragging = false;
  }

  function updateSelected(patch) {
    setElements((els) => els.map((el) => (el.id === selectedId ? { ...el, ...patch, styles: { ...el.styles, ...(patch.styles || {}) } } : el)));
  }

  function duplicateSelected() {
    const el = selected;
    if (!el) return;
    const clone = { ...el, id: uid(), x: el.x + 24, y: el.y + 24 };
    setElements((els) => [...els, clone]);
    setSelectedId(clone.id);
  }

  function deleteSelected() {
    setElements((els) => els.filter((x) => x.id !== selectedId));
    setSelectedId(null);
  }

  function exportHTML() {
    const html = renderExportHTML(elements, accent);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page.html';
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyHTML() {
    const html = renderExportHTML(elements, accent);
    navigator.clipboard.writeText(html);
  }

  if (!open) return (
    <section id="builder" className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-6 text-white/70">
          Open a template above to start editing with the drag-and-drop builder.
        </div>
      </div>
    </section>
  );

  return (
    <section id="builder" className="py-16">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/60">Accent</span>
            <div className="flex items-center gap-2">
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => setAccent(c)}
                  className="h-6 w-6 rounded-full border border-white/20"
                  style={{ background: c, outline: accent === c ? '2px solid white' : 'none' }}
                  aria-label={`Set accent ${c}`}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={duplicateSelected} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:border-white/30"><Copy size={16}/>Duplicate</button>
            <button onClick={deleteSelected} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:border-white/30"><Trash2 size={16}/>Delete</button>
            <button onClick={exportHTML} className="inline-flex items-center gap-2 rounded-lg bg-white text-neutral-900 px-3 py-1.5 text-sm font-medium hover:bg-white/90"><Download size={16}/>Export HTML</button>
            <button onClick={() => { copyHTML(); }} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:border-white/30">Copy HTML</button>
            <button onClick={onClose} className="ml-2 inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm hover:border-white/30">Close</button>
          </div>
        </div>

        <div className="grid grid-cols-[260px_1fr_280px] gap-4">
          {/* Left: Palette */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-white"><Plus size={16}/> Add blocks</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div
                draggable
                onDragStart={(e) => onDragStartNew('heading', e)}
                onClick={() => addElement('heading')}
                className="cursor-grab rounded-lg border border-white/10 bg-neutral-800/60 p-3 hover:border-white/20"
              >
                <Type size={16} className="mb-2"/>
                Heading
              </div>
              <div
                draggable
                onDragStart={(e) => onDragStartNew('text', e)}
                onClick={() => addElement('text')}
                className="cursor-grab rounded-lg border border-white/10 bg-neutral-800/60 p-3 hover:border-white/20"
              >
                <AlignLeft size={16} className="mb-2"/>
                Paragraph
              </div>
              <div
                draggable
                onDragStart={(e) => onDragStartNew('button', e)}
                onClick={() => addElement('button')}
                className="cursor-grab rounded-lg border border-white/10 bg-neutral-800/60 p-3 hover:border-white/20"
              >
                <MousePointer2 size={16} className="mb-2"/>
                Button
              </div>
              <div
                draggable
                onDragStart={(e) => onDragStartNew('box', e)}
                onClick={() => addElement('box')}
                className="cursor-grab rounded-lg border border-white/10 bg-neutral-800/60 p-3 hover:border-white/20"
              >
                <Square size={16} className="mb-2"/>
                Box
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div
            ref={canvasRef}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDropNew}
            onMouseMove={onMouseMoveCanvas}
            onMouseUp={onMouseUpCanvas}
            className="relative min-h-[560px] rounded-xl border border-white/10 bg-neutral-900/40"
            style={{
              background: `radial-gradient(600px 200px at 0% 0%, ${accent}14, transparent), radial-gradient(600px 200px at 100% 100%, ${accent}14, transparent)`,
            }}
          >
            <GridLines />
            {elements.map((el) => (
              <ElementView
                key={el.id}
                el={el}
                accent={accent}
                selected={selectedId === el.id}
                onMouseDown={(e) => onMouseDownEl(e, el.id)}
                onClick={() => setSelectedId(el.id)}
              />
            ))}
          </div>

          {/* Inspector */}
          <div className="rounded-xl border border-white/10 bg-neutral-900/50 p-3">
            <div className="text-sm font-medium text-white">Inspector</div>
            {!selected && (
              <div className="mt-3 text-sm text-white/60">Select an element to edit its content and styles.</div>
            )}
            {selected && (
              <div className="space-y-4 mt-3">
                <div>
                  <label className="text-xs text-white/60">Type</label>
                  <div className="mt-1 rounded-lg border border-white/10 bg-neutral-800/60 px-3 py-2 text-sm">{selected.type}</div>
                </div>

                {(selected.type === 'heading' || selected.type === 'text' || selected.type === 'button') && (
                  <div>
                    <label className="text-xs text-white/60">Text</label>
                    <input
                      value={selected.content}
                      onChange={(e) => updateSelected({ content: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-white/10 bg-neutral-800/60 px-3 py-2 text-sm outline-none focus:border-white/30"
                    />
                  </div>
                )}

                {/* Typography */}
                <div>
                  <label className="text-xs text-white/60">Typography</label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      min={10}
                      max={96}
                      value={selected.styles.fontSize || 16}
                      onChange={(e) => updateSelected({ styles: { fontSize: parseInt(e.target.value || '0', 10) } })}
                      className="col-span-1 w-full rounded-lg border border-white/10 bg-neutral-800/60 px-2 py-2 text-sm outline-none"
                    />
                    <button
                      onClick={() => updateSelected({ styles: { fontWeight: selected.styles.fontWeight === 700 ? 400 : 700 } })}
                      className={`inline-flex items-center justify-center rounded-lg border px-2 py-2 ${selected.styles.fontWeight >= 600 ? 'border-white/40 bg-white/10' : 'border-white/10 bg-neutral-800/60'}`}
                    >
                      <Bold size={16} />
                    </button>
                    <button
                      onClick={() => updateSelected({ styles: { fontStyle: selected.styles.fontStyle === 'italic' ? 'normal' : 'italic' } })}
                      className={`inline-flex items-center justify-center rounded-lg border px-2 py-2 ${selected.styles.fontStyle === 'italic' ? 'border-white/40 bg-white/10' : 'border-white/10 bg-neutral-800/60'}`}
                    >
                      <Italic size={16} />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => updateSelected({ styles: { textAlign: 'left' } })} className={`rounded-lg border px-2 py-2 ${selected.styles.textAlign === 'left' ? 'border-white/40 bg-white/10' : 'border-white/10 bg-neutral-800/60'}`}><AlignLeft size={16}/></button>
                    <button onClick={() => updateSelected({ styles: { textAlign: 'center' } })} className={`rounded-lg border px-2 py-2 ${selected.styles.textAlign === 'center' ? 'border-white/40 bg-white/10' : 'border-white/10 bg-neutral-800/60'}`}><AlignCenter size={16}/></button>
                    <button onClick={() => updateSelected({ styles: { textAlign: 'right' } })} className={`rounded-lg border px-2 py-2 ${selected.styles.textAlign === 'right' ? 'border-white/40 bg-white/10' : 'border-white/10 bg-neutral-800/60'}`}><AlignRight size={16}/></button>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <label className="text-xs text-white/60">Colors</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60 w-16">Text</span>
                      <input type="color" value={selected.styles.color || '#ffffff'} onChange={(e) => updateSelected({ styles: { color: e.target.value } })} />
                    </div>
                    {selected.type !== 'text' && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white/60 w-16">Background</span>
                        <input type="color" value={selected.styles.backgroundColor || '#00000000'} onChange={(e) => updateSelected({ styles: { backgroundColor: e.target.value } })} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Spacing */}
                <div>
                  <label className="text-xs text-white/60">Spacing & Radius</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <NumberField label="Padding X" value={selected.styles.paddingX || 0} onChange={(v) => updateSelected({ styles: { paddingX: v } })} />
                    <NumberField label="Padding Y" value={selected.styles.paddingY || 0} onChange={(v) => updateSelected({ styles: { paddingY: v } })} />
                    <NumberField label="Width" value={selected.styles.width || undefined} onChange={(v) => updateSelected({ styles: { width: v } })} />
                    <NumberField label="Height" value={selected.styles.height || undefined} onChange={(v) => updateSelected({ styles: { height: v } })} />
                    <NumberField label="Radius" value={selected.styles.borderRadius || 0} onChange={(v) => updateSelected({ styles: { borderRadius: v } })} />
                  </div>
                </div>

                {/* Border */}
                <div>
                  <label className="text-xs text-white/60">Border</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <NumberField label="Width" value={selected.styles.borderWidth || 0} onChange={(v) => updateSelected({ styles: { borderWidth: v } })} />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/60 w-16">Color</span>
                      <input type="color" value={selected.styles.borderColor || '#00000000'} onChange={(e) => updateSelected({ styles: { borderColor: e.target.value } })} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-20 text-xs text-white/60">{label}</span>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(parseInt(e.target.value || '0', 10))}
        className="w-full rounded-lg border border-white/10 bg-neutral-800/60 px-2 py-2 text-sm outline-none"
      />
    </div>
  );
}

function GridLines() {
  const lines = new Array(12).fill(0);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {lines.map((_, i) => (
        <div key={i} className="absolute left-0 right-0 border-t border-white/5" style={{ top: `${(i + 1) * (100 / 13)}%` }} />
      ))}
      {lines.map((_, i) => (
        <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-white/5" style={{ left: `${(i + 1) * (100 / 13)}%` }} />
      ))}
    </div>
  );
}

function ElementView({ el, selected, onMouseDown, onClick, accent }) {
  const style = {
    position: 'absolute',
    left: el.x,
    top: el.y,
    color: el.styles?.color,
    backgroundColor: el.styles?.backgroundColor,
    fontSize: el.styles?.fontSize,
    fontWeight: el.styles?.fontWeight,
    fontStyle: el.styles?.fontStyle,
    textAlign: el.styles?.textAlign,
    padding: `${el.styles?.paddingY || 0}px ${el.styles?.paddingX || 0}px`,
    width: el.styles?.width,
    height: el.styles?.height,
    borderRadius: el.styles?.borderRadius,
    borderWidth: el.styles?.borderWidth,
    borderColor: el.styles?.borderColor,
    borderStyle: el.styles?.borderWidth ? 'solid' : 'none',
    cursor: 'move',
  };

  let child = null;
  if (el.type === 'heading') {
    child = <div style={{ lineHeight: 1.1 }}>{el.content}</div>;
  } else if (el.type === 'text') {
    child = <div style={{ lineHeight: 1.6, opacity: 0.95 }}>{el.content}</div>;
  } else if (el.type === 'button') {
    child = (
      <button style={{
        background: el.styles?.backgroundColor || '#fff',
        color: el.styles?.color || '#111827',
        padding: `${el.styles?.paddingY || 10}px ${el.styles?.paddingX || 16}px`,
        borderRadius: el.styles?.borderRadius || 10,
        fontSize: el.styles?.fontSize || 16,
        fontWeight: el.styles?.fontWeight || 600,
      }}>
        {el.content}
      </button>
    );
  } else if (el.type === 'box') {
    child = <div style={{ width: el.styles?.width || 240, height: el.styles?.height || 120, borderRadius: el.styles?.borderRadius || 16, background: el.styles?.backgroundColor || '#111827', border: `${el.styles?.borderWidth || 0}px solid ${el.styles?.borderColor || 'transparent'}` }} />;
  }

  return (
    <div
      onMouseDown={onMouseDown}
      onClick={onClick}
      className={`group ${selected ? '' : ''}`}
      style={style}
    >
      {child}
      {/* Selection frame */}
      <div className={`pointer-events-none absolute -inset-2 rounded-lg ${selected ? 'ring-2 ring-white/60' : 'ring-0'} transition`} />
      {/* Accent handle */}
      {selected && (
        <div className="absolute -top-3 -left-3 h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
      )}
    </div>
  );
}

function renderExportHTML(elements, accent) {
  const items = elements
    .map((el) => {
      const s = el.styles || {};
      const base = [
        `position:absolute`,
        `left:${el.x}px`,
        `top:${el.y}px`,
        s.color ? `color:${s.color}` : null,
        s.backgroundColor ? `background:${s.backgroundColor}` : null,
        s.fontSize ? `font-size:${s.fontSize}px` : null,
        s.fontWeight ? `font-weight:${s.fontWeight}` : null,
        s.fontStyle ? `font-style:${s.fontStyle}` : null,
        s.textAlign ? `text-align:${s.textAlign}` : null,
        `padding:${s.paddingY || 0}px ${s.paddingX || 0}px`,
        s.width ? `width:${s.width}px` : null,
        s.height ? `height:${s.height}px` : null,
        s.borderRadius ? `border-radius:${s.borderRadius}px` : null,
        s.borderWidth ? `border:${s.borderWidth}px solid ${s.borderColor || 'transparent'}` : null,
      ].filter(Boolean).join(';');

      if (el.type === 'heading' || el.type === 'text') {
        return `<div style="${base}">${escapeHTML(el.content)}</div>`;
      }
      if (el.type === 'button') {
        const btn = [
          s.backgroundColor ? `background:${s.backgroundColor}` : `background:#fff`,
          `color:${s.color || '#111827'}`,
          `padding:${s.paddingY || 10}px ${s.paddingX || 16}px`,
          `border-radius:${s.borderRadius || 10}px`,
          `font-size:${s.fontSize || 16}px`,
          `font-weight:${s.fontWeight || 600}`,
        ].join(';');
        return `<div style="${base}"><button style="${btn}">${escapeHTML(el.content)}</button></div>`;
      }
      if (el.type === 'box') {
        const w = s.width || 240;
        const h = s.height || 120;
        const radius = s.borderRadius || 16;
        const bg = s.backgroundColor || '#111827';
        const border = s.borderWidth ? `border:${s.borderWidth}px solid ${s.borderColor || 'transparent'}` : '';
        return `<div style="${base}"><div style="width:${w}px;height:${h}px;border-radius:${radius}px;background:${bg};${border}"></div></div>`;
      }
      return '';
    })
    .join('\n');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Exported Page</title>
    <style>
      body{margin:0;background:#0a0a0a;color:#fff;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
      .canvas{position:relative;min-height:560px;overflow:hidden;background:radial-gradient(600px 200px at 0% 0%, ${accent}14, transparent), radial-gradient(600px 200px at 100% 100%, ${accent}14, transparent)}
    </style>
  </head>
  <body>
    <div class="canvas">
      ${items}
    </div>
  </body>
</html>`;
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
