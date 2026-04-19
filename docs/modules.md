# Modules Overview

The SPPU Engineers system is organized into functional modules, each mapped to a real set of code, data, and workflows. Every module is responsible for a specific part of the platform and interacts with others through well-defined interfaces.

---

## 1. Academic Content Module

- Delivers notes, PYQs, and study resources to users
- Content is stored in Google Drive folders; Firestore holds metadata (titles, mapping, preview links)
- Access is controlled: users must purchase a pack to get Drive access (granted via Apps Script after payment)
- Frontend fetches resource lists from Firestore and checks user access before showing download/view links
- Free previews are available; full content is gated by Drive permissions

---

## 2. Opportunities Module

- Handles internships, jobs, and scholarship listings
- All data is stored in Firestore ("opportunities" collection)
- Frontend fetches using `orderBy` and `limit` queries for recent items
- Results are cached in localStorage to reduce Firestore reads and speed up repeat visits
- Admins can add, edit, or remove opportunities via the admin dashboard

---

## 3. Payment Module

- Manages order creation, payment processing, and post-payment workflows
- Integrates with Cashfree for payment gateway and webhooks
- Orders are created via backend API; payment status is updated by webhook
- Firestore transactions update orders, enrollments, stats, and coupon usage atomically
- After successful payment, triggers Apps Script to grant Drive access
- Handles idempotency to prevent duplicate processing

---

## 4. Access Automation Module

- Uses Google Apps Script to automate Drive access provisioning
- Receives webhook from backend after payment confirmation
- Checks for duplicate access before granting
- Logs all actions in Google Sheets for audit
- Removes access if required (admin/manual)

---

## 5. Admin Module

- Admin dashboard for managing users, content, coupons, stats, and opportunities
- Protected by Firebase Authentication and Firestore role checks
- All admin actions are logged
- Admin APIs are only accessible to users with the "admin" role

---
