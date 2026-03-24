# 🖼 Panduan Setup Foto Profil

**Status:** Website siap menerima foto profil Anda  
**Location:** `/assets/img/profile-placeholder.jpg`  
**Current:** Placeholder, siap di-replace

---

## 📋 REQUIREMENTS FOTO PROFIL

### Spesifikasi Teknis:
| Item | Requirement |
|------|-------------|
| **Format** | JPG, PNG, atau WebP |
| **Dimensi** | Min 400x400px (recommended 512x512px) |
| **Aspect Ratio** | 1:1 (Square - PENTING!) |
| **File Size** | < 500KB (optimal: < 200KB) |
| **Quality** | Min 72 DPI untuk web |
| **Path** | `/assets/img/profile-placeholder.jpg` |

### Rekomendasi Konten Foto:
- ✅ **Professional headshot** - formal atau semi-formal
- ✅ **Cropped close-up** - fokus pada wajah dan bahu
- ✅ **High contrast background** - wajah terlihat jelas
- ✅ **Good lighting** - wajah well-lit, tidak silhouette
- ✅ **Neutral expression** - confident, approachable
- ❌ **Avoid:** Group photos, casual selfies, full-body shots
- ❌ **Avoid:** Extreme filters, poor quality scans

### Contoh Dimensi Ideal:
```
- 512x512px ← RECOMMENDED
- 600x600px
- 800x800px (untuk retina/high-DPI)
```

---

## 🚀 CARA UPLOAD FOTO

### Opsi 1: Direct File Replace (Recommended)

1. **Persiapkan foto Anda:**
   - Crop ke format persegi (1:1 ratio)
   - Resize ke 512x512px
   - Export sebagai JPG dengan quality 85-90%

2. **Ganti file placeholder:**
   ```
   Delete: /assets/img/profile-placeholder.jpg
   Upload: /assets/img/your-photo.jpg
   ```

3. **Update HTML (jika pakai nama file berbeda):**
   - Buka file: `tentang.html`
   - Cari: `profile-placeholder.jpg`
   - Ganti dengan: `your-photo.jpg` atau nama file baru Anda

### Opsi 2: Menggunakan Nama File Sama
Jika mau simpel, cukup:
1. Export foto Anda sebagai `profile-placeholder.jpg`
2. Upload ke `/assets/img/`
3. Selesai! Tidak perlu edit HTML

---

## 🎨 CURRENT STYLING

Foto Anda akan ditampilkan dengan styling ini (dari CSS):

```css
/* Styling untuk foto profil */
width: 200px;              /* Diameter 200px */
height: 200px;             /* Square aspect */
border-radius: 50%;        /* Circular shape */
object-fit: cover;         /* Crop, tidak stretch */
border: 4px solid gold;    /* Gold border (elegant) */
box-shadow: drop-shadow;   /* Subtle shadow untuk depth */
```

**Hasil Visual:**
- 🟡 **Circular frame** dengan gold border
- ✨ **Professional look** dengan shadow effect
- 📱 **Responsive** - terlihat bagus di mobile & desktop

---

## 📸 REKOMENDASI TOOLS

### Untuk Resize & Compress Foto:

**Online (Gratis, No Upload Required):**
- [TinyPNG](https://tinypng.com/) - Best compression
- [Squoosh](https://squoosh.app/) - Google's tool, high quality
- [ImageResizer.com](https://imageresizer.com/) - Simple & fast
- [Canva](https://www.canva.com/) - Design + resize

**Desktop Apps:**
- **Windows:** Paint, Irfanview, FastStone
- **Mac:** Preview, ImageOptim
- **All platforms:** GIMP (free & powerful)

### Workflow Recommended:
1. **Take/Select photo** (Instagram, smartphone, professional photo)
2. **Crop to square** (1:1 ratio) using Canva or Preview
3. **Resize to 512x512px** using TinyPNG or Squoosh
4. **Save as JPG** with quality 85-90%
5. **Upload to** `/assets/img/profile-placeholder.jpg`

---

## ✅ CHECKLIST SEBELUM UPLOAD

Sebelum upload foto, pastikan:

- [ ] Foto berbentuk persegi (1:1 ratio)
- [ ] Dimensi minimal 400x400px, ideal 512x512px
- [ ] File size < 500KB (lebih baik < 200KB)
- [ ] Format: JPG, PNG, atau WebP
- [ ] Kualitas foto bagus (tidak blur, good lighting)
- [ ] Nama file: `profile-placeholder.jpg` (atau note nama barunya)
- [ ] Path siap di-upload ke: `assets/img/`

---

## 🔧 TROUBLESHOOTING

### ❌ Foto tidak muncul?
**Solutions:**
1. Check nama file - pastikan path benar: `/assets/img/profile-placeholder.jpg`
2. Check case-sensitive - "jpg" vs "JPG"
3. Clear browser cache (Ctrl+Shift+R untuk hard refresh)
4. Verify file ada di folder `assets/img/`

### ❌ Foto stretched atau distorted?
**Solution:**
- Pastikan aspect ratio 1:1 (square)
- Foto akan auto-crop dengan `object-fit: cover`
- Jika ingin full-body, crop ke square-centered lebih dulu

### ❌ Foto terlalu besar/lambat load?
**Solution:**
- Compress menggunakan TinyPNG atau Squoosh
- Reduce quality sampai file < 200KB
- Resize ke exactly 512x512px (tidak perlu lebih besar)

### ❌ Ingin ganti nama file?
**Steps:**
1. Save foto dengan nama baru: `my-profile.jpg`
2. Upload ke `/assets/img/`
3. Buka `tentang.html`
4. Cari: `profile-placeholder.jpg`
5. Ganti dengan: `my-profile.jpg` (atau nama Anda)
6. Save dan refresh browser

---

## 📝 CURRENT HTML

Ini adalah kode yang digunakan di `tentang.html`:

```html
<div style="text-align: center; margin-bottom: 3rem;">
  <img src="/assets/img/profile-placeholder.jpg" 
       alt="Dwi Agus Widodo, M.Pd." 
       style="width: 200px; height: 200px; 
               border-radius: 50%; 
               object-fit: cover; 
               border: 4px solid var(--color-gold); 
               box-shadow: var(--shadow-md);">
</div>
```

**Jika mau ubah:**
- `src="/assets/img/profile-placeholder.jpg"` ← Ganti nama file di sini
- `alt="Dwi Agus Widodo, M.Pd."` ← Alt text untuk SEO (biarkan saja)

---

## 🎯 NEXT STEPS

### Immediate (Segera):
1. ✅ Persiapkan foto profil Anda
2. ✅ Resize ke 512x512px
3. ✅ Compress file < 200KB
4. ✅ Upload ke `/assets/img/profile-placeholder.jpg`

### Testing:
5. ✅ Refresh halaman `tentang.html`
6. ✅ Verify foto muncul dengan circular frame & gold border
7. ✅ Test di mobile (responsive check)

### Optional:
8. Update nama file jika diinginkan
9. Optimize lebih lanjut untuk SEO

---

## 📞 BANTUAN

Jika ada pertanyaan tentang foto profil:
- ✉️ Email: dwiagus2976@gmail.com
- 📱 WhatsApp: 0878-1888-8003
- 💬 Form kontak: https://dawinsight.com/kontak.html

**Website sudah siap menerima foto Anda! 🚀**
