/**
 * VisitPage — Visit information and directions
 */
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Car, Train, Plane, Phone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function VisitPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-forest overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-gold text-sm font-medium mb-3">PLAN YOUR VISIT</div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold mb-6">Visit Us</h1>
            <p className="text-cream/70 text-lg max-w-2xl">Conveniently located in the heart of Bangkok, Krungthep Kreetha is easily accessible from all major areas.</p>
          </motion.div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-3xl text-forest mb-8">Location</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0"><MapPin size={20} /></div>
                  <div>
                    <h4 className="font-medium text-forest">Address</h4>
                    <p className="text-warm-gray text-sm">123 Krungthep Kreetha Road, Suan Luang, Bangkok 10250, Thailand</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0"><Clock size={20} /></div>
                  <div>
                    <h4 className="font-medium text-forest">Operating Hours</h4>
                    <div className="text-warm-gray text-sm space-y-1">
                      <p>Clubhouse: 6:00 AM - 10:00 PM daily</p>
                      <p>Golf Course: 6:00 AM - 6:30 PM (last tee time)</p>
                      <p>Pro Shop: 6:00 AM - 7:00 PM</p>
                      <p>Practice Range: 6:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold flex-shrink-0"><Phone size={20} /></div>
                  <div>
                    <h4 className="font-medium text-forest">Contact</h4>
                    <p className="text-warm-gray text-sm">+66 2 123 4567</p>
                    <p className="text-warm-gray text-sm">info@krungthepkreetha.co.th</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="aspect-square bg-forest/5 rounded-2xl flex items-center justify-center border border-forest/10">
              <div className="text-center text-warm-gray">
                <MapPin size={48} className="mx-auto mb-4 text-gold" />
                <p className="font-display text-lg text-forest">Interactive Map</p>
                <p className="text-sm mt-1">13.4912° N, 100.6532° E</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Here */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-display text-3xl text-forest mb-12 text-center">Getting Here</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <DirectionCard icon={<Car size={28} />} title="By Car" directions={['From Sathorn: Take Rama IX Road eastbound (25 min)', 'From Sukhumvit: Use motorway to Srinakarin exit (20 min)', 'From Silom: Via Rama III bridge then Rama IX (30 min)', 'Complimentary valet parking available']} />
            <DirectionCard icon={<Train size={28} />} title="By BTS/MRT" directions={['MRT Hua Mak station — 5 min taxi', 'BTS On Nut — 15 min taxi', 'Airport Rail Link Hua Mak — 8 min taxi', 'Complimentary shuttle from Hua Mak on weekends']} />
            <DirectionCard icon={<Plane size={28} />} title="From Airport" directions={['Suvarnabhumi (BKK): 25 min via motorway', 'Don Mueang (DMK): 45 min via expressway', 'Airport limousine service available', 'Complimentary transfer for Platinum members']} />
          </div>
        </div>
      </section>

      {/* Visitor Info */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="font-display text-3xl text-forest mb-8 text-center">Visitor Information</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-forest mb-2">Dress Code</h4>
                <p className="text-sm text-warm-gray">Collared shirts, tailored shorts or trousers, and proper golf shoes required. No denim in clubhouse dining areas.</p>
              </div>
              <div>
                <h4 className="font-medium text-forest mb-2">Guest Policy</h4>
                <p className="text-sm text-warm-gray">All visitors must be accompanied by a member or have a pre-arranged appointment. ID required at reception.</p>
              </div>
              <div>
                <h4 className="font-medium text-forest mb-2">Facilities</h4>
                <p className="text-sm text-warm-gray">Locker rooms, shower facilities, club rental, pro shop, and practice range available for all visitors.</p>
              </div>
              <div>
                <h4 className="font-medium text-forest mb-2">Caddie Service</h4>
                <p className="text-sm text-warm-gray">Professional caddies available for all rounds. Advance booking recommended on weekends.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-forest">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">Schedule a Tour</h2>
          <p className="text-cream/70 mb-8">Experience Krungthep Kreetha firsthand. Book a personal tour with our membership team.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-forest font-semibold rounded-xl hover:bg-gold-light transition-all shadow-xl shadow-gold/20 group">
            Book a Tour <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function DirectionCard({ icon, title, directions }: { icon: React.ReactNode; title: string; directions: string[] }) {
  return (
    <div className="p-6 rounded-xl border border-gray-100">
      <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold mb-4">{icon}</div>
      <h4 className="font-display text-lg text-forest mb-3">{title}</h4>
      <ul className="space-y-2">
        {directions.map((d, i) => (
          <li key={i} className="text-sm text-warm-gray flex items-start gap-2">
            <span className="w-1.5 h-1.5 bg-gold rounded-full mt-1.5 flex-shrink-0"></span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
