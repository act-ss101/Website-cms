/**
 * BookingPage — Public tee time booking interface
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAvailableSlots, Booking } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';

export function BookingPage() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [holes, setHoles] = useState(18);
  const [guests, setGuests] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{ time: string; available: boolean; price: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState<Booking | null>(null);
  const [error, setError] = useState('');

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    if (selectedDate) {
      setLoading(true);
      getAvailableSlots(selectedDate).then(slots => {
        setAvailableSlots(slots);
        setLoading(false);
      });
    }
  }, [selectedDate]);

  const handleBook = async () => {
    if (!user) {
      setError('Please login to book a tee time');
      return;
    }
    if (!selectedDate || !selectedTime) {
      setError('Please select date and time');
      return;
    }
    setError('');
    try {
      // In a real app, this would call the booking service
      setBooked({
        id: 'demo-' + Date.now(),
        memberId: user.id,
        date: selectedDate,
        time: selectedTime,
        holes,
        guests,
        status: 'confirmed',
        price: holes === 18 ? 3500 : 2000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (booked) {
    return (
      <div className="pt-24 pb-20 min-h-screen bg-cream">
        <div className="max-w-lg mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 shadow-sm text-center">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h2 className="font-display text-2xl text-forest mb-2">Booking Confirmed!</h2>
            <p className="text-warm-gray mb-6">Your tee time has been reserved.</p>
            <div className="bg-cream rounded-xl p-4 space-y-2 text-left mb-6">
              <div className="flex justify-between"><span className="text-warm-gray text-sm">Date</span><span className="font-medium text-forest text-sm">{new Date(booked.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span></div>
              <div className="flex justify-between"><span className="text-warm-gray text-sm">Time</span><span className="font-medium text-forest text-sm">{booked.time}</span></div>
              <div className="flex justify-between"><span className="text-warm-gray text-sm">Holes</span><span className="font-medium text-forest text-sm">{booked.holes}</span></div>
              <div className="flex justify-between"><span className="text-warm-gray text-sm">Price</span><span className="font-medium text-gold text-sm">฿{booked.price.toLocaleString()}</span></div>
            </div>
            <div className="flex gap-3">
              <Link to="/" className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-medium text-forest hover:bg-gray-50">Back to Home</Link>
              <button onClick={() => { setBooked(null); setSelectedDate(''); setSelectedTime(''); }} className="flex-1 py-3 bg-forest text-cream rounded-xl text-sm font-medium hover:bg-forest-light">Book Another</button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-16 bg-forest overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-gold text-sm font-medium mb-3">TEE TIME RESERVATION</div>
            <h1 className="font-display text-4xl md:text-5xl text-cream font-semibold mb-4">Book Your Round</h1>
            <p className="text-cream/70 text-lg max-w-2xl">Select your preferred date and time. Members enjoy priority booking windows.</p>
          </motion.div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-12 bg-cream">
        <div className="max-w-4xl mx-auto px-6">
          {!user && (
            <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 mb-6 flex items-center gap-3">
              <AlertCircle size={20} className="text-gold" />
              <p className="text-sm text-forest">Please <Link to="/login" className="font-medium underline">login</Link> to complete your booking.</p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Date Selection */}
            <div className="mb-8">
              <label className="flex items-center gap-2 text-forest font-medium mb-3"><Calendar size={18} /> Select Date</label>
              <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
                {dates.map(date => {
                  const d = new Date(date);
                  const isToday = date === dates[0];
                  return (
                    <button key={date} onClick={() => { setSelectedDate(date); setSelectedTime(''); }} className={`p-3 rounded-xl text-center transition-all ${selectedDate === date ? 'bg-forest text-cream' : 'bg-gray-50 hover:bg-gray-100 text-forest'}`}>
                      <div className="text-xs opacity-60">{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="font-display text-lg">{d.getDate()}</div>
                      <div className="text-xs opacity-60">{isToday ? 'Today' : d.toLocaleDateString('en-US', { month: 'short' })}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <label className="flex items-center gap-2 text-forest font-medium mb-3"><Clock size={18} /> Select Time</label>
                {loading ? (
                  <div className="flex items-center justify-center py-8"><Loader2 size={24} className="animate-spin text-gold" /></div>
                ) : (
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                    {availableSlots.filter(s => s.available).map(slot => (
                      <button key={slot.time} onClick={() => setSelectedTime(slot.time)} className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${selectedTime === slot.time ? 'bg-gold text-forest' : 'bg-gray-50 hover:bg-gray-100 text-forest'}`}>
                        {slot.time}
                      </button>
                    ))}
                    {availableSlots.filter(s => s.available).length === 0 && <p className="col-span-full text-center text-warm-gray py-4">No available slots for this date.</p>}
                  </div>
                )}
              </motion.div>
            )}

            {/* Options */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="flex items-center gap-2 text-forest font-medium mb-3">Holes</label>
                <div className="flex gap-2">
                  {[9, 18].map(h => (
                    <button key={h} onClick={() => setHoles(h)} className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${holes === h ? 'bg-forest text-cream' : 'bg-gray-50 text-forest hover:bg-gray-100'}`}>
                      {h} Holes
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-forest font-medium mb-3"><Users size={18} /> Guests</label>
                <input type="text" value={guests.join(', ')} onChange={e => setGuests(e.target.value ? e.target.value.split(',').map(s => s.trim()) : [])} placeholder="Guest names (comma separated)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-forest" />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button onClick={handleBook} disabled={!selectedDate || !selectedTime} className="w-full py-4 bg-gold text-forest font-semibold rounded-xl hover:bg-gold-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group">
              Confirm Booking <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
