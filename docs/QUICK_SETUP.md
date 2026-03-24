# DWIAGUS Ebook Rental System - Quick Setup

Ringkasan cepat untuk implementasi sistem rental ebook dengan GAS dalam 15 menit.

## 5-Step Setup

### ✅ Step 1: Create Google Spreadsheet (2 min)
```
1. Buka: https://sheets.google.com/
2. New → Blank spreadsheet
3. Rename ke: "DWIAGUS Ebook Rental"
4. Catat SPREADSHEET_ID dari URL
```

### ✅ Step 2: Setup Google Apps Script (5 min)
```
1. Buka: https://script.google.com/
2. New project
3. Delete default function
4. Copy Code.gs ke editor
5. Update SPREADSHEET_ID di line 8-9
6. Jalankan setupGoogleSheet()
7. Approve permissions
```

### ✅ Step 3: Deploy GAS Web App (3 min)
```
1. Click Deploy → New deployment
2. Type: Web app
3. Execute: Your account
4. Access: Anyone
5. Click Deploy
6. Copy deployment URL
   Format: https://script.google.com/macros/d/{ID}/usercodeapp
7. Save ke: backend/DEPLOYMENT_ID.txt
```

### ✅ Step 4: Update HTML (2 min)
```
File: ebook/spiritualitas-sosial-transformasi.html

Find this line (search "GAS_DEPLOYMENT_URL"):
const GAS_DEPLOYMENT_URL = "...";

Replace dengan URL dari Step 3
```

### ✅ Step 5: Test (3 min)
```bash
python -m http.server 8000
# Buka: http://localhost:8000/ebook/spiritualitas-sosial-transformasi.html

Test flow:
1. Input email
2. Click "Lanjutkan"
3. See pricing options
4. Click "Beli Akses"
5. Check Google Sheets TRANSACTIONS - harus ada row baru
6. Refresh page - harus langsung lihat PDF viewer
```

---

## 📂 Files to Know

| File | What | Need to Touch? |
|------|------|---|
| Code.gs | Backend logic | ✅ Copy ke GAS |
| ebook-access.js | Frontend system | ❌ Already in place |
| ebook/...html | Ebook pages | ✅ Update GAS URL |
| GOOGLE_SHEETS_SETUP.md | Database docs | ℹ️ Reference |
| EBOOK_RENTAL_GUIDE.md | Full guide | ℹ️ Reference |

---

## 🐛 If Something Goes Wrong

**"Email form muncul tapi tidak bisa klik button"**
- Check GAS_DEPLOYMENT_URL tidak ada typo
- Open DevTools (F12) → Console, lihat error

**"Pricing options tidak muncul"**
- Check EBOOK_CATALOG sheet ada row untuk ebook slug
- Slug harus sama: `spiritualitas-sosial-transformasi`

**"Transaksi tidak masuk ke Sheets"**
- Check Google Sheets permissions di GAS
- Check SPREADSHEET_ID benar

**"PDF tidak tampil di iframe"**
- Check PDF URL valid di EBOOK_CATALOG
- PDF harus di-host (Google Drive, Cloudinary, etc)
- Must be HTTPS

---

## 💰 Add Pricing

Edit Google Sheets EBOOK_CATALOG:

```
slug | title | author | pdf_url | price_7days | price_30days | price_90days | price_1year
spiritualitas-sosial-transformasi | Title | Author | https://... | 2.50 | 7.99 | 15.99 | 25.99
```

Pricing muncul otomatis di pricing options.

---

## 📋 Minimal Checklist

Before declaring done:

- [ ] Google Sheets dibuat
- [ ] GAS Code.gs deployed
- [ ] Deployment URL di-update di HTML
- [ ] Local test: email form works
- [ ] Local test: pricing shows
- [ ] Local test: transaksi di Sheets
- [ ] Local test: PDF viewer shows

---

## 🎉 Next Steps

**Now it's live locally. Next:**

1. Deploy ke Cloudflare Pages (push ke GitHub)
2. Setup email notifications (optional GAS feature)
3. Add more ebooks
4. Monitor transactions in Google Sheets

**Eventually:**
- Add payment gateway (Stripe/PayPal)
- Email verification
- Refund system

---

## 📞 Need Help?

1. See: `docs/EBOOK_RENTAL_GUIDE.md` (comprehensive)
2. See: `backend/Code.gs` (inline comments)
3. See: `assets/js/ebook-access.js` (inline comments)

---

**Done? Test locally first, then deploy to production!** 🚀
