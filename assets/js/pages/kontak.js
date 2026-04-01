/**
 * KONTAK PAGE JS
 * Handle contact form validation, submission, dan FAQ interactions
 */

(function () {
  'use strict';

  // ========== FORM HANDLING ==========
  const kontakForm = document.getElementById('kontakForm');
  const formMessage = document.getElementById('formMessage');

  if (kontakForm) {
    // Real-time validation for required fields
    const fields = ['fullname', 'email', 'phone', 'subject', 'message', 'permission'];
    
    fields.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('change', () => validateField(field));
      }
    });

    kontakForm.addEventListener('submit', handleFormSubmit);
  }

  // Validate individual field
  function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    const errorElement = field.parentElement.querySelector('.error-message');

    let isValid = true;
    let errorMsg = '';

    // Validation rules
    if (!value && field.hasAttribute('required')) {
      isValid = false;
      errorMsg = `${field.previousElementSibling.textContent.replace('*', '').trim()} harus diisi`;
    }

    // Email validation
    if (fieldId === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMsg = 'Format email tidak valid';
      }
    }

    // Phone validation (if filled)
    if (fieldId === 'phone' && value) {
      const phoneRegex = /^(\+62|0)[0-9]{9,12}$/;
      if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
        isValid = false;
        errorMsg = 'Format nomor telepon tidak valid';
      }
    }

    // Checkbox validation
    if (fieldId === 'permission' && !field.checked) {
      isValid = false;
      errorMsg = 'Anda harus menyetujui persyaratan ini';
    }

    // Display error
    if (!isValid) {
      field.classList.add('input-error');
      if (errorElement) {
        errorElement.textContent = errorMsg;
        errorElement.classList.add('show');
      }
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('input-error');
      field.removeAttribute('aria-invalid');
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
      }
    }

    return isValid;
  }

  // Handle form submission
  async function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all fields
    let isFormValid = true;
    const fieldsToValidate = ['fullname', 'email', 'subject', 'message', 'permission'];
    
    fieldsToValidate.forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field && !validateField(field)) {
        isFormValid = false;
      }
    });

    // Also validate optional phone if filled
    const phoneField = document.getElementById('phone');
    if (phoneField && phoneField.value.trim() && !validateField(phoneField)) {
      isFormValid = false;
    }

    if (!isFormValid) {
      showFormMessage('Mohon perbaiki error di atas sebelum mengirim', 'error');
      return;
    }

    // Show loading state
    const submitBtn = kontakForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    try {
      // Collect form data
      const formData = new FormData(kontakForm);
      const data = Object.fromEntries(formData);

      // For now, we'll simulate sending the email via Google Forms or similar
      // In production, this should call a backend API
      
      // Simple validation before "sending"
      await simulateFormSubmission(data);

      // Show success message
      showFormMessage(
        '✓ Pesan Anda berhasil dikirim! Terima kasih. Saya akan merespons secepatnya.',
        'success'
      );

      // Reset form
      setTimeout(() => {
        kontakForm.reset();
        kontakForm.querySelectorAll('input, textarea').forEach(field => {
          field.classList.remove('input-error');
          field.removeAttribute('aria-invalid');
          const errorEl = field.parentElement.querySelector('.error-message');
          if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('show');
          }
        });
      }, 1000);
    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage(
        'Gagal mengirim pesan. Silakan coba lagi atau gunakan saluran kontak lain.',
        'error'
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  }

  // Simulate form submission (in production, call actual API)
  function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Check if data is complete
        if (data.fullname && data.email && data.subject && data.message) {
          // Log to console (in production, would send to server)
          console.log('Form submitted:', data);
          
          // You can optionally send to a backend service here
          // Example: sendToWebhook(data);
          
          resolve({ success: true });
        } else {
          reject(new Error('Form data incomplete'));
        }
      }, 800);
    });
  }

  // Show/hide form message
  function showFormMessage(message, type = 'success') {
    if (!formMessage) return;

    formMessage.textContent = message;
    formMessage.className = `form-message ${type} show`;

    // Auto-hide after 5 seconds (for success) or 7 seconds (for error)
    const duration = type === 'success' ? 5000 : 7000;
    setTimeout(() => {
      formMessage.classList.remove('show');
    }, duration);
  }

  // ========== FAQ ACCORDION ==========
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const summary = item.querySelector('summary');
    
    if (summary) {
      summary.addEventListener('click', (e) => {
        // Close other open items (optional - for single open at a time)
        // faqItems.forEach(other => {
        //   if (other !== item && other.open) {
        //     other.open = false;
        //   }
        // });
      });
    }
  });

  // ========== SMOOTH SCROLL ==========
  // If user clicks on method cards, scroll to form smoothly
  const methodLinks = document.querySelectorAll('.method-link');
  
  methodLinks.forEach(link => {
    link.addEventListener('keydown', (e) => {
      // Only prevent default for form-related interactions
      // Let normal navigation work
    });
  });

  // ========== ACCESSIBILITY ENHANCEMENTS ==========
  // Add focus trap for form
  if (kontakForm) {
    const formElements = kontakForm.querySelectorAll(
      'input, textarea, button, [tabindex]'
    );
    
    if (formElements.length > 0) {
      const firstElement = formElements[0];
      const lastElement = formElements[formElements.length - 1];

      kontakForm.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      });
    }
  }

  // ========== COPY TO CLIPBOARD ==========
  // Add copy functionality for contact info (optional enhancement)
  const copyableElements = document.querySelectorAll('[data-copyable]');
  
  copyableElements.forEach(element => {
    element.addEventListener('click', (e) => {
      const text = element.textContent;
      navigator.clipboard.writeText(text).then(() => {
        const originalText = element.textContent;
        element.textContent = 'Tersalin! ✓';
        setTimeout(() => {
          element.textContent = originalText;
        }, 2000);
      });
    });
  });

  // ========== FORM ANALYTICS (optional) ==========
  // Track form interactions
  if (kontakForm) {
    kontakForm.addEventListener('focus', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        // You can track which fields users interact with
        // console.log('User focused on:', e.target.name);
      }
    }, true);
  }

})();

