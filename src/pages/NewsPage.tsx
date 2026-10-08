/**
 * NewsPage — Club news and announcements
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight, Search } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export function NewsPage() {
  const { content } = useCMS();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...new Set(content.newsItems.map(n => n.category))];
  const filtered = content.newsItems.filter(n => {
    if (!n.published) return false;
    if (filter !== 'All' && n.category !== filter) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-gold text-sm font-medium mb-3">NEWS & UPDATES</div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold mb-6">Latest News</h1>
            <p className="text-cream/70 text-lg max-w-2xl">Stay informed about tournaments, events, course updates, and club announcements.</p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {categories.map(cat => (
                <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === cat ? 'bg-forest text-cream' : 'bg-gray-100 text-warm-gray hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search news..." className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm w-64 focus:outline-none focus:border-forest" />
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-12 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-warm-gray text-lg">No news articles found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, idx) => (
                <motion.article key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                  <div className="aspect-video bg-gradient-to-br from-forest/5 to-gold/10 flex items-center justify-center">
                    <Tag size={32} className="text-gold/40" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs font-medium rounded">{item.category}</span>
                      <span className="text-xs text-warm-gray/60 flex items-center gap-1"><Calendar size={10} /> {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-display text-lg text-forest mb-2 group-hover:text-gold transition-colors">{item.title}</h3>
                    <p className="text-warm-gray text-sm mb-4">{item.excerpt}</p>
                    <span className="text-forest text-sm font-medium flex items-center gap-1 group-hover:text-gold transition-colors">
                      Read More <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Announcements */}
      {content.announcements.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-display text-2xl text-forest mb-6">Announcements</h2>
            <div className="space-y-3">
              {content.announcements.map((ann, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-gold/5 rounded-xl border border-gold/10">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-forest">{ann}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
