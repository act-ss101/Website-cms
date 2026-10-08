/**
 * Integration Tests — Runs in browser to verify all systems
 * Tests: Database, Auth, CMS, Booking, i18n, Validation
 */
import { getDB, generateId, hashPassword } from '../db/database';
import { register, login, logout, getCurrentSession, seedDefaultUsers, hasPermission } from '../services/authService';
import { createPage, getPageBySlug, listPages, publishPage, updatePage, getVersionHistory, rollbackToVersion, deletePage } from '../services/cmsService';
import { createBooking, getMemberBookings, getAvailableSlots, cancelBooking } from '../services/bookingService';
import { initI18n, t, setLocale, getLocale, getAllTranslations, updateTranslation } from '../services/i18nService';
import { validateEmail, validatePassword, validateSlug, validateBooking, validateRegistration } from '../services/validationService';
import { auditLog, getAuditLogs } from '../services/auditService';
import { uploadFile, listMedia, deleteMedia, formatFileSize } from '../services/mediaService';

export interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

export async function runAllTests(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  const tests = [
    // Database
    { name: 'DB: Initialize', fn: testDBInit },
    { name: 'DB: Generate ID', fn: testGenerateId },
    { name: 'DB: Hash Password', fn: testHashPassword },

    // Auth
    { name: 'Auth: Seed Users', fn: testSeedUsers },
    { name: 'Auth: Register', fn: testRegister },
    { name: 'Auth: Login', fn: testLogin },
    { name: 'Auth: Session', fn: testSession },
    { name: 'Auth: RBAC', fn: testRBAC },
    { name: 'Auth: Logout', fn: testLogout },

    // CMS
    { name: 'CMS: Create Page', fn: testCreatePage },
    { name: 'CMS: Get by Slug', fn: testGetPageBySlug },
    { name: 'CMS: Update Page', fn: testUpdatePage },
    { name: 'CMS: Publish', fn: testPublishPage },
    { name: 'CMS: Version History', fn: testVersionHistory },
    { name: 'CMS: Rollback', fn: testRollback },
    { name: 'CMS: List Pages', fn: testListPages },

    // Booking
    { name: 'Booking: Available Slots', fn: testAvailableSlots },
    { name: 'Booking: Create', fn: testCreateBooking },
    { name: 'Booking: Get Member', fn: testGetMemberBookings },
    { name: 'Booking: Cancel', fn: testCancelBooking },

    // i18n
    { name: 'i18n: Initialize', fn: testI18nInit },
    { name: 'i18n: Translate EN', fn: () => testTranslate('en') },
    { name: 'i18n: Translate TH', fn: () => testTranslate('th') },
    { name: 'i18n: Translate JA', fn: () => testTranslate('ja') },
    { name: 'i18n: Update Translation', fn: testUpdateTranslation },

    // Validation
    { name: 'Validation: Email', fn: testValidateEmail },
    { name: 'Validation: Password', fn: testValidatePassword },
    { name: 'Validation: Slug', fn: testValidateSlug },
    { name: 'Validation: Registration', fn: testValidateRegistration },
    { name: 'Validation: Booking', fn: testValidateBooking },

    // Audit
    { name: 'Audit: Log Entry', fn: testAuditLog },
    { name: 'Audit: Retrieve Logs', fn: testAuditRetrieve },

    // Media
    { name: 'Media: Format Size', fn: testFormatSize },
  ];

  for (const test of tests) {
    const start = performance.now();
    try {
      await test.fn();
      results.push({ name: test.name, passed: true, duration: performance.now() - start });
    } catch (e: any) {
      results.push({ name: test.name, passed: false, error: e.message || String(e), duration: performance.now() - start });
    }
  }

  return results;
}

// ─── Database Tests ────────────────────────────────────────────────────────────
async function testDBInit() {
  const db = await getDB();
  if (!db) throw new Error('DB not initialized');
  const storeNames: string[] = [];
  for (let i = 0; i < db.objectStoreNames.length; i++) {
    storeNames.push(db.objectStoreNames[i]);
  }
  const required = ['members', 'sessions', 'bookings', 'cms_pages', 'versions', 'media', 'audit_log', 'translations', 'settings'];
  for (const s of required) {
    if (!storeNames.includes(s)) throw new Error(`Missing store: ${s}`);
  }
}

