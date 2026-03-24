/**
 * DWIAGUS Ebook Access System - Frontend JavaScript
 * 
 * Handles:
 * - User email storage (localStorage)
 * - Access checks with GAS API
 * - Transaction creation
 * - PDF viewer management
 * 
 * Usage:
 * <script src="/assets/js/ebook-access.js"></script>
 */

class EbookAccessSystem {
  constructor(gasDeploymentUrl) {
    /**
     * Initialize the ebook access system
     * @param {string} gasDeploymentUrl - Google Apps Script deployment URL
     * 
     * Example: 'https://script.google.com/macros/d/YOUR_ID/usercodeapp'
     */
    this.gasUrl = gasDeploymentUrl;
    this.userEmail = this.loadEmail();
    this.accessCache = {}; // Cache access status
  }

  // ============================================
  // Email Management
  // ============================================

  loadEmail() {
    /**
     * Load user email from localStorage
     */
    return localStorage.getItem("dwiagus_user_email") || null;
  }

  saveEmail(email) {
    /**
     * Save user email to localStorage
     */
    localStorage.setItem("dwiagus_user_email", email);
    this.userEmail = email;
  }

  clearEmail() {
    /**
     * Clear user email from localStorage
     */
    localStorage.removeItem("dwiagus_user_email");
    this.userEmail = null;
  }

