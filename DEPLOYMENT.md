# DWIAGUS - Deployment Guide

Panduan lengkap untuk deploy website static DWIAGUS ke berbagai platform.

## 1. Cloudflare Pages (Recommended ⭐)

Cloudflare Pages adalah pilihan terbaik untuk website static - **gratis, cepat, aman**.

### Setup Awal (One-time)

1. **Fork repository ke GitHub**
   - Buat akun GitHub jika belum ada
   - Fork atau clone repo DWIAGUS
   - Push ke GitHub account Anda

2. **Connect dengan Cloudflare Pages**
   ```
   1. Kunjungi https://pages.cloudflare.com/
   2. Klik "Connect to Git"
   3. Authorize Cloudflare dengan GitHub
   4. Pilih repository "dwiagus"
   ```

3. **Configure Build Settings**
   ```
   Framework: None
   Build command: (kosongkan)
   Build output directory: /
   Root directory: /
   ```

4. **Save & Deploy**
   - Tunggu build selesai (~30 detik)
   - Site akan tersedia di `https://yourname-dwiagus.pages.dev`

### Connect Custom Domain

1. **Beli domain** (jika belum punya)
   - Registrar: Namecheap, GoDaddy, IDwebhost, dll
   - TLD: .com, .id, .net, dll

2. **Setup DNS di Cloudflare**
   ```
   1. Add site ke Cloudflare
   2. Update nameserver di registrar
   3. Tunggu 24 jam untuk propagasi DNS
   ```

3. **Add Custom Domain di Pages**
   ```
   1. Pages > Your Site > Custom domains
   2. Add domain: dawinsight.com
   3. Verifikasi DNS setting
   4. Auto-provision SSL certificate
   ```

### Testing Deployment

```bash
# Test production URL
curl -I https://dawinsight.com

# Check SSL certificate
curl -v https://dawinsight.com | grep SSL

# Run Lighthouse check
# https://pagespeed.web.dev/
```

---

## 2. Vercel

Alternative dengan fitur lebih lengkap untuk website static.

### Deploy Steps

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login ke Vercel
vercel login

# 3. Deploy
cd /path/to/dwiagus
vercel

