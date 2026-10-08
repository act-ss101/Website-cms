/**
 * CMS Panel — Full content management with version history and media library
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Palette, Layout, FileText, Globe, Plus, Trash2, Check, History, Image, RotateCcw, Clock, Upload, AlertCircle } from 'lucide-react';
import { useCMS, NewsItem } from '../context/CMSContext';
import { uploadFile, listMedia, deleteMedia, MediaItem, formatFileSize } from '../services/mediaService';
import { useAuth } from '../context/AuthContext';

type CMSTab = 'content' | 'theme' | 'layout' | 'news' | 'versions' | 'media';

export function CMSPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<CMSTab>('content');
  const { content, setContent, theme, setTheme, layout, setLayout, themes, versions, saveVersion, rollbackToVersion } = useCMS();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [saveNote, setSaveNote] = useState('');

  const handleSave = async () => {
    const note = saveNote || 'Manual save';
    await saveVersion(note);
    setSaveNote('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: CMSTab; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: 'Content', icon: <FileText size={14} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={14} /> },
    { id: 'layout', label: 'Layout', icon: <Layout size={14} /> },
    { id: 'news', label: 'News', icon: <Globe size={14} /> },
    { id: 'versions', label: 'History', icon: <History size={14} /> },
    { id: 'media', label: 'Media', icon: <Image size={14} /> },
  ];

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-forest text-cream px-5 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-display text-base font-semibold">CMS Panel</h2>
          <p className="text-cream/60 text-[10px]">Content Management · {user?.name || 'Guest'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gold text-forest hover:bg-gold-light'}`}>
            {saved ? <><Check size={12} /> Saved</> : <><Save size={12} /> Save</>}
          </button>
          <button onClick={onClose} className="p-1.5 hover:bg-cream/10 rounded-lg"><X size={16} /></button>
        </div>
      </div>

      {/* Save Note */}
      <div className="px-5 py-2 border-b border-gray-100 flex items-center gap-2 flex-shrink-0">
        <input value={saveNote} onChange={e => setSaveNote(e.target.value)} placeholder="Version note (optional)" className="flex-1 px-2 py-1 text-xs rounded border border-gray-200 focus:outline-none focus:border-forest" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 flex-shrink-0 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-shrink-0 px-3 py-2.5 text-[11px] font-medium flex items-center gap-1 transition-all border-b-2 ${tab === t.id ? 'border-forest text-forest' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'content' && <ContentEditor content={content} setContent={setContent} />}
        {tab === 'theme' && <ThemeEditor theme={theme} setTheme={setTheme} themes={themes} />}
        {tab === 'layout' && <LayoutEditor layout={layout} setLayout={setLayout} />}
        {tab === 'news' && <NewsEditor content={content} setContent={setContent} />}
        {tab === 'versions' && <VersionsPanel versions={versions} onRollback={rollbackToVersion} />}
        {tab === 'media' && <MediaPanel />}
      </div>
    </motion.div>
  );
}

