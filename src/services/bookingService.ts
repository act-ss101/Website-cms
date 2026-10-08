/**
 * Booking Service
 * Manages tee time bookings, waitlist, and conflict resolution.
 */
import { getDB, generateId } from '../db/database';
import { auditLog } from './auditService';

export interface Booking {
  id: string;
  memberId: string;
  date: string;
  time: string;
  holes: number;
  guests: string[];
  caddieId?: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled' | 'completed';
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface WaitlistEntry {
  id: string;
  memberId: string;
  requestedDate: string;
  requestedTime: string;
  flexibilityMinutes: number;
  status: 'waiting' | 'fulfilled' | 'expired' | 'cancelled';
  priority: number;
  createdAt: string;
}

// ─── Tee Time Slots Configuration ──────────────────────────────────────────────
const TEE_TIMES = ['06:00', '06:12', '06:30', '06:45', '07:00', '07:15', '07:30', '07:45', '08:00', '08:15', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30'];
const MAX_BOOKINGS_PER_SLOT = 1; // One group per slot
const PRICING = { weekday18: 3500, weekend18: 5800, weekday9: 2000, weekend9: 3200, twilight: 2800 };

// ─── Create Booking ────────────────────────────────────────────────────────────
export async function createBooking(data: {
  memberId: string;
  date: string;
  time: string;
  holes: number;
  guests: string[];
  caddieId?: string;
}): Promise<Booking> {
  const db = await getDB();

  // Check for conflicts
  const existingBookings = await db.getAllFromIndex('bookings', 'by-date', data.date);
  const conflict = existingBookings.find(b => b.time === data.time && b.status !== 'cancelled');

  if (conflict) {
    // Add to waitlist instead
    return createWaitlistEntry({
      memberId: data.memberId,
      requestedDate: data.date,
      requestedTime: data.time,
      flexibilityMinutes: 30,
    }) as any;
  }

  // Calculate price
  const dayOfWeek = new Date(data.date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isTwilight = parseInt(data.time.split(':')[0]) >= 13;
  let price: number;
  if (isTwilight) price = PRICING.twilight;
  else if (data.holes === 9) price = isWeekend ? PRICING.weekend9 : PRICING.weekday9;
  else price = isWeekend ? PRICING.weekend18 : PRICING.weekday18;

  const now = new Date().toISOString();
  const booking: Booking = {
    id: generateId(),
    memberId: data.memberId,
    date: data.date,
    time: data.time,
    holes: data.holes,
    guests: data.guests,
    caddieId: data.caddieId,
    status: 'confirmed',
    price,
    createdAt: now,
    updatedAt: now,
  };

  await db.put('bookings', booking);
  await auditLog({ userId: data.memberId, action: 'booking.create', entity: 'bookings', entityId: booking.id, details: { date: data.date, time: data.time } });

  return booking;
}

// ─── Get Member Bookings ───────────────────────────────────────────────────────
export async function getMemberBookings(memberId: string): Promise<Booking[]> {
  const db = await getDB();
  const bookings = await db.getAllFromIndex('bookings', 'by-member', memberId);
  return bookings.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
  });
}

// ─── Get Bookings by Date ──────────────────────────────────────────────────────
export async function getBookingsByDate(date: string): Promise<Booking[]> {
  const db = await getDB();
  return await db.getAllFromIndex('bookings', 'by-date', date);
}

// ─── Cancel Booking ────────────────────────────────────────────────────────────
export async function cancelBooking(bookingId: string, userId: string): Promise<Booking> {
  const db = await getDB();
  const booking = await db.get('bookings', bookingId);
  if (!booking) throw new Error('Booking not found');

  booking.status = 'cancelled';
  booking.updatedAt = new Date().toISOString();
  await db.put('bookings', booking);

  await auditLog({ userId, action: 'booking.cancel', entity: 'bookings', entityId: bookingId });

  // Check waitlist for this slot
  await processWaitlist(booking.date, booking.time);

  return booking;
}

// ─── Get Available Slots ───────────────────────────────────────────────────────
export async function getAvailableSlots(date: string): Promise<{ time: string; available: boolean; price: number }[]> {
  const bookings = await getBookingsByDate(date);
  const bookedTimes = new Set(bookings.filter(b => b.status !== 'cancelled').map(b => b.time));

  const dayOfWeek = new Date(date).getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  return TEE_TIMES.map(time => {
    const isTwilight = parseInt(time.split(':')[0]) >= 13;
    let price: number;
    if (isTwilight) price = PRICING.twilight;
    else price = isWeekend ? PRICING.weekend18 : PRICING.weekday18;

    return {
      time,
      available: !bookedTimes.has(time),
      price,
    };
  });
}

// ─── Waitlist ──────────────────────────────────────────────────────────────────
async function createWaitlistEntry(data: {
  memberId: string;
  requestedDate: string;
  requestedTime: string;
  flexibilityMinutes: number;
}): Promise<WaitlistEntry> {
  const db = await getDB();
  const now = new Date().toISOString();

  const entry: WaitlistEntry = {
    id: generateId(),
    memberId: data.memberId,
    requestedDate: data.requestedDate,
    requestedTime: data.requestedTime,
    flexibilityMinutes: data.flexibilityMinutes,
    status: 'waiting',
    priority: Date.now(),
    createdAt: now,
  };

  await db.put('waitlist', entry);
  await auditLog({ userId: data.memberId, action: 'waitlist.add', entity: 'waitlist', entityId: entry.id });

  return entry;
}

export async function getMemberWaitlist(memberId: string): Promise<WaitlistEntry[]> {
  const db = await getDB();
  return await db.getAllFromIndex('waitlist', 'by-member', memberId);
}

async function processWaitlist(date: string, time: string): Promise<void> {
  const db = await getDB();
  const waitlist = await db.getAllFromIndex('waitlist', 'by-date', date);
  const waiting = waitlist
    .filter(w => w.status === 'waiting' && Math.abs(timeToMinutes(w.requestedTime) - timeToMinutes(time)) <= w.flexibilityMinutes)
    .sort((a, b) => a.priority - b.priority);

  if (waiting.length > 0) {
    const first = waiting[0];
    // Auto-create booking for first in waitlist
    await createBooking({
      memberId: first.memberId,
      date,
      time,
      holes: 18,
      guests: [],
    });
    first.status = 'fulfilled';
    await db.put('waitlist', first);
  }
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}
