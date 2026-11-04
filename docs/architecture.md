# Architecture

SPPU Engineers is a Next.js 15 (App Router) application with React 19 and TypeScript. It runs on Vercel. Firebase provides Auth, Firestore and Storage. There is no separate backend server. The API is a set of Route Handlers in the same project.

## Layers

| Layer | What it is |
|-------|------------|
| Pages | Server Components in `src/app`. Route groups `(site)` and `(viewer)`, plus `admin`. |
| Client components | Interactive views in `src/components`, loaded from the pages. 162 of the 511 TS/TSX files are client files. |
| Service layer | Typed functions in `src/services` for each Firestore collection, with `.server.ts` files for server-side reads. |
| API | 54 Route Handlers in `src/app/api`, all on the Node runtime. |
| Middleware | `src/middleware.ts` rewrites clean file URLs and handles admin subdomain routing. |
| Data | Firestore, with security rules in `firestore.rules`. Files are in Firebase Storage. |

## Rendering

- SEO pages fetch data on the server and pass it to client components as initial content.
- Auth-gated pages render a client view inside `RequireAuth` or `RequireAdmin`.
- Three admin pages are client pages.
- `generateStaticParams` is used for study material, legal and first year subject routes.

## Hosts

- `sppuengineers.in`: public site
- `admin.sppuengineers.in`: admin panel. Middleware rewrites its clean paths to `/admin/*` and sends `noindex, nofollow`.
- `dev.sppuengineers.in`, `*.vercel.app` and localhost skip the admin routing.

## External services

| Service | Use |
|---------|-----|
| Cashfree | Payments |
| MSG91 | SMS OTP |
| Zoho ZeptoMail | Order receipts, magic links, newsletters, query replies |
| Google Search Console API | Search metrics in the admin dashboard |
| Google Apps Script | Optional call after payment, see [apps-script.md](apps-script.md) |

## Auth and roles

Sign-in is Google, email magic link or mobile OTP. API routes read a Firebase ID token from the `Authorization` header. The admin role is `users/{uid}.role == "admin"`. The API and the Firestore rules check the same field.

See the [README](../README.md) for the payment flow and the security rules.
