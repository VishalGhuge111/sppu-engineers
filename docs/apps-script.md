# Google Apps Script Automation

Google Apps Script is used to automate Google Drive access provisioning after payment confirmation. The webhook from the backend triggers the script, which validates the request, prevents duplicates, maps the order to the correct Drive folder, and grants access to the user.

---

## Full Script

```
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    if (!body || !body.data || !body.data.order) {
      return respond({ ok: false, error: "invalid_webhook" });
    }

    const order = body.data.order;
    const payment = body.data.payment || {};
    const customer = body.data.customer_details || {};

    const status = String(payment.payment_status || "").toUpperCase();
    if (status !== "SUCCESS") {
      return respond({ ok: false, msg: "ignored_non_success" });
    }

    const tags = order.order_tags || {};

    const pattern = normalize(tags.pattern);
    const branch = normalize(tags.branch);
    const sem = normalize(tags.sem || tags.semester); 

    const college = safe(tags.college || tags.clg || tags.college_name);    
    const product = normalize(tags.product);
    const coupon = safe(tags.coupon);

    const orderId = safe(order.order_id);
    const amount = Number(order.order_amount || 0);

    const name = safe(customer.customer_name);
    const email = safe(customer.customer_email);
    const phone = safe(customer.customer_phone);

    const transactionId = safe(payment.cf_payment_id);
    const purchaseTime = new Date();

    const SPREADSHEET_ID = "[REDACTED]"; // hidden for security
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const sheet = ss.getSheetByName("enrollments");
    if (!sheet) {
      return respond({ ok: false, error: "enrollments_sheet_not_found" });
    }

    const finder = sheet.createTextFinder(orderId).findNext();
    if (finder) {
      return respond({ ok: true, msg: "duplicate_ignored" });
    }

    const folderId = getFolderId(ss, pattern, branch, sem, product);

    sheet.appendRow([
      orderId,
      name,
      email,
      phone,
      college,
      pattern,
      branch,
      sem,
      product,
      coupon,
      amount,
      purchaseTime,
      transactionId,
      folderId,
      "NO"
    ]);

    if (folderId && email) {
      try {
        DriveApp.getFolderById(folderId).addViewer(email);
        updateDriveFlag(sheet, orderId, "YES");
      } catch (err) {
        updateDriveFlag(sheet, orderId, "ERROR");
      }
    }

    return respond({ ok: true });

  } catch (err) {
    return respond({ ok: false, error: err.toString() });
  }
}

function normalize(v) {
  return String(v || "").trim().toLowerCase();
}

function safe(v) {
  return v ? String(v).trim() : "";
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getFolderId(ss, pattern, branch, sem, product) {
  const sheet = ss.getSheetByName("folderMapping");
  if (!sheet) return "";

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (
      normalize(data[i][0]) === pattern &&
      normalize(data[i][1]) === branch &&
      normalize(data[i][2]) === sem &&
      normalize(data[i][3]) === product
    ) {
      return data[i][4];
    }
  }

  return "";
}

function updateDriveFlag(sheet, orderId, value) {
  const row = sheet.createTextFinder(orderId).findNext();
  if (!row) return;

  sheet.getRange(row.getRow(), 15).setValue(value);
}
```

---

## Explanation

- **Webhook parsing**: Receives and parses JSON payload from backend webhook.
- **Validation logic**: Checks for required fields and payment status.
- **Duplicate prevention**: Ignores requests for already processed order IDs.
- **Folder mapping**: Maps order details to the correct Drive folder using a mapping sheet.
- **Drive access logic**: Grants Drive access to the user's email and updates the status in the sheet.
