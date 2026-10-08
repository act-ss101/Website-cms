/**
 * NotFoundPage — 404 error page
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-forest flex items-center justify-center px-6">
      <div className="text-center">
        <div className="font-display text-8xl md:text-9xl text-gold mb-4">404</div>
        <h1 className="font-display text-2xl md:text-3xl text-cream mb-4">Page Not Found</h1>
        <p className="text-cream/60 mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved. Let's get you back on the fairway.</p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/" className="px-6 py-3 bg-gold text-forest font-medium rounded-xl hover:bg-gold-light transition-colors flex items-center gap-2">
            <Home size={16} /> Back to Home
          </Link>
          <button onClick={() => window.history.back()} className="px-6 py-3 bg-cream/10 text-cream border border-cream/20 rounded-xl hover:bg-cream/20 transition-colors flex items-center gap-2">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
