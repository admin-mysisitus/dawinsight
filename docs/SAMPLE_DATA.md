# Sample Data untuk Google Sheets Testing

Copy-paste data ini ke Google Sheets untuk quick setup dan testing.

## 1. EBOOK_CATALOG Sheet

Copy-paste starting from row 1 (including header):

```
slug	title	author	description	pdf_url	price_7days	price_30days	price_90days	price_1year	available
spiritualitas-sosial-transformasi	Spiritualitas Sosial: Transformasi dalam Krisis	Dwi Agus Widodo	Panduan komprehensif tentang spiritualitas transformatif untuk perubahan sosial	https://example.com/ebooks/spiritualitas-sosial.pdf	2.50	7.99	15.99	25.99	TRUE
keadilan-dalam-quran	Keadilan Dalam Al-Quran	Dwi Agus Widodo	Eksplorasi mendalam tentang konsep keadilan dalam teks suci Al-Quran	https://example.com/ebooks/keadilan-quran.pdf	2.50	7.99	15.99	25.99	TRUE
ritualisme-modern	Ritualisme dan Modernitas	Dwi Agus Widodo	Analisis kritis tentang praktik ritual agama di era modern	https://example.com/ebooks/ritualisme-modern.pdf	3.00	9.99	19.99	29.99	TRUE
```

---

## 2. USERS Sheet (Optional - for testing)

This will be auto-populated when users access ebook. But here's sample:

```
email	full_name	created_at	updated_at	total_purchases
user1@example.com	User One	2026-03-24T10:00:00Z	2026-03-24T10:00:00Z	1
user2@example.com	User Two	2026-03-24T11:00:00Z	2026-03-24T11:00:00Z	2
test@example.com	Test User	2026-03-24T12:00:00Z	2026-03-24T12:00:00Z	0
```

---

## 3. TRANSACTIONS Sheet (Optional - for reference)

This will be auto-populated. Sample transaction:

```
id	email	ebook_slug	duration_days	price_usd	start_time	end_time	status	created_at	payment_method
TX1711270400abc12	user1@example.com	spiritualitas-sosial-transformasi	7	2.50	2026-03-24T10:00:00Z	2026-03-31T10:00:00Z	active	2026-03-24T10:00:00Z	simulated
TX1711275600def45	user2@example.com	keadilan-dalam-quran	30	7.99	2026-03-24T11:00:00Z	2026-04-23T11:00:00Z	active	2026-03-24T11:00:00Z	simulated
TX1711282800ghi78	user2@example.com	spiritualitas-sosial-transformasi	365	25.99	2026-03-24T12:00:00Z	2027-03-24T12:00:00Z	active	2026-03-24T12:00:00Z	simulated
```

---

## How to Use

### 1. Copy First Sheet (EBOOK_CATALOG)
- Select and copy all data above for EBOOK_CATALOG
- Paste ke Google Sheet EBOOK_CATALOG starting cell A1
- Google Sheets akan auto-detect columns

### 2. (Optional) Add Sample USERS
- If you want sample user data for testing
- Copy USERS data above
- Paste ke Google Sheet USERS

### 3. (Optional) Add Sample TRANSACTIONS
- If you want to test dengan existing transactions
- Copy TRANSACTIONS data above
- Paste ke Google Sheet TRANSACTIONS

---

## PDF Testing

For testing without real PDFs, gunakan:

```
https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf
https://www.learningcontainer.com/sample-pdf-file/
```

Or lebih baik, host PDF Anda di:
- Google Drive (share "Anyone")
- Cloudinary (free tier available)
- S3 (free tier)
- GitHub Pages

---

## Quick Test Flow

Setelah import sample data:

1. **Local test:**
   ```bash
   python -m http.server 8000
   ```

2. **Buka ebook page:**
   ```
   http://localhost:8000/ebook/spiritualitas-sosial-transformasi.html
   ```

3. **Input email:**
   ```
   test@example.com
   ```

4. **Click "Lanjutkan"** → Harus lihat pricing options

5. **Click "Beli Akses" (7 days)** → Should see success message

6. **Check Google Sheets TRANSACTIONS**
   - Row baru harus ditambahkan
   - Status: "active"
   - end_time: 7 hari dari sekarang

7. **Refresh page** → Harus langsung lihat PDF viewer

---

## Important Notes

⚠️ **PDF URLs:**
- Ganti `https://example.com/ebooks/...` dengan URL real
- PDF harus accessible (HTTPS)
- Tidak perlu download permission, hanya read

⚠️ **Date Format:**
- Gunakan ISO 8601: `2026-03-24T10:00:00Z`
- Google Sheets auto-convert jika format benar

⚠️ **Price Format:**
- Numeric: `2.50` bukan `"$2.50"` atau `"2.50 USD"`
- Google Sheets akan auto-format jika numeric

---

## Delete Sample Data

Jika ingin clean slate:

1. Delete sample rows tapi keep headers
2. Atau delete columns dan recreate
3. Atau delete sheet dan recreate

GAS script `setupGoogleSheet()` akan recreate empty sheets jika dijalankan lagi.

---

**Ready to test? Use this sample data to get started immediately!** ⚡
