# Krungthep Kreetha — Full-Stack Digital Concierge

## Architecture Overview

```
┌───────────────────────────────────────────────────────────────┐
│  Presentation Layer (React + Framer Motion + Tailwind)        │
│  Public Site │ Member Portal │ Admin │ CMS Panel │ Tests      │
├───────────────────────────────────────────────────────────────┤
│  Service Layer (Async API)                                    │
│  AuthService │ BookingService │ CMSService │ MediaService     │
│  AuditService │ i18nService │ ValidationService               │
├───────────────────────────────────────────────────────────────┤
│  Persistence Layer (IndexedDB via `idb`)                      │
│  members │ sessions │ bookings │ waitlist │ cms_pages         │
│  versions │ media │ audit_log │ translations │ settings       │
└───────────────────────────────────────────────────────────────┘
```

## File Structure

```
src/
├── App.tsx                          (204 lines) Main app with routing
├── main.tsx                         (7 lines)   Entry point
├── index.css                        Tailwind + custom styles
├── db/
│   └── database.ts                  (247 lines) IndexedDB schema & connection
├── services/
│   ├── authService.ts               (191 lines) Auth + RBAC + sessions
│   ├── cmsService.ts                (281 lines) CMS CRUD + versioning
│   ├── bookingService.ts            (207 lines) Bookings + waitlist
│   ├── mediaService.ts              (113 lines) File upload + storage
│   ├── auditService.ts              (56 lines)  Audit logging
│   ├── i18nService.ts               (148 lines) TH/EN/JA translations
│   └── validationService.ts         (94 lines)  Form validation
├── context/
│   ├── AuthContext.tsx               (80 lines)  React auth state
│   └── CMSContext.tsx                (196 lines) React CMS state + persistence
├── components/
│   ├── PublicSite.tsx               (555 lines) Public marketing site
│   ├── MemberPortal.tsx             (689 lines) Member dashboard + booking
│   ├── AdminDashboard.tsx           (597 lines) Admin operations
│   ├── CMSPanel.tsx                 (380 lines) Content management UI
│   ├── LoginScreen.tsx              (154 lines) Authentication UI
│   └── TestRunner.tsx               (126 lines) Integration test UI
├── data/
│   └── mockData.ts                  (146 lines) Static reference data
└── tests/
    └── integrationTests.ts          (324 lines) 36 integration tests
```

**Total: 20 source files, ~4,894 lines of code**
**No file exceeds 1,000 lines** ✅

## Features Implemented

### 1. Backend & Database (IndexedDB)
- ✅ 9 object stores with indexes
- ✅ Transactional operations
- ✅ Structured queries via indexes
- ✅ Persistent across page reloads

### 2. Authentication & RBAC
- ✅ SHA-256 password hashing
- ✅ Session management with tokens
- ✅ Role-based permissions (admin/staff/member/guest)
- ✅ Auto-redirect based on auth state
- ✅ Demo accounts seeded on first load

### 3. CMS with Full Lifecycle
- ✅ Create/Read/Update/Delete pages
- ✅ Draft → Publish workflow
- ✅ Version history (auto-created on every update)
- ✅ Rollback to any previous version
- ✅ Multi-language content (TH/EN/JA)
- ✅ Slug-based URL routing
- ✅ News/Announcement management

### 4. Theme & Layout System
- ✅ 5 preset themes
- ✅ Custom color picker
- ✅ Border radius control
- ✅ Layout style selectors (hero/nav/cards/footer)
- ✅ Real-time preview
- ✅ Persisted to IndexedDB

### 5. Booking System
- ✅ Real-time availability checking
- ✅ Conflict detection
- ✅ Dynamic pricing (weekday/weekend/twilight)
- ✅ Waitlist with auto-fulfillment
- ✅ Cancel with waitlist processing
- ✅ Member booking history

### 6. i18n (TH/EN/JA)
- ✅ 50+ translation keys
- ✅ Locale switching
- ✅ Database-persisted translations
- ✅ CMS-editable translations
- ✅ Fallback chain (requested → en → key)

### 7. Media Library
- ✅ File upload (images, PDF)
- ✅ Size validation (5MB max)
- ✅ Type validation
- ✅ Grid view with delete
- ✅ Alt text (multi-language)

### 8. Audit Logging
- ✅ All CRUD operations logged
- ✅ User attribution
- ✅ Entity/action tracking
- ✅ Queryable by user/entity/action
- ✅ Timestamped

### 9. Validation
- ✅ Email format
- ✅ Password strength
- ✅ Slug format
- ✅ Booking rules
- ✅ Registration rules
- ✅ CMS page rules

### 10. Integration Tests (36 tests)
- ✅ Database initialization
- ✅ Auth flow (register/login/session/RBAC/logout)
- ✅ CMS lifecycle (create/update/publish/version/rollback)
- ✅ Booking flow (slots/create/get/cancel)
- ✅ i18n (init/translate/update)
- ✅ Validation (email/password/slug/booking/registration)
- ✅ Audit logging
- ✅ Media utilities

## Demo Accounts

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@kk.co.th | admin123 | Admin | Full access |
| staff@kk.co.th | staff123 | Staff | Operations |
| member@kk.co.th | member123 | Member | Portal |

## Sandbox Limitations

| Limitation | Impact | Workaround |
|-----------|--------|------------|
| No server runtime | No Express/API server | Client-side service layer with async API |
| No PostgreSQL | No relational DB | IndexedDB with indexes and transactions |
| No real file storage | No S3/CDN | Base64 data URLs in IndexedDB |
| Static build | No server-side rendering | SPA with client-side routing |
| No real email/SMS | No notification delivery | Audit log records notification attempts |
| Single-user browser | No concurrent users | Session-per-browser model |

## Build Status

- ✅ `npm run build` — Success (8.14s)
- ✅ TypeScript strict mode — No errors
- ✅ All files < 1,000 lines
- ✅ 36 integration tests defined
