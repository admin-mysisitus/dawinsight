# Google Sheets Template untuk Ebook Rental System

Panduan membuat dan mengkonfigurasi Google Sheets untuk menyimpan data users dan transactions.

## 1. Buat Google Spreadsheet Baru

1. Buka https://sheets.google.com/
2. Klik "Blank Spreadsheet"
3. Rename ke: `DWIAGUS Ebook Rental`
4. Salin URL spreadsheet (kamu akan membutuhkannya di Gas Script)
   - Format: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - Copy `{SPREADSHEET_ID}` bagian

## 2. Buat Sheet: USERS

### Kolom Header:
```
A: email
B: full_name
C: created_at
D: updated_at
E: total_purchases
```

### Contoh Data:
```
email | full_name | created_at | updated_at | total_purchases
user1@gmail.com | User Satu | 2026-03-24T10:00:00Z | 2026-03-24T10:00:00Z | 1
user2@gmail.com | User Dua | 2026-03-24T11:00:00Z | 2026-03-24T11:00:00Z | 0
```

### Format:
- Email: standard email format
- full_name: nama lengkap user
- created_at: timestamp (ISO 8601 format)
- updated_at: timestamp (ISO 8601 format)
- total_purchases: numeric

---

## 3. Buat Sheet: TRANSACTIONS

### Kolom Header:
```
A: id
B: email
C: ebook_slug
D: duration_days
E: price_usd
F: start_time
G: end_time
H: status
I: created_at
J: payment_method
```

### Contoh Data:
```
id | email | ebook_slug | duration_days | price_usd | start_time | end_time | status | created_at | payment_method
1 | user1@gmail.com | spiritualitas-sosial-transformasi | 7 | 2.50 | 2026-03-24T10:00:00Z | 2026-03-31T10:00:00Z | active | 2026-03-24T10:00:00Z | simulated
2 | user1@gmail.com | spiritualitas-sosial-transformasi | 30 | 7.99 | 2026-03-24T12:00:00Z | 2026-04-23T12:00:00Z | active | 2026-03-24T12:00:00Z | simulated
```

### Format:
- id: auto-increment atau UUID
- email: email user (foreign key ke USERS)
- ebook_slug: identifier ebook (contoh: `spiritualitas-sosial-transformasi`)
- duration_days: durasi rental (7, 30, 90, 365)
- price_usd: harga dalam USD
- start_time: timestamp ketika akses dimulai
- end_time: timestamp ketika akses berakhir (calculated)
- status: `active` atau `expired`
- created_at: timestamp pembelian
- payment_method: `simulated` (untuk development)

---

## 4. Buat Sheet: EBOOK_CATALOG

### Kolom Header:
```
A: slug
B: title
C: author
D: description
E: pdf_url
F: price_7days
G: price_30days
H: price_90days
I: price_1year
J: available
```

### Contoh Data:
```
slug | title | author | description | pdf_url | price_7days | price_30days | price_90days | price_1year | available
spiritualitas-sosial-transformasi | Spiritualitas Sosial: Transformasi dalam Krisis | Dwi Agus Widodo | Panduan komprehensif tentang spiritualitas transformatif | https://example.com/ebooks/spiritualitas-sosial.pdf | 2.50 | 7.99 | 15.99 | 25.99 | TRUE
```

### Format:
- slug: identifier unik (lowercase, hyphen)
- title: judul ebook
- author: penulis
- description: deskripsi singkat
- pdf_url: URL ke file PDF (bisa hosted di Cloudinary, S3, Google Drive)
- price_*: harga untuk berbagai durasi
- available: boolean (TRUE/FALSE)

---

## 5. Buat Sheet: SETTINGS (Optional)

### Kolom Header:
```
A: key
B: value
C: description
```

### Contoh Data:
```
key | value | description
GAS_DEPLOYMENT_ID | <deployment-id> | ID untuk verifikasi request
SITE_URL | https://dawinsight.com | Base URL website
SPREADSHEET_ID | <spreadsheet-id> | ID spreadsheet ini
```

---

## Setup Permissions

1. **Bagikan Spreadsheet**
   - Di Google Sheets, klik "Share"
   - Add: Email dari GAS project Anda
   - Permission: Editor

2. **GAS Script Permissions**
   - Akan diminta saat pertama kali run
   - Approve: `Read and modify Google Sheets`

---

## Data Validation (Optional tapi Recommended)

### Sheet: TRANSACTIONS
1. Select column H (status)
2. Data → Data validation
3. Criteria: Dropdown list
4. Options: `active, expired, refunded`

### Sheet: EBOOK_CATALOG
1. Select column J (available)
2. Data → Data validation
3. Criteria: Checkbox

---

## Initial Setup Script

Jika ingin auto-populate headers:

```javascript
function setupGoogleSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create USERS sheet if not exists
  let usersSheet = ss.getSheetByName("USERS");
  if (!usersSheet) {
    usersSheet = ss.addSheet("USERS");
    usersSheet.appendRow(["email", "full_name", "created_at", "updated_at", "total_purchases"]);
  }
  
  // Create TRANSACTIONS sheet if not exists
  let transSheet = ss.getSheetByName("TRANSACTIONS");
  if (!transSheet) {
    transSheet = ss.addSheet("TRANSACTIONS");
    transSheet.appendRow([
      "id", "email", "ebook_slug", "duration_days", "price_usd", 
      "start_time", "end_time", "status", "created_at", "payment_method"
    ]);
  }
  
  // Create EBOOK_CATALOG sheet if not exists
  let catalogSheet = ss.getSheetByName("EBOOK_CATALOG");
  if (!catalogSheet) {
    catalogSheet = ss.addSheet("EBOOK_CATALOG");
    catalogSheet.appendRow([
      "slug", "title", "author", "description", "pdf_url",
      "price_7days", "price_30days", "price_90days", "price_1year", "available"
    ]);
  }
}
```

Run function ini di GAS editor pertama kali untuk auto-setup sheets.

---

## Struktur Data JSON (untuk reference)

```json
{
  "users": {
    "email": "string",
    "full_name": "string",
    "created_at": "ISO 8601 timestamp",
    "updated_at": "ISO 8601 timestamp",
    "total_purchases": "number"
  },
  "transactions": {
    "id": "number or uuid",
    "email": "string",
    "ebook_slug": "string",
    "duration_days": "number (7|30|90|365)",
    "price_usd": "number",
    "start_time": "ISO 8601 timestamp",
    "end_time": "ISO 8601 timestamp",
    "status": "string (active|expired|refunded)",
    "created_at": "ISO 8601 timestamp",
    "payment_method": "string (simulated|stripe|paypal)"
  },
  "ebook_catalog": {
    "slug": "string",
    "title": "string",
    "author": "string",
    "description": "string",
    "pdf_url": "string",
    "price_7days": "number",
    "price_30days": "number",
    "price_90days": "number",
    "price_1year": "number",
    "available": "boolean"
  }
}
```

---

## Next Steps

1. Setup spreadsheet dengan struktur di atas
2. Catat SPREADSHEET_ID Anda
3. Lanjut ke: Membuat Google Apps Script

---

## Troubleshooting

**Q: Bagaimana cara dapat SPREADSHEET_ID?**
A: Dari URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`

**Q: Apa format timestamp yang benar?**
A: ISO 8601: `2026-03-24T10:00:00Z` atau `new Date().toISOString()`

**Q: Akankah data ter-share public?**
A: Tidak. Hanya GAS script yang bisa akses.

---

**Sudah setup? Siap untuk Google Apps Script!**
