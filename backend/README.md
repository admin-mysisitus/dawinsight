# DWIAGUS Ebook Rental System - README

Sistem rental ebook menggunakan Google Apps Script dan Google Spreadsheet.

## 🎯 Fitur

- ✅ Rental berbasis durasi (7, 30, 90, 365 hari)
- ✅ Email-based user management
- ✅ Transaction tracking di Google Sheets
- ✅ PDF viewer dengan access control
- ✅ No payment gateway integration (Phase 1 - Simulated)
- ✅ localStorage untuk user session
- ✅ Dynamic pricing per ebook

## 📁 Structure

```
backend/
├── Code.gs                    # Google Apps Script
├── DEPLOYMENT_ID.txt          # Your GAS deployment URL
└── README.md                  # This file

assets/js/
├── ebook-access.js            # Frontend system

ebook/
├── spiritualitas-sosial-transformasi.html  # Ebook page (updated)
└── index.html                 # Ebook listing

docs/
├── GOOGLE_SHEETS_SETUP.md     # Database setup guide
├── EBOOK_RENTAL_GUIDE.md      # Complete implementation guide
└── README.md                  # Overview
```

## 🚀 Quick Start

### 1. Setup Google Sheets
Follow: `docs/GOOGLE_SHEETS_SETUP.md`

### 2. Deploy Google Apps Script
Follow: `docs/EBOOK_RENTAL_GUIDE.md` (Step 2-3)

### 3. Update Deployment ID
Edit: `ebook/spiritualitas-sosial-transformasi.html`

Update this line:
```javascript
const GAS_DEPLOYMENT_URL = "https://script.google.com/macros/d/YOUR_ID/usercodeapp";
```

### 4. Test
```bash
python -m http.server 8000
# Visit: http://localhost:8000/ebook/spiritualitas-sosial-transformasi.html
```

## 📖 Documentation

- **GOOGLE_SHEETS_SETUP.md** - How to structure Google Sheets database
- **EBOOK_RENTAL_GUIDE.md** - Complete setup and deployment guide
- **Code.gs** - Google Apps Script with inline documentation
- **ebook-access.js** - Frontend JavaScript with inline documentation

## 🔗 API Endpoints

All endpoints are proxied through Google Apps Script Web App.

### GET /check-access
Check if user has active access.

```
GET {GAS_URL}?action=checkAccess&email=user@example.com&ebook_slug=slug
```

Response:
```json
{
  "access": true,
  "remaining_days": 5,
  "end_time": "2026-03-31T10:00:00Z"
}
```

### POST /start-access
Create rental transaction.

```
POST {GAS_URL}?action=startAccess
Body: {
  "email": "user@example.com",
  "ebook_slug": "spiritualitas-sosial-transformasi",
  "duration_days": 7
}
```

Response:
```json
{
  "success": true,
  "transaction_id": "TX1711270400...",
  "end_time": "2026-03-31T10:00:00Z"
}
```

### GET /get-catalog
Get ebook catalog.

```
GET {GAS_URL}?action=getCatalog&ebook_slug=slug
```

Response:
```json
{
  "ebook": {
    "slug": "spiritualitas-sosial-transformasi",
    "title": "Spiritualitas Sosial",
    "author": "Dwi Agus Widodo",
    "pricing": {
      "7days": 2.50,
      "30days": 7.99,
      "90days": 15.99,
      "1year": 25.99
    }
  }
}
```

## 💾 Database Schema

### USERS Sheet
```
email | full_name | created_at | updated_at | total_purchases
```

### TRANSACTIONS Sheet
```
id | email | ebook_slug | duration_days | price_usd | 
start_time | end_time | status | created_at | payment_method
```

### EBOOK_CATALOG Sheet
```
slug | title | author | description | pdf_url | 
price_7days | price_30days | price_90days | price_1year | available
```

## 🔄 User Flow

```
1. User visits ebook page
2. If no email stored -> Show email form
3. Email submitted -> Save to localStorage
4. Check access via GAS API
   ├─ If has access -> Show PDF viewer
   └─ If no access -> Show pricing options
5. User clicks "Beli Akses" button
6. Call startAccess() API -> Create transaction in Sheets
7. Show success message
8. Refresh page -> Show PDF viewer
```

## 🛠️ Maintenance

### Monitor Transactions
Google Sheets TRANSACTIONS sheet contains all rentals.

Columns to watch:
- `status`: active, expired, refunded
- `end_time`: When access expires
- `created_at`: When purchased

### Expire Old Transactions
Run in GAS editor:
```javascript
expireOldTransactions();
```

Or setup scheduled trigger:
1. Edit → Current project's triggers
2. Add trigger: Time-driven → Daily

### Add New Ebook
1. Add row to EBOOK_CATALOG sheet
2. Create /ebook/new-slug.html page (copy existing)
3. Update GAS deployment URL in new page
4. Test the rental flow

## 📊 Google Sheets File

Share spreadsheet with:
- Your email (for management)
- GAS project email (for access)

Don't share publicly! Contains user data.

## 🔐 Security Notes

**Current State (Development):**
- No payment integration
- Simulated transactions
- Email in localStorage
- No encryption

**For Production:**
- Implement Stripe/PayPal
- Add email verification
- Add CORS restrictions
- Rate limiting
- Data encryption
- HTTPS everywhere (Cloudflare)

## 🎓 Learning Resources

- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Web App Deployment](https://developers.google.com/apps-script/guides/web)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

## 📞 Support

For issues:
1. Check `docs/EBOOK_RENTAL_GUIDE.md` Troubleshooting section
2. Check browser console (F12) for errors
3. Check GAS editor Logs for backend errors
4. Verify Google Sheets structure
5. Verify Deployment URL is correct

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-24 | Initial release |

---

**Ready to use! Follow EBOOK_RENTAL_GUIDE.md for complete setup.**
