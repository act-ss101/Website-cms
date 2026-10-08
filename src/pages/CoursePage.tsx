/**
 * CoursePage — Golf course details, hole-by-hole guide
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, TreePine, Droplets, Wind, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { courseHoles } from '../data/mockData';

export function CoursePage() {
  const [expandedHole, setExpandedHole] = useState<number | null>(null);

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-gold text-sm font-medium mb-3">THE CHAMPIONSHIP COURSE</div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold mb-6">18 Holes of Pure Excellence</h1>
            <p className="text-cream/70 text-lg max-w-2xl">A meticulously maintained championship layout that challenges players of all levels while rewarding strategic play and precision.</p>
          </motion.div>
        </div>
      </section>

      {/* Course Stats */}
      <section className="py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard label="Par" value="72" />
            <StatCard label="Total Yardage" value="7,200" />
            <StatCard label="Course Rating" value="74.2" />
            <StatCard label="Slope Rating" value="138" />
          </div>
        </div>
      </section>

      {/* Course Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-forest mb-12 text-center">Course Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureBlock icon={<TreePine size={32} />} title="Mature Tree-Lined Fairways" description="Over 3,000 mature trees frame every hole, demanding accuracy off the tee." />
            <FeatureBlock icon={<Droplets size={32} />} title="Strategic Water Hazards" description="12 lakes and streams come into play on 8 holes, rewarding bold play." />
            <FeatureBlock icon={<Wind size={32} />} title="Undulating Greens" description="Bent grass greens with subtle breaks that test even the best putters." />
          </div>
        </div>
      </section>

      {/* Hole by Hole */}
      <section className="py-16 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl text-forest mb-4 text-center">Hole by Hole Guide</h2>
          <p className="text-warm-gray text-center mb-12">Detailed information for each hole on the championship course</p>
          
          <div className="space-y-3">
            {courseHoles.map((hole) => (
              <motion.div key={hole.hole} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <button onClick={() => setExpandedHole(expandedHole === hole.hole ? null : hole.hole)} className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-forest text-cream flex items-center justify-center font-display font-bold">{hole.hole}</div>
                    <div className="text-left">
                      <div className="font-medium text-forest">Hole {hole.hole}</div>
                      <div className="text-sm text-warm-gray">{hole.par} Par · {hole.yards} yards</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gold font-medium hidden sm:block">{hole.handicap ?? '-'} HCP</span>
                    {expandedHole === hole.hole ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </button>
                {expandedHole === hole.hole && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-4 border-t border-gray-100">
                    <div className="pt-4 grid grid-cols-4 gap-4 text-center">
                      <div><div className="text-xs text-warm-gray">Par</div><div className="font-semibold text-forest">{hole.par}</div></div>
                      <div><div className="text-xs text-warm-gray">Yards</div><div className="font-semibold text-forest">{hole.yards}</div></div>
                      <div><div className="text-xs text-warm-gray">Handicap</div><div className="font-semibold text-forest">{hole.handicap ?? '-'}</div></div>
                      <div><div className="text-xs text-warm-gray">Side</div><div className="font-semibold text-forest">{hole.hole <= 9 ? 'Out' : 'In'}</div></div>
                    </div>
                    <p className="text-sm text-warm-gray mt-4 pt-4 border-t border-gray-100">{hole.description || 'A challenging hole requiring precise shot placement.'}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Ready to Play?</h2>
          <p className="text-cream/70 mb-8">Book your tee time and experience our championship course firsthand.</p>
          <Link to="/booking" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest font-semibold rounded-xl hover:bg-gold-light transition-all shadow-xl shadow-gold/20 group">
            Book a Tee Time <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-4xl text-forest font-bold mb-1">{value}</div>
      <div className="text-sm text-warm-gray">{label}</div>
    </div>
  );
}

function FeatureBlock({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="text-center p-8">
      <div className="w-16 h-16 mx-auto mb-5 bg-gold/10 rounded-2xl flex items-center justify-center text-gold">{icon}</div>
      <h3 className="font-display text-xl text-forest mb-3">{title}</h3>
      <p className="text-warm-gray text-sm">{description}</p>
    </div>
  );
}
