/**
 * MemberPortalData — Connects Member Portal to Database
 * Fetches real bookings, profile data from IndexedDB
 */
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMemberBookings, Booking } from '../services/bookingService';
import { getDB } from '../db/database';

export interface MemberData {
  name: string;
  email: string;
  tier: string;
  handicap: number;
  memberId: string;
  walletBalance: number;
  bookings: Booking[];
  roundsThisMonth: number;
  notifications: { id: string; message: string; time: string; read: boolean }[];
}

export function useMemberData(): { data: MemberData | null; loading: boolean; refresh: () => void } {
  const { user } = useAuth();
  const [data, setData] = useState<MemberData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);

    try {
      const db = await getDB();
      const member = await db.get('members', user.id);
      const bookings = await getMemberBookings(user.id);
      
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const completedThisMonth = bookings.filter(b => 
        b.status === 'completed' && b.date >= monthStart
      ).length;

      // Generate notifications from recent bookings
      const notifications = bookings.slice(0, 5).map((b, i) => ({
        id: `notif-${b.id}`,
        message: b.status === 'confirmed' 
          ? `Tee time confirmed: ${b.date} at ${b.time}` 
          : b.status === 'waitlisted'
          ? `Waitlisted for ${b.date} at ${b.time}`
          : `Booking ${b.status}: ${b.date}`,
        time: new Date(b.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        read: b.status !== 'confirmed',
      }));

      setData({
        name: member?.name || user.name,
        email: member?.email || user.email,
        tier: member?.tier || user.tier || 'Gold',
        handicap: member?.handicap || user.handicap || 12,
        memberId: member?.memberId || `KK-${user.id.slice(-6).toUpperCase()}`,
        walletBalance: 25000,
        bookings,
        roundsThisMonth: completedThisMonth,
        notifications,
      });
    } catch (e) {
      console.error('Failed to fetch member data:', e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [user?.id]);

  return { data, loading, refresh: fetchData };
}
