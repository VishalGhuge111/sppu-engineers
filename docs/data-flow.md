# Data Flow

## Payment

1. The client calls `POST /api/createOrder` with a Firebase ID token.
2. The server reads the user, the coupon and the price document. A missing price document is an error.
3. It creates a Cashfree order and writes `payments/{orderId}` with status `PENDING`.
4. The client opens the Cashfree modal with `payment_session_id`.
5. Cashfree calls `POST /api/webhook/cashfree`. The request is verified with an HMAC-SHA256 signature check using a timing-safe compare. The route ignores non-terminal events and calls `fulfillOrder()` for `SUCCESS`, `FAILED` and `CANCELLED`.
6. In parallel, the status page polls `GET /api/verifyOrder`. If Firestore is still `PENDING`, the route asks the Cashfree Orders API and calls `fulfillOrder()` if the result is final.
7. `fulfillOrder()` runs one Firestore transaction. On success it updates the payment, creates the enrollment, updates coupon usage and stats, and updates the user. Flags on the payment stop any step from running twice.
8. After the commit, the receipt email is sent and the optional Apps Script call is made.

## Sign-in

1. The student signs in with Google or an email magic link.
2. The server creates the user profile if it is missing.
3. The student verifies a mobile number. The server generates the OTP, sends it through MSG91, then verifies it and saves the phone number.
4. The student completes onboarding, with an optional referral code.
5. A device session is registered. The student can list and revoke sessions.

## Study access

1. A semester page loads `studyContent` for the branch, pattern and semester.
2. The client checks the student's enrollments and decides which units are unlocked.
3. The viewer opens the unit and offers previous and next navigation across unlocked units.

## Stats

1. Business writes (order created, payment success, registration, mobile verified and others) update counters in the same transaction or in a follow-up transaction.
2. `GET /api/admin/stats` reads live `count()` and `sum()` queries and the stored time series, then caches the result for 60 seconds.

## Search Console

A cron calls `/api/cron/gsc-sync` daily at `0 4 * * *`. The admin dashboard can also trigger a sync.
