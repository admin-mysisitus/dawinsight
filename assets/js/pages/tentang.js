/* ============================================
   HALAMAN TENTANG - INTERACTIVE FEATURES
   BIOGRAFI, KARIR, PORTOFOLIO, LEGAL
   ============================================ */

(function() {
  'use strict';

  // ==================
  // PENDIDIKAN TIMELINE
  // ==================
  function initPendidikanTimeline() {
    const pendidikanItems = document.querySelectorAll('.pendidikan-item');
    
    if (!pendidikanItems.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -80px 0px'
    });

    pendidikanItems.forEach(item => {
      observer.observe(item);
    });
  }

  // ==================
  // PENGALAMAN CARDS
  // ==================
  function initPengalamanCards() {
    const pengalamanCards = document.querySelectorAll('.pengalaman-card');
    
    if (!pengalamanCards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    pengalamanCards.forEach(card => {
      observer.observe(card);
    });
  }

  // ==================
  // FILOSOFI POINTS
  // ==================
  function initFilosofiPoints() {
    const filosofiPoints = document.querySelectorAll('.filosofi-point');
    
    if (!filosofiPoints.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    filosofiPoints.forEach(point => {
      observer.observe(point);
    });
  }

  // ==================
  // SMOOTH SCROLL
  // ==================
  function initSmoothScroll() {
    document.addEventListener('click', function(e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      e.preventDefault();
      
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  // ==================
  // CTA BUTTONS
  // ==================
  function initCTAButtons() {
    const ctaButtons = document.querySelectorAll('.cta-buttons-biografi .btn');
    
    ctaButtons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
  }

  // ==================
  // INIT ALL
  // ==================
  function init() {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    initPendidikanTimeline();
    initPengalamanCards();
    initFilosofiPoints();
    initSmoothScroll();
    initCTAButtons();

    // Expose utils
    window.tentangPageUtils = {
      scrollToSection: (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      copyToClipboard: (text) => {
        navigator.clipboard.writeText(text).then(() => {
          console.log('Copied to clipboard:', text);
        });
      }
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