async function testGenerateId() {
  const id = generateId();
  if (!id || id.length < 10) throw new Error('Invalid ID');
  const id2 = generateId();
  if (id === id2) throw new Error('IDs not unique');
}

async function testHashPassword() {
  const hash = await hashPassword('test123');
  if (!hash || hash.length !== 64) throw new Error('Invalid hash');
  const hash2 = await hashPassword('test123');
  if (hash !== hash2) throw new Error('Hash not deterministic');
}

// ─── Auth Tests ────────────────────────────────────────────────────────────────
async function testSeedUsers() {
  await seedDefaultUsers();
  const db = await getDB();
  const count = await db.count('members');
  if (count < 3) throw new Error(`Expected 3+ users, got ${count}`);
}

async function testRegister() {
  const email = `test-${Date.now()}@test.com`;
  const user = await register(email, 'Test1234', 'Test User', 'member');
  if (!user.id) throw new Error('No user ID');
  if (user.email !== email) throw new Error('Email mismatch');
}

async function testLogin() {
  const result = await login('admin@kk.co.th', 'admin123');
  if (!result.user) throw new Error('No user');
  if (result.user.role !== 'admin') throw new Error('Wrong role');
  if (!result.session.token) throw new Error('No token');
}

async function testSession() {
  const session = await getCurrentSession();
  if (!session) throw new Error('No active session');
  if (!session.user.id) throw new Error('No user in session');
}

async function testRBAC() {
  if (!hasPermission('admin', 'anything')) throw new Error('Admin should have all permissions');
  if (!hasPermission('member', 'bookings:read')) throw new Error('Member should read bookings');
  if (hasPermission('member', 'cms:write')) throw new Error('Member should not write CMS');
  if (hasPermission('guest', 'bookings:write')) throw new Error('Guest should not write bookings');
}

async function testLogout() {
  await logout();
  const session = await getCurrentSession();
  if (session) throw new Error('Session should be cleared');
  // Re-login for other tests
  await login('admin@kk.co.th', 'admin123');
}

// ─── CMS Tests ─────────────────────────────────────────────────────────────────
let testPageId = '';

async function testCreatePage() {
  const session = await getCurrentSession();
  const page = await createPage({
    slug: `test-page-${Date.now()}`,
    title: { en: 'Test Page', th: 'หน้าทดสอบ', ja: 'テストページ' },
    content: { body: { en: 'Test content' } },
    type: 'page',
    author: session?.user.id || 'test',
  });
  testPageId = page.id;
  if (!page.id) throw new Error('No page ID');
  if (page.status !== 'draft') throw new Error('Should be draft');
}

async function testGetPageBySlug() {
  const pages = await listPages();
  const page = pages[0];
  if (!page) throw new Error('No pages found');
  const found = await getPageBySlug(page.slug);
  if (!found) throw new Error('Page not found by slug');
}

async function testUpdatePage() {
  if (!testPageId) throw new Error('No test page');
  const updated = await updatePage(testPageId, { content: { body: { en: 'Updated content' } } }, 'test', 'Updated body');
  if (!updated.currentVersionId) throw new Error('No version created');
}

async function testPublishPage() {
  if (!testPageId) throw new Error('No test page');
  const published = await publishPage(testPageId, 'test');
  if (published.status !== 'published') throw new Error('Not published');
}

async function testVersionHistory() {
  if (!testPageId) throw new Error('No test page');
  const versions = await getVersionHistory(testPageId);
  if (versions.length < 2) throw new Error(`Expected 2+ versions, got ${versions.length}`);
  if (!versions[0].isCurrent) throw new Error('Latest should be current');
}

async function testRollback() {
  if (!testPageId) throw new Error('No test page');
  const versions = await getVersionHistory(testPageId);
  const oldVersion = versions[versions.length - 1];
  const rolled = await rollbackToVersion(testPageId, oldVersion.id, 'test');
  if (!rolled.currentVersionId) throw new Error('No new version after rollback');
}