// ─── CONTENT EDITOR ────────────────────────────────────────────────────────────
function ContentEditor({ content, setContent }: { content: any; setContent: any }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={<FileText size={14} />} title="Hero Section" />
      <div className="space-y-3">
        <Field label="Title (\n for line break)">
          <textarea value={content.heroTitle} onChange={e => setContent({ ...content, heroTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none" rows={3} />
        </Field>
        <Field label="Subtitle">
          <textarea value={content.heroSubtitle} onChange={e => setContent({ ...content, heroSubtitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none" rows={2} />
        </Field>
        <Field label="CTA Button">
          <input value={content.heroCTA} onChange={e => setContent({ ...content, heroCTA: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest" />
        </Field>
      </div>

      <SectionTitle icon={<FileText size={14} />} title="About Section" />
      <div className="space-y-3">
        <Field label="Title">
          <input value={content.aboutTitle} onChange={e => setContent({ ...content, aboutTitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest" />
        </Field>
        <Field label="Description">
          <textarea value={content.aboutText} onChange={e => setContent({ ...content, aboutText: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none" rows={4} />
        </Field>
      </div>

      <SectionTitle icon={<Globe size={14} />} title="Announcements" />
      <div className="space-y-2">
        {content.announcements.map((a: string, i: number) => (
          <div key={i} className="flex items-center gap-2">
            <input value={a} onChange={e => { const n = [...content.announcements]; n[i] = e.target.value; setContent({ ...content, announcements: n }); }} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest" />
            <button onClick={() => setContent({ ...content, announcements: content.announcements.filter((_: any, j: number) => j !== i) })} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={12} /></button>
          </div>
        ))}
        <button onClick={() => setContent({ ...content, announcements: [...content.announcements, 'New announcement'] })} className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-xs text-gray-500 hover:border-forest hover:text-forest flex items-center justify-center gap-1"><Plus size={12} /> Add</button>
      </div>
    </div>
  );
}

// ─── THEME EDITOR ──────────────────────────────────────────────────────────────
function ThemeEditor({ theme, setTheme, themes }: { theme: any; setTheme: any; themes: any[] }) {
  return (
    <div className="space-y-5">
      <SectionTitle icon={<Palette size={14} />} title="Preset Themes" />
      <div className="grid grid-cols-2 gap-2">
        {themes.map((t: any, i: number) => (
          <button key={i} onClick={() => setTheme(t)} className={`p-2.5 rounded-xl border-2 transition-all text-left ${theme.name === t.name ? 'border-forest shadow-md' : 'border-gray-200 hover:border-gray-300'}`}>
            <div className="flex gap-1 mb-1.5">
              <div className="w-5 h-5 rounded-full" style={{ background: t.primary }}></div>
              <div className="w-5 h-5 rounded-full" style={{ background: t.secondary }}></div>
              <div className="w-5 h-5 rounded-full border" style={{ background: t.background }}></div>
            </div>
            <span className="text-[11px] font-medium text-charcoal">{t.name}</span>
            {theme.name === t.name && <Check size={10} className="text-forest inline ml-1" />}
          </button>
        ))}
      </div>

      <SectionTitle icon={<Palette size={14} />} title="Custom Colors" />
      <div className="space-y-2">
        {[{ label: 'Primary', key: 'primary' }, { label: 'Accent', key: 'secondary' }, { label: 'Background', key: 'background' }, { label: 'Text', key: 'text' }].map((c: any) => (
          <div key={c.key} className="flex items-center gap-2">
            <input type="color" value={(theme as any)[c.key]} onChange={e => setTheme({ ...theme, [c.key]: e.target.value })} className="w-8 h-8 rounded border border-gray-200 cursor-pointer" />
            <div className="flex-1">
              <label className="text-[10px] text-gray-500">{c.label}</label>
              <input value={(theme as any)[c.key]} onChange={e => setTheme({ ...theme, [c.key]: e.target.value })} className="w-full px-2 py-1 rounded border border-gray-200 text-[10px] font-mono" />
            </div>
          </div>
        ))}
      </div>

      <SectionTitle icon={<Layout size={14} />} title="Border Radius" />
      <div className="flex items-center gap-2">
        <input type="range" min="0" max="24" value={parseInt(theme.radius)} onChange={e => setTheme({ ...theme, radius: `${e.target.value}px` })} className="flex-1 accent-forest" />
        <span className="text-xs font-mono text-charcoal w-10 text-right">{theme.radius}</span>
      </div>
    </div>
  );
}

// ─── LAYOUT EDITOR ─────────────────────────────────────────────────────────────
function LayoutEditor({ layout, setLayout }: { layout: any; setLayout: any }) {
  const settings = [
    { label: 'Hero Style', key: 'heroStyle', options: [{ value: 'cinematic', label: 'Cinematic' }, { value: 'minimal', label: 'Minimal' }, { value: 'split', label: 'Split' }] },
    { label: 'Navigation', key: 'navStyle', options: [{ value: 'transparent', label: 'Transparent' }, { value: 'solid', label: 'Solid' }, { value: 'floating', label: 'Floating' }] },
    { label: 'Cards', key: 'cardStyle', options: [{ value: 'elevated', label: 'Elevated' }, { value: 'flat', label: 'Flat' }, { value: 'bordered', label: 'Bordered' }] },
    { label: 'Footer', key: 'footerStyle', options: [{ value: 'full', label: 'Full' }, { value: 'compact', label: 'Compact' }, { value: 'minimal', label: 'Minimal' }] },
  ];

  return (
    <div className="space-y-5">
      {settings.map((s: any) => (
        <div key={s.key}>
          <h4 className="text-xs font-semibold text-charcoal mb-2">{s.label}</h4>
          <div className="grid grid-cols-3 gap-1.5">
            {s.options.map((o: any) => (
              <button key={o.value} onClick={() => setLayout({ ...layout, [s.key]: o.value })} className={`p-2 rounded-lg border text-center transition-all ${layout[s.key] === o.value ? 'border-forest bg-forest/5 text-forest' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <span className="text-[10px] font-medium">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NEWS EDITOR ───────────────────────────────────────────────────────────────
function NewsEditor({ content, setContent }: { content: any; setContent: any }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addNews = () => {
    const newItem: NewsItem = { id: Date.now().toString(), title: 'New Article', excerpt: 'Excerpt...', date: new Date().toISOString().split('T')[0], category: 'General', published: false };
    setContent({ ...content, newsItems: [newItem, ...content.newsItems] });
    setEditingId(newItem.id);
  };

  const updateNews = (id: string, field: string, value: any) => {
    setContent({ ...content, newsItems: content.newsItems.map((n: NewsItem) => n.id === id ? { ...n, [field]: value } : n) });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionTitle icon={<Globe size={14} />} title="News Articles" />
        <button onClick={addNews} className="px-2.5 py-1 bg-forest text-cream rounded text-[10px] font-medium flex items-center gap-1"><Plus size={10} /> Add</button>
      </div>

      {content.newsItems.map((news: NewsItem) => (
        <div key={news.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-2.5 bg-gray-50 cursor-pointer hover:bg-gray-100" onClick={() => setEditingId(editingId === news.id ? null : news.id)}>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${news.published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs font-medium text-charcoal truncate max-w-[180px]">{news.title}</span>
            </div>
            <span className="text-[10px] text-gray-400">{news.date}</span>
          </div>
          <AnimatePresence>
            {editingId === news.id && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                <div className="p-3 space-y-2 border-t border-gray-200">
                  <input value={news.title} onChange={e => updateNews(news.id, 'title', e.target.value)} placeholder="Title" className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-forest" />
                  <textarea value={news.excerpt} onChange={e => updateNews(news.id, 'excerpt', e.target.value)} placeholder="Excerpt" className="w-full px-2 py-1.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-forest resize-none" rows={2} />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" value={news.date} onChange={e => updateNews(news.id, 'date', e.target.value)} className="px-2 py-1.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-forest" />
                    <select value={news.category} onChange={e => updateNews(news.id, 'category', e.target.value)} className="px-2 py-1.5 rounded border border-gray-200 text-xs focus:outline-none focus:border-forest">
                      <option>Tournament</option><option>Dining</option><option>Course</option><option>Program</option><option>General</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={news.published} onChange={e => updateNews(news.id, 'published', e.target.checked)} className="w-3.5 h-3.5 rounded accent-forest" />
                      <span className="text-[10px] text-gray-600">Published</span>
                    </label>
                    <button onClick={() => setContent({ ...content, newsItems: content.newsItems.filter((n: NewsItem) => n.id !== news.id) })} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={12} /></button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

// ─── VERSIONS PANEL ────────────────────────────────────────────────────────────
function VersionsPanel({ versions, onRollback }: { versions: any[]; onRollback: (id: string) => void }) {
  const [confirmId, setConfirmId] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <SectionTitle icon={<History size={14} />} title="Version History" />
      <p className="text-[10px] text-gray-500">Click rollback to restore a previous version. A new version will be created.</p>

      {versions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          <Clock size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs">No versions saved yet</p>
          <p className="text-[10px]">Use the Save button to create versions</p>
        </div>
      ) : (
        <div className="space-y-2">
          {versions.map((v, i) => (
            <div key={v.id} className={`p-3 rounded-lg border ${i === 0 ? 'border-forest/30 bg-forest/5' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-charcoal">{v.note}</span>
                {i === 0 && <span className="text-[9px] bg-forest text-cream px-1.5 py-0.5 rounded">Current</span>}
              </div>
              <p className="text-[10px] text-gray-400 mb-2">{new Date(v.createdAt).toLocaleString()}</p>
              {i > 0 && (
                confirmId === v.id ? (
                  <div className="flex gap-2">
                    <button onClick={() => { onRollback(v.id); setConfirmId(null); }} className="px-2 py-1 bg-amber-500 text-white rounded text-[10px] font-medium flex items-center gap-1"><RotateCcw size={10} /> Confirm</button>
                    <button onClick={() => setConfirmId(null)} className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-[10px]">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setConfirmId(v.id)} className="text-[10px] text-forest hover:underline flex items-center gap-1"><RotateCcw size={10} /> Rollback</button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MEDIA PANEL ───────────────────────────────────────────────────────────────
function MediaPanel() {
  const { user } = useAuth();
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => { loadMedia(); }, []);

  const loadMedia = async () => {
    const items = await listMedia({ limit: 20 });
    setMedia(items);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    setError('');
    try {
      await uploadFile(file, user.id);
      await loadMedia();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteMedia(id, user.id);
    await loadMedia();
  };

  return (
    <div className="space-y-3">
      <SectionTitle icon={<Image size={14} />} title="Media Library" />

      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" id="cms-upload" />
        <label htmlFor="cms-upload" className="cursor-pointer">
          <Upload size={20} className="mx-auto text-gray-400 mb-1" />
          <p className="text-xs text-gray-500">{uploading ? 'Uploading...' : 'Click to upload (max 5MB)'}</p>
        </label>
      </div>

      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {media.length === 0 ? (
        <p className="text-center text-xs text-gray-400 py-4">No media files yet</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {media.map(item => (
            <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
              <img src={item.dataUrl} alt={item.alt?.en || ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-500 text-white rounded-full"><Trash2 size={12} /></button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-0.5">
                <p className="text-[8px] text-white truncate">{item.filename}</p>
                <p className="text-[8px] text-white/60">{formatFileSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── UI HELPERS ────────────────────────────────────────────────────────────────
function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <h3 className="font-semibold text-charcoal text-xs flex items-center gap-1.5">{icon} {title}</h3>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] text-gray-500 block mb-1">{label}</label>
      {children}
    </div>
  );
}
