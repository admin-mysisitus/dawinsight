# DWIAGUS - Personal Branding Website

Website static personal branding Dwi Agus Widodo dengan fokus pada spiritualitas, sosial, dan pemikiran kritis. 
Dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework.

## Fitur Utama

- ✅ **Static HTML** - Performa cepat, aman, mudah di-deploy
- ✅ **SEO Optimized** - Meta tags, sitemap.xml, robots.txt, open graph
- ✅ **Clean URLs** - Tanpa query parameters (?id=)
- ✅ **Responsive Design** - Mobile-first, minimalist
- ✅ **Typography-Focused** - Desain bersih untuk membaca yang optimal
- ✅ **Cloudflare Pages Ready** - Deploy gratis dan cepat

## Struktur Folder

```
/
├── index.html                          # Homepage
├── tentang.html                        # About page
├── kontak.html                         # Contact form
├── galeri.html                         # Gallery
├── arsip.html                          # Archive/index
│
├── artikel/                            # Article pages
│   ├── index.html                      # Article listing
│   ├── sosial/
│   │   └── spiritualitas-sosial-di-tengah-krisis.html
│   ├── islami/
│   └── pemikiran/
│
├── ebook/                              # E-book pages
│   ├── index.html                      # E-book listing
│   └── spiritualitas-sosial-transformasi.html
│
├── assets/
│   ├── css/
│   │   └── style.css                   # Main stylesheet (minimalist)
│   ├── js/
│   │   └── markdown.js                 # Markdown to HTML converter
│   └── img/                            # Images (when added)
│
├── content/                            # Optional: markdown sources
│   └── articles/
│
├── sitemap.xml                         # XML sitemap for SEO
├── robots.txt                          # Robots directives
├── _redirects                          # Cloudflare Pages redirects
├── .htaccess                           # Apache server config (if needed)
├── README.md                           # This file
└── contoh-artikel.md                   # Original markdown article
```

## Panduan Konten

### Menulis Artikel

1. **Format**: Gunakan HTML langsung atau markdown yang di-convert ke HTML
2. **Lokasi**: `/artikel/{kategori}/{slug}.html`
3. **Kategori**: `sosial`, `islami`, `pemikiran`
4. **URL Slug**: Lowercase dengan hyphen, contoh: `spiritualitas-sosial-di-tengah-krisis`

**Template HTML Artikel:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="description" content="...">
  <meta name="keywords" content="...">
  <title>Judul Artikel | DWIAGUS</title>
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>
  <header><!-- Header --></header>
  <main>
    <article class="article-content">
      <div class="article-header">
        <h1>Judul Artikel</h1>
        <div class="article-meta">
          <span class="category">Kategori</span>
          <span>Tanggal</span>
        </div>
      </div>
      <div class="article-body">
        <!-- Konten artikel -->
      </div>
    </article>
  </main>
  <footer><!-- Footer --></footer>
</body>
</html>
```

### Menambah E-Book

1. **Lokasi**: `/ebook/{slug}.html`
2. **Format**: HTML page dengan info lengkap dan link download
3. **PDF**: Upload file PDF ke `/public/ebooks/` (optional setup)

### Update Sitemap

Setiap kali menambah artikel/ebook baru, update `sitemap.xml`:
```xml
<url>
  <loc>https://dawinsight.com/artikel/kategori/slug.html</loc>
  <lastmod>2026-03-24</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

## SEO Checklist

- [ ] Meta title (max 60 karakter)
- [ ] Meta description (max 160 karakter)
- [ ] H1 heading (1 per halaman)
- [ ] Open Graph tags (og:title, og:description, og:url)
- [ ] Canonical URL
- [ ] Keywords di konten
- [ ] Internal links antar halaman
- [ ] Clean URLs (no query params)

## Deployment ke Cloudflare Pages

### 1. Setup Git Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### 2. Push ke GitHub
```bash
git remote add origin https://github.com/username/dwiagus.git
git branch -M main
git push -u origin main
```

### 3. Deploy di Cloudflare Pages
1. Buka https://pages.cloudflare.com/
2. Pilih "Connect to Git"
3. Pilih repository `dwiagus`
4. Build settings:
   - **Framework**: None
   - **Build command**: (kosongkan)
   - **Build output directory**: `/`
5. Deploy!

### 4. Domain Custom (Opsional)
1. Di Cloudflare Pages settings
2. Custom domain → `dawinsight.com`
3. Setup DNS di registrar domain Anda

## Performa & Optimasi

### File Size
- HTML: ~15 KB per halaman
- CSS: ~8 KB (minimal)
- JS: ~2 KB (minimal)
- **Total**: ~25 KB per page load

### Lighthouse Scores (Target)
- Performance: 95+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

### Optimasi Tips
1. Minify CSS/JS jika diperlukan
2. Compress gambar (TinyPNG, Squoosh)
3. Use CSS sprites untuk icons
4. Cache headers di Cloudflare

## Development

### Local Testing
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Buka http://localhost:8000 di browser.

### File Structure Notes
- Tidak perlu build process
- Edit HTML langsung - live reload jika menggunakan extension
- Markdown dapat di-convert manual atau menggunakan tools eksternal

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License & Copyright

© 2026 Dwi Agus Widodo. All rights reserved.

## Contact

- Email: hello@dawinsight.com
- Website: https://dawinsight.com
- Social: Twitter, LinkedIn, Instagram

---

**Catatan Penting:**
- Gunakan HTTPS (automatic di Cloudflare Pages)
- Regular backup konten
- Monitor analytics di Cloudflare
- Update sitemap setiap kali konten baru