# 4. Link custom domain
vercel domains add dawinsight.com
```

### vercel.json Configuration

```json
{
  "builds": [
    {
      "src": "*.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

---

## 3. Netlify

Simple drag-and-drop deployment.

### Deploy Steps

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Connect ke Netlify
netlify login

# 3. Deploy
cd /path/to/dwiagus
netlify deploy

# 4. Setup continuous deployment
netlify init
```

### netlify.toml

```toml
[build]
  command = ""
  publish = "/"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

---

## 4. GitHub Pages

Gratis dengan GitHub account.

### Steps

```bash
# 1. Create repo: username.github.io
# Atau: dwiagus (private repo)

# 2. Push code
git init
git add .
git commit -m "Initial commit"
git push -u origin main

# 3. Enable Pages
# Settings > Pages > Source: main branch

# 4. Site available di:
# https://username.github.io/dwiagus
```

---

## 5. Self-Hosted (VPS / cPanel)

Untuk kontrol penuh dan custom domain.

### Using cPanel

```
1. Login ke cPanel
2. File Manager
3. Upload files ke public_html/
4. Point domain ke server
```

### Using SFTP

```bash
# Windows (gunakan WinSCP)
# atau

# Linux/Mac
sftp -i private_key.pem user@server.com
put -r dwiagus/* /public_html/
```

### Using SSH (Linux/Mac)

```bash
# Connect
ssh -i private_key.pem user@server.com

# Upload files
scp -r dwiagus/* user@server.com:/public_html/

# Set permissions
ssh user@server.com
chmod -R 755 /public_html/
```

---

## Performance Optimization untuk Production

### 1. Minify CSS & JavaScript

```bash
# Gunakan tools:
# - cssnano (CSS)
# - terser (JavaScript)
# - html-minifier

npm install -g csso-cli
csso assets/css/style.css -o assets/css/style.min.css
```

### 2. Optimize Images

```bash
# Compress images
# - TinyPNG.com
# - Squoosh.app
# - ImageOptim (Mac)
# - FileOptimizer (Windows)

# Convert ke WebP for better compression
cwebp image.png -o image.webp
```

### 3. Setup Caching Headers

**Cloudflare** (automatic):
- Static assets: 1 year
- HTML: 1 day
- Automatic GZIP

**Manual (.htaccess)**:
Sudah included di `.htaccess` file

**Cloudflare Workers** (advanced):
```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  let response = await fetch(request)
  response = new Response(response.body, response)
  response.headers.set('Cache-Control', 'public, max-age=3600')
  return response
}
```

### 4. Content Delivery Network (CDN)

Cloudflare Pages includes **automatic CDN**:
- 200+ data centers worldwide
- Auto-cached at edge
- DDoS protection included
- Free SSL/TLS

---

## Monitoring & Maintenance

### 1. Analytics

**Cloudflare Analytics:**
```
Dashboard > Analytics > Traffic
```

**Google Analytics** (optional):
```html
<!-- Add to <head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Uptime Monitoring

- **Pingdom**: https://www.pingdom.com/
- **UptimeRobot**: https://uptimerobot.com/
- **Cloudflare**: Built-in reliability

### 3. Regular Backups

```bash
# Backup ke local
git clone https://github.com/username/dwiagus.git backup/

# Backup to cloud
# - Google Drive
# - Dropbox
# - AWS S3
```

### 4. Update Content

**Adding New Article:**
```
1. Create: /artikel/{kategori}/{slug}.html
2. Update: /artikel/index.html (add to list)
3. Update: /arsip.html (add to archive)
4. Update: sitemap.xml (add <url> entry)
5. Commit & push
```

**Forms Integration:**

Untuk form kontak, gunakan:
- **Formspree**: https://formspree.io/
- **Getform**: https://getform.io/
- **Basin**: https://usebasin.com/

Setup Formspree:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  <input type="email" name="email" required>
  <textarea name="message" required></textarea>
  <button type="submit">Send</button>
</form>
```

---

## Troubleshooting

### Issue: 404 errors on article pages

**Solution**: Pastikan struktur folder sesuai:
```
artikel/
├── sosial/
│   └── spiritualitas-sosial-di-tengah-krisis.html
```

### Issue: CSS/JS tidak loading

**Solution**: Cek path adalah absolute (`/assets/css/style.css`)

### Issue: Slow page load

**Solution**:
1. Enable Cloudflare caching
2. Minify CSS/JS
3. Compress images
4. Check waterfall in DevTools

### Issue: SSL certificate error

**Solution**:
- Cloudflare: Auto-provision (free)
- Vercel: Auto-provision (free)
- Self-hosted: Use Let's Encrypt

---

## Security Checklist

- [x] HTTPS enabled
- [x] robots.txt configured
- [x] .htaccess security rules (if Apache)
- [x] No sensitive files committed
- [x] Meta charset set to UTF-8
- [x] CSP headers recommended
- [x] Regular updates

---

## Next Steps

1. **Push to GitHub**: Setup version control
2. **Deploy to Cloudflare**: Get live experience
3. **Add Google Analytics**: Track visitors
4. **Setup email form**: Connect Formspree
5. **Monitor performance**: Use Lighthouse/Pagespeed
6. **Add more content**: Create articles & e-books

---

## Resources

- **Cloudflare Docs**: https://developers.cloudflare.com/pages/
- **Lighthouse Guide**: https://developers.google.com/web/tools/lighthouse
- **SEO Checklist**: https://www.semrush.com/blog/seo-checklist/
- **Web Vitals**: https://web.dev/vitals/

---

**Deployed? Congratulations! 🎉**

Share your site dan beri tahu jika ada feedback atau issues!
