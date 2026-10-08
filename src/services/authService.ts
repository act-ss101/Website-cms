/**
 * Authentication Service
 * Client-side auth with RBAC, session management, and audit logging.
 * Uses IndexedDB for persistence.
 */
import { getDB, generateId, hashPassword } from '../db/database';
import { auditLog } from './auditService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'member' | 'guest';
  tier?: string;
  handicap?: number;
  memberId?: string;
  status: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  role: string;
  expiresAt: number;
  createdAt: string;
}

// ─── RBAC Permissions ──────────────────────────────────────────────────────────
const PERMISSIONS: Record<string, string[]> = {
  admin: ['*'],
  staff: ['bookings:read', 'bookings:write', 'members:read', 'cms:read', 'cms:write', 'media:read', 'media:write'],
  member: ['bookings:read', 'bookings:write', 'profile:read', 'profile:write', 'wallet:read'],
  guest: ['public:read'],
};

export function hasPermission(role: string, permission: string): boolean {
  const perms = PERMISSIONS[role] || [];
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

// ─── Register ──────────────────────────────────────────────────────────────────
export async function register(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'staff' | 'member' = 'member',
  tier?: string
): Promise<User> {
  const db = await getDB();

  // Check existing
  const existing = await db.getFromIndex('members', 'by-email', email);
  if (existing) throw new Error('Email already registered');

  const passwordHash = await hashPassword(password);
  const now = new Date().toISOString();
  const user = {
    id: generateId(),
    email,
    passwordHash,
    name,
    role,
    tier: tier as any,
    status: 'active' as const,
    createdAt: now,
    updatedAt: now,
  };

  await db.put('members', user);
  await auditLog({ action: 'user.register', entity: 'members', entityId: user.id, details: { email, role } });

  return { id: user.id, email: user.email, name: user.name, role: user.role, tier: user.tier, status: user.status };
}

// ─── Login ─────────────────────────────────────────────────────────────────────
export async function login(email: string, password: string): Promise<{ user: User; session: Session }> {
  const db = await getDB();
  const member = await db.getFromIndex('members', 'by-email', email);

  if (!member) throw new Error('Invalid credentials');
  if (member.status !== 'active') throw new Error('Account is suspended');

  const passwordHash = await hashPassword(password);
  if (member.passwordHash !== passwordHash) throw new Error('Invalid credentials');

  // Create session
  const token = generateId() + '-' + Math.random().toString(36).substr(2, 16);
  const session: Session = {
    id: generateId(),
    userId: member.id,
    token,
    role: member.role,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    createdAt: new Date().toISOString(),
  };

  await db.put('sessions', session);
  localStorage.setItem('kk_session_token', token);

  await auditLog({ userId: member.id, action: 'auth.login', entity: 'sessions', entityId: session.id });

  const user: User = {
    id: member.id,
    email: member.email,
    name: member.name,
    role: member.role,
    tier: member.tier,
    handicap: member.handicap,
    memberId: member.memberId,
    status: member.status,
  };

  return { user, session };
}

// ─── Get Current Session ───────────────────────────────────────────────────────
export async function getCurrentSession(): Promise<{ user: User; session: Session } | null> {
  const token = localStorage.getItem('kk_session_token');
  if (!token) return null;

  const db = await getDB();
  const session = await db.getFromIndex('sessions', 'by-token', token);

  if (!session || session.expiresAt < Date.now()) {
    localStorage.removeItem('kk_session_token');
    return null;
  }

  const member = await db.get('members', session.userId);
  if (!member) return null;

  return {
    user: {
      id: member.id,
      email: member.email,
      name: member.name,
      role: member.role,
      tier: member.tier,
      handicap: member.handicap,
      memberId: member.memberId,
      status: member.status,
    },
    session,
  };
}

// ─── Logout ────────────────────────────────────────────────────────────────────
export async function logout(): Promise<void> {
  const token = localStorage.getItem('kk_session_token');
  if (token) {
    const db = await getDB();
    const session = await db.getFromIndex('sessions', 'by-token', token);
    if (session) {
      await db.delete('sessions', session.id);
      await auditLog({ userId: session.userId, action: 'auth.logout', entity: 'sessions', entityId: session.id });
    }
  }
  localStorage.removeItem('kk_session_token');
}

// ─── Seed Default Users ────────────────────────────────────────────────────────
export async function seedDefaultUsers(): Promise<void> {
  const db = await getDB();
  const count = await db.count('members');
  if (count > 0) return;

  const defaults = [
    { email: 'admin@kk.co.th', password: 'admin123', name: 'General Manager', role: 'admin' as const },
    { email: 'staff@kk.co.th', password: 'staff123', name: 'Operations Staff', role: 'staff' as const },
    { email: 'member@kk.co.th', password: 'member123', name: 'Thanawat Siripong', role: 'member' as const, tier: 'platinum' },
  ];

  for (const d of defaults) {
    const passwordHash = await hashPassword(d.password);
    const now = new Date().toISOString();
    await db.put('members', {
      id: generateId(),
      email: d.email,
      passwordHash,
      name: d.name,
      role: d.role,
      tier: d.tier as any,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    });
  }
}
