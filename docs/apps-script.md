# Google Apps Script

Apps Script is an optional step after a successful payment. It is not part of the payment transaction.

## How it works

- `fulfillOrder()` commits the Firestore transaction first.
- If `APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET` are set, it then sends a JSON `POST` to the script. If either is missing, it logs a warning and skips the call.
- The payload has the shared secret, order id, name, email, phone, college, pattern, branch, semester, product, coupon, amount, transaction id and the expiry date (`YYYY-MM-DD`).
- The call is best effort. A failure is logged and does not affect the purchase.

## Why it exists

Paid notes open in the viewer as Google Drive previews. Access to those files depends on Drive sharing, which this call grants per email.

## Not covered here

This repository does not contain the script itself, so what it does with the payload is not documented here.
