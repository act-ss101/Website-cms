/**
 * DiningPage — Restaurant and event spaces
 */
import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, Wine, Users, Calendar, Clock, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DiningPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-gold text-sm font-medium mb-3">DINING & EVENTS</div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold mb-6">Culinary Excellence</h1>
            <p className="text-cream/70 text-lg max-w-2xl">From post-round refreshments to grand celebrations, our dining venues offer an unforgettable experience.</p>
          </motion.div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-forest mb-12 text-center">Our Venues</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <VenueCard name="The 19th Hole" type="Casual Dining" description="Relaxed atmosphere with panoramic course views. Perfect for post-round meals and casual gatherings." hours="6:30 AM - 10:00 PM" cuisine="Thai & International" icon={<Utensils size={28} />} />
            <VenueCard name="The Pavilion" type="Fine Dining" description="Elegant fine dining experience featuring seasonal menus crafted by our executive chef." hours="6:00 PM - 11:00 PM" cuisine="Contemporary Thai" icon={<Star size={28} />} />
            <VenueCard name="The Wine Cellar" type="Bar & Lounge" description="Curated wine collection and premium spirits in an intimate setting." hours="11:00 AM - 12:00 AM" cuisine="Light Fare" icon={<Wine size={28} />} />
            <VenueCard name="Grand Ballroom" type="Events" description="Versatile event space for weddings, corporate functions, and private celebrations." hours="By Reservation" cuisine="Custom Menus" icon={<Users size={28} />} />
          </div>
        </div>
      </section>

      {/* Special Menus */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-forest mb-12 text-center">Signature Experiences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ExperienceCard title="Sunday Brunch" desc="Lavish buffet featuring Thai and international specialties" price="฿1,800++" />
            <ExperienceCard title="Chef's Table" desc="8-course tasting menu with wine pairing" price="฿4,500++" />
            <ExperienceCard title="Tournament Catering" desc="Custom menus for corporate events and tournaments" price="From ฿2,500/pp" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Reserve Your Table</h2>
          <p className="text-cream/70 mb-8">Members enjoy priority reservations and exclusive dining privileges.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest font-semibold rounded-xl hover:bg-gold-light transition-all shadow-xl shadow-gold/20 group">
            Make a Reservation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function VenueCard({ name, type, description, hours, cuisine, icon }: { name: string; type: string; description: string; hours: string; cuisine: string; icon: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0">{icon}</div>
        <div>
          <h3 className="font-display text-xl text-forest">{name}</h3>
          <p className="text-sm text-gold">{type}</p>
        </div>
      </div>
      <p className="text-warm-gray text-sm mb-4">{description}</p>
      <div className="flex items-center gap-4 text-xs text-warm-gray/70">
        <span className="flex items-center gap-1"><Clock size={12} /> {hours}</span>
        <span className="flex items-center gap-1"><Utensils size={12} /> {cuisine}</span>
      </div>
    </motion.div>
  );
}

function ExperienceCard({ title, desc, price }: { title: string; desc: string; price: string }) {
  return (
    <div className="p-6 rounded-xl border border-gray-100 hover:border-gold/30 transition-colors">
      <h4 className="font-display text-lg text-forest mb-2">{title}</h4>
      <p className="text-sm text-warm-gray mb-3">{desc}</p>
      <div className="text-gold font-medium">{price}</div>
    </div>
  );
}
