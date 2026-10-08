/**
 * Internationalization Service
 * Manages translations for TH/EN/JA with database persistence.
 */
import { getDB, generateId } from '../db/database';

export type Locale = 'en' | 'th' | 'ja';

// ─── Default Translation Catalog ───────────────────────────────────────────────
const DEFAULT_TRANSLATIONS: Record<string, Record<Locale, string>> = {
  // Navigation
  'nav.home': { en: 'Home', th: 'หน้าแรก', ja: 'ホーム' },
  'nav.course': { en: 'The Course', th: 'สนามกอล์ฟ', ja: 'コース' },
  'nav.membership': { en: 'Membership', th: 'สมาชิก', ja: 'メンバーシップ' },
  'nav.dining': { en: 'Dining & Events', th: 'ห้องอาหารและงานอีเวนต์', ja: 'ダイニング＆イベント' },
  'nav.visit': { en: 'Visit', th: 'เยี่ยมชม', ja: '訪問' },
  'nav.contact': { en: 'Contact', th: 'ติดต่อ', ja: 'お問い合わせ' },
  'nav.login': { en: 'Member Login', th: 'เข้าสู่ระบบสมาชิก', ja: 'メンバーログイン' },

  // Hero
  'hero.title.line1': { en: "Bangkok's Most Refined", th: 'สถานที่กอล์ฟที่ประณีตที่สุด', ja: 'バンコクで最も洗練された' },
  'hero.title.line2': { en: 'Urban Golf Sanctuary', th: 'สนามกอล์ฟกลางกรุง', ja: 'アーバンゴルフサンクチュアリ' },
  'hero.subtitle': { en: 'Where exclusivity meets effortless service. A private club that anticipates your every need.', th: 'ที่ซึ่งความพิเศษพบกับการบริการที่ไร้ที่ติ สโมสรส่วนตัวที่เข้าใจทุกความต้องการของคุณ', ja: '独占性と気配りのあるサービスが出会う場所。すべてのニーズを先取りするプライベートクラブ。' },
  'hero.cta': { en: 'Reserve Your Tee Time', th: 'จองเวลาตี golf', ja: 'ティータイムを予約' },

  // Common
  'common.learnMore': { en: 'Learn More', th: 'เรียนรู้เพิ่มเติม', ja: '詳しく見る' },
  'common.bookNow': { en: 'Book Now', th: 'จองเลย', ja: '今すぐ予約' },
  'common.applyNow': { en: 'Apply Now', th: 'สมัครเลย', ja: '今すぐ申し込む' },
  'common.save': { en: 'Save', th: 'บันทึก', ja: '保存' },
  'common.cancel': { en: 'Cancel', th: 'ยกเลิก', ja: 'キャンセル' },
  'common.delete': { en: 'Delete', th: 'ลบ', ja: '削除' },
  'common.edit': { en: 'Edit', th: 'แก้ไข', ja: '編集' },
  'common.publish': { en: 'Publish', th: 'เผยแพร่', ja: '公開' },
  'common.draft': { en: 'Draft', th: 'ฉบับร่าง', ja: '下書き' },
  'common.preview': { en: 'Preview', th: 'ดูตัวอย่าง', ja: 'プレビュー' },

  // Member Portal
  'member.dashboard': { en: 'Dashboard', th: 'แดชบอร์ด', ja: 'ダッシュボード' },
  'member.booking': { en: 'Tee Times', th: 'จองเวลาตี', ja: 'ティータイム' },
  'member.scores': { en: 'My Game', th: 'เกมของฉัน', ja: 'マイゲーム' },
  'member.wallet': { en: 'Wallet', th: 'กระเป๋าเงิน', ja: 'ウォレット' },
  'member.dining': { en: 'F&B Services', th: 'บริการอาหาร', ja: 'F&Bサービス' },
  'member.community': { en: 'Community', th: 'ชุมชน', ja: 'コミュニティ' },
  'member.profile': { en: 'Profile', th: 'โปรไฟล์', ja: 'プロフィール' },
  'member.greeting': { en: 'Good Morning', th: 'สวัสดีตอนเช้า', ja: 'おはようございます' },

  // Admin
  'admin.overview': { en: 'Overview', th: 'ภาพรวม', ja: '概要' },
  'admin.teesheet': { en: 'Tee Sheet', th: 'ตารางที', ja: 'ティーシート' },
  'admin.members': { en: 'Members', th: 'สมาชิก', ja: 'メンバー' },
  'admin.caddies': { en: 'Caddies', th: 'แคดดี้', ja: 'キャディ' },
  'admin.analytics': { en: 'Analytics', th: 'วิเคราะห์', ja: '分析' },
  'admin.comms': { en: 'Communications', th: 'การสื่อสาร', ja: 'コミュニケーション' },
  'admin.settings': { en: 'Settings', th: 'ตั้งค่า', ja: '設定' },

  // CMS
  'cms.title': { en: 'Content Management', th: 'จัดการเนื้อหา', ja: 'コンテンツ管理' },
  'cms.pages': { en: 'Pages', th: 'หน้าเว็บ', ja: 'ページ' },
  'cms.news': { en: 'News', th: 'ข่าวสาร', ja: 'ニュース' },
  'cms.themes': { en: 'Themes', th: 'ธีม', ja: 'テーマ' },
  'cms.media': { en: 'Media Library', th: 'คลังสื่อ', ja: 'メディアライブラリ' },
  'cms.versions': { en: 'Version History', th: 'ประวัติเวอร์ชัน', ja: 'バージョン履歴' },

  // Footer
  'footer.rights': { en: 'All rights reserved.', th: 'สงวนลิขสิทธิ์ทั้งหมด', ja: '全著作権所有' },
  'footer.privacy': { en: 'Privacy Policy', th: 'นโยบายความเป็นส่วนตัว', ja: 'プライバシーポリシー' },
  'footer.terms': { en: 'Terms of Service', th: 'เงื่อนไขการให้บริการ', ja: '利用規約' },
};

