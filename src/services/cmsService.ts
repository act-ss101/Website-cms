/**
 * CMS Service
 * Full content management with draft/publish, versioning, and rollback.
 */
import { getDB, generateId } from '../db/database';
import { auditLog } from './auditService';

export interface CMSPage {
  id: string;
  slug: string;
  title: Record<string, string>;
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
}

export interface CMSVersion {
  id: string;
  pageId: string;
  versionNumber: number;
  content: Record<string, any>;
  title: Record<string, string>;
  changeNote: string;
  createdBy: string;
  createdAt: string;
  isCurrent: boolean;
}

// ─── Create Page ───────────────────────────────────────────────────────────────
export async function createPage(data: {
  slug: string;
  title: Record<string, string>;
  content: Record<string, any>;
  type: CMSPage['type'];
  author: string;
}): Promise<CMSPage> {
  const db = await getDB();

  // Check slug uniqueness
  const existing = await db.getFromIndex('cms_pages', 'by-slug', data.slug);
  if (existing) throw new Error(`Slug "${data.slug}" already exists`);

  const now = new Date().toISOString();
  const page: CMSPage = {
    id: generateId(),
    slug: data.slug,
    title: data.title,
    content: data.content,
    type: data.type,
    status: 'draft',
    metadata: { author: data.author },
    createdAt: now,
    updatedAt: now,
  };

  await db.put('cms_pages', page);

  // Create initial version
  const version = await createVersion(page.id, page.content, page.title, 'Initial creation', data.author);
  page.currentVersionId = version.id;
  await db.put('cms_pages', page);

  await auditLog({ action: 'cms.page.create', entity: 'cms_pages', entityId: page.id, details: { slug: data.slug, type: data.type } });

  return page;
}

// ─── Update Page (creates new version) ─────────────────────────────────────────
export async function updatePage(pageId: string, updates: Partial<CMSPage>, userId: string, changeNote: string = 'Updated'): Promise<CMSPage> {
  const db = await getDB();
  const page = await db.get('cms_pages', pageId);
  if (!page) throw new Error('Page not found');

  const now = new Date().toISOString();
  const updatedPage = { ...page, ...updates, updatedAt: now };

  // If content changed, create new version
  if (updates.content || updates.title) {
    const version = await createVersion(pageId, updatedPage.content, updatedPage.title, changeNote, userId);
    updatedPage.currentVersionId = version.id;
  }

  await db.put('cms_pages', updatedPage);
  await auditLog({ userId, action: 'cms.page.update', entity: 'cms_pages', entityId: pageId, details: { changeNote } });

  return updatedPage;
}

// ─── Publish Page ──────────────────────────────────────────────────────────────
export async function publishPage(pageId: string, userId: string): Promise<CMSPage> {
  const db = await getDB();
  const page = await db.get('cms_pages', pageId);
  if (!page) throw new Error('Page not found');

  const now = new Date().toISOString();
  page.status = 'published';
  page.publishedAt = now;
  page.updatedAt = now;

  await db.put('cms_pages', page);
  await auditLog({ userId, action: 'cms.page.publish', entity: 'cms_pages', entityId: pageId });

  return page;
}

// ─── Unpublish (back to draft) ─────────────────────────────────────────────────
export async function unpublishPage(pageId: string, userId: string): Promise<CMSPage> {
  const db = await getDB();
  const page = await db.get('cms_pages', pageId);
  if (!page) throw new Error('Page not found');

  page.status = 'draft';
  page.updatedAt = new Date().toISOString();

  await db.put('cms_pages', page);
  await auditLog({ userId, action: 'cms.page.unpublish', entity: 'cms_pages', entityId: pageId });

  return page;
}

// ─── Delete Page ───────────────────────────────────────────────────────────────
export async function deletePage(pageId: string, userId: string): Promise<void> {
  const db = await getDB();
  const page = await db.get('cms_pages', pageId);
  if (!page) throw new Error('Page not found');

  await db.delete('cms_pages', pageId);

  // Delete all versions
  const versions = await db.getAllFromIndex('versions', 'by-page', pageId);
  for (const v of versions) {
    await db.delete('versions', v.id);
  }

  await auditLog({ userId, action: 'cms.page.delete', entity: 'cms_pages', entityId: pageId, details: { slug: page.slug } });
}

// ─── Get Page by Slug ──────────────────────────────────────────────────────────
export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  const db = await getDB();
  const page = await db.getFromIndex('cms_pages', 'by-slug', slug);
  return page || null;
}

// ─── Get Page by ID ────────────────────────────────────────────────────────────
export async function getPageById(id: string): Promise<CMSPage | null> {
  const db = await getDB();
  return await db.get('cms_pages', id) || null;
}

