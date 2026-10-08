import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Wallet, Trophy, Bell, User, ChefHat, ShoppingBag, Users, Settings, ChevronRight, TrendingUp, TrendingDown, MapPin, Star, Plus, MessageCircle, ArrowRight, LogOut, CreditCard, FileText, Cloud, CloudRain, Sun, Loader2, CheckCircle } from 'lucide-react';
import { memberData } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getMemberBookings, getAvailableSlots, createBooking, cancelBooking, Booking } from '../services/bookingService';

type MemberPage = 'dashboard' | 'booking' | 'scores' | 'wallet' | 'dining' | 'community' | 'profile';

export function MemberPortal({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<MemberPage>('dashboard');

  const menuItems: { id: MemberPage; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Trophy size={20} /> },
    { id: 'booking', label: 'Tee Times', icon: <Calendar size={20} /> },
    { id: 'scores', label: 'My Game', icon: <TrendingUp size={20} /> },
    { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} /> },
    { id: 'dining', label: 'F&B Services', icon: <ChefHat size={20} /> },
    { id: 'community', label: 'Community', icon: <Users size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-forest text-cream p-6 fixed h-full">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center">
            <span className="font-display text-forest font-bold text-lg">KK</span>
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Member Portal</div>
            <div className="text-[10px] text-cream/50 uppercase tracking-wider">Krungthep Kreetha</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${page === item.id ? 'bg-gold text-forest' : 'text-cream/70 hover:bg-cream/10 hover:text-cream'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-cream/10 pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
              <span className="text-gold font-bold text-sm">TS</span>
            </div>
            <div>
              <div className="text-sm font-medium">{memberData.name}</div>
              <div className="text-xs text-cream/50">{memberData.tier} Member</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-cream/50 hover:text-cream text-sm transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-forest/95 backdrop-blur-md z-50 px-2 py-2 flex justify-around">
        {menuItems.slice(0, 5).map(item => (
          <button key={item.id} onClick={() => setPage(item.id)} className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${page === item.id ? 'text-gold' : 'text-cream/60'}`}>
            {item.icon}
            <span className="text-[10px]">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-6 md:p-8 pb-24 lg:pb-8">
        {page === 'dashboard' && <DashboardPage />}
        {page === 'booking' && <BookingPage />}
        {page === 'scores' && <ScoresPage />}
        {page === 'wallet' && <WalletPage />}
        {page === 'dining' && <DiningPage />}
        {page === 'community' && <CommunityPage />}
        {page === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}

// ─── DASHBOARD ──────────────────────────────────────────────────────────────────
function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Morning Briefing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl text-forest mb-2">Good Morning, Thanawat</h1>
        <p className="text-warm-gray">Here's your briefing for today</p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Wallet Balance', value: `฿${memberData.walletBalance.toLocaleString()}`, icon: <Wallet size={20} />, color: 'bg-forest text-cream' },
          { label: 'Handicap', value: memberData.handicap.toString(), icon: <Trophy size={20} />, color: 'bg-gold/10 text-forest' },
          { label: 'Next Round', value: 'Feb 15', icon: <Calendar size={20} />, color: 'bg-blue-50 text-blue-700' },
          { label: 'Rounds This Month', value: '5', icon: <TrendingUp size={20} />, color: 'bg-green-50 text-green-700' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className={`rounded-xl p-5 ${stat.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="opacity-70">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm opacity-70">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Weather & Course */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><Sun size={18} className="text-gold" /> Today's Conditions</h3>
          <div className="flex items-center gap-6">
            <div className="text-5xl font-display text-forest">32°</div>
            <div>
              <p className="text-charcoal font-medium">Partly Cloudy</p>
              <p className="text-warm-gray text-sm">Wind: 8 km/h SE · Humidity: 65%</p>
              <p className="text-warm-gray text-sm">Green Speed: 10.5 · Course Status: Open</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><Bell size={18} className="text-gold" /> Notifications</h3>
          <div className="space-y-3">
            {memberData.notifications.slice(0, 3).map(n => (
              <div key={n.id} className={`flex items-start gap-3 ${!n.read ? 'font-medium' : 'opacity-70'}`}>
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-gold' : 'bg-cream-dark'}`}></div>
                <div>
                  <p className="text-sm text-charcoal">{n.message}</p>
                  <p className="text-xs text-warm-gray">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Tee Times */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-forest text-lg">Upcoming Tee Times</h3>
          <button className="text-gold text-sm font-medium flex items-center gap-1 hover:underline">View All <ChevronRight size={14} /></button>
        </div>
        <div className="space-y-3">
          {memberData.upcomingTeeTimes.map(tt => (
            <div key={tt.id} className="flex items-center justify-between p-4 bg-cream/50 rounded-xl hover:bg-cream transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-forest/10 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs text-warm-gray">{tt.date.split('-')[1]}/{tt.date.split('-')[2]}</span>
                  <span className="text-sm font-bold text-forest">{tt.time}</span>
                </div>
                <div>
                  <p className="text-charcoal font-medium">{tt.holes} Holes · {tt.guests} Guest{tt.guests !== 1 ? 's' : ''}</p>
                  <p className="text-warm-gray text-sm">Caddie: {tt.caddie}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${tt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {tt.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Book Tee Time', icon: <Calendar size={24} />, color: 'bg-forest text-cream' },
          { label: 'Order F&B', icon: <ChefHat size={24} />, color: 'bg-gold/10 text-forest' },
          { label: 'Request Caddie', icon: <User size={24} />, color: 'bg-blue-50 text-blue-700' },
          { label: 'Invite Guest', icon: <Users size={24} />, color: 'bg-purple-50 text-purple-700' },
        ].map((action, i) => (
          <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`${action.color} rounded-xl p-5 text-center transition-all`}>
            <div className="flex justify-center mb-2">{action.icon}</div>
            <span className="text-sm font-medium">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── BOOKING PAGE ───────────────────────────────────────────────────────────────
function BookingPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('2026-02-15');
  const [slots, setSlots] = useState<{ time: string; available: boolean; price: number }[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSlots();
    if (user) loadBookings();
  }, [selectedDate, user]);

  const loadSlots = async () => {
    const available = await getAvailableSlots(selectedDate);
    setSlots(available);
  };

  const loadBookings = async () => {
    if (!user) return;
    const bookings = await getMemberBookings(user.id);
    setMyBookings(bookings);
  };

  const handleBook = async (time: string) => {
    if (!user) return;
    setBooking(true);
    try {
      await createBooking({ memberId: user.id, date: selectedDate, time, holes: 18, guests: [] });
      setSuccess(`Booked ${time} successfully!`);
      await loadSlots();
      await loadBookings();
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setBooking(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!user) return;
    await cancelBooking(bookingId, user.id);
    await loadBookings();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-forest mb-2">Book Tee Time</h1>
        <p className="text-warm-gray mb-8">Select your preferred date and time slot</p>
      </motion.div>

      {/* AI Recommendation */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-r from-forest to-forest-light rounded-xl p-6 text-cream mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-gold/20 rounded-lg flex items-center justify-center"><Star size={16} className="text-gold" /></div>
          <span className="font-semibold text-gold text-sm">AI Recommendation</span>
        </div>
        <p className="text-cream/90">Your usual Saturday 6:30 AM slot with Somchai K. is available on Feb 22. Would you like to book it?</p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-gold text-forest rounded-lg text-sm font-semibold">Book Now</button>
          <button className="px-4 py-2 bg-cream/10 text-cream rounded-lg text-sm">Dismiss</button>
        </div>
      </motion.div>

      {/* Date Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50 mb-6">
        <h3 className="font-semibold text-forest mb-4">Select Date</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Feb 15', 'Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20', 'Feb 21', 'Feb 22'].map((d, i) => (
            <button key={i} onClick={() => setSelectedDate(`2026-02-${15 + i}`)} className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all ${selectedDate === `2026-02-${15 + i}` ? 'bg-forest text-cream' : 'bg-cream hover:bg-cream-dark text-charcoal'}`}>
              <div className="text-xs opacity-70">{['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i]}</div>
              <div className="font-bold">{d}</div>
            </button>
          ))}
        </div>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      {/* My Bookings */}
      {myBookings.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50 mb-6">
          <h3 className="font-semibold text-forest mb-4">My Bookings</h3>
          <div className="space-y-2">
            {myBookings.filter(b => b.status === 'confirmed').slice(0, 3).map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-cream/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-charcoal">{b.date} at {b.time}</p>
                  <p className="text-xs text-warm-gray">{b.holes} holes · ฿{b.price.toLocaleString()}</p>
                </div>
                <button onClick={() => handleCancel(b.id)} className="text-xs text-red-500 hover:underline">Cancel</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time Slots */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
        <h3 className="font-semibold text-forest mb-4">Available Slots</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {slots.map((slot, i) => (
            <button
              key={i}
              disabled={!slot.available || booking}
              onClick={() => handleBook(slot.time)}
              className={`p-3 rounded-xl text-center transition-all ${
                slot.available ? 'bg-green-50 hover:bg-green-100 text-green-800 border border-green-200 cursor-pointer' :
                'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
              }`}
            >
              <div className="font-bold">{slot.time}</div>
              <div className="text-xs mt-1">฿{slot.price.toLocaleString()}</div>
              <div className="text-[10px] mt-0.5">{slot.available ? 'Available' : 'Booked'}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCORES PAGE ────────────────────────────────────────────────────────────────
function ScoresPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-forest mb-2">My Game</h1>
        <p className="text-warm-gray mb-8">Track your performance and progress</p>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Handicap Index', value: '12.4', trend: -0.3 },
          { label: 'Scoring Avg', value: '79.2', trend: -1.2 },
          { label: 'Rounds (30d)', value: '5', trend: 1 },
          { label: 'Best Score', value: '76', trend: 0 },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-xl p-5 shadow-sm border border-cream-dark/50">
            <div className="text-sm text-warm-gray mb-1">{stat.label}</div>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold text-forest">{stat.value}</span>
              {stat.trend !== 0 && (
                <span className={`text-xs flex items-center ${stat.trend < 0 ? 'text-green-600' : 'text-amber-600'}`}>
                  {stat.trend < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}
                  {Math.abs(stat.trend)}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Rounds */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50 mb-8">
        <h3 className="font-semibold text-forest mb-4">Recent Rounds</h3>
        <div className="space-y-3">
          {memberData.recentRounds.map((round, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-cream/50 rounded-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-forest/10 rounded-xl flex items-center justify-center">
                  <span className="font-bold text-forest">{round.score}</span>
                </div>
                <div>
                  <p className="text-charcoal font-medium">{round.course} · {round.holes} holes</p>
                  <p className="text-warm-gray text-sm">{round.date} · Par {round.par}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${round.score - round.par <= 4 ? 'text-green-600' : round.score - round.par <= 8 ? 'text-amber-600' : 'text-red-600'}`}>
                  {round.score - round.par > 0 ? '+' : ''}{round.score - round.par}
                </div>
                <div className="text-xs text-warm-gray">{round.holes === 18 ? '18H' : '9H'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
        <h3 className="font-semibold text-forest mb-4">Score Trend (Last 10 Rounds)</h3>
        <div className="h-48 flex items-end justify-between gap-2 px-4">
          {[82, 79, 76, 80, 78, 84, 77, 79, 82, 78].map((score, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-warm-gray">{score}</span>
              <div className={`w-full rounded-t-lg transition-all ${score <= 78 ? 'bg-green-400' : score <= 80 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ height: `${(score - 70) * 12}px` }}></div>
              <span className="text-[10px] text-warm-gray">R{i + 1}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-xs text-warm-gray">
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-400 rounded"></div> ≤78</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-amber-400 rounded"></div> 79-80</span>
          <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-400 rounded"></div> &gt;80</span>
        </div>
      </div>
    </div>
  );
}

// ─── WALLET PAGE ────────────────────────────────────────────────────────────────
function WalletPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-forest mb-2">Wallet & Billing</h1>
        <p className="text-warm-gray mb-8">Manage your account balance and transactions</p>
      </motion.div>

      {/* Balance Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-forest to-forest-light rounded-2xl p-8 text-cream mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-cream/60 text-sm">Current Balance</p>
            <p className="text-4xl font-display font-bold">฿{memberData.walletBalance.toLocaleString()}</p>
          </div>
          <div className="w-16 h-16 bg-gold/20 rounded-2xl flex items-center justify-center">
            <CreditCard size={32} className="text-gold" />
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-gold text-forest rounded-xl font-semibold text-sm">Top Up</button>
          <button className="px-5 py-2.5 bg-cream/10 text-cream rounded-xl text-sm">Auto-Pay Setup</button>
          <button className="px-5 py-2.5 bg-cream/10 text-cream rounded-xl text-sm">Download Statement</button>
        </div>
      </motion.div>

      {/* Transactions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-forest">Recent Transactions</h3>
          <select className="px-3 py-1.5 rounded-lg border border-cream-dark text-sm text-warm-gray">
            <option>All Categories</option>
            <option>Green Fees</option>
            <option>F&B</option>
            <option>Pro Shop</option>
            <option>Caddie</option>
          </select>
        </div>
        <div className="space-y-3">
          {memberData.transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-cream/50 rounded-xl transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.amount > 0 ? 'bg-green-100 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {tx.amount > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                </div>
                <div>
                  <p className="text-charcoal font-medium text-sm">{tx.description}</p>
                  <p className="text-warm-gray text-xs">{tx.date} · {tx.category}</p>
                </div>
              </div>
              <span className={`font-semibold ${tx.amount > 0 ? 'text-green-600' : 'text-charcoal'}`}>
                {tx.amount > 0 ? '+' : ''}฿{Math.abs(tx.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── DINING PAGE ────────────────────────────────────────────────────────────────
function DiningPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-forest mb-2">F&B & Services</h1>
        <p className="text-warm-gray mb-8">Pre-order, reservations, and locker management</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pre-order */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><ChefHat size={18} className="text-gold" /> Pre-Order for Round</h3>
          <p className="text-warm-gray text-sm mb-4">Order will be delivered to your locker or on-course</p>
          <div className="space-y-3">
            {[
              { name: 'Breakfast Set', desc: 'Thai omelette, toast, fresh juice', price: 350 },
              { name: 'On-Course Beverage Pack', desc: 'Water, sports drink, energy bars', price: 280 },
              { name: 'Post-Round Lunch', desc: 'Chef\'s choice 3-course meal', price: 890 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-cream/50 rounded-xl">
                <div>
                  <p className="text-charcoal font-medium text-sm">{item.name}</p>
                  <p className="text-warm-gray text-xs">{item.desc}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-forest font-semibold text-sm">฿{item.price}</span>
                  <button className="w-8 h-8 bg-forest text-cream rounded-lg flex items-center justify-center"><Plus size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restaurant Reservation */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><Calendar size={18} className="text-gold" /> Restaurant Reservation</h3>
          <div className="space-y-4">
            <select className="w-full px-4 py-3 rounded-xl border border-cream-dark text-sm">
              <option>The 19th Hole — Fine Dining</option>
              <option>The Terrace — Casual</option>
              <option>Pool Bar</option>
            </select>
            <input type="date" className="w-full px-4 py-3 rounded-xl border border-cream-dark text-sm" />
            <select className="w-full px-4 py-3 rounded-xl border border-cream-dark text-sm">
              <option>2 Guests</option>
              <option>4 Guests</option>
              <option>6 Guests</option>
              <option>8+ Guests</option>
            </select>
            <select className="w-full px-4 py-3 rounded-xl border border-cream-dark text-sm">
              <option>12:00 PM</option>
              <option>12:30 PM</option>
              <option>1:00 PM</option>
              <option>6:00 PM</option>
              <option>7:00 PM</option>
              <option>8:00 PM</option>
            </select>
            <button className="w-full py-3 bg-forest text-cream rounded-xl font-semibold text-sm">Reserve Table</button>
          </div>
        </div>

        {/* Locker */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><ShoppingBag size={18} className="text-gold" /> Locker Management</h3>
          <div className="space-y-3">
            <div className="p-4 bg-cream/50 rounded-xl">
              <p className="text-sm text-warm-gray">Locker Number</p>
              <p className="text-forest font-bold text-lg">#247 — Premium Suite</p>
            </div>
            <div className="p-4 bg-cream/50 rounded-xl">
              <p className="text-sm text-warm-gray">Dry Cleaning Request</p>
              <p className="text-charcoal text-sm">2 items pending pickup</p>
            </div>
            <button className="w-full py-3 border-2 border-forest text-forest rounded-xl font-semibold text-sm">Request Service</button>
          </div>
        </div>

        {/* Pro Shop */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><ShoppingBag size={18} className="text-gold" /> Pro Shop</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: 'Titleist Pro V1', price: '฿2,400/doz', emoji: '⛳' },
              { name: 'KK Logo Cap', price: '฿1,200', emoji: '🧢' },
              { name: 'Rain Gloves', price: '฿450', emoji: '🧤' },
              { name: 'Range Balls (50)', price: '฿300', emoji: '🏌️' },
            ].map((item, i) => (
              <div key={i} className="p-3 bg-cream/50 rounded-xl text-center hover:bg-cream transition-colors cursor-pointer">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="text-xs text-charcoal font-medium">{item.name}</p>
                <p className="text-xs text-gold font-semibold">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMMUNITY PAGE ─────────────────────────────────────────────────────────────
function CommunityPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-forest mb-2">Community</h1>
        <p className="text-warm-gray mb-8">Connect with fellow members and club events</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Tournaments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><Trophy size={18} className="text-gold" /> Upcoming Tournaments</h3>
          <div className="space-y-3">
            {[
              { name: 'Monthly Medal', date: 'Feb 25', format: 'Stroke Play', spots: 12 },
              { name: 'Annual Championship', date: 'Mar 15-17', format: '36-Hole', spots: 45 },
              { name: 'Mixed Foursomes', date: 'Mar 8', format: 'Stableford', spots: 20 },
            ].map((t, i) => (
              <div key={i} className="p-4 bg-cream/50 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-charcoal font-medium text-sm">{t.name}</p>
                  <p className="text-warm-gray text-xs">{t.date} · {t.format}</p>
                </div>
                <button className="px-3 py-1.5 bg-forest text-cream rounded-lg text-xs font-medium">{t.spots} spots</button>
              </div>
            ))}
          </div>
        </div>

        {/* My Regular Foursome */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
          <h3 className="font-semibold text-forest mb-4 flex items-center gap-2"><Users size={18} className="text-gold" /> My Regular Foursome</h3>
          <div className="space-y-3">
            {['Somchai W. (HCP 8)', 'Priya N. (HCP 5)', 'David C. (HCP 16)', 'You (HCP 12)'].map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-cream/50 rounded-xl">
                <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center text-xs font-bold text-forest">{m[0]}</div>
                <span className="text-sm text-charcoal">{m}</span>
                {i === 3 && <span className="ml-auto text-xs text-gold font-medium">You</span>}
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2.5 border-2 border-forest text-forest rounded-xl font-semibold text-sm">Book Group Tee Time</button>
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ───────────────────────────────────────────────────────────────
function ProfilePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-3xl text-forest mb-2">Profile & Settings</h1>
        <p className="text-warm-gray mb-8">Manage your membership details and preferences</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Digital Card */}
        <div className="md:col-span-1">
          <div className="bg-gradient-to-br from-forest to-forest-light rounded-2xl p-6 text-cream mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gold/20 rounded-full flex items-center justify-center">
                <span className="text-gold font-bold text-xl">TS</span>
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{memberData.name}</div>
                <div className="text-cream/60 text-sm">{memberData.memberId}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-cream/60">Tier</span><span className="text-gold font-semibold">{memberData.tier}</span></div>
              <div className="flex justify-between"><span className="text-cream/60">Member Since</span><span>{memberData.joinDate}</span></div>
              <div className="flex justify-between"><span className="text-cream/60">Handicap</span><span>{memberData.handicap}</span></div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
            <h3 className="font-semibold text-forest mb-4">Preferences</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-warm-gray block mb-1">Preferred Caddie</label>
                <input defaultValue={memberData.preferences.caddie} className="w-full px-3 py-2 rounded-lg border border-cream-dark text-sm" />
              </div>
              <div>
                <label className="text-sm text-warm-gray block mb-1">Tee Time Window</label>
                <input defaultValue={memberData.preferences.teeTimeWindow} className="w-full px-3 py-2 rounded-lg border border-cream-dark text-sm" />
              </div>
              <div>
                <label className="text-sm text-warm-gray block mb-1">Dietary Restrictions</label>
                <input defaultValue={memberData.preferences.dietary} className="w-full px-3 py-2 rounded-lg border border-cream-dark text-sm" />
              </div>
              <div>
                <label className="text-sm text-warm-gray block mb-1">Cart Preference</label>
                <select defaultValue={memberData.preferences.cartPreference} className="w-full px-3 py-2 rounded-lg border border-cream-dark text-sm">
                  <option>Always</option>
                  <option>When needed</option>
                  <option>Never (walk)</option>
                </select>
              </div>
            </div>
            <button className="mt-4 px-5 py-2.5 bg-forest text-cream rounded-xl text-sm font-semibold">Save Preferences</button>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-cream-dark/50">
            <h3 className="font-semibold text-forest mb-4">Communication</h3>
            <div className="space-y-3">
              {['Booking confirmations', 'Tournament invitations', 'Promotional offers', 'Course maintenance alerts', 'Monthly newsletter'].map((item, i) => (
                <label key={i} className="flex items-center justify-between p-3 bg-cream/50 rounded-xl cursor-pointer">
                  <span className="text-sm text-charcoal">{item}</span>
                  <input type="checkbox" defaultChecked={i < 3} className="w-5 h-5 rounded accent-forest" />
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