// ─── State ─────────────────────────────────────────────────────────────────────
let currentLocale: Locale = 'en';
let translationsLoaded = false;

// ─── Initialize ────────────────────────────────────────────────────────────────
export async function initI18n(): Promise<void> {
  const db = await getDB();
  const count = await db.count('translations');

  if (count === 0) {
    // Seed default translations
    const tx = db.transaction('translations', 'readwrite');
    for (const [id, locales] of Object.entries(DEFAULT_TRANSLATIONS)) {
      for (const [locale, value] of Object.entries(locales)) {
        await tx.store.put({
          id: `${id}::${locale}`,
          locale: locale as Locale,
          value,
          updatedAt: new Date().toISOString(),
        });
      }
    }
    await tx.done;
  }

  // Load saved locale
  const savedLocale = localStorage.getItem('kk_locale') as Locale;
  if (savedLocale && ['en', 'th', 'ja'].includes(savedLocale)) {
    currentLocale = savedLocale;
  }

  translationsLoaded = true;
}

// ─── Translate ─────────────────────────────────────────────────────────────────
export function t(key: string, locale?: Locale): string {
  const loc = locale || currentLocale;
  // Fallback chain: requested locale → en → key
  const defaults = DEFAULT_TRANSLATIONS[key];
  if (defaults) {
    return defaults[loc] || defaults.en || key;
  }
  return key;
}

// ─── Get/Set Locale ────────────────────────────────────────────────────────────
export function getLocale(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale): void {
  currentLocale = locale;
  localStorage.setItem('kk_locale', locale);
}

// ─── Get all translations for a locale (for CMS) ───────────────────────────────
export async function getAllTranslations(locale: Locale): Promise<Record<string, string>> {
  const db = await getDB();
  const results = await db.getAllFromIndex('translations', 'by-locale', locale);
  const map: Record<string, string> = {};
  for (const r of results) {
    const key = r.id.replace(`::${locale}`, '');
    map[key] = r.value;
  }
  return map;
}

// ─── Update translation (CMS) ──────────────────────────────────────────────────
export async function updateTranslation(key: string, locale: Locale, value: string): Promise<void> {
  const db = await getDB();
  await db.put('translations', {
    id: `${key}::${locale}`,
    locale,
    value,
    updatedAt: new Date().toISOString(),
  });
}
