/**
 * MOBILE OPTIMIZATION ENHANCEMENTS FOR ONEVIA
 * Add these functions to js/scripts.js or include as separate file
 *
 * Quick implementation:
 * <script src="mobile-enhancements.js"></script>
 */

(function () {
  'use strict';

  // ============================================
  // 1. NETWORK-AWARE LOADING
  // ============================================

  const NetworkOptimizer = {
    init() {
      this.detectConnection();
      this.listenForChanges();
      this.detectBattery();
    },

    isSlowConnection() {
      if (!('connection' in navigator)) return false;
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      return (
        conn.effectiveType === '2g' ||
        conn.effectiveType === 'slow-2g' ||
        conn.saveData === true
      );
    },

    detectConnection() {
      if (this.isSlowConnection()) {
        document.documentElement.classList.add('low-bandwidth');
        console.log('[Onevia] Low bandwidth detected - optimizing experience');
        this.optimizeForSlowConnection();
      }
    },

    listenForChanges() {
      if ('connection' in navigator) {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        conn.addEventListener('change', () => {
          this.detectConnection();
        });
      }
    },

    detectBattery() {
      if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
          if (battery.level < 0.2 && !battery.charging) {
            document.documentElement.classList.add('low-battery');
            console.log('[Onevia] Low battery detected - reducing animations');
          }

          battery.addEventListener('levelchange', () => {
            if (battery.level < 0.2 && !battery.charging) {
              document.documentElement.classList.add('low-battery');
            } else {
              document.documentElement.classList.remove('low-battery');
            }
          });
        });
      }
    },

    optimizeForSlowConnection() {
      // Disable reveal animations for faster rendering
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.classList.add('is-visible');
        el.style.transition = 'none';
      });

      // Load smaller images if srcset is available
      document.querySelectorAll('img[srcset]').forEach((img) => {
        // Browser will automatically choose smaller images
        // But we can force smallest by manipulating sizes attribute
        const currentSizes = img.getAttribute('sizes') || '100vw';
        if (!currentSizes.includes('max-width')) {
          img.setAttribute('sizes', '50vw'); // Force smaller images
        }
      });

      // Show notification to user (optional)
      console.log('[Onevia] Optimized for slow connection');
    },
  };

  // ============================================
  // 2. ENHANCED MOBILE NAVIGATION
  // ============================================

  const MobileNav = {
    init() {
      this.menuToggle = document.querySelector('.menu-toggle');
      this.navLinks = document.querySelector('.nav-links');

      if (!this.menuToggle || !this.navLinks) return;

      this.setupToggle();
      this.setupOutsideClick();
      this.setupKeyboardNav();
      this.setupScrollLock();
    },

    setupToggle() {
      this.menuToggle.addEventListener('click', () => {
        this.toggleMenu();
      });

      // Close on link click
      this.navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          this.closeMenu();
        });
      });
    },

    setupOutsideClick() {
      document.addEventListener('click', (e) => {
        if (
          this.navLinks.classList.contains('is-open') &&
          !this.navLinks.contains(e.target) &&
          !this.menuToggle.contains(e.target)
        ) {
          this.closeMenu();
        }
      });
    },

    setupKeyboardNav() {
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navLinks.classList.contains('is-open')) {
          this.closeMenu();
          this.menuToggle.focus();
        }
      });
    },

    setupScrollLock() {
      // Prevent body scroll when menu is open on mobile
      this.navLinks.addEventListener('transitionend', () => {
        if (this.navLinks.classList.contains('is-open')) {
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.width = '100%';
        }
      });
    },

    toggleMenu() {
      const isOpen = this.navLinks.classList.toggle('is-open');
      this.menuToggle.setAttribute('aria-expanded', String(isOpen));

      if (isOpen) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    },

    openMenu() {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';

      // Trap focus within menu
      const firstLink = this.navLinks.querySelector('a');
      if (firstLink) {
        setTimeout(() => firstLink.focus(), 100);
      }
    },

    closeMenu() {
      this.navLinks.classList.remove('is-open');
      this.menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    },
  };

  // ============================================
  // 3. LAZY LOADING ENHANCEMENTS
  // ============================================

  const LazyLoader = {
    init() {
      this.lazyLoadImages();
      this.lazyLoadBackgrounds();
    },

    lazyLoadImages() {
      const images = document.querySelectorAll('img[loading="lazy"]');

      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                  img.classList.add('loaded');
                });
                observer.unobserve(img);
              }
            });
          },
          { rootMargin: '50px' }
        );

        images.forEach((img) => imageObserver.observe(img));
      } else {
        // Fallback: load all images
        images.forEach((img) => {
          img.classList.add('loaded');
        });
      }
    },

    lazyLoadBackgrounds() {
      const bgElements = document.querySelectorAll('[data-bg]');

      if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const bgUrl = el.getAttribute('data-bg');
              el.style.backgroundImage = `url(${bgUrl})`;
              observer.unobserve(el);
            }
          });
        });

        bgElements.forEach((el) => bgObserver.observe(el));
      }
    },
  };

  // ============================================
  // 4. TOUCH INTERACTION IMPROVEMENTS
  // ============================================

  const TouchEnhancer = {
    init() {
      this.addTouchFeedback();
      this.preventDoubleTapZoom();
      this.improveScrolling();
    },

    addTouchFeedback() {
      // Add active class on touch for better feedback
      const touchElements = document.querySelectorAll('.btn, .card, .care-card, .feature-card');

      touchElements.forEach((el) => {
        el.addEventListener('touchstart', () => {
          el.classList.add('is-touching');
        });

        el.addEventListener('touchend', () => {
          el.classList.remove('is-touching');
        });

        el.addEventListener('touchcancel', () => {
          el.classList.remove('is-touching');
        });
      });
    },

    preventDoubleTapZoom() {
      // Prevent double-tap zoom on buttons
      const buttons = document.querySelectorAll('.btn');

      buttons.forEach((btn) => {
        btn.addEventListener('touchend', (e) => {
          e.preventDefault();
          btn.click();
        });
      });
    },

    improveScrolling() {
      // Enable momentum scrolling on iOS
      const scrollContainers = document.querySelectorAll('.nav-links');

      scrollContainers.forEach((container) => {
        container.style.webkitOverflowScrolling = 'touch';
      });
    },
  };

  // ============================================
  // 5. FORM OPTIMIZATION
  // ============================================

  const FormOptimizer = {
    init() {
      this.preventIOSZoom();
      this.addInputValidation();
      this.improveAutocomplete();
    },

    preventIOSZoom() {
      // Ensure all inputs have 16px font size to prevent iOS zoom
      const inputs = document.querySelectorAll('input, textarea, select');

      inputs.forEach((input) => {
        const fontSize = window.getComputedStyle(input).fontSize;
        if (parseFloat(fontSize) < 16) {
          input.style.fontSize = '16px';
        }
      });
    },

    addInputValidation() {
      // Add real-time validation feedback
      const emailInputs = document.querySelectorAll('input[type="email"]');
      const telInputs = document.querySelectorAll('input[type="tel"]');

      emailInputs.forEach((input) => {
        input.addEventListener('blur', () => {
          if (input.value && !this.isValidEmail(input.value)) {
            input.setAttribute('aria-invalid', 'true');
            this.showError(input, 'Please enter a valid email address');
          } else {
            input.setAttribute('aria-invalid', 'false');
            this.hideError(input);
          }
        });
      });

      telInputs.forEach((input) => {
        input.addEventListener('blur', () => {
          if (input.value && !this.isValidPhone(input.value)) {
            input.setAttribute('aria-invalid', 'true');
            this.showError(input, 'Please enter a valid phone number');
          } else {
            input.setAttribute('aria-invalid', 'false');
            this.hideError(input);
          }
        });
      });
    },

    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isValidPhone(phone) {
      // Basic US phone validation
      return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
    },

    showError(input, message) {
      let errorEl = input.parentElement.querySelector('.error-message');

      if (!errorEl) {
        errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.style.color = '#d32f2f';
        errorEl.style.fontSize = '0.85rem';
        errorEl.style.marginTop = '0.3rem';
        input.parentElement.appendChild(errorEl);
      }

      errorEl.textContent = message;
      input.style.borderColor = '#d32f2f';
    },

    hideError(input) {
      const errorEl = input.parentElement.querySelector('.error-message');
      if (errorEl) {
        errorEl.remove();
      }
      input.style.borderColor = '';
    },

    improveAutocomplete() {
      // Add autocomplete attributes if missing
      const nameInputs = document.querySelectorAll('input[name*="name"]:not([autocomplete])');
      const emailInputs = document.querySelectorAll('input[type="email"]:not([autocomplete])');
      const telInputs = document.querySelectorAll('input[type="tel"]:not([autocomplete])');

      nameInputs.forEach((input) => input.setAttribute('autocomplete', 'name'));
      emailInputs.forEach((input) => input.setAttribute('autocomplete', 'email'));
      telInputs.forEach((input) => input.setAttribute('autocomplete', 'tel'));
    },
  };

  // ============================================
  // 6. PERFORMANCE MONITORING
  // ============================================

  const PerformanceMonitor = {
    init() {
      this.measureCoreWebVitals();
      this.detectSlowFrames();
    },

    measureCoreWebVitals() {
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('[Onevia] LCP:', lastEntry.renderTime || lastEntry.loadTime);
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            console.log('[Onevia] FID:', entry.processingStart - entry.startTime);
          });
        }).observe({ entryTypes: ['first-input'] });

        // Cumulative Layout Shift (CLS)
        let clsScore = 0;
        new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsScore += entry.value;
            }
          });
          console.log('[Onevia] CLS:', clsScore);
        }).observe({ entryTypes: ['layout-shift'] });
      }
    },

    detectSlowFrames() {
      let lastTime = performance.now();
      let frames = 0;
      let slowFrames = 0;

      const checkFrame = () => {
        const currentTime = performance.now();
        const delta = currentTime - lastTime;

        if (delta > 50) {
          // Frame took longer than 50ms (20fps)
          slowFrames++;
        }

        frames++;

        if (frames >= 60) {
          const slowPercentage = (slowFrames / frames) * 100;
          if (slowPercentage > 10) {
            console.warn('[Onevia] Performance warning:', slowPercentage.toFixed(1), '% slow frames');
            document.documentElement.classList.add('low-performance');
          }
          frames = 0;
          slowFrames = 0;
        }

        lastTime = currentTime;
        requestAnimationFrame(checkFrame);
      };

      requestAnimationFrame(checkFrame);
    },
  };

  // ============================================
  // 7. ORIENTATION CHANGE HANDLER
  // ============================================

  const OrientationHandler = {
    init() {
      this.handleOrientationChange();
      window.addEventListener('orientationchange', () => {
        this.handleOrientationChange();
      });
    },

    handleOrientationChange() {
      // Allow layout to adjust
      setTimeout(() => {
        // Recalculate heights if needed
        const hero = document.querySelector('.hero');
        if (hero) {
          hero.style.minHeight = `${window.innerHeight * 0.7}px`;
        }
      }, 100);
    },
  };

  // ============================================
  // 8. SERVICE WORKER REGISTRATION (OPTIONAL)
  // ============================================

  const PWASetup = {
    init() {
      if ('serviceWorker' in navigator) {
        // Register service worker when available
        // Uncomment when service-worker.js is created
        /*
        navigator.serviceWorker
          .register('/service-worker.js')
          .then((registration) => {
            console.log('[Onevia] Service Worker registered:', registration);
          })
          .catch((error) => {
            console.log('[Onevia] Service Worker registration failed:', error);
          });
        */
      }
    },
  };

  // ============================================
  // 9. VIEWPORT HEIGHT FIX FOR MOBILE BROWSERS
  // ============================================

  const ViewportFix = {
    init() {
      this.setViewportHeight();
      window.addEventListener('resize', () => {
        this.setViewportHeight();
      });
    },

    setViewportHeight() {
      // Fix 100vh on mobile browsers (accounts for address bar)
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    },
  };

  // ============================================
  // 10. INITIALIZE ALL MODULES
  // ============================================

  function initMobileEnhancements() {
    console.log('[Onevia] Initializing mobile enhancements...');

    // Initialize all modules
    NetworkOptimizer.init();
    MobileNav.init();
    LazyLoader.init();
    TouchEnhancer.init();
    FormOptimizer.init();
    PerformanceMonitor.init();
    OrientationHandler.init();
    ViewportFix.init();
    // PWASetup.init(); // Uncomment when service worker is ready

    console.log('[Onevia] Mobile enhancements initialized');
  }

  // Run on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileEnhancements);
  } else {
    initMobileEnhancements();
  }

  // ============================================
  // 11. UTILITY FUNCTIONS
  // ============================================

  // Debounce function for performance
  window.debounce = function (func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Throttle function for scroll/resize events
  window.throttle = function (func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // Check if element is in viewport
  window.isInViewport = function (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // ============================================
  // 12. DEVICE DETECTION
  // ============================================

  const DeviceInfo = {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isTouchDevice: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
  };

  // Make device info globally available
  window.DeviceInfo = DeviceInfo;

  console.log('[Onevia] Device Info:', DeviceInfo);
})();
