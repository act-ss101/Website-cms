/**
 * CMSPageManager — Full page management with CRUD, draft/publish, versioning
 * Connects CMS operations to IndexedDB via cmsService
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FileText, Globe, Edit, Trash2, Eye, Clock, CheckCircle, AlertCircle, History, RotateCcw, Save, X } from 'lucide-react';
import { CMSPage, CMSVersion, createPage, updatePage, publishPage, unpublishPage, deletePage, getPageBySlug, listPages, getVersionHistory, rollbackToVersion } from '../services/cmsService';
import { useAuth } from '../context/AuthContext';
import { validateSlug } from '../services/validationService';

type ManagerView = 'list' | 'editor' | 'preview' | 'history';

export function CMSPageManager() {
  const { user } = useAuth();
  const [view, setView] = useState<ManagerView>('list');
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const loadPages = async () => {
    setLoading(true);
    try {
      const allPages = await listPages();
      setPages(allPages);
    } catch (e) {
      console.error('Failed to load pages:', e);
    }
    setLoading(false);
  };

  useEffect(() => { loadPages(); }, []);

  const filteredPages = statusFilter === 'all' ? pages : pages.filter(p => p.status === statusFilter);

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    try {
      await deletePage(pageId, user?.id || 'system');
      await loadPages();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handlePublish = async (pageId: string) => {
    try {
      await publishPage(pageId, user?.id || 'system');
      await loadPages();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const handleUnpublish = async (pageId: string) => {
    try {
      await unpublishPage(pageId, user?.id || 'system');
      await loadPages();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  if (view === 'editor') {
    return <PageEditor page={selectedPage} onBack={() => { setView('list'); setSelectedPage(null); loadPages(); }} userId={user?.id || 'system'} />;
  }

  if (view === 'preview' && selectedPage) {
    return <PagePreview page={selectedPage} onBack={() => { setView('list'); setSelectedPage(null); }} />;
  }

  if (view === 'history' && selectedPage) {
    return <PageHistory page={selectedPage} onBack={() => { setView('list'); setSelectedPage(null); loadPages(); }} userId={user?.id || 'system'} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl text-forest">Page Manager</h2>
          <p className="text-sm text-warm-gray">{pages.length} pages total</p>
        </div>
        <button onClick={() => { setSelectedPage(null); setView('editor'); }} className="flex items-center gap-2 px-4 py-2 bg-forest text-cream rounded-lg text-sm font-medium hover:bg-forest-light transition-colors">
          <Plus size={16} /> New Page
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {['all', 'draft', 'published', 'archived'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f ? 'bg-forest text-cream' : 'bg-gray-100 text-warm-gray hover:bg-gray-200'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Page List */}
      {loading ? (
        <div className="text-center py-12 text-warm-gray">Loading pages...</div>
      ) : filteredPages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="text-warm-gray">No pages found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPages.map(page => (
            <div key={page.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gold/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${page.status === 'published' ? 'bg-green-500' : page.status === 'draft' ? 'bg-yellow-500' : 'bg-gray-400'}`}></div>
                  <div>
                    <div className="font-medium text-forest">{page.title.en || page.slug}</div>
                    <div className="text-xs text-warm-gray">/{page.slug} · {page.type} · v{page.currentVersionId ? 'Active' : 'No version'}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-700' : page.status === 'draft' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    {page.status}
                  </span>
                  <button onClick={() => { setSelectedPage(page); setView('preview'); }} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Preview"><Eye size={14} className="text-gray-500" /></button>
                  <button onClick={() => { setSelectedPage(page); setView('editor'); }} className="p-1.5 hover:bg-gray-100 rounded-lg" title="Edit"><Edit size={14} className="text-gray-500" /></button>
                  <button onClick={() => { setSelectedPage(page); setView('history'); }} className="p-1.5 hover:bg-gray-100 rounded-lg" title="History"><History size={14} className="text-gray-500" /></button>
                  {page.status === 'draft' && <button onClick={() => handlePublish(page.id)} className="p-1.5 hover:bg-green-50 rounded-lg" title="Publish"><CheckCircle size={14} className="text-green-600" /></button>}
                  {page.status === 'published' && <button onClick={() => handleUnpublish(page.id)} className="p-1.5 hover:bg-yellow-50 rounded-lg" title="Unpublish"><AlertCircle size={14} className="text-yellow-600" /></button>}
                  <button onClick={() => handleDelete(page.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 size={14} className="text-red-500" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page Editor ────────────────────────────────────────────────────────────────
function PageEditor({ page, onBack, userId }: { page: CMSPage | null; onBack: () => void; userId: string }) {
  const [slug, setSlug] = useState(page?.slug || '');
  const [titleEn, setTitleEn] = useState(page?.title?.en || '');
  const [titleTh, setTitleTh] = useState(page?.title?.th || '');
  const [titleJa, setTitleJa] = useState(page?.title?.ja || '');
  const [contentEn, setContentEn] = useState(page?.content?.en || '');
  const [contentTh, setContentTh] = useState(page?.content?.th || '');
  const [contentType, setContentType] = useState<CMSPage['type']>(page?.type || 'page');
  const [changeNote, setChangeNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (asDraft: boolean = true) => {
    if (!slug || !validateSlug(slug)) { setError('Valid slug is required (lowercase, hyphens)'); return; }
    if (!titleEn) { setError('English title is required'); return; }

    setSaving(true);
    setError('');

    try {
      const data = {
        title: { en: titleEn, th: titleTh, ja: titleJa },
        content: { en: contentEn, th: contentTh },
        type: contentType,
      };

      if (page) {
        await updatePage(page.id, data, userId, changeNote || 'Updated via CMS');
      } else {
        await createPage({ slug, ...data, author: userId });
      }
      onBack();
    } catch (e: any) {
      setError(e.message);
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-warm-gray hover:text-forest"><X size={16} /> Back to Pages</button>
        <div className="flex items-center gap-2">
          <button onClick={() => handleSave(true)} disabled={saving} className="px-4 py-2 bg-gray-100 text-forest rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50">
            <Save size={14} className="inline mr-1" /> Save Draft
          </button>
          <button onClick={() => handleSave(false)} disabled={saving} className="px-4 py-2 bg-forest text-cream rounded-lg text-sm font-medium hover:bg-forest-light disabled:opacity-50">
            Save & Publish
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-medium text-forest">Page Settings</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-warm-gray mb-1">Slug (URL path)</label>
            <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))} disabled={!!page} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest disabled:bg-gray-50" placeholder="about-us" />
          </div>
          <div>
            <label className="block text-xs font-medium text-warm-gray mb-1">Type</label>
            <select value={contentType} onChange={e => setContentType(e.target.value as CMSPage['type'])} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest">
              <option value="page">Page</option>
              <option value="news">News</option>
              <option value="announcement">Announcement</option>
              <option value="template">Template</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-medium text-forest">Title (Multilingual)</h3>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">English *</label>
          <input value={titleEn} onChange={e => setTitleEn(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest" placeholder="Page title in English" />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Thai</label>
          <input value={titleTh} onChange={e => setTitleTh(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest" placeholder="หัวข้อภาษาไทย" />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Japanese</label>
          <input value={titleJa} onChange={e => setTitleJa(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest" placeholder="日本語のタイトル" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-medium text-forest">Content (Multilingual)</h3>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">English Content</label>
          <textarea value={contentEn} onChange={e => setContentEn(e.target.value)} rows={8} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none" placeholder="Page content in English..." />
        </div>
        <div>
          <label className="block text-xs font-medium text-warm-gray mb-1">Thai Content</label>
          <textarea value={contentTh} onChange={e => setContentTh(e.target.value)} rows={6} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest resize-none" placeholder="เนื้อหาภาษาไทย..." />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <label className="block text-xs font-medium text-warm-gray mb-1">Change Note</label>
        <input value={changeNote} onChange={e => setChangeNote(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-forest" placeholder="Describe what changed..." />
      </div>
    </div>
  );
}

// ─── Page Preview ───────────────────────────────────────────────────────────────
function PagePreview({ page, onBack }: { page: CMSPage; onBack: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-warm-gray hover:text-forest"><X size={16} /> Back</button>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {page.status}
        </span>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-100 flex items-center gap-2">
          <Globe size={14} className="text-gray-400" />
          <span className="text-xs text-warm-gray">/{page.slug}</span>
        </div>
        <div className="p-8">
          <h1 className="font-display text-3xl text-forest mb-2">{page.title.en}</h1>
          {page.title.th && <p className="text-warm-gray mb-1">{page.title.th}</p>}
          {page.title.ja && <p className="text-warm-gray mb-4">{page.title.ja}</p>}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <div className="prose max-w-none">
              <p className="text-warm-gray whitespace-pre-wrap">{page.content?.en || 'No content yet.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page History ───────────────────────────────────────────────────────────────
function PageHistory({ page, onBack, userId }: { page: CMSPage; onBack: () => void; userId: string }) {
  const [versions, setVersions] = useState<CMSVersion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVersionHistory(page.id).then(v => {
      setVersions(v);
      setLoading(false);
    });
  }, [page.id]);

  const handleRollback = async (versionId: string) => {
    if (!confirm('Rollback to this version? Current content will be replaced.')) return;
    try {
      await rollbackToVersion(page.id, versionId, userId);
      onBack();
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-warm-gray hover:text-forest"><X size={16} /> Back</button>
        <h3 className="font-medium text-forest">Version History: {page.title.en}</h3>
      </div>

      {loading ? (
        <div className="text-center py-8 text-warm-gray">Loading versions...</div>
      ) : versions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl text-warm-gray">No version history</div>
      ) : (
        <div className="space-y-3">
          {versions.map(v => (
            <div key={v.id} className={`bg-white rounded-xl border p-4 ${v.isCurrent ? 'border-gold bg-gold/5' : 'border-gray-100'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-forest text-sm">v{v.versionNumber}</span>
                    {v.isCurrent && <span className="px-1.5 py-0.5 bg-gold/20 text-gold text-[10px] font-medium rounded">CURRENT</span>}
                  </div>
                  <p className="text-xs text-warm-gray mt-1">{v.changeNote}</p>
                  <p className="text-xs text-warm-gray/60 mt-1">{new Date(v.createdAt).toLocaleString()} · by {v.createdBy}</p>
                </div>
                {!v.isCurrent && (
                  <button onClick={() => handleRollback(v.id)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-forest transition-colors">
                    <RotateCcw size={12} /> Rollback
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
