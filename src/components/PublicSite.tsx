import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Phone, Mail, ChevronDown, ChevronRight, Star, Users, Award, Calendar, ArrowRight, Menu, X, Globe, Search } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { membershipTiers, courseHoles } from '../data/mockData';

// ─── NAVIGATION ────────────────────────────────────────────────────────────────
export function PublicNav({ onNavigate, currentSection }: { onNavigate: (s: string) => void; currentSection: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { layout } = useCMS();
  const navBg = layout.navStyle === 'solid' ? 'bg-forest/95 backdrop-blur-md' : layout.navStyle === 'floating' ? 'bg-white/90 backdrop-blur-md shadow-lg mt-4 mx-4 rounded-xl' : 'bg-transparent';

  const links = ['Home', 'The Course', 'Membership', 'Dining & Events', 'Visit', 'Contact'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
            <span className="font-display text-forest font-bold text-lg">KK</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display text-lg text-white font-semibold tracking-wide">Krungthep Kreetha</div>
            <div className="text-[10px] text-cream/70 uppercase tracking-[0.2em]">Golf Club · Est. 1972</div>
          </div>
        </button>

        <div className="hidden lg:flex items-center gap-8">
          {links.map(link => (
            <button
              key={link}
              onClick={() => onNavigate(link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}
              className={`text-sm font-medium transition-all duration-300 hover:text-gold ${currentSection === link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') ? 'text-gold' : 'text-cream/90'}`}
            >
              {link}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button className="text-cream/70 hover:text-gold transition-colors"><Globe size={18} /></button>
          <button className="px-5 py-2 bg-gold text-forest text-sm font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20">
            Member Login
          </button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-cream">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-forest/98 backdrop-blur-md border-t border-cream/10">
            <div className="px-6 py-6 space-y-4">
              {links.map(link => (
                <button key={link} onClick={() => { onNavigate(link.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')); setMobileOpen(false); }} className="block text-cream/90 text-lg font-medium hover:text-gold transition-colors">
                  {link}
                </button>
              ))}
              <button className="mt-4 w-full px-5 py-3 bg-gold text-forest font-semibold rounded-lg">Member Login</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ─── HERO SECTION ───────────────────────────────────────────────────────────────
export function HeroSection() {
  const { content, layout } = useCMS();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-forest/95 to-forest-light"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-cream to-transparent"></div>
      </div>

      {/* Decorative elements */}
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

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          {content.heroSubtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.8 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="px-8 py-4 bg-gold text-forest font-semibold rounded-xl hover:bg-gold-light transition-all duration-300 shadow-xl shadow-gold/20 text-lg flex items-center gap-2 group">
            {content.heroCTA}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border-2 border-cream/30 text-cream rounded-xl hover:border-gold hover:text-gold transition-all duration-300 text-lg">
            Explore the Course
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Years of Legacy', value: '54' },
            { label: 'Championship Holes', value: '18' },
            { label: 'Active Members', value: '1,200+' },
            { label: 'Avg. Green Speed', value: '11.5' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl md:text-4xl text-gold font-bold">{stat.value}</div>
              <div className="text-cream/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── COURSE SECTION ─────────────────────────────────────────────────────────────
export function CourseSection() {
  const [selectedHole, setSelectedHole] = useState(0);

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">The Course</span>
          <h2 className="font-display text-4xl md:text-5xl text-forest mt-4 mb-6">A Championship Experience</h2>
          <p className="text-warm-gray max-w-2xl mx-auto text-lg">
            7,200 yards of meticulously maintained championship golf through mature tropical landscape. Every hole tells a story of strategic design and natural beauty.
          </p>
        </motion.div>

        {/* Course Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'Total Yardage', value: '7,214', icon: '📏' },
            { label: 'Course Rating', value: '74.2', icon: '⭐' },
            { label: 'Slope Rating', value: '138', icon: '📊' },
            { label: 'Par', value: '72', icon: '🏌️' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-6 text-center shadow-sm border border-cream-dark/50">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display text-2xl text-forest font-bold">{stat.value}</div>
              <div className="text-warm-gray text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Hole Guide */}
        <div className="bg-white rounded-2xl shadow-lg border border-cream-dark/50 overflow-hidden">
          <div className="p-6 border-b border-cream-dark/50">
            <h3 className="font-display text-2xl text-forest">Hole-by-Hole Guide</h3>
          </div>
          <div className="grid md:grid-cols-[280px_1fr]">
            {/* Hole selector */}
            <div className="border-r border-cream-dark/50 p-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-6 md:grid-cols-3 gap-2">
                {courseHoles.map((hole, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedHole(i)}
                    className={`p-3 rounded-lg text-center transition-all duration-200 ${selectedHole === i ? 'bg-forest text-cream shadow-md' : 'bg-cream hover:bg-cream-dark text-forest'}`}
                  >
                    <div className="font-bold text-lg">{hole.hole}</div>
                    <div className="text-xs opacity-70">Par {hole.par}</div>
                  </button>
                ))}
              </div>
            </div>
            {/* Hole detail */}
            <div className="p-8">
              <motion.div key={selectedHole} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-forest rounded-xl flex items-center justify-center">
                    <span className="font-display text-2xl text-gold font-bold">{courseHoles[selectedHole].hole}</span>
                  </div>
                  <div>
                    <h4 className="font-display text-xl text-forest">Hole {courseHoles[selectedHole].hole}</h4>
                    <p className="text-warm-gray">Par {courseHoles[selectedHole].par} · {courseHoles[selectedHole].yards} yards</p>
                  </div>
                </div>
                <p className="text-charcoal text-lg leading-relaxed mb-6">{courseHoles[selectedHole].description}</p>
                <div className="flex gap-4">
                  <div className="px-4 py-2 bg-cream rounded-lg">
                    <span className="text-sm text-warm-gray">Handicap Index</span>
                    <div className="font-bold text-forest">{courseHoles[selectedHole].handicap || (selectedHole + 1) % 18 + 1}</div>
                  </div>
                  <div className="px-4 py-2 bg-cream rounded-lg">
                    <span className="text-sm text-warm-gray">Distance</span>
                    <div className="font-bold text-forest">{courseHoles[selectedHole].yards} yds</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── MEMBERSHIP SECTION ─────────────────────────────────────────────────────────
export function MembershipSection() {
  return (
    <section className="py-24 md:py-32 bg-forest relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 20.5V18H0v-2h20v-2l2 3-2 3z\' fill=\'%23C9A227\' fill-opacity=\'0.3\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}></div>

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Membership</span>
          <h2 className="font-display text-4xl md:text-5xl text-cream mt-4 mb-6">Join Our Distinguished Community</h2>
          <p className="text-cream/70 max-w-2xl mx-auto text-lg">
            Four tiers of membership, each crafted to match your lifestyle. All members enjoy our championship course, world-class dining, and personalized concierge service.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {membershipTiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${i === 2 ? 'bg-gold text-forest shadow-2xl shadow-gold/20 scale-105' : 'bg-cream/10 backdrop-blur-sm text-cream border border-cream/10 hover:border-gold/30'}`}
            >
              {i === 2 && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-forest text-gold text-xs font-bold rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="font-display text-2xl font-bold mb-2">{tier.name}</h3>
                <div className={`text-3xl font-bold ${i === 2 ? 'text-forest' : 'text-gold'}`}>{tier.price}</div>
                <p className={`text-sm mt-1 ${i === 2 ? 'text-forest/70' : 'text-cream/50'}`}>{tier.period}</p>
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <ChevronRight size={16} className={`mt-0.5 flex-shrink-0 ${i === 2 ? 'text-forest' : 'text-gold'}`} />
                    <span className={`text-sm ${i === 2 ? 'text-forest/80' : 'text-cream/80'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${i === 2 ? 'bg-forest text-cream hover:bg-forest-light' : 'bg-cream/10 text-cream hover:bg-gold hover:text-forest border border-cream/20'}`}>
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── DINING & EVENTS ────────────────────────────────────────────────────────────
export function DiningSection() {
  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Dining & Events</span>
          <h2 className="font-display text-4xl md:text-5xl text-forest mt-4 mb-6">Beyond the Fairway</h2>
          <p className="text-warm-gray max-w-2xl mx-auto text-lg">
            From post-round celebrations to corporate gatherings, our venues and culinary team create unforgettable experiences.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: 'The 19th Hole', subtitle: 'Fine Dining', desc: 'Seasonal Thai-fusion cuisine with panoramic course views. Chef Somchai\'s menu changes monthly.', icon: '🍽️', features: ['Seasonal menu', 'Private dining room', 'Wine cellar (400+ labels)', 'Dietary accommodations'] },
            { title: 'The Terrace', subtitle: 'Casual Dining', desc: 'All-day dining overlooking the 18th green. Perfect for a leisurely breakfast before your round.', icon: '☀️', features: ['Breakfast from 6 AM', 'On-course ordering', 'Healthy options', 'Kids menu'] },
            { title: 'Tournament Hall', subtitle: 'Private Events', desc: 'Host your corporate events, weddings, and celebrations in our elegant 200-guest ballroom.', icon: '🏆', features: ['200 guest capacity', 'AV equipment', 'Custom menus', 'Dedicated event coordinator'] },
          ].map((venue, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="bg-white rounded-2xl p-8 shadow-sm border border-cream-dark/50 hover:shadow-lg transition-all duration-300 group">
              <div className="text-4xl mb-4">{venue.icon}</div>
              <div className="text-gold text-xs font-semibold uppercase tracking-wider mb-1">{venue.subtitle}</div>
              <h3 className="font-display text-2xl text-forest mb-3">{venue.title}</h3>
              <p className="text-warm-gray mb-6 leading-relaxed">{venue.desc}</p>
              <ul className="space-y-2 mb-6">
                {venue.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm text-charcoal">
                    <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                    {f}
                  </li>
                ))}
              </ul>
              <button className="text-forest font-semibold text-sm flex items-center gap-1 group-hover:text-gold transition-colors">
                Learn More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── VISIT SECTION ──────────────────────────────────────────────────────────────
export function VisitSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Visit Us</span>
          <h2 className="font-display text-4xl md:text-5xl text-forest mt-4 mb-6">Plan Your Visit</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-cream rounded-2xl p-8 mb-8">
              <h3 className="font-display text-xl text-forest mb-4 flex items-center gap-2"><Clock size={20} className="text-gold" /> Operating Hours</h3>
              <div className="space-y-3">
                {[
                  { day: 'Monday - Friday', hours: '6:00 AM - 7:00 PM' },
                  { day: 'Saturday - Sunday', hours: '5:30 AM - 6:30 PM' },
                  { day: 'Public Holidays', hours: '6:00 AM - 5:00 PM' },
                  { day: 'Restaurant', hours: '6:30 AM - 10:00 PM' },
                  { day: 'Pro Shop', hours: '6:00 AM - 6:00 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-cream-dark/50 last:border-0">
                    <span className="text-charcoal">{item.day}</span>
                    <span className="text-warm-gray font-medium">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cream rounded-2xl p-8">
              <h3 className="font-display text-xl text-forest mb-4 flex items-center gap-2"><MapPin size={20} className="text-gold" /> Getting Here</h3>
              <p className="text-warm-gray mb-4">88 Krungthep Kreetha Road, Suan Luang, Bangkok 10250, Thailand</p>
              <div className="space-y-2 text-sm">
                <p className="text-charcoal">🚗 25 min from Sukhumvit via motorway</p>
                <p className="text-charcoal">🚇 Near Suan Luang Rama IX station</p>
                <p className="text-charcoal">🅿️ Complimentary valet parking</p>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-forest rounded-2xl p-8 text-cream mb-8">
              <h3 className="font-display text-xl mb-4 flex items-center gap-2"><Award size={20} className="text-gold" /> Visitor Information</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-gold font-semibold mb-1">Dress Code</h4>
                  <p className="text-cream/70 text-sm">Collared shirts, tailored trousers/shorts, golf shoes. No denim. Hats must be removed in clubhouse.</p>
                </div>
                <div>
                  <h4 className="text-gold font-semibold mb-1">Green Fees</h4>
                  <p className="text-cream/70 text-sm">Weekday: ฿4,500 (18 holes) · Weekend: ฿5,800 (18 holes). Includes caddie and cart.</p>
                </div>
                <div>
                  <h4 className="text-gold font-semibold mb-1">Guest Policy</h4>
                  <p className="text-cream/70 text-sm">All visitors must be accompanied by a member or have prior arrangement with our concierge.</p>
                </div>
              </div>
            </div>

            <div className="bg-gold/10 rounded-2xl p-8 border border-gold/20">
              <h3 className="font-display text-xl text-forest mb-4">Book a Guest Tee Time</h3>
              <p className="text-warm-gray mb-6 text-sm">Limited guest slots available. Priority given to members' guests. Book at least 7 days in advance.</p>
              <div className="flex gap-3">
                <input type="date" className="flex-1 px-4 py-3 rounded-xl border border-cream-dark bg-white text-charcoal focus:outline-none focus:border-gold" />
                <button className="px-6 py-3 bg-forest text-cream rounded-xl font-semibold hover:bg-forest-light transition-colors">
                  Check Availability
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── NEWS SECTION ───────────────────────────────────────────────────────────────
export function NewsSection() {
  const { content } = useCMS();
  const publishedNews = content.newsItems.filter(n => n.published);

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Latest News</span>
          <h2 className="font-display text-4xl md:text-5xl text-forest mt-4 mb-6">Club Updates</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publishedNews.map((news, i) => (
            <motion.article key={news.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="h-40 bg-gradient-to-br from-forest to-forest-light flex items-center justify-center">
                <span className="text-4xl">{news.category === 'Tournament' ? '🏆' : news.category === 'Dining' ? '🍽️' : news.category === 'Course' ? '🌿' : '⛳'}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs font-semibold rounded-full">{news.category}</span>
                  <span className="text-warm-gray text-xs">{news.date}</span>
                </div>
                <h3 className="font-display text-lg text-forest mb-2 group-hover:text-gold transition-colors">{news.title}</h3>
                <p className="text-warm-gray text-sm leading-relaxed">{news.excerpt}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT SECTION ────────────────────────────────────────────────────────────
export function ContactSection() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">Contact</span>
            <h2 className="font-display text-4xl text-forest mt-4 mb-6">Get in Touch</h2>
            <p className="text-warm-gray mb-8 text-lg leading-relaxed">
              Our concierge team is available to assist with any inquiry — from membership applications to special event planning.
            </p>

            <div className="space-y-6">
              {[
                { icon: <Phone size={20} />, label: 'Phone', value: '+66 2 123 4567', sub: 'Mon-Sun 6:00 AM - 8:00 PM' },
                { icon: <Mail size={20} />, label: 'Email', value: 'concierge@krungthepkreetha.com', sub: 'Response within 2 hours' },
                { icon: <MapPin size={20} />, label: 'Address', value: '88 Krungthep Kreetha Road', sub: 'Suan Luang, Bangkok 10250' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-forest/10 rounded-lg flex items-center justify-center text-forest flex-shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-sm text-warm-gray">{item.label}</div>
                    <div className="text-charcoal font-medium">{item.value}</div>
                    <div className="text-sm text-warm-gray">{item.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-cream rounded-2xl p-8">
            <h3 className="font-display text-2xl text-forest mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="First Name" className="px-4 py-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-gold transition-colors" />
                <input placeholder="Last Name" className="px-4 py-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-gold transition-colors" />
              </div>
              <input placeholder="Email Address" type="email" className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-gold transition-colors" />
              <select className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-gold transition-colors text-warm-gray">
                <option>Membership Inquiry</option>
                <option>Guest Booking</option>
                <option>Event Planning</option>
                <option>General Question</option>
              </select>
              <textarea placeholder="Your message..." rows={4} className="w-full px-4 py-3 rounded-xl border border-cream-dark bg-white focus:outline-none focus:border-gold transition-colors resize-none"></textarea>
              <button type="button" className="w-full py-4 bg-forest text-cream font-semibold rounded-xl hover:bg-forest-light transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer className="bg-forest text-cream py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                <span className="font-display text-forest font-bold text-lg">KK</span>
              </div>
              <div>
                <div className="font-display text-lg font-semibold">Krungthep Kreetha</div>
                <div className="text-[10px] text-cream/50 uppercase tracking-wider">Golf Club · Est. 1972</div>
              </div>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed">Bangkok's most distinguished urban golf sanctuary. Where tradition meets modern luxury.</p>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-cream/60 text-sm">
              <li><button className="hover:text-gold transition-colors">The Course</button></li>
              <li><button className="hover:text-gold transition-colors">Membership</button></li>
              <li><button className="hover:text-gold transition-colors">Dining</button></li>
              <li><button className="hover:text-gold transition-colors">Events</button></li>
              <li><button className="hover:text-gold transition-colors">Visit</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Member Services</h4>
            <ul className="space-y-2 text-cream/60 text-sm">
              <li><button className="hover:text-gold transition-colors">Tee Time Booking</button></li>
              <li><button className="hover:text-gold transition-colors">Digital Scorecard</button></li>
              <li><button className="hover:text-gold transition-colors">Wallet & Billing</button></li>
              <li><button className="hover:text-gold transition-colors">Concierge</button></li>
              <li><button className="hover:text-gold transition-colors">Pro Shop</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <ul className="space-y-2 text-cream/60 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /> +66 2 123 4567</li>
              <li className="flex items-center gap-2"><Mail size={14} /> concierge@krungthepkreetha.com</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Bangkok, Thailand</li>
            </ul>
            <div className="flex gap-3 mt-4">
              {['LINE', 'IG', 'FB'].map(s => (
                <div key={s} className="w-8 h-8 bg-cream/10 rounded-full flex items-center justify-center text-xs text-cream/60 hover:bg-gold hover:text-forest transition-all cursor-pointer">{s}</div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/40 text-sm">© 2026 Krungthep Kreetha Golf Club. All rights reserved.</p>
          <div className="flex gap-6 text-cream/40 text-sm">
            <button className="hover:text-cream transition-colors">Privacy Policy</button>
            <button className="hover:text-cream transition-colors">Terms of Service</button>
            <button className="hover:text-cream transition-colors">PDPA Notice</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
