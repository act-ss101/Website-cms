/**
 * MembershipPage — Membership tiers and benefits
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Star, Award, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { membershipTiers } from '../data/mockData';

export function MembershipPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-gold text-sm font-medium mb-3">MEMBERSHIP</div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold mb-6">Join an Exclusive Community</h1>
            <p className="text-cream/70 text-lg max-w-2xl">Select the membership that suits your lifestyle. Each tier offers unique privileges and access to our world-class facilities.</p>
          </motion.div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipTiers.map((tier, idx) => (
              <motion.div key={tier.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={`bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all ${idx === 1 ? 'ring-2 ring-gold relative' : ''}`}>
                {idx === 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gold text-forest text-xs font-bold rounded-full">MOST POPULAR</div>
                )}
                <div className="mb-6">
                  <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                    {tier.name === 'Platinum' ? <Crown size={24} className="text-gold" /> :
                     tier.name === 'Gold' ? <Star size={24} className="text-gold" /> :
                     tier.name === 'Corporate' ? <Users size={24} className="text-gold" /> :
                     <Award size={24} className="text-gold" />}
                  </div>
                  <h3 className="font-display text-2xl text-forest mb-1">{tier.name}</h3>
                  <p className="text-warm-gray text-sm">{tier.period}</p>
                </div>
                <div className="mb-6">
                  <span className="font-display text-3xl text-forest">{tier.price}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-warm-gray">
                      <Check size={16} className="text-gold mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
                <Link to="/booking" className={`block text-center py-3 rounded-xl font-medium transition-all ${idx === 1 ? 'bg-gold text-forest hover:bg-gold-light' : 'bg-forest text-cream hover:bg-forest-light'}`}>
                  Apply Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-forest mb-12 text-center">Member Benefits</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <BenefitItem title="Priority Booking" desc="48-hour advance booking window" />
            <BenefitItem title="Guest Privileges" desc="Bring up to 4 guests per round" />
            <BenefitItem title="Dining Discounts" desc="15-25% off at all F&B outlets" />
            <BenefitItem title="Locker Room" desc="Personal locker with premium amenities" />
            <BenefitItem title="Practice Facilities" desc="Unlimited range & short game area" />
            <BenefitItem title="Tournament Access" desc="Priority entry to all club events" />
            <BenefitItem title="Pro Shop" desc="10% discount on all merchandise" />
            <BenefitItem title="Reciprocal Clubs" desc="Access to 50+ partner clubs worldwide" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Begin Your Journey</h2>
          <p className="text-cream/70 mb-8">Membership is by application. Contact our membership team to schedule a personal tour.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest font-semibold rounded-xl hover:bg-gold-light transition-all shadow-xl shadow-gold/20 group">
            Contact Membership <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function BenefitItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-xl border border-gray-100 hover:border-gold/30 transition-colors">
      <h4 className="font-medium text-forest mb-1">{title}</h4>
      <p className="text-sm text-warm-gray">{desc}</p>
    </div>
  );
}
