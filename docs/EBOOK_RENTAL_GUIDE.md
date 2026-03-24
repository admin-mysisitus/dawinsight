# DWIAGUS Ebook Rental System - Setup & Deployment Guide

Panduan lengkap untuk mengimplementasikan sistem ebook rental dengan Google Apps Script dan Google Spreadsheet.

## 📋 Overview Sistem

```
┌─────────────────────────────────────────────────────────────────┐
│                    DWIAGUS Website (Static)                      │
│                   (Cloudflare Pages)                             │
│                                                                  │
│  ebook/spiritualitas-sosial-transformasi.html                   │
│  ├── ebook-access.js (Frontend)                                 │
│  └── Calls GAS API via fetch()                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│              Google Apps Script (Web App)                        │
│              (Code.gs)                                           │
│                                                                  │
│  ├── doGet() / doPost() handlers                                │
│  ├── /check-access endpoint                                    │
│  ├── /start-access endpoint                                    │
│  └── /get-catalog endpoint                                     │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Read/Write
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│              Google Spreadsheet (Database)                       │
│                                                                  │
│  ├── USERS sheet (email, name, purchase history)               │
│  ├── TRANSACTIONS sheet (rentals, access, timing)              │
│  ├── EBOOK_CATALOG sheet (products, pricing)                   │
│  └── SETTINGS sheet (config)                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## ✅ Step-by-Step Setup Guide

### Step 1: Create Google Spreadsheet

**1.1 Buat spreadsheet baru**
```
1. Buka https://sheets.google.com/
2. Klik "Blank Spreadsheet" / "+ New"
3. Rename ke: "DWIAGUS Ebook Rental"
4. Catat SPREADSHEET_ID dari URL:
   https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
```

**1.2 Create sheets dengan struktur berikut**

Lihat file: `GOOGLE_SHEETS_SETUP.md` untuk detail lengkap struktur

Sheets yang harus dibuat:
- **USERS** - User data
- **TRANSACTIONS** - Rental transactions
- **EBOOK_CATALOG** - Product catalog
- **SETTINGS** - Configuration

Use script GAS `setupGoogleSheet()` untuk auto-create sheets jika kosong.

---

### Step 2: Setup Google Apps Script

**2.1 Create Google Apps Script project**
```
1. Buka https://script.google.com/
2. Klik "+ New project"
3. Rename ke: "DWIAGUS Ebook Rental API"
4. Delete default "myFunction"
```

**2.2 Copy Code.gs**
```
1. Copy semua kode dari: backend/Code.gs
2. Paste ke Editor Apps Script
3. Update variable di atas:
   - SPREADSHEET_ID = "Your_Spreadsheet_ID_Here"
   - ALLOWED_ORIGINS = ["https://dawinsight.com", ...]
```

**2.3 Test Code**
```
1. Di Apps Script editor, pilih function: setupGoogleSheet
2. Klik Run
3. Approve permissions ketika diminta
4. Check Google Sheets - sheets harus auto-created
```

---

### Step 3: Deploy Google Apps Script as Web App

**3.1 Deploy untuk pertama kali**
```
1. Klik "Deploy" di atas editor
2. Pilih "New deployment"
3. Select type: "Web app"
4. Execute as: Pilih akun Anda
5. Who has access: "Anyone"
6. Klik "Deploy"
```

**3.2 Grant Permissions**
```
1. Review permissions yang diminta (Google Sheets access)
2. Klik "Allow"
3. Copy Deployment URL yang diberikan
   Format: https://script.google.com/macros/d/{DEPLOYMENT_ID}/usercodeapp
```

**3.3 Simpan Deployment ID**
```
- Folder: /backend/
- File: DEPLOYMENT_ID.txt
- Content: https://script.google.com/macros/d/YOUR_ID/usercodeapp
```

---

### Step 4: Update Frontend HTML

**4.1 Update ebook page**

File: `ebook/spiritualitas-sosial-transformasi.html`

Find this line (near bottom):
```javascript
const GAS_DEPLOYMENT_URL = "https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercodeapp";
```

Replace `YOUR_DEPLOYMENT_ID` dengan ID dari Step 3.2

**4.2 Verify changes**
```
Pemberian script:
✅ <script src="/assets/js/ebook-access.js"></script>
✅ GAS_DEPLOYMENT_URL diset dengan benar
✅ initEbookSystem() dipanggil on DOMContentLoaded
```

---

### Step 5: Test Sistem

**5.1 Test Lokal**
```bash
# Start local server
python -m http.server 8000

