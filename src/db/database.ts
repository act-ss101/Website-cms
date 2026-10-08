/**
 * Database Layer — IndexedDB via `idb`
 * Provides structured, transactional persistence for the full-stack app.
 * Stores: members, sessions, bookings, cms_pages, versions, media, audit_log, translations
 */
import { openDB, DBSchema, IDBPDatabase } from 'idb';

// ─── Schema ────────────────────────────────────────────────────────────────────
interface KKSchema extends DBSchema {
  members: {
    key: string;
    value: {
      id: string;
      email: string;
      passwordHash: string;
      name: string;
      role: 'admin' | 'staff' | 'member' | 'guest';
      tier?: 'platinum' | 'gold' | 'silver' | 'corporate' | 'family';
      handicap?: number;
      memberId?: string;
      preferences?: Record<string, any>;
      status: 'active' | 'suspended' | 'pending';
      createdAt: string;
      updatedAt: string;
    };
    indexes: { 'by-email': string; 'by-role': string };
  };
  sessions: {
    key: string;
    value: {
      id: string;
      userId: string;
      token: string;
      role: string;
      expiresAt: number;
      createdAt: string;
    };
    indexes: { 'by-user': string; 'by-token': string };
  };
  bookings: {
    key: string;
    value: {
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
    };
    indexes: { 'by-member': string; 'by-date': string; 'by-status': string };
  };
  waitlist: {
    key: string;
    value: {
      id: string;
      memberId: string;
      requestedDate: string;
      requestedTime: string;
      flexibilityMinutes: number;
      status: 'waiting' | 'fulfilled' | 'expired' | 'cancelled';
      priority: number;
      createdAt: string;
    };
    indexes: { 'by-member': string; 'by-date': string; 'by-status': string };
  };
  cms_pages: {
    key: string;
    value: {
      id: string;
      slug: string;
      title: Record<string, string>; // { en: '', th: '', ja: '' }
      content: Record<string, any>;
      type: 'page' | 'news' | 'announcement' | 'template';
      status: 'draft' | 'published' | 'archived';
      currentVersionId?: string;
      metadata: {
        author: string;
        seoTitle?: Record<string, string>;
        seoDescription?: Record<string, string>;
        ogImage?: string;
      };
      createdAt: string;
      updatedAt: string;
      publishedAt?: string;
    };
    indexes: { 'by-slug': string; 'by-type': string; 'by-status': string };
  };
  versions: {
    key: string;
    value: {
      id: string;
      pageId: string;
      versionNumber: number;
      content: Record<string, any>;
      title: Record<string, string>;
      changeNote: string;
      createdBy: string;
      createdAt: string;
      isCurrent: boolean;
    };
    indexes: { 'by-page': string; 'by-page-current': [string, number] };
  };
  media: {
    key: string;
    value: {
      id: string;
      filename: string;
      mimeType: string;
      size: number;
      dataUrl: string; // base64 data URL for simplicity in sandbox
      alt: Record<string, string>;
      uploadedBy: string;
      createdAt: string;
    };
    indexes: { 'by-type': string; 'by-uploader': string };
  };
  audit_log: {
    key: string;
    value: {
      id: string;
      userId?: string;
      action: string;
      entity: string;
      entityId: string;
      details: Record<string, any>;
      ip?: string;
      timestamp: string;
    };
    indexes: { 'by-user': string; 'by-entity': string; 'by-action': string; 'by-timestamp': string };
  };
  translations: {
    key: string;
    value: {
      id: string; // e.g., "nav.home"
      locale: 'en' | 'th' | 'ja';
      value: string;
      updatedAt: string;
    };
    indexes: { 'by-locale': string };
  };
  settings: {
    key: string;
    value: {
      key: string;
      value: any;
      updatedAt: string;
    };
  };
}

// ─── Singleton DB ──────────────────────────────────────────────────────────────
let dbInstance: IDBPDatabase<KKSchema> | null = null;

export async function getDB(): Promise<IDBPDatabase<KKSchema>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<KKSchema>('krungthep-kreetha', 1, {
    upgrade(db) {
      // Members
      if (!db.objectStoreNames.contains('members')) {
        const memberStore = db.createObjectStore('members', { keyPath: 'id' });
        memberStore.createIndex('by-email', 'email', { unique: true });
        memberStore.createIndex('by-role', 'role');
      }
      // Sessions
      if (!db.objectStoreNames.contains('sessions')) {
        const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
        sessionStore.createIndex('by-user', 'userId');
        sessionStore.createIndex('by-token', 'token', { unique: true });
      }
      // Bookings
      if (!db.objectStoreNames.contains('bookings')) {
        const bookingStore = db.createObjectStore('bookings', { keyPath: 'id' });
        bookingStore.createIndex('by-member', 'memberId');
        bookingStore.createIndex('by-date', 'date');
        bookingStore.createIndex('by-status', 'status');
      }
      // Waitlist
      if (!db.objectStoreNames.contains('waitlist')) {
        const waitlistStore = db.createObjectStore('waitlist', { keyPath: 'id' });
        waitlistStore.createIndex('by-member', 'memberId');
        waitlistStore.createIndex('by-date', 'requestedDate');
        waitlistStore.createIndex('by-status', 'status');
      }
      // CMS Pages
      if (!db.objectStoreNames.contains('cms_pages')) {
        const pageStore = db.createObjectStore('cms_pages', { keyPath: 'id' });
        pageStore.createIndex('by-slug', 'slug', { unique: true });
        pageStore.createIndex('by-type', 'type');
        pageStore.createIndex('by-status', 'status');
      }
      // Versions
      if (!db.objectStoreNames.contains('versions')) {
        const versionStore = db.createObjectStore('versions', { keyPath: 'id' });
        versionStore.createIndex('by-page', 'pageId');
        versionStore.createIndex('by-page-current', ['pageId', 'isCurrent' as any]);
      }
      // Media
      if (!db.objectStoreNames.contains('media')) {
        const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
        mediaStore.createIndex('by-type', 'mimeType');
        mediaStore.createIndex('by-uploader', 'uploadedBy');
      }
      // Audit Log
      if (!db.objectStoreNames.contains('audit_log')) {
        const auditStore = db.createObjectStore('audit_log', { keyPath: 'id' });
        auditStore.createIndex('by-user', 'userId');
        auditStore.createIndex('by-entity', 'entity');
        auditStore.createIndex('by-action', 'action');
        auditStore.createIndex('by-timestamp', 'timestamp');
      }
      // Translations
      if (!db.objectStoreNames.contains('translations')) {
        const transStore = db.createObjectStore('translations', { keyPath: 'id' });
        transStore.createIndex('by-locale', 'locale');
      }
      // Settings
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
}

// ─── Utility: Generate ID ──────────────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// ─── Utility: Hash Password (simple for sandbox — NOT production secure) ──────
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'kk-salt-2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export type { KKSchema };
