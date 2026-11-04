# Modules

How the codebase is organized, by folder.

| Folder | Contents |
|--------|----------|
| `src/app/(site)` | Public pages: home, study materials, syllabus, events, opportunities, resources, tools, checkout, student dashboard, Campus Ambassador pages, legal pages |
| `src/app/(viewer)` | The in-app PDF viewer |
| `src/app/admin` | The admin panel, 17 sections |
| `src/app/api` | Route Handlers |
| `src/components` | UI by feature: admin, auth, payment, study, dashboard, events and others |
| `src/hooks` | `useAuth`, `useStudyAccess`, `useOnboardingGuard`, `useSessionTracking` and others |
| `src/services` | Firestore access per collection |
| `src/lib` | Shared logic: payments, fulfillment, enrollment expiry, stats, sessions, search helpers |
| `src/data` | Static page content and the admin navigation |
| `scripts` | Tests, backfills and stats maintenance scripts |

## Key modules

- `lib/fulfill-order.ts`: the single idempotent fulfillment function used by the Cashfree webhook and by the polling fallback.
- `lib/cashfree.ts`: Cashfree API version, base URL and the order status query.
- `lib/enrollment-expiry-core.ts`: expiry dates on SPPU academic cycles, stored as end-of-day IST.
- `lib/sessions.server.ts`: device sessions and the denormalized `activeSessionCount`.
- `lib/stats/*`: counters written in transactions, and the aggregation reads behind the admin dashboard.
- `lib/admin-search.ts` and `lib/admin-list.server.ts`: search tokens and cursor pagination for admin lists.
- `lib/msg91.server.ts`: send and verify OTP through MSG91.
- `lib/search-console/gsc.server.ts`: Google Search Console client. It signs a service-account JWT with `node:crypto`.
- `lib/mail.ts`: Zoho ZeptoMail sending.
- `lib/gcs-pdf-stream.server.ts`: streams PDFs from Cloud Storage.

## Admin API

Admin routes live under `src/app/api/admin`. They cover enrollments, transactions, users, sessions, content, uploads, stats, newsletters, query replies and Search Console sync.

## Tests and scripts

- `npm run test:firestore-rules`: rules tests on the Firestore emulator
- `npm run test:enrollment-expiry`: expiry calculation tests
- `rebuild:stats`, `verify:stats`, `validate:aggregation`, `verify:ui`: stats checks and repair
- `backfill:admin-search`: fills search fields on older records