# Buka di browser
http://localhost:8000/ebook/spiritualitas-sosial-transformasi.html

# Flow test:
1. Halaman harus loading "Memuat sistem akses..."
2. Harus muncul form untuk input email
3. Input email, klik "Lanjutkan"
4. Harus muncul pricing options
5. Klik "Beli Akses" untuk 7 hari
6. Check Google Sheets TRANSACTIONS - harus ada row baru
7. Refresh halaman
8. Email masih tersimpan, harus langsung tampil PDF viewer
```

**5.2 Test GAS API Langsung**

Test `/check-access`:
```
https://script.google.com/macros/d/DEPLOYMENT_ID/usercodeapp?action=checkAccess&email=test@example.com&ebook_slug=spiritualitas-sosial-transformasi
```

Response harus:
```json
{
  "access": false,
  "email": "test@example.com",
  "ebook_slug": "spiritualitas-sosial-transformasi"
}
```

Test `/get-catalog`:
```
https://script.google.com/macros/d/DEPLOYMENT_ID/usercodeapp?action=getCatalog&ebook_slug=spiritualitas-sosial-transformasi
```

---

## 🔧 Configuration

### Update Database Pricing

Di Google Sheets EBOOK_CATALOG:

```
slug | title | ... | price_7days | price_30days | price_90days | price_1year
spiritualitas-sosial-transformasi | Spiritualitas Sosial | ... | 2.50 | 7.99 | 15.99 | 25.99
```

Pricing ini akan otomatis ditampilkan di frontend.

### Add New Ebook

**1. Add ke EBOOK_CATALOG sheet:**
```
A: ebook-baru-slug
B: Judul Ebook Baru
C: Author Name
D: Description
E: https://link-ke-pdf.com/ebook.pdf
F-I: Pricing untuk 7/30/90/365 hari
J: TRUE (available)
```

**2. Create HTML page:**
```
/ebook/ebook-baru-slug.html
```

Template bisa copy-paste dari existing ebook page, hanya perlu ubah:
- h1 title
- ebookSlug parameter di initializeEbookPage()
- Link PDF (optional - dari CATALOG)

---

## 📊 Database Queries (Reference)

### Check User Purchases
```javascript
// Di GAS editor, run function ini untuk debug
function listUserPurchases(email) {
  const transSheet = getSheet("TRANSACTIONS");
  const data = transSheet.getDataRange().getValues();
  
  const purchases = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === email) {
      purchases.push({
        ebook: data[i][2],
        duration: data[i][3],
        status: data[i][7],
        expires: data[i][6]
      });
    }
  }
  Logger.log(purchases);
}
```

### Manually Expire Transaction
```javascript
function manuallyExpireTransaction(transactionId) {
  const transSheet = getSheet("TRANSACTIONS");
  const data = transSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === transactionId) {
      transSheet.getRange(i + 1, 8).setValue("expired");
      Logger.log("Transaction expired: " + transactionId);
      break;
    }
  }
}
```

---

## 🐛 Troubleshooting

### Problem: "GAS_DEPLOYMENT_URL not found" error

**Solution:** Check apakah URL benar di HTML:
```javascript
const GAS_DEPLOYMENT_URL = "https://script.google.com/macros/d/YOUR_ID/usercodeapp";
```

Pastikan gak ada typo dan ID lengkap.

---

### Problem: "Permission denied" saat akses Sheets

**Solution:**
1. Log in dengan akun yang membuat GAS
2. Re-authorize: `setupGoogleSheet()` lagi
3. Atau share spreadsheet dengan email GAS deployment

---

### Problem: Form email tidak responsive

**Solution:** Check browser console (F12) untuk errors:
```javascript
// Debugging
console.log("Email valid?", ebookSystem.isEmailValid("test@example.com"));
console.log("GAS URL:", ebookSystem.gasUrl);
```

---

### Problem: PDF tidak tampil di iframe

**Solution:**
1. Check pdf_url di EBOOK_CATALOG valid
2. PDF harus bisa di-access via HTTPS
3. Jika private PDF, gunakan Google Drive sharing dengan "Anyone" access

---

## 🚀 Production Deployment

### Deploy ke Cloudflare Pages

1. **Commit kode**
```bash
git add .
git commit -m "Add ebook rental system with GAS"
git push origin main
```

2. **File struktur yang penting:**
```
- ebook/spiritualitas-sosial-transformasi.html (updated)
- assets/js/ebook-access.js (new)
- backend/Code.gs (reference only, bukan di deploy)
```

3. **GAS tetap di Google**, frontend di Cloudflare Pages

4. **Test production:**
```
https://dawinsight.com/ebook/spiritualitas-sosial-transformasi.html
```

---

## 📝 Maintenance Tasks

### Daily
- Nothing required (sistem otomatis)

### Weekly
- Check Google Sheets untuk anomali
- Monitor transaction logs

### Monthly
- Run `expireOldTransactions()` (atau setup scheduled trigger)
- Review active users
- Check PDF links masih valid

### Yearly
- Backup Google Sheets
- Review pricing
- Update catalog jika ada product baru

---

## 🔐 Security Considerations

**Current Setup (Development):**
- ✅ No payment gateway (simulated)
- ✅ No sensitive data exposed
- ⚠️ Email disimpan di localStorage (client-side)

**For Production (Future):**
- [ ] Implement proper payment gateway (Stripe, PayPal)
- [ ] Add email verification
- [ ] Add CORS headers di GAS
- [ ] Add rate limiting
- [ ] Encrypt sensitive data
- [ ] Use HTTPS everywhere (Cloudflare handles ini)

---

## 💡 Advanced Features (For Future)

### 1. Email Notifications
```javascript
// Di GAS, add:
MailApp.sendEmail(email, "Access Granted", "Your ebook access...");
```

### 2. Payment Gateway Integration
```javascript
// di startAccess:
// Call Stripe API -> get payment token
// Verify token -> then create transaction
```

### 3. Analytics Dashboard
```javascript
// Hitung: total sales, active users, most popular ebooks
// Buat sheet untuk analytics
```

### 4. Refund System
```javascript
// Add "refund" status ke TRANSACTIONS
// Hitung refund period (e.g., 7 days)
```

---

## 📚 Files Overview

| File | Purpose | Status |
|------|---------|--------|
| backend/Code.gs | Google Apps Script logic | ✅ Ready |
| assets/js/ebook-access.js | Frontend system | ✅ Ready |
| ebook/*.html | Ebook pages | ✅ Updated |
| docs/GOOGLE_SHEETS_SETUP.md | Sheet structure | ✅ Ready |
| docs/EBOOK_RENTAL_GUIDE.md | This file | ✅ Ready |

---

## ✨ Quick Reference

**Endpoints:**
| Action | Method | Params |
|--------|--------|--------|
| checkAccess | GET | email, ebook_slug |
| startAccess | POST | email, ebook_slug, duration_days |
| getCatalog | GET | (optional) ebook_slug |
| createUser | POST | email, full_name |

**Duration Options:**
```
7 days   (1 minggu)
30 days  (1 bulan)
90 days  (3 bulan)
365 days (1 tahun)
```

**Status Values:**
```
active   - Akses masih berlaku
expired  - Akses sudah berakhir
refunded - Pembelian diretur
```

---

## 🎉 Testing Checklist

Sebelum mark sebagai complete:

- [ ] Google Sheets dibuat dengan 4 sheets
- [ ] Google Apps Script deployed as Web App
- [ ] Deployment URL diupdate di HTML
- [ ] Test lokal: email form muncul
- [ ] Test lokal: pricing options tampil
- [ ] Test lokal: transaksi dibuat di Sheets
- [ ] Test lokal: access diberikan setelah transaksi
- [ ] Test lokal: PDF viewer tampil untuk akses aktif
- [ ] Test production: semua flow masih bekerja
- [ ] Backup Deployment ID di safe place

---

**Selesai? Sistem rental ebook siap digunakan! 🚀**

Untuk pertanyaan lebih lanjut, lihat:
- `Code.gs` untuk dokumentasi GAS
- `ebook-access.js` untuk dokumentasi frontend
- `GOOGLE_SHEETS_SETUP.md` untuk struktur database