// ─── List Pages ────────────────────────────────────────────────────────────────
export async function listPages(filters?: { type?: string; status?: string }): Promise<CMSPage[]> {
  const db = await getDB();
  let pages: CMSPage[];

  if (filters?.type) {
    pages = await db.getAllFromIndex('cms_pages', 'by-type', filters.type as any);
  } else if (filters?.status) {
    pages = await db.getAllFromIndex('cms_pages', 'by-status', filters.status as any);
  } else {
    pages = await db.getAll('cms_pages');
  }

  return pages.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

// ─── Create Version ────────────────────────────────────────────────────────────
async function createVersion(pageId: string, content: Record<string, any>, title: Record<string, string>, changeNote: string, createdBy: string): Promise<CMSVersion> {
  const db = await getDB();

  // Get existing versions for this page
  const existingVersions = await db.getAllFromIndex('versions', 'by-page', pageId);
  const maxVersion = existingVersions.reduce((max, v) => Math.max(max, v.versionNumber), 0);

  // Mark all existing as not current
  for (const v of existingVersions) {
    if (v.isCurrent) {
      v.isCurrent = false;
      await db.put('versions', v);
    }
  }

  const version: CMSVersion = {
    id: generateId(),
    pageId,
    versionNumber: maxVersion + 1,
    content: JSON.parse(JSON.stringify(content)), // Deep clone
    title: JSON.parse(JSON.stringify(title)),
    changeNote,
    createdBy,
    createdAt: new Date().toISOString(),
    isCurrent: true,
  };

  await db.put('versions', version);
  return version;
}

// ─── Get Version History ───────────────────────────────────────────────────────
export async function getVersionHistory(pageId: string): Promise<CMSVersion[]> {
  const db = await getDB();
  const versions = await db.getAllFromIndex('versions', 'by-page', pageId);
  return versions.sort((a, b) => b.versionNumber - a.versionNumber);
}

// ─── Rollback to Version ───────────────────────────────────────────────────────
export async function rollbackToVersion(pageId: string, versionId: string, userId: string): Promise<CMSPage> {
  const db = await getDB();
  const version = await db.get('versions', versionId);
  if (!version || version.pageId !== pageId) throw new Error('Version not found');

  const page = await db.get('cms_pages', pageId);
  if (!page) throw new Error('Page not found');

  // Restore content from version
  page.content = JSON.parse(JSON.stringify(version.content));
  page.title = JSON.parse(JSON.stringify(version.title));
  page.updatedAt = new Date().toISOString();

  // Create new version for the rollback
  const newVersion = await createVersion(pageId, page.content, page.title, `Rollback to v${version.versionNumber}`, userId);
  page.currentVersionId = newVersion.id;

  await db.put('cms_pages', page);
  await auditLog({ userId, action: 'cms.page.rollback', entity: 'cms_pages', entityId: pageId, details: { toVersion: version.versionNumber } });

  return page;
}

// ─── Seed Default Pages ────────────────────────────────────────────────────────
export async function seedDefaultPages(authorId: string): Promise<void> {
  const db = await getDB();
  const count = await db.count('cms_pages');
  if (count > 0) return;

  const defaultPages = [
    {
      slug: 'home',
      title: { en: 'Home', th: 'หน้าแรก', ja: 'ホーム' },
      content: {
        heroTitle: { en: "Bangkok's Most Refined\nUrban Golf Sanctuary", th: 'สถานที่กอล์ฟที่ประณีตที่สุด\nกลางกรุงเทพฯ', ja: 'バンコクで最も洗練された\nアーバンゴルフサンクチュアリ' },
        heroSubtitle: { en: 'Where exclusivity meets effortless service.', th: 'ที่ซึ่งความพิเศษพบกับการบริการที่ไร้ที่ติ', ja: '独占性と気配りのあるサービスが出会う場所。' },
        heroCTA: { en: 'Reserve Your Tee Time', th: 'จองเวลาตี golf', ja: 'ティータイムを予約' },
      },
      type: 'page' as const,
    },
    {
      slug: 'about',
      title: { en: 'About Us', th: 'เกี่ยวกับเรา', ja: '私たちについて' },
      content: {
        body: {
          en: 'Since 1972, Krungthep Kreetha has been the distinguished home of Bangkok\'s golfing elite.',
          th: 'ตั้งแต่ปี 1972 Krungthep Kreetha เป็นบ้านที่โดดเด่นของชนชั้นกอล์ฟในกรุงเทพฯ',
          ja: '1972年以来、クルンテープ・クリータはバンコクのゴルフエリートの名高い本拠地です。',
        },
      },
      type: 'page' as const,
    },
    {
      slug: 'welcome',
      title: { en: 'Welcome to Krungthep Kreetha', th: 'ยินดีต้อนรับสู่ Krungthep Kreetha', ja: 'クルンテープ・クリータへようこそ' },
      content: { body: { en: 'Experience the finest urban golf in Bangkok.', th: 'สัมผัสกอล์ฟกลางกรุงที่ดีที่สุดในกรุงเทพฯ', ja: 'バンコクで最高のアーバンゴルフを体験。' } },
      type: 'news' as const,
    },
  ];

  for (const p of defaultPages) {
    await createPage({ ...p, author: authorId });
  }
}
