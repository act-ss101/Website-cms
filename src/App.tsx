/**
 * App.tsx — Main Application Entry
 * Integrates: Auth, CMS, Public Site, Member Portal, Admin Dashboard
 */
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Settings, ArrowLeft, Shield, User, Globe, Lock, Loader2 } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CMSProvider, useCMS } from './context/CMSContext';
import { PublicNav, HeroSection, CourseSection, MembershipSection, DiningSection, VisitSection, NewsSection, ContactSection, Footer } from './components/PublicSite';
import { MemberPortal } from './components/MemberPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { CMSPanel } from './components/CMSPanel';
import { LoginScreen } from './components/LoginScreen';
import { TestRunner } from './components/TestRunner';

type AppView = 'landing' | 'login' | 'public' | 'member' | 'admin' | 'tests';

function AppContent() {
  const { user, loading, initialized } = useAuth();
  const [view, setView] = useState<AppView>('landing');
  const [cmsOpen, setCmsOpen] = useState(false);
  const { theme, isCMSEnabled, setIsCMSEnabled } = useCMS();

  // Auto-redirect based on auth state
  useEffect(() => {
    if (initialized && user) {
      if (user.role === 'admin' || user.role === 'staff') {
        setView('admin');
      } else if (user.role === 'member') {
        setView('member');
      }
    }
  }, [initialized, user]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-gold flex items-center justify-center mb-4">
            <span className="font-display text-forest font-bold text-2xl">KK</span>
          </div>
          <Loader2 size={24} className="text-gold animate-spin mx-auto" />
          <p className="text-cream/60 text-sm mt-4">Initializing...</p>
        </div>
      </div>
    );
  }

  // Login screen
  if (view === 'login') {
    return <LoginScreen onBack={() => setView('landing')} onLoginSuccess={(role) => {
      if (role === 'admin' || role === 'staff') setView('admin');
      else setView('member');
    }} />;
  }

  // Landing / Role Selection
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-forest-light/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="mb-12">
            <div className="w-20 h-20 mx-auto rounded-full bg-gold flex items-center justify-center mb-6 shadow-xl shadow-gold/20">
              <span className="font-display text-forest font-bold text-3xl">KK</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl text-cream font-semibold mb-4">Krungthep Kreetha</h1>
            <p className="text-cream/60 text-lg">Bangkok's Premier Golf Sanctuary · Est. 1972</p>
            {user && <p className="text-gold text-sm mt-2">Signed in as {user.name} ({user.role})</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <button onClick={() => setView('public')} className="group bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 hover:bg-cream/10 hover:border-gold/30 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Globe size={28} className="text-gold" />
              </div>
              <h3 className="font-display text-xl text-cream mb-2">Public Site</h3>
              <p className="text-cream/50 text-sm">Explore the club, course, and membership</p>
            </button>

            <button onClick={() => setView('login')} className="group bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 hover:bg-cream/10 hover:border-gold/30 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <User size={28} className="text-gold" />
              </div>
              <h3 className="font-display text-xl text-cream mb-2">Member Portal</h3>
              <p className="text-cream/50 text-sm">Book tee times, track scores, manage wallet</p>
            </button>

            <button onClick={() => setView('login')} className="group bg-cream/5 backdrop-blur-sm border border-cream/10 rounded-2xl p-8 hover:bg-cream/10 hover:border-gold/30 transition-all duration-300">
              <div className="w-14 h-14 mx-auto mb-4 bg-gold/10 rounded-xl flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Shield size={28} className="text-gold" />
              </div>
              <h3 className="font-display text-xl text-cream mb-2">Admin Dashboard</h3>
              <p className="text-cream/50 text-sm">Operations, analytics, member management</p>
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center gap-3 flex-wrap">
            <button onClick={() => setIsCMSEnabled(!isCMSEnabled)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all ${isCMSEnabled ? 'bg-gold text-forest' : 'bg-cream/5 text-cream/50 border border-cream/10 hover:border-cream/20'}`}>
              <Lock size={14} /> CMS Mode: {isCMSEnabled ? 'ON' : 'OFF'}
            </button>
            <button onClick={() => setView('tests')} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-cream/5 text-cream/50 border border-cream/10 hover:border-cream/20 transition-all">
              🧪 Run Tests
            </button>
          </div>

          <p className="mt-8 text-cream/30 text-xs">Full-Stack Digital Concierge · IndexedDB Persistence · Auth + RBAC · i18n (TH/EN/JA)</p>
        </div>
      </div>
    );
  }

  // Member Portal
  if (view === 'member') {
    return (
      <>
        <MemberPortal onLogout={() => setView('landing')} />
        {isCMSEnabled && (
          <button onClick={() => setCmsOpen(true)} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-forest text-gold rounded-full shadow-lg flex items-center justify-center hover:bg-forest-light transition-colors">
            <Settings size={20} />
          </button>
        )}
        <AnimatePresence>{cmsOpen && <CMSPanel onClose={() => setCmsOpen(false)} />}</AnimatePresence>
      </>
    );
  }

  // Admin Dashboard
  if (view === 'admin') {
    return (
      <>
        <AdminDashboard onLogout={() => setView('landing')} />
        {isCMSEnabled && (
          <button onClick={() => setCmsOpen(true)} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-forest text-gold rounded-full shadow-lg flex items-center justify-center hover:bg-forest-light transition-colors">
            <Settings size={20} />
          </button>
        )}
        <AnimatePresence>{cmsOpen && <CMSPanel onClose={() => setCmsOpen(false)} />}</AnimatePresence>
      </>
    );
  }

  // Test Runner
  if (view === 'tests') {
    return (
      <>
        <div className="fixed top-4 left-4 z-50">
          <button onClick={() => setView('landing')} className="flex items-center gap-2 px-3 py-2 bg-forest/90 backdrop-blur-sm text-cream rounded-lg text-sm hover:bg-forest transition-colors shadow-lg">
            <ArrowLeft size={16} /> Back
          </button>
        </div>
        <TestRunner />
      </>
    );
  }

  // Public Site
  return (
    <div style={{ '--cms-primary': theme.primary, '--cms-secondary': theme.secondary, '--cms-bg': theme.background, '--cms-text': theme.text, '--cms-radius': theme.radius } as React.CSSProperties}>
      <PublicNavWrapper onBack={() => setView('landing')} />
      <HeroSection />
      <CourseSection />
      <MembershipSection />
      <DiningSection />
      <VisitSection />
      <NewsSection />
      <ContactSection />
      <Footer />
      {isCMSEnabled && (
        <button onClick={() => setCmsOpen(true)} className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-forest text-gold rounded-full shadow-lg flex items-center justify-center hover:bg-forest-light transition-colors">
          <Settings size={20} />
        </button>
      )}
      <AnimatePresence>{cmsOpen && <CMSPanel onClose={() => setCmsOpen(false)} />}</AnimatePresence>
    </div>
  );
}

function PublicNavWrapper({ onBack }: { onBack: () => void }) {
  return (
    <div className="fixed top-4 left-4 z-[60]">
      <button onClick={onBack} className="flex items-center gap-2 px-3 py-2 bg-forest/90 backdrop-blur-sm text-cream rounded-lg text-sm hover:bg-forest transition-colors shadow-lg">
        <ArrowLeft size={16} />
        <span className="hidden sm:inline">Back</span>
      </button>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CMSProvider>
        <AppContent />
      </CMSProvider>
    </AuthProvider>
  );
}