async function testListPages() {
  const pages = await listPages();
  if (pages.length === 0) throw new Error('No pages');
  const published = await listPages({ status: 'published' });
  if (published.length === 0) throw new Error('No published pages');
}

// ─── Booking Tests ─────────────────────────────────────────────────────────────
let testBookingId = '';

async function testAvailableSlots() {
  const slots = await getAvailableSlots('2026-03-01');
  if (slots.length === 0) throw new Error('No slots');
  if (!slots[0].time) throw new Error('Slot missing time');
}

async function testCreateBooking() {
  const session = await getCurrentSession();
  if (!session) throw new Error('No session');
  const booking = await createBooking({
    memberId: session.user.id,
    date: '2026-03-15',
    time: '09:00',
    holes: 18,
    guests: ['Guest 1'],
  });
  testBookingId = booking.id;
  if (!booking.id) throw new Error('No booking ID');
  if (booking.status !== 'confirmed') throw new Error('Not confirmed');
}

async function testGetMemberBookings() {
  const session = await getCurrentSession();
  if (!session) throw new Error('No session');
  const bookings = await getMemberBookings(session.user.id);
  if (bookings.length === 0) throw new Error('No bookings');
}

async function testCancelBooking() {
  if (!testBookingId) throw new Error('No booking');
  const session = await getCurrentSession();
  if (!session) throw new Error('No session');
  const cancelled = await cancelBooking(testBookingId, session.user.id);
  if (cancelled.status !== 'cancelled') throw new Error('Not cancelled');
}

// ─── i18n Tests ────────────────────────────────────────────────────────────────
async function testI18nInit() {
  await initI18n();
  const locale = getLocale();
  if (!['en', 'th', 'ja'].includes(locale)) throw new Error('Invalid locale');
}

async function testTranslate(locale: string) {
  setLocale(locale as any);
  const result = t('nav.home');
  if (!result || result === 'nav.home') throw new Error(`Translation missing for ${locale}`);
}

async function testUpdateTranslation() {
  await updateTranslation('test.key', 'en', 'Test Value');
  const all = await getAllTranslations('en');
  if (!all['test.key']) throw new Error('Translation not saved');
}

// ─── Validation Tests ──────────────────────────────────────────────────────────
async function testValidateEmail() {
  if (!validateEmail('test@example.com')) throw new Error('Valid email rejected');
  if (validateEmail('invalid')) throw new Error('Invalid email accepted');
}

async function testValidatePassword() {
  const good = validatePassword('Test1234');
  if (!good.valid) throw new Error('Good password rejected');
  const bad = validatePassword('weak');
  if (bad.valid) throw new Error('Weak password accepted');
}

async function testValidateSlug() {
  if (!validateSlug('my-page')) throw new Error('Valid slug rejected');
  if (validateSlug('My Page')) throw new Error('Invalid slug accepted');
}

async function testValidateRegistration() {
  const good = validateRegistration({ email: 'test@test.com', password: 'Test1234', name: 'Test' });
  if (!good.valid) throw new Error('Good registration rejected');
  const bad = validateRegistration({ email: 'bad', password: '123', name: '' });
  if (bad.valid) throw new Error('Bad registration accepted');
}

async function testValidateBooking() {
  const good = validateBooking({ date: '2026-03-15', time: '09:00', holes: 18, guests: [] });
  if (!good.valid) throw new Error('Good booking rejected');
  const bad = validateBooking({ date: '', time: '', holes: 5, guests: [] });
  if (bad.valid) throw new Error('Bad booking accepted');
}

// ─── Audit Tests ───────────────────────────────────────────────────────────────
async function testAuditLog() {
  await auditLog({ action: 'test.action', entity: 'test', entityId: '123', details: { foo: 'bar' } });
}

async function testAuditRetrieve() {
  const logs = await getAuditLogs({ action: 'test.action' });
  if (logs.length === 0) throw new Error('No audit logs found');
}

// ─── Media Tests ───────────────────────────────────────────────────────────────
async function testFormatSize() {
  if (formatFileSize(500) !== '500 B') throw new Error('Bytes format wrong');
  if (formatFileSize(1500) !== '1.5 KB') throw new Error('KB format wrong');
  if (formatFileSize(1500000) !== '1.4 MB') throw new Error('MB format wrong');
}
