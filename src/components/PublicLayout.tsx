/**
 * PublicLayout — Shared layout for public pages (Navigation + Footer)
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useCMS } from '../context/CMSContext';

const NAV_LINKS = [
  { label: 'Home', path: '/site' },
  { label: 'The Course', path: '/course' },
  { label: 'Membership', path: '/membership' },
  { label: 'Dining & Events', path: '/dining-events' },
  { label: 'Visit', path: '/visit' },
  { label: 'News', path: '/news' },
  { label: 'Contact', path: '/contact' },
];

export function PublicLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { layout } = useCMS();
  const isHome = location.pathname === '/site';
  const navBg = isHome
    ? (layout.navStyle === 'solid' ? 'bg-forest/95 backdrop-blur-md' : layout.navStyle === 'floating' ? 'bg-white/90 backdrop-blur-md shadow-lg mt-4 mx-4 rounded-xl' : 'bg-transparent')
    : 'bg-forest/95 backdrop-blur-md';

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
              <span className="font-display text-forest font-bold text-lg">KK</span>
            </div>
            <div className="hidden sm:block">
              <div className="font-display text-lg text-white font-semibold tracking-wide">Krungthep Kreetha</div>
              <div className="text-[10px] text-cream/70 uppercase tracking-[0.2em]">Golf Club · Est. 1972</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map(link => (
              <Link key={link.path} to={link.path} className={`text-sm font-medium transition-all duration-300 hover:text-gold ${location.pathname === link.path ? 'text-gold' : 'text-cream/90'}`}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <button className="text-cream/70 hover:text-gold transition-colors"><Globe size={18} /></button>
            <Link to="/booking" className="px-5 py-2 bg-gold text-forest text-sm font-semibold rounded-lg hover:bg-gold-light transition-all duration-300 shadow-lg shadow-gold/20">
              Book Tee Time
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-cream">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-forest/98 backdrop-blur-md border-t border-cream/10">
              <div className="px-6 py-6 space-y-4">
                {NAV_LINKS.map(link => (
                  <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`block text-lg font-medium transition-colors ${location.pathname === link.path ? 'text-gold' : 'text-cream/90 hover:text-gold'}`}>
                    {link.label}
                  </Link>
                ))}
                <Link to="/booking" onClick={() => setMobileOpen(false)} className="block mt-4 w-full px-5 py-3 bg-gold text-forest font-semibold rounded-lg text-center">
                  Book Tee Time
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Page Content */}
      <Outlet />

      {/* Footer */}
      <footer className="bg-forest text-cream">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                  <span className="font-display text-forest font-bold text-lg">KK</span>
                </div>
                <div>
                  <div className="font-display text-sm font-semibold">Krungthep Kreetha</div>
                  <div className="text-[10px] text-cream/50 uppercase tracking-wider">Golf Club · Est. 1972</div>
                </div>
              </div>
              <p className="text-cream/60 text-sm leading-relaxed">Bangkok's premier private golf sanctuary, offering world-class facilities and exclusive membership since 1972.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-sm font-semibold mb-4 text-gold">Quick Links</h4>
              <ul className="space-y-2">
                {NAV_LINKS.slice(0, 5).map(link => (
                  <li key={link.path}><Link to={link.path} className="text-cream/60 text-sm hover:text-gold transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-display text-sm font-semibold mb-4 text-gold">Services</h4>
              <ul className="space-y-2 text-cream/60 text-sm">
                <li>Tee Time Booking</li>
                <li>Golf Lessons</li>
                <li>Club Fitting</li>
                <li>Corporate Events</li>
                <li>Membership</li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-sm font-semibold mb-4 text-gold">Contact</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2 text-cream/60 text-sm"><MapPin size={14} className="mt-0.5 flex-shrink-0" /> 123 Krungthep Kreetha Rd, Bangkok 10250</div>
                <div className="flex items-center gap-2 text-cream/60 text-sm"><Phone size={14} className="flex-shrink-0" /> +66 2 123 4567</div>
                <div className="flex items-center gap-2 text-cream/60 text-sm"><Mail size={14} className="flex-shrink-0" /> info@krungthepkreetha.co.th</div>
                <div className="flex items-center gap-2 text-cream/60 text-sm"><Clock size={14} className="flex-shrink-0" /> 6:00 AM - 10:00 PM daily</div>
              </div>
            </div>
          </div>

          <div className="border-t border-cream/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/40 text-sm">© 2026 Krungthep Kreetha Golf Club. All rights reserved.</p>
            <div className="flex items-center gap-6 text-cream/40 text-sm">
              <Link to="/contact" className="hover:text-gold transition-colors">Privacy Policy</Link>
              <Link to="/contact" className="hover:text-gold transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
