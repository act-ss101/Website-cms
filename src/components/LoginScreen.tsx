/**
 * Login Component — Real authentication with validation and error handling
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateRegistration, validateEmail } from '../services/validationService';

interface LoginScreenProps {
  onBack: () => void;
  onLoginSuccess: (role: string) => void;
}

export function LoginScreen({ onBack, onLoginSuccess }: LoginScreenProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        return;
      }
      await login(email, password);
      setSuccess('Login successful!');
      setTimeout(() => {
        // Determine role and navigate
        if (email.includes('admin')) onLoginSuccess('admin');
        else if (email.includes('staff')) onLoginSuccess('staff');
        else onLoginSuccess('member');
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validation = validateRegistration({ email, password, name });
      if (!validation.valid) {
        setError(Object.values(validation.errors)[0]);
        return;
      }
      await register(email, password, name, 'member');
      setSuccess('Registration successful! Please login.');
      setMode('login');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-forest flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A227\' fill-opacity=\'0.3\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

      <div className="absolute top-6 left-6">
        <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 bg-cream/10 text-cream rounded-lg text-sm hover:bg-cream/20 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md mx-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-full bg-gold flex items-center justify-center mb-4">
              <span className="font-display text-forest font-bold text-xl">KK</span>
            </div>
            <h2 className="font-display text-2xl text-forest">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-warm-gray text-sm mt-1">{mode === 'login' ? 'Sign in to your account' : 'Join Krungthep Kreetha'}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
              <CheckCircle size={16} /> {success}
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-sm text-warm-gray block mb-1">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Thanawat Siripong" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm" />
                </div>
              </div>
            )}
            <div>
              <label className="text-sm text-warm-gray block mb-1">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm text-warm-gray block mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-forest text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 bg-forest text-cream rounded-xl font-semibold hover:bg-forest-light transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }} className="text-sm text-forest hover:underline">
              {mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>

          {mode === 'login' && (
            <div className="mt-6 p-4 bg-cream rounded-xl">
              <p className="text-xs text-warm-gray font-semibold mb-2">Demo Accounts:</p>
              <div className="space-y-1 text-xs text-charcoal">
                <p><span className="font-mono bg-white px-1.5 py-0.5 rounded">admin@kk.co.th</span> / admin123</p>
                <p><span className="font-mono bg-white px-1.5 py-0.5 rounded">staff@kk.co.th</span> / staff123</p>
                <p><span className="font-mono bg-white px-1.5 py-0.5 rounded">member@kk.co.th</span> / member123</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
