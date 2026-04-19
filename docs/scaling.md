# Scaling & Performance

---

## Current Scale

- ~10,000+ users
- ~50K+ monthly visits (organic)
- Payment transactions handled via Cashfree
- Content delivered through Google Drive
- Firestore as the main database

Scale here means:
- Handling thousands of concurrent reads (notes, events, opportunities)
- Processing payment transactions reliably
- Granting/removing Drive access for paid users

---

## System Design That Enables Scale

- Frontend reads public data directly from Firestore (no backend bottleneck)
- Backend is only used for payments, webhooks, and admin actions
- Firebase and Apps Script are serverless (auto-scale, no manual ops)
- Read-heavy (content, events) and write-heavy (payments, enrollments) flows are separated

---

## Backend Load Strategy

- Backend is not used for every user request
- Only handles:
  - Payment order creation
  - Webhook processing
  - Admin operations (content, coupons, stats)
- All other reads (content, events, opportunities) go direct to Firestore
- This keeps server load minimal and predictable

---

## Firestore Scaling Approach

- Collections: users, orders, enrollments, opportunities, events, coupons, stats
- All queries use filters, `orderBy`, and `limit` (no full scans)
- No unnecessary reads or writes
- Firestore auto-scales, but query discipline is enforced in code

---

## Webhook & Idempotency Design

- Payment webhook can be triggered multiple times (by Cashfree)
- System checks order ID and status before processing
- Firestore transactions ensure atomic, single-write updates
- Prevents duplicate enrollments, coupon usage, and stats updates

---

## Access Delivery Scaling

- Google Apps Script handles Drive access provisioning
- No backend load for file delivery
- Access is granted/removed via Drive permissions (not file hosting)
- Mapping system (pattern/branch/semester/product) allows structured scaling as content grows

---

## Caching Strategy (Frontend)

- localStorage caches large lists (opportunities, events)
- Reduces repeated Firestore reads for returning users
- Improves perceived performance and reduces Firestore costs

---

## Asynchronous Workflow Design

- Payment flow is fully async
- User pays → webhook triggers backend → backend triggers Apps Script
- User does not wait for full pipeline (access is granted after payment confirmation)
- Improves reliability and user experience under load

---

## Limitations & Future Improvements

- No webhook signature verification (should be added for security)
- No rate limiting on backend endpoints
- Folder mapping in Apps Script uses linear lookup (can be optimized)
- Heavy reliance on external services (Drive, Apps Script)

---

## Key Takeaways

- System scales by offloading work to managed services (Firestore, Drive, Apps Script)
- Minimal backend load due to direct Firestore reads
- Automation reduces manual admin work
- Designed for current scale, with clear paths for future optimization

---

