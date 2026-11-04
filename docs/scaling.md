# Scaling and Performance

This page lists the techniques used to keep Firestore reads and server work small. It does not include load test numbers.

## Reads

- Public content (events, opportunities, resources, academic documents, study content) is cached with `unstable_cache`. Events and opportunities use 300 seconds. The others use 60 seconds.
- The syllabus and exam timetable pages use ISR with a 60 second revalidate.
- Study material, legal and first year subject pages are generated with `generateStaticParams`.
- `enrollmentCount` and `activeSessionCount` are stored on the user document, so the admin users list does not read other collections.
- Admin lists use cursor pagination (`pageSize + 1`, then `startAfter`) and `count()` for totals.
- The admin stats route caches its result in memory for 60 seconds.

## Writes

- Dashboard and analytics counters are incremented with `FieldValue.increment` inside the transaction that makes the business write.
- Payment fulfillment is idempotent, so retries and duplicate confirmations do not change data twice.

## Search

Firestore cannot search inside strings. Users, payments and enrollments store lowercase fields and a `searchTokens` array. The 23 composite indexes support the admin filters and sorts.

## Files

PDFs stream from Cloud Storage and are not buffered in memory. Responses are cacheable for one hour.

## Client

- Charts and the PDF viewer load lazily.
- The Cashfree SDK is preloaded on the checkout page.
- Several `sessionStorage` and `localStorage` caches avoid repeat loads.
- The service worker caches only an offline page and icons.

## Known limits

- Unit locking is decided in the client. Real access to paid files depends on Google Drive sharing.
- `DEFAULT_MAX_DEVICES = 3` exists in the sessions code but is not enforced.
