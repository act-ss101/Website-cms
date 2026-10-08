/**
 * Audit Logging Service
 * Records all significant actions for compliance and debugging.
 */
import { getDB, generateId } from '../db/database';

export interface AuditEntry {
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  details?: Record<string, any>;
}

export async function auditLog(entry: AuditEntry): Promise<void> {
  try {
    const db = await getDB();
    await db.put('audit_log', {
      id: generateId(),
      userId: entry.userId,
      action: entry.action,
      entity: entry.entity,
      entityId: entry.entityId,
      details: entry.details || {},
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Audit log failed:', e);
  }
}

export async function getAuditLogs(filters: {
  userId?: string;
  entity?: string;
  action?: string;
  limit?: number;
}): Promise<any[]> {
  const db = await getDB();
  let results: any[] = [];

  if (filters.userId) {
    results = await db.getAllFromIndex('audit_log', 'by-user', filters.userId);
  } else if (filters.entity) {
    results = await db.getAllFromIndex('audit_log', 'by-entity', filters.entity);
  } else if (filters.action) {
    results = await db.getAllFromIndex('audit_log', 'by-action', filters.action);
  } else {
    results = await db.getAll('audit_log');
  }

  // Sort by timestamp desc
  results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  return results.slice(0, filters.limit || 100);
}
