import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Palette, Layout, FileText, Image, Type, Globe, ChevronDown, ChevronRight, Eye, EyeOff, Plus, Trash2, GripVertical, Check } from 'lucide-react';
import { useCMS, NewsItem } from '../context/CMSContext';

type CMSTab = 'content' | 'theme' | 'layout' | 'news';

export function CMSPanel({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<CMSTab>('content');
  const { content, setContent, theme, setTheme, layout, setLayout, themes } = useCMS();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: CMSTab; label: string; icon: React.ReactNode }[] = [
    { id: 'content', label: 'Content', icon: <FileText size={16} /> },
    { id: 'theme', label: 'Theme', icon: <Palette size={16} /> },
    { id: 'layout', label: 'Layout', icon: <Layout size={16} /> },
    { id: 'news', label: 'News', icon: <Globe size={16} /> },
  ];

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-forest text-cream px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="font-display text-lg font-semibold">CMS Panel</h2>
          <p className="text-cream/60 text-xs">Content Management System</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${saved ? 'bg-green-500 text-white' : 'bg-gold text-forest hover:bg-gold-light'}`}>
            {saved ? <><Check size={14} /> Saved</> : <><Save size={14} /> Save</>}
          </button>
          <button onClick={onClose} className="p-2 hover:bg-cream/10 rounded-lg"><X size={18} /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 flex-shrink-0">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 px-4 py-3 text-xs font-medium flex items-center justify-center gap-1.5 transition-all border-b-2 ${tab === t.id ? 'border-forest text-forest' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {tab === 'content' && <ContentEditor content={content} setContent={setContent} />}
        {tab === 'theme' && <ThemeEditor theme={theme} setTheme={setTheme} themes={themes} />}
        {tab === 'layout' && <LayoutEditor layout={layout} setLayout={setLayout} />}
        {tab === 'news' && <NewsEditor content={content} setContent={setContent} />}
      </div>
    </motion.div>
  );
}

// ─── CONTENT EDITOR ─────────────────────────────────────────────────────────────
function ContentEditor({ content, setContent }: { content: any; setContent: any }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-charcoal text-sm mb-3 flex items-center gap-2"><Type size={14} className="text-gold" /> Hero Section</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Title (use \n for line break)</label>
            <textarea
              value={content.heroTitle}
              onChange={e => setContent({ ...content, heroTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Subtitle</label>
            <textarea
              value={content.heroSubtitle}
              onChange={e => setContent({ ...content, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none"
              rows={2}
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">CTA Button Text</label>
            <input
              value={content.heroCTA}
              onChange={e => setContent({ ...content, heroCTA: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-charcoal text-sm mb-3 flex items-center gap-2"><FileText size={14} className="text-gold" /> About Section</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Title</label>
            <input
              value={content.aboutTitle}
              onChange={e => setContent({ ...content, aboutTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Description</label>
            <textarea
              value={content.aboutText}
              onChange={e => setContent({ ...content, aboutText: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none"
              rows={4}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-charcoal text-sm mb-3 flex items-center gap-2"><Globe size={14} className="text-gold" /> Announcements</h3>
        <div className="space-y-2">
          {content.announcements.map((a: string, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={a}
                onChange={e => {
                  const newAnnouncements = [...content.announcements];
                  newAnnouncements[i] = e.target.value;
                  setContent({ ...content, announcements: newAnnouncements });
                }}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest"
              />
              <button
                onClick={() => setContent({ ...content, announcements: content.announcements.filter((_: any, j: number) => j !== i) })}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={() => setContent({ ...content, announcements: [...content.announcements, 'New announcement'] })}
            className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-500 hover:border-forest hover:text-forest transition-colors flex items-center justify-center gap-1"
          >
            <Plus size={14} /> Add Announcement
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── THEME EDITOR ───────────────────────────────────────────────────────────────
function ThemeEditor({ theme, setTheme, themes }: { theme: any; setTheme: any; themes: any[] }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-charcoal text-sm mb-3 flex items-center gap-2"><Palette size={14} className="text-gold" /> Preset Themes</h3>
        <div className="grid grid-cols-2 gap-3">
          {themes.map((t: any, i: number) => (
            <button
              key={i}
              onClick={() => setTheme(t)}
              className={`p-3 rounded-xl border-2 transition-all ${theme.name === t.name ? 'border-forest shadow-md' : 'border-gray-200 hover:border-gray-300'}`}
            >
              <div className="flex gap-1 mb-2">
                <div className="w-6 h-6 rounded-full" style={{ background: t.primary }}></div>
                <div className="w-6 h-6 rounded-full" style={{ background: t.secondary }}></div>
                <div className="w-6 h-6 rounded-full border" style={{ background: t.background }}></div>
              </div>
              <span className="text-xs font-medium text-charcoal">{t.name}</span>
              {theme.name === t.name && <Check size={12} className="text-forest inline ml-1" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-charcoal text-sm mb-3 flex items-center gap-2"><Type size={14} className="text-gold" /> Custom Colors</h3>
        <div className="space-y-3">
          {[
            { label: 'Primary', key: 'primary' },
            { label: 'Secondary/Accent', key: 'secondary' },
            { label: 'Background', key: 'background' },
            { label: 'Text', key: 'text' },
          ].map((c: any) => (
            <div key={c.key} className="flex items-center gap-3">
              <input
                type="color"
                value={(theme as any)[c.key]}
                onChange={e => setTheme({ ...theme, [c.key]: e.target.value })}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
              />
              <div className="flex-1">
                <label className="text-xs text-gray-500">{c.label}</label>
                <input
                  value={(theme as any)[c.key]}
                  onChange={e => setTheme({ ...theme, [c.key]: e.target.value })}
                  className="w-full px-2 py-1 rounded border border-gray-200 text-xs font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-charcoal text-sm mb-3">Border Radius</h3>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="24"
            value={parseInt(theme.radius)}
            onChange={e => setTheme({ ...theme, radius: `${e.target.value}px` })}
            className="flex-1 accent-forest"
          />
          <span className="text-sm font-mono text-charcoal w-12 text-right">{theme.radius}</span>
        </div>
      </div>
    </div>
  );
}

// ─── LAYOUT EDITOR ──────────────────────────────────────────────────────────────
function LayoutEditor({ layout, setLayout }: { layout: any; setLayout: any }) {
  return (
    <div className="space-y-6">
      {[
        {
          label: 'Hero Style',
          key: 'heroStyle',
          options: [
            { value: 'cinematic', label: 'Cinematic', desc: 'Full-screen with parallax' },
            { value: 'minimal', label: 'Minimal', desc: 'Clean, centered content' },
            { value: 'split', label: 'Split', desc: 'Image + text side by side' },
          ],
        },
        {
          label: 'Navigation Style',
          key: 'navStyle',
          options: [
            { value: 'transparent', label: 'Transparent', desc: 'Overlays hero section' },
            { value: 'solid', label: 'Solid', desc: 'Opaque background always' },
            { value: 'floating', label: 'Floating', desc: 'Floating card with shadow' },
          ],
        },
        {
          label: 'Card Style',
          key: 'cardStyle',
          options: [
            { value: 'elevated', label: 'Elevated', desc: 'Shadow + rounded corners' },
            { value: 'flat', label: 'Flat', desc: 'Background color only' },
            { value: 'bordered', label: 'Bordered', desc: 'Border outline style' },
          ],
        },
        {
          label: 'Footer Style',
          key: 'footerStyle',
          options: [
            { value: 'full', label: 'Full', desc: 'All links and info' },
            { value: 'compact', label: 'Compact', desc: 'Essential links only' },
            { value: 'minimal', label: 'Minimal', desc: 'Copyright only' },
          ],
        },
      ].map((setting: any) => (
        <div key={setting.key}>
          <h3 className="font-semibold text-charcoal text-sm mb-3">{setting.label}</h3>
          <div className="grid grid-cols-3 gap-2">
            {setting.options.map((opt: any) => (
              <button
                key={opt.value}
                onClick={() => setLayout({ ...layout, [setting.key]: opt.value })}
                className={`p-3 rounded-xl border-2 text-center transition-all ${layout[setting.key] === opt.value ? 'border-forest bg-forest/5' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="text-xs font-medium text-charcoal">{opt.label}</div>
                <div className="text-[10px] text-gray-500 mt-0.5">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── NEWS EDITOR ────────────────────────────────────────────────────────────────
function NewsEditor({ content, setContent }: { content: any; setContent: any }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  const addNews = () => {
    const newItem: NewsItem = {
      id: Date.now().toString(),
      title: 'New Article',
      excerpt: 'Article excerpt goes here...',
      date: new Date().toISOString().split('T')[0],
      category: 'General',
      published: false,
    };
    setContent({ ...content, newsItems: [newItem, ...content.newsItems] });
    setEditingId(newItem.id);
  };

  const updateNews = (id: string, field: string, value: any) => {
    setContent({
      ...content,
      newsItems: content.newsItems.map((n: NewsItem) => n.id === id ? { ...n, [field]: value } : n),
    });
  };

  const deleteNews = (id: string) => {
    setContent({ ...content, newsItems: content.newsItems.filter((n: NewsItem) => n.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-charcoal text-sm">News & Articles</h3>
        <button onClick={addNews} className="px-3 py-1.5 bg-forest text-cream rounded-lg text-xs font-medium flex items-center gap-1">
          <Plus size={12} /> Add Article
        </button>
      </div>

      {content.newsItems.map((news: NewsItem) => (
        <div key={news.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => setEditingId(editingId === news.id ? null : news.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${news.published ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm font-medium text-charcoal">{news.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{news.date}</span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${editingId === news.id ? 'rotate-180' : ''}`} />
            </div>
          </div>

          <AnimatePresence>
            {editingId === news.id && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-4 space-y-3 border-t border-gray-200">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Title</label>
                    <input
                      value={news.title}
                      onChange={e => updateNews(news.id, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Excerpt</label>
                    <textarea
                      value={news.excerpt}
                      onChange={e => updateNews(news.id, 'excerpt', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Date</label>
                      <input
                        type="date"
                        value={news.date}
                        onChange={e => updateNews(news.id, 'date', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Category</label>
                      <select
                        value={news.category}
                        onChange={e => updateNews(news.id, 'category', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest"
                      >
                        <option>Tournament</option>
                        <option>Dining</option>
                        <option>Course</option>
                        <option>Program</option>
                        <option>General</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={news.published}
                        onChange={e => updateNews(news.id, 'published', e.target.checked)}
                        className="w-4 h-4 rounded accent-forest"
                      />
                      <span className="text-xs text-gray-600">Published</span>
                    </label>
                    <button onClick={() => deleteNews(news.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
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
