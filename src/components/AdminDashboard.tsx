import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Calendar, DollarSign, Settings, Bell, Search, Filter, ChevronDown, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, UserCheck, MapPin, Edit, Trash2, Plus, Eye, Download, Send, RefreshCw, LogOut, Activity, PieChart, Layers, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart as RechartsPie, Pie, Cell } from 'recharts';
import { adminData } from '../data/mockData';

type AdminPage = 'overview' | 'teesheet' | 'members' | 'caddies' | 'analytics' | 'communications' | 'settings';

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [page, setPage] = useState<AdminPage>('overview');

  const menuItems: { id: AdminPage; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={20} /> },
    { id: 'teesheet', label: 'Tee Sheet', icon: <Calendar size={20} /> },
    { id: 'members', label: 'Members', icon: <Users size={20} /> },
    { id: 'caddies', label: 'Caddies', icon: <UserCheck size={20} /> },
    { id: 'analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    { id: 'communications', label: 'Comms', icon: <Send size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-forest text-cream p-5 fixed h-full">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-gold flex items-center justify-center">
            <span className="font-display text-forest font-bold text-sm">KK</span>
          </div>
          <div>
            <div className="font-display text-sm font-semibold">Admin Panel</div>
            <div className="text-[10px] text-cream/50 uppercase tracking-wider">Operations</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${page === item.id ? 'bg-gold text-forest' : 'text-cream/70 hover:bg-cream/10'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-cream/10 pt-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-xs text-gold font-bold">GM</div>
            <div>
              <div className="text-xs font-medium">General Manager</div>
              <div className="text-[10px] text-cream/50">admin@kk.co.th</div>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-cream/50 hover:text-cream text-xs transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="font-semibold text-charcoal capitalize">{page === 'teesheet' ? 'Tee Sheet Management' : page}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input placeholder="Search members, bookings..." className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 text-sm w-64 focus:outline-none focus:border-forest" />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <Bell size={18} className="text-gray-600" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
          </div>
        </header>

        <div className="p-6 pb-24 lg:pb-6">
          {page === 'overview' && <OverviewPage />}
          {page === 'teesheet' && <TeeSheetPage />}
          {page === 'members' && <MembersPage />}
          {page === 'caddies' && <CaddiesPage />}
          {page === 'analytics' && <AnalyticsPage />}
          {page === 'communications' && <CommunicationsPage />}
          {page === 'settings' && <SettingsPage />}
        </div>
      </main>
    </div>
  );
}

