/**
 * Media Library Service
 * Handles file uploads, storage, and retrieval using IndexedDB.
 * Files stored as base64 data URLs (sandbox limitation).
 */
import { getDB, generateId } from '../db/database';
import { auditLog } from './auditService';

export interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  alt: Record<string, string>;
  uploadedBy: string;
  createdAt: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];

// ─── Upload File ───────────────────────────────────────────────────────────────
export async function uploadFile(file: File, uploadedBy: string, alt?: Record<string, string>): Promise<MediaItem> {
  // Validate
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type not allowed. Allowed: ${ALLOWED_TYPES.join(', ')}`);
  }

  // Convert to data URL
  const dataUrl = await fileToDataUrl(file);

  const media: MediaItem = {
    id: generateId(),
    filename: file.name,
    mimeType: file.type,
    size: file.size,
    dataUrl,
    alt: alt || { en: file.name },
    uploadedBy,
    createdAt: new Date().toISOString(),
  };

  const db = await getDB();
  await db.put('media', media);
  await auditLog({ userId: uploadedBy, action: 'media.upload', entity: 'media', entityId: media.id, details: { filename: file.name, size: file.size } });

  return media;
}

// ─── Get Media Item ────────────────────────────────────────────────────────────
export async function getMediaItem(id: string): Promise<MediaItem | null> {
  const db = await getDB();
  return await db.get('media', id) || null;
}

// ─── List Media ────────────────────────────────────────────────────────────────
export async function listMedia(filters?: { mimeType?: string; uploadedBy?: string; limit?: number }): Promise<MediaItem[]> {
  const db = await getDB();
  let items: MediaItem[];

  if (filters?.mimeType) {
    items = await db.getAllFromIndex('media', 'by-type', filters.mimeType);
  } else if (filters?.uploadedBy) {
    items = await db.getAllFromIndex('media', 'by-uploader', filters.uploadedBy);
  } else {
    items = await db.getAll('media');
  }

  items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return items.slice(0, filters?.limit || 50);
}

// ─── Delete Media ──────────────────────────────────────────────────────────────
export async function deleteMedia(id: string, userId: string): Promise<void> {
  const db = await getDB();
  const item = await db.get('media', id);
  if (!item) throw new Error('Media not found');

  await db.delete('media', id);
  await auditLog({ userId, action: 'media.delete', entity: 'media', entityId: id, details: { filename: item.filename } });
}

// ─── Update Alt Text ───────────────────────────────────────────────────────────
export async function updateMediaAlt(id: string, alt: Record<string, string>): Promise<MediaItem> {
  const db = await getDB();
  const item = await db.get('media', id);
  if (!item) throw new Error('Media not found');

  item.alt = alt;
  await db.put('media', item);
  return item;
}

// ─── Utility ───────────────────────────────────────────────────────────────────
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