  isEmailValid(email) {
    /**
     * Validate email format
     */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // ============================================
  // API Communication
  // ============================================

  async checkAccess(email, ebookSlug) {
    /**
     * Check if user has active access to ebook
     * @param {string} email - User email
     * @param {string} ebookSlug - Ebook identifier
     * @return {Object} Access status
     */

    if (!email || !ebookSlug) {
      return { access: false, error: "Missing email or ebook_slug" };
    }

    try {
      const params = new URLSearchParams({
        action: "checkAccess",
        email: email,
        ebook_slug: ebookSlug
      });

      const url = `${this.gasUrl}?${params}`;
      const response = await fetch(url);
      const data = await response.json();

      // Cache the result
      this.accessCache[`${email}_${ebookSlug}`] = data;

      return data;
    } catch (error) {
      console.error("Error checking access:", error);
      return { access: false, error: error.message };
    }
  }

  async startAccess(email, ebookSlug, durationDays = 7) {
    /**
     * Create new transaction and start access
     * @param {string} email - User email
     * @param {string} ebookSlug - Ebook identifier
     * @param {number} durationDays - Rental duration (7, 30, 90, 365)
     * @return {Object} Transaction details
     */

    if (!email || !ebookSlug) {
      return { success: false, error: "Missing email or ebook_slug" };
    }

    if (!this.isEmailValid(email)) {
      return { success: false, error: "Invalid email format" };
    }

    try {
      const payload = {
        email: email,
        ebook_slug: ebookSlug,
        duration_days: durationDays
      };

      const response = await fetch(`${this.gasUrl}?action=startAccess`, {
        method: "POST",
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        this.saveEmail(email);
      }

      return data;
    } catch (error) {
      console.error("Error starting access:", error);
      return { success: false, error: error.message };
    }
  }

  async getCatalog(ebookSlug = null) {
    /**
     * Get ebook catalog
     * @param {string} ebookSlug - Optional: get specific ebook
     * @return {Object} Catalog data
     */

    try {
      let params = new URLSearchParams({
        action: "getCatalog"
      });

      if (ebookSlug) {
        params.append("ebook_slug", ebookSlug);
      }

      const url = `${this.gasUrl}?${params}`;
      const response = await fetch(url);
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting catalog:", error);
      return { error: error.message };
    }
  }

  // ============================================
  // UI Helpers
  // ============================================

  async initializeEbookPage(ebookSlug) {
    /**
     * Full initialization for ebook page
     * This handles the entire flow
     */

    const email = this.userEmail;

    // If no email stored, show email form
    if (!email) {
      this.showEmailForm(ebookSlug);
      return;
    }

    // Check access status
    const accessStatus = await this.checkAccess(email, ebookSlug);

    if (accessStatus.access) {
      // Show PDF viewer
      this.showPdfViewer(ebookSlug, email);
      this.showAccessInfo(accessStatus);
    } else {
      // Show purchase options
      this.showPurchaseForm(ebookSlug, email);
    }
  }

  showEmailForm(ebookSlug) {
    /**
     * Show form to collect user email
     */

    const container = document.getElementById("ebook-access-container");
    if (!container) return;

    container.innerHTML = `
      <div class="ebook-access-form">
        <h3>Akses E-Book</h3>
        <p>Masukkan email Anda untuk melanjutkan</p>
        <form id="email-form">
          <div class="form-group">
            <input 
              type="email" 
              id="user-email-input" 
              name="email" 
              placeholder="email@example.com"
              required
            >
          </div>
          <button type="submit" class="btn">Lanjutkan</button>
        </form>
        <p class="text-light" style="font-size: 0.9rem; margin-top: 1rem;">
          Email Anda akan disimpan untuk akses terakhir
        </p>
      </div>
    `;

    const form = document.getElementById("email-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("user-email-input").value;

      if (this.isEmailValid(email)) {
        this.saveEmail(email);
        this.initializeEbookPage(ebookSlug);
      } else {
        alert("Email tidak valid");
      }
    });
  }

  async showPurchaseForm(ebookSlug, email) {
    /**
     * Show purchase/rental options
     */

    const container = document.getElementById("ebook-access-container");
    if (!container) return;

    // Get catalog for pricing
    const catalogData = await this.getCatalog(ebookSlug);
    const ebook = catalogData.ebook;

    if (!ebook) {
      container.innerHTML = `<p class="error">E-book tidak ditemukan</p>`;
      return;
    }

    const pricing = ebook.pricing;

    container.innerHTML = `
      <div class="ebook-access-purchase">
        <h3>Pilih Durasi Akses</h3>
        <p>Email: <strong>${email}</strong> 
          <a href="#" id="change-email-btn" style="font-size: 0.9rem;">(Ubah)</a>
        </p>
        
        <div class="pricing-options">
          <div class="pricing-card" data-duration="7">
            <h4>7 Hari</h4>
            <p class="price">$${pricing['7days'].toFixed(2)}</p>
            <button class="btn btn-small" onclick="ebookSystem.purchaseAccess('${ebookSlug}', '${email}', 7)">
              Beli Akses
            </button>
          </div>
          
          <div class="pricing-card" data-duration="30">
            <h4>30 Hari</h4>
            <p class="price">$${pricing['30days'].toFixed(2)}</p>
            <button class="btn btn-small" onclick="ebookSystem.purchaseAccess('${ebookSlug}', '${email}', 30)">
              Beli Akses
            </button>
          </div>
          
          <div class="pricing-card" data-duration="90">
            <h4>90 Hari</h4>
            <p class="price">$${pricing['90days'].toFixed(2)}</p>
            <button class="btn btn-small" onclick="ebookSystem.purchaseAccess('${ebookSlug}', '${email}', 90)">
              Beli Akses
            </button>
          </div>
          
          <div class="pricing-card" data-duration="365">
            <h4>1 Tahun</h4>
            <p class="price">$${pricing['1year'].toFixed(2)}</p>
            <button class="btn btn-small" onclick="ebookSystem.purchaseAccess('${ebookSlug}', '${email}', 365)">
              Beli Akses
            </button>
          </div>
        </div>
        
        <p class="text-light" style="font-size: 0.9rem; margin-top: 1rem;">
          💡 Tips: Harga lebih murah untuk durasi yang lebih lama
        </p>
      </div>
    `;

    // Change email handler
    document.getElementById("change-email-btn").addEventListener("click", (e) => {
      e.preventDefault();
      this.clearEmail();
      this.initializeEbookPage(ebookSlug);
    });
  }

  async purchaseAccess(ebookSlug, email, durationDays) {
    /**
     * Handle purchase button click
     */

    const button = event.target;
    button.disabled = true;
    button.textContent = "Memproses...";

    try {
      const result = await this.startAccess(email, ebookSlug, durationDays);

      if (result.success) {
        // Show success and reload
        alert(`✅ Akses berhasil! E-book dapat diakses selama ${durationDays} hari`);
        this.initializeEbookPage(ebookSlug);
      } else {
        alert(`❌ Error: ${result.error || "Gagal membuat transaksi"}`);
        button.disabled = false;
        button.textContent = "Beli Akses";
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
      button.disabled = false;
      button.textContent = "Beli Akses";
    }
  }

  showPdfViewer(ebookSlug, email) {
    /**
     * Show PDF viewer for active access
     */

    const container = document.getElementById("ebook-access-container");
    if (!container) return;

    // Get PDF URL from catalog
    this.getCatalog(ebookSlug).then((data) => {
      const ebook = data.ebook;
      const pdfUrl = ebook.pdf_url;

      container.innerHTML = `
        <div class="ebook-access-viewer">
          <div class="viewer-header">
            <p>
              ✅ Anda memiliki akses ke e-book ini
              <a href="#" id="logout-btn" style="float: right; font-size: 0.9rem;">(Logout)</a>
            </p>
          </div>
          <div class="pdf-viewer" style="height: 600px; border: 1px solid #ddd;">
            <iframe 
              src="${pdfUrl}" 
              width="100%" 
              height="100%"
              style="border: none;"
            ></iframe>
          </div>
          <p class="text-light" style="font-size: 0.9rem; margin-top: 1rem;">
            📌 Catatan: File PDF dapat dibaca dalam iframe. Download tidak tersedia untuk menjaga hak cipta.
          </p>
        </div>
      `;

      // Logout handler
      document.getElementById("logout-btn").addEventListener("click", (e) => {
        e.preventDefault();
        this.clearEmail();
        location.reload();
      });
    });
  }

  showAccessInfo(accessStatus) {
    /**
     * Show access information
     */

    const infoContainer = document.getElementById("ebook-access-info");
    if (!infoContainer) return;

    const endDate = new Date(accessStatus.end_time);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    infoContainer.innerHTML = `
      <p style="background-color: #f0f8ff; padding: 10px; border-radius: 4px;">
        <strong>✅ Akses Aktif</strong> | 
        Berakhir: ${endDate.toLocaleDateString("id-ID", options)} | 
        Sisa: ${accessStatus.remaining_days} hari
      </p>
    `;
  }

  // ============================================
  // Utility Methods
  // ============================================

  formatDate(dateString) {
    /**
     * Format ISO date to readable format
     */
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  async getAccessStatus(email, ebookSlug) {
    /**
     * Get current access status string
     */
    const status = await this.checkAccess(email, ebookSlug);

    if (status.access) {
      return `✅ Active (${status.remaining_days} days left)`;
    } else {
      return "❌ No access";
    }
  }
}

// ============================================
// Global Instance
// ============================================

// Create global instance (initialize with your GAS deployment URL)
let ebookSystem;

function initEbookSystem(gasDeploymentUrl) {
  /**
   * Initialize the ebook system globally
   * Call this on page load with your GAS deployment URL
   * 
   * Example:
   * <script>
   *   initEbookSystem('https://script.google.com/macros/d/YOUR_ID/usercodeapp');
   * </script>
   */
  ebookSystem = new EbookAccessSystem(gasDeploymentUrl);
}

// ============================================
// Auto-Initialize (optional)
// ============================================

// Uncomment if you want auto-load on page ready
// document.addEventListener("DOMContentLoaded", () => {
//   const gasUrl = document.body.dataset.gasUrl;
//   if (gasUrl) {
//     initEbookSystem(gasUrl);
//   }
// });