// ─── OVERVIEW ───────────────────────────────────────────────────────────────────
function OverviewPage() {
  const stats = adminData.todayStats;

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Operations Overview</h1>
        <p className="text-gray-500 text-sm">Real-time snapshot of today's operations</p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Tee Times Today', value: stats.teeTimes, sub: `${stats.occupied} occupied`, icon: <Calendar size={20} />, color: 'text-blue-600 bg-blue-50' },
          { label: 'Revenue Today', value: `฿${(stats.revenue / 1000).toFixed(0)}K`, sub: '+12% vs yesterday', icon: <DollarSign size={20} />, color: 'text-green-600 bg-green-50' },
          { label: 'Members On Course', value: stats.membersOnCourse, sub: `${stats.guests} guests`, icon: <Users size={20} />, color: 'text-purple-600 bg-purple-50' },
          { label: 'Caddies On Duty', value: stats.caddiesOnDuty, sub: '8 available', icon: <UserCheck size={20} />, color: 'text-amber-600 bg-amber-50' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>{stat.icon}</div>
              <TrendingUp size={14} className="text-green-500" />
            </div>
            <div className="text-2xl font-bold text-charcoal">{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">Revenue Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={adminData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => `฿${(value/1000).toFixed(0)}K`} />
              <Bar dataKey="greenFees" fill="#1B3A2F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fb" fill="#C9A227" radius={[4, 4, 0, 0]} />
              <Bar dataKey="proShop" fill="#94A3B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">Course Utilization</h3>
          <div className="flex items-center justify-center h-[200px]">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f0f0f0" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#1B3A2F" strokeWidth="12" strokeDasharray={`${(stats.occupied / stats.teeTimes) * 251.2} 251.2`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-charcoal">{Math.round((stats.occupied / stats.teeTimes) * 100)}%</span>
                <span className="text-xs text-gray-500">Utilized</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6 text-sm">
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-forest rounded-full"></div> Occupied ({stats.occupied})</span>
            <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-200 rounded-full"></div> Available ({stats.available})</span>
          </div>
        </div>
      </div>

      {/* Churn Risk & Recent Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" /> Churn Risk Alerts</h3>
          <div className="space-y-3">
            {adminData.churnRisk.map((member, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-charcoal">{member.member}</p>
                  <p className="text-xs text-gray-500">{member.reason} · Last visit: {member.lastVisit}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.risk === 'high' ? 'bg-red-100 text-red-700' : member.risk === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                  {member.risk}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4 flex items-center gap-2"><Activity size={16} className="text-blue-500" /> Recent Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'New member application', detail: 'James Morrison — Silver tier', time: '15 min ago', type: 'member' },
              { action: 'Booking confirmed', detail: 'Tanaka Y. — Feb 15, 6:30 AM', time: '32 min ago', type: 'booking' },
              { action: 'Payment received', detail: '฿50,000 top-up — Siripong T.', time: '1 hr ago', type: 'payment' },
              { action: 'Maintenance alert', detail: 'Hole 10 cart path repair', time: '2 hrs ago', type: 'maintenance' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.type === 'member' ? 'bg-purple-50 text-purple-600' : item.type === 'booking' ? 'bg-blue-50 text-blue-600' : item.type === 'payment' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                  {item.type === 'member' ? <Users size={14} /> : item.type === 'booking' ? <Calendar size={14} /> : item.type === 'payment' ? <DollarSign size={14} /> : <AlertTriangle size={14} />}
                </div>
                <div>
                  <p className="text-sm text-charcoal">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.detail} · {item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── TEE SHEET ──────────────────────────────────────────────────────────────────
function TeeSheetPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Tee Sheet — Today</h1>
          <p className="text-gray-500 text-sm">February 14, 2026 · Championship Course</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-forest text-cream rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} /> Add Tee Time</button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-2"><RefreshCw size={16} /> Refresh</button>
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { label: 'Completed', color: 'bg-gray-100 text-gray-600' },
          { label: 'In Progress', color: 'bg-blue-100 text-blue-700' },
          { label: 'Confirmed', color: 'bg-green-100 text-green-700' },
          { label: 'Available', color: 'bg-white border border-gray-200 text-gray-600' },
          { label: 'Maintenance', color: 'bg-amber-100 text-amber-700' },
        ].map((s, i) => (
          <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${s.color}`}>{s.label}</span>
        ))}
      </div>

      {/* Tee Sheet Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-[100px_1fr_120px_100px] gap-0">
          {/* Header */}
          <div className="col-span-4 grid grid-cols-subgrid bg-gray-50 border-b border-gray-200 p-3">
            <div className="font-semibold text-xs text-gray-500 uppercase">Time</div>
            <div className="font-semibold text-xs text-gray-500 uppercase">Players</div>
            <div className="font-semibold text-xs text-gray-500 uppercase">Tier</div>
            <div className="font-semibold text-xs text-gray-500 uppercase">Status</div>
          </div>

          {/* Rows */}
          {adminData.teeSheetToday.map((slot, i) => (
            <div key={i} className="col-span-4 grid grid-cols-[100px_1fr_120px_100px] gap-0 border-b border-gray-100 hover:bg-gray-50/50 transition-colors items-center">
              <div className="p-3 font-mono text-sm font-semibold text-charcoal">{slot.time}</div>
              <div className="p-3">
                {slot.players.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {slot.players.map((p, j) => (
                      <span key={j} className="px-2 py-0.5 bg-cream text-xs rounded-md text-charcoal">{p}</span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">Open slot</span>
                )}
              </div>
              <div className="p-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${slot.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' : slot.tier === 'Gold' ? 'bg-amber-100 text-amber-700' : slot.tier === 'Corporate' ? 'bg-blue-100 text-blue-700' : slot.tier === 'Silver' ? 'bg-gray-100 text-gray-600' : 'bg-white text-gray-400'}`}>
                  {slot.tier}
                </span>
              </div>
              <div className="p-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${slot.status === 'completed' ? 'bg-gray-100 text-gray-600' : slot.status === 'in-progress' ? 'bg-blue-100 text-blue-700' : slot.status === 'confirmed' ? 'bg-green-100 text-green-700' : slot.status === 'maintenance' ? 'bg-amber-100 text-amber-700' : 'bg-white border border-gray-200 text-gray-500'}`}>
                  {slot.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MEMBERS PAGE ───────────────────────────────────────────────────────────────
function MembersPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-charcoal">Member Management</h1>
          <p className="text-gray-500 text-sm">1,247 active members</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 flex items-center gap-2"><Download size={16} /> Export</button>
          <button className="px-4 py-2 bg-forest text-cream rounded-lg text-sm font-medium flex items-center gap-2"><Plus size={16} /> Add Member</button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {['All', 'Platinum', 'Gold', 'Silver', 'Corporate', 'Family', 'Pending'].map((f, i) => (
          <button key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium ${i === 0 ? 'bg-forest text-cream' : 'bg-white border border-gray-200 text-gray-600 hover:border-forest'}`}>{f}</button>
        ))}
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Member</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Tier</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Handicap</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Last Visit</th>
              <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminData.recentMembers.map((member, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-forest/10 rounded-full flex items-center justify-center text-xs font-bold text-forest">{member.name.split(' ').map(n => n[0]).join('')}</div>
                    <span className="text-sm font-medium text-charcoal">{member.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.tier === 'Platinum' ? 'bg-purple-100 text-purple-700' : member.tier === 'Gold' ? 'bg-amber-100 text-amber-700' : member.tier === 'Corporate' ? 'bg-blue-100 text-blue-700' : member.tier === 'Family' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {member.tier}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-charcoal">{member.handicap}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{member.lastVisit}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Eye size={14} className="text-gray-400" /></button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Edit size={14} className="text-gray-400" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── CADDIES PAGE ───────────────────────────────────────────────────────────────
function CaddiesPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-charcoal mb-2">Caddie Management</h1>
      <p className="text-gray-500 text-sm mb-6">36 registered caddies · 32 on duty today</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'On Course', value: '24', color: 'bg-blue-50 text-blue-700' },
          { label: 'Available', value: '8', color: 'bg-green-50 text-green-700' },
          { label: 'Off Duty', value: '4', color: 'bg-gray-50 text-gray-600' },
        ].map((s, i) => (
          <div key={i} className={`${s.color} rounded-xl p-4 text-center`}>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Caddie</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rating</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Rounds</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Current Hole</th>
            </tr>
          </thead>
          <tbody>
            {adminData.caddieRoster.map((caddie, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-xs font-bold text-gold">{caddie.name[0]}</div>
                    <span className="text-sm font-medium text-charcoal">{caddie.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Star size={12} className="text-gold fill-gold" />
                    <span className="text-sm">{caddie.rating}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-charcoal">{caddie.rounds}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${caddie.status === 'on-course' ? 'bg-blue-100 text-blue-700' : caddie.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {caddie.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{caddie.currentHole ? `Hole ${caddie.currentHole}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ANALYTICS PAGE ─────────────────────────────────────────────────────────────
function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-charcoal mb-2">Analytics & Reporting</h1>
      <p className="text-gray-500 text-sm mb-6">Performance metrics and business intelligence</p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">Monthly Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={adminData.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value: number) => `฿${(value/1000).toFixed(0)}K`} />
              <Bar dataKey="greenFees" name="Green Fees" fill="#1B3A2F" stackId="a" />
              <Bar dataKey="fb" name="F&B" fill="#C9A227" stackId="a" />
              <Bar dataKey="proShop" name="Pro Shop" fill="#60A5FA" stackId="a" />
              <Bar dataKey="other" name="Other" fill="#94A3B8" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">Member Tier Distribution</h3>
          <div className="flex items-center justify-center h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie data={[{ name: 'Silver', value: 420 }, { name: 'Gold', value: 380 }, { name: 'Platinum', value: 280 }, { name: 'Corporate', value: 95 }, { name: 'Family', value: 72 }]} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
                  {['#94A3B8', '#C9A227', '#E5E4E2', '#1B3A2F', '#60A5FA'].map((color, i) => (
                    <Cell key={i} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {[{ n: 'Silver', c: '#94A3B8' }, { n: 'Gold', c: '#C9A227' }, { n: 'Platinum', c: '#1B3A2F' }, { n: 'Corporate', c: '#1B3A2F' }, { n: 'Family', c: '#60A5FA' }].map((t, i) => (
              <span key={i} className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full" style={{ background: t.c }}></div>{t.n}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Utilization Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tee Time Utilization', value: '81%', target: '85%' },
          { label: 'F&B Revenue/Member', value: '฿6,200', target: '฿7,000' },
          { label: 'Member NPS', value: '52', target: '50' },
          { label: 'Renewal Rate', value: '94%', target: '92%' },
        ].map((m, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">{m.label}</div>
            <div className="text-2xl font-bold text-charcoal">{m.value}</div>
            <div className="text-xs text-gray-400">Target: {m.target}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COMMUNICATIONS PAGE ────────────────────────────────────────────────────────
function CommunicationsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-charcoal mb-2">Communications</h1>
      <p className="text-gray-500 text-sm mb-6">Send announcements and manage member communications</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">Send Announcement</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Channel</label>
              <div className="flex gap-2">
                {['Push', 'Email', 'SMS', 'LINE'].map((ch, i) => (
                  <button key={i} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${i === 0 ? 'bg-forest text-cream' : 'bg-gray-100 text-gray-600'}`}>{ch}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Audience</label>
              <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                <option>All Members</option>
                <option>Platinum Only</option>
                <option>Gold & Platinum</option>
                <option>Corporate Members</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Subject</label>
              <input placeholder="Announcement title..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">Message</label>
              <textarea rows={4} placeholder="Your message..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none"></textarea>
            </div>
            <button className="w-full py-2.5 bg-forest text-cream rounded-lg font-semibold text-sm flex items-center justify-center gap-2"><Send size={16} /> Send Announcement</button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">Recent Campaigns</h3>
          <div className="space-y-3">
            {[
              { title: 'Weekend Tournament Reminder', sent: 'Feb 12', reach: 1247, open: '78%' },
              { title: 'New Seasonal Menu Launch', sent: 'Feb 10', reach: 1247, open: '65%' },
              { title: 'Course Maintenance Notice', sent: 'Feb 8', reach: 1247, open: '92%' },
              { title: 'Membership Renewal Reminder', sent: 'Feb 5', reach: 89, open: '85%' },
            ].map((c, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-charcoal">{c.title}</span>
                  <span className="text-xs text-gray-400">{c.sent}</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-500">
                  <span>Reach: {c.reach}</span>
                  <span>Open Rate: {c.open}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ──────────────────────────────────────────────────────────────
function SettingsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-charcoal mb-2">Settings & Configuration</h1>
      <p className="text-gray-500 text-sm mb-6">System configuration and user management</p>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">Pricing Configuration</h3>
          <div className="space-y-3">
            {[
              { label: 'Weekday Green Fee (18H)', value: '฿3,500' },
              { label: 'Weekend Green Fee (18H)', value: '฿5,800' },
              { label: 'Twilight Rate (after 2PM)', value: '฿2,800' },
              { label: 'Caddie Fee', value: '฿800' },
              { label: 'Cart Fee (included)', value: '฿0' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-charcoal">{p.label}</span>
                <input defaultValue={p.value} className="w-24 px-2 py-1 rounded border border-gray-200 text-sm text-right" />
              </div>
            ))}
            <button className="w-full py-2 bg-forest text-cream rounded-lg text-sm font-medium">Save Pricing</button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-charcoal mb-4">User Roles</h3>
          <div className="space-y-3">
            {[
              { role: 'General Manager', users: 1, permissions: 'Full Access' },
              { role: 'Operations Manager', users: 3, permissions: 'Tee Sheet, Members, Reports' },
              { role: 'Starter', users: 4, permissions: 'Tee Sheet Only' },
              { role: 'Finance', users: 2, permissions: 'Billing, Reports' },
              { role: 'Marketing', users: 2, permissions: 'Communications, Events' },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-charcoal">{r.role}</span>
                  <span className="text-xs text-gray-500 ml-2">({r.users} users)</span>
                </div>
                <button className="text-xs text-forest font-medium hover:underline">Edit</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
