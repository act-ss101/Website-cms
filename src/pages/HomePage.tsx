/**
 * HomePage — Landing page with Hero, About, and News sections
 */
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Clock, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

export function HomePage() {
  const { content, layout } = useCMS();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/95 to-forest-light"></div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream to-transparent"></div>
        </div>

        <div className="absolute top-20 right-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-forest-light/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cream/10 backdrop-blur-sm rounded-full mb-8 border border-cream/10">
              <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
              <span className="text-cream/80 text-sm">Next Available: Tomorrow 6:30 AM</span>
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="font-display text-5xl md:text-7xl lg:text-8xl text-cream font-semibold leading-[0.9] mb-8">
            {content.heroTitle.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {i > 0 && <br />}
                {i === 1 ? <span className="text-gold">{line}</span> : line}
              </React.Fragment>
            ))}
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            {content.heroSubtitle}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/booking" className="px-8 py-4 bg-gold text-forest font-semibold rounded-xl hover:bg-gold-light transition-all duration-300 shadow-xl shadow-gold/20 flex items-center gap-2 group">
              {content.heroCTA}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/visit" className="px-8 py-4 bg-cream/10 backdrop-blur-sm text-cream border border-cream/20 rounded-xl hover:bg-cream/20 transition-all duration-300">
              Schedule a Visit
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-cream/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-gold rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-4">
                <Star size={14} /> ESTABLISHED 1972
              </div>
              <h2 className="font-display text-4xl md:text-5xl text-forest mb-6 leading-tight">{content.aboutTitle}</h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-8">{content.aboutText}</p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="font-display text-3xl text-forest font-bold">52+</div>
                  <div className="text-sm text-warm-gray">Years</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl text-forest font-bold">18</div>
                  <div className="text-sm text-warm-gray">Holes</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-3xl text-forest font-bold">2,400+</div>
                  <div className="text-sm text-warm-gray">Members</div>
                </div>
              </div>
              <Link to="/course" className="inline-flex items-center gap-2 text-forest font-medium hover:text-gold transition-colors group">
                Explore the Course <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-br from-forest to-forest-light overflow-hidden relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-cream/80">
                    <Award size={64} className="mx-auto mb-4 text-gold" />
                    <p className="font-display text-2xl">Championship Course</p>
                    <p className="text-sm mt-2 text-cream/60">Par 72 · 7,200 yards</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gold/10 rounded-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-forest/10 rounded-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl text-forest mb-4">The Complete Experience</h2>
            <p className="text-warm-gray max-w-2xl mx-auto">Every detail crafted for the discerning golfer</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard icon={<Clock size={28} />} title="Flexible Tee Times" description="Book from 6 AM to twilight with real-time availability" link="/booking" />
            <FeatureCard icon={<Users size={28} />} title="Exclusive Community" description="Join 2,400+ members from Bangkok's business elite" link="/membership" />
            <FeatureCard icon={<Award size={28} />} title="World-Class Service" description="Dedicated caddies, fine dining, and premium facilities" link="/dining-events" />
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl text-forest mb-2">Latest News</h2>
              <p className="text-warm-gray">Stay updated with club happenings</p>
            </div>
            <Link to="/news" className="text-forest font-medium hover:text-gold transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.newsItems.filter(n => n.published).slice(0, 3).map(item => (
              <motion.article key={item.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-xs text-gold font-medium mb-2">{item.category}</div>
                <h3 className="font-display text-lg text-forest mb-2">{item.title}</h3>
                <p className="text-warm-gray text-sm mb-4">{item.excerpt}</p>
                <div className="text-xs text-warm-gray/60">{new Date(item.date).toLocaleDateString()}</div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <Link to={link} className="group block p-8 rounded-2xl border border-gray-100 hover:border-gold/30 hover:shadow-lg transition-all duration-300">
      <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-5 group-hover:bg-gold/20 transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-xl text-forest mb-2">{title}</h3>
      <p className="text-warm-gray text-sm">{description}</p>
    </Link>
  );
}
