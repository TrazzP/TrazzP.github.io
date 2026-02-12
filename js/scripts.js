document.addEventListener('DOMContentLoaded', () => {
  const STEP_KEY = 'oneviaMembershipStep';
  const STORAGE_KEY = 'oneviaMembership';
  const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const setCookie = (name, value) => {
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${COOKIE_MAX_AGE}; path=/`;
  };

  const getCookie = (name) => {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=')[1]) : null;
  };

  const membershipLinks = document.querySelectorAll('[data-membership-link]');
  const currentPath = window.location.pathname.split('/').pop();
  if (currentPath && currentPath.startsWith('membership')) {
    localStorage.setItem(STEP_KEY, currentPath);
    setCookie(STEP_KEY, currentPath);
  }
  const lastStep = localStorage.getItem(STEP_KEY) || getCookie(STEP_KEY);
  if (lastStep && membershipLinks.length) {
    membershipLinks.forEach((link) => {
      link.setAttribute('href', lastStep);
    });
  }

  const revealElements = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  const planButtons = document.querySelectorAll('[data-plan]');
  const planLabel = document.getElementById('plan-label');
  const planPrice = document.getElementById('plan-price');
  const planNote = document.getElementById('plan-note');
  const planFeatures = document.getElementById('plan-features');

  const plans = {
    individual: {
      label: 'Individual membership',
      price: '$100 / month',
      note: 'Per adult. Transparent, predictable pricing.',
      features: [
        'Same- or next-day access',
        'Longer visits when you need them',
        'Direct physician messaging',
        'At-cost labs and medications',
      ],
    },
    family: {
      label: 'Family membership',
      price: '$300 / month',
      note: 'Covers 2 adults + 2 kids. Call for other arrangements.',
      features: [
        'One shared care plan for the whole family',
        'Unlimited primary care visits',
        'Direct messaging for parents and caregivers',
        'Transparent monthly pricing',
      ],
    },
  };

  const setPlan = (key) => {
    const plan = plans[key];
    if (!plan) return;

    if (planLabel) planLabel.textContent = plan.label;
    if (planPrice) planPrice.textContent = plan.price;
    if (planNote) planNote.textContent = plan.note;

    if (planFeatures) {
      planFeatures.innerHTML = '';
      plan.features.forEach((feature) => {
        const li = document.createElement('li');
        li.textContent = feature;
        planFeatures.appendChild(li);
      });
    }
  };

  if (planButtons.length) {
    planButtons.forEach((button) => {
      button.addEventListener('click', () => {
        planButtons.forEach((btn) => {
          btn.classList.remove('is-active');
          btn.setAttribute('aria-selected', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-selected', 'true');
        setPlan(button.dataset.plan);
      });
    });

    setPlan('individual');
  }

  const FAMILY_DISCOUNT = 0.25;
  const FAMILY_SIZE = 4;
  const defaultMembership = {
    plan: {
      key: 'individual',
      label: 'Individual membership',
      price: 100,
    },
    addons: {
      rx: { label: 'Pharmacy', price: 25, selected: false },
      dental: { label: 'Dental', price: 40, selected: false },
      vision: { label: 'Vision', price: 10, selected: false },
    },
  };
  const planDefaults = {
    individual: { label: 'Individual membership', price: 100 },
    family: { label: 'Family membership (2 adults + 2 kids)', price: 300 },
  };

  const loadMembership = () => {
    try {
      const storedRaw = localStorage.getItem(STORAGE_KEY) || getCookie(STORAGE_KEY);
      const stored = storedRaw ? JSON.parse(storedRaw) : null;
      if (!stored) return { ...defaultMembership };
      const storedPlan = stored.plan || {};
      const planKey = storedPlan.key || defaultMembership.plan.key;
      const normalizedPlan = {
        ...defaultMembership.plan,
        ...storedPlan,
        key: planKey,
      };
      if (planDefaults[planKey]) {
        normalizedPlan.label = planDefaults[planKey].label;
        normalizedPlan.price = planDefaults[planKey].price;
      }

      const storedAddons = stored.addons || {};
      return {
        plan: normalizedPlan,
        addons: {
          rx: { ...defaultMembership.addons.rx, selected: Boolean(storedAddons.rx?.selected) },
          dental: { ...defaultMembership.addons.dental, selected: Boolean(storedAddons.dental?.selected) },
          vision: { ...defaultMembership.addons.vision, selected: Boolean(storedAddons.vision?.selected) },
        },
      };
    } catch (error) {
      return { ...defaultMembership };
    }
  };

  const saveMembership = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setCookie(STORAGE_KEY, JSON.stringify(data));
  };

  const formatPrice = (value) => {
    const rounded = Math.round(Number(value) * 100) / 100;
    return rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2);
  };

  const getAddonPrice = (addon, planKey) => {
    const basePrice = Number(addon.price || 0);
    if (planKey === 'family') {
      return basePrice * FAMILY_SIZE * (1 - FAMILY_DISCOUNT);
    }
    return basePrice;
  };

  const updateSummary = (data) => {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    if (!orderItems || !orderTotal) return;

    orderItems.innerHTML = '';
    let total = 0;
    const planKey = data.plan?.key;

    if (data.plan) {
      total += Number(data.plan.price || 0);
      const li = document.createElement('li');
      li.innerHTML = `<span>${data.plan.label}</span><span>$${formatPrice(data.plan.price)}</span>`;
      orderItems.appendChild(li);
    }

    Object.values(data.addons || {}).forEach((addon) => {
      if (!addon.selected) return;
      const addonPrice = getAddonPrice(addon, planKey);
      total += addonPrice;
      const li = document.createElement('li');
      li.innerHTML = `<span>${addon.label}</span><span>$${formatPrice(addonPrice)}</span>`;
      orderItems.appendChild(li);
    });

    orderTotal.textContent = `$${formatPrice(total)} / month`;
  };

  const updateAddonPrices = (data) => {
    const planKey = data.plan?.key;
    const priceTargets = document.querySelectorAll('[data-addon-price]');
    priceTargets.forEach((target) => {
      const key = target.dataset.addonPrice;
      const basePrice = Number(target.dataset.basePrice || 0);
      const addon = (data.addons || {})[key];
      const effectivePrice = addon ? getAddonPrice(addon, planKey) : basePrice;
      target.textContent = `$${formatPrice(effectivePrice || basePrice)}`;
    });
  };

  const membershipData = loadMembership();
  const urlParams = new URLSearchParams(window.location.search);
  const addParam = urlParams.get('add');
  if (addParam && membershipData.addons[addParam]) {
    membershipData.addons[addParam].selected = true;
    saveMembership(membershipData);
  }

  const planInputs = document.querySelectorAll('[data-plan-key]');
  planInputs.forEach((input) => {
    if (input.dataset.planKey === membershipData.plan.key) {
      input.checked = true;
    }
    input.addEventListener('change', () => {
      if (!input.checked) return;
      membershipData.plan = {
        key: input.dataset.planKey,
        label: input.dataset.label || 'Membership',
        price: Number(input.dataset.price || 0),
      };
      saveMembership(membershipData);
      updateSummary(membershipData);
      updateAddonPrices(membershipData);
    });
  });

  const addonInputs = document.querySelectorAll('[data-addon-key]');
  addonInputs.forEach((input) => {
    const key = input.dataset.addonKey;
    if (membershipData.addons[key]) {
      input.checked = Boolean(membershipData.addons[key].selected);
    }
    input.addEventListener('change', () => {
      if (!membershipData.addons[key]) return;
      membershipData.addons[key].selected = input.checked;
      saveMembership(membershipData);
      updateSummary(membershipData);
    });
  });

  updateSummary(membershipData);
  updateAddonPrices(membershipData);
});

/* ============================================
   ENHANCED FEATURES FOR LIQUID GLASS DESIGN
   ============================================ */

// Video Background Lazy Loading and Optimization
document.addEventListener('DOMContentLoaded', () => {
  // Lazy load video backgrounds for performance
  const videoBackgrounds = document.querySelectorAll('.video-hero-bg, .location-hero-video');
  
  if (videoBackgrounds.length > 0) {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    videoBackgrounds.forEach((video) => {
      if (!prefersReducedMotion) {
        // Ensure video plays on mobile devices
        video.setAttribute('playsinline', '');
        video.setAttribute('muted', '');
        
        // Handle video loading and playback
        const playVideo = () => {
          video.play().catch((error) => {
            console.log('Video autoplay prevented:', error);
            // Fallback: show poster image if video can't play
          });
        };
        
        // Play video when it's loaded enough
        if (video.readyState >= 3) {
          playVideo();
        } else {
          video.addEventListener('loadeddata', playVideo);
        }
        
        // Pause video when out of viewport to save resources
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                video.play().catch(() => {});
              } else {
                video.pause();
              }
            });
          },
          { threshold: 0.25 }
        );
        
        observer.observe(video);
      } else {
        // If user prefers reduced motion, don't autoplay
        video.pause();
      }
    });
  }
});

/* ============================================
   LOCATION SEARCH AND FILTER FUNCTIONALITY
   ============================================ */

// Location Search and Filter
if (document.getElementById('location-search')) {
  const searchInput = document.getElementById('location-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const locationCards = document.querySelectorAll('[data-location]');
  const locationCount = document.getElementById('location-count');
  const noResults = document.getElementById('no-results');
  
  let activeFilter = 'all';
  
  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterLocations(searchTerm, activeFilter);
  });
  
  // Filter chip functionality
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      // Update active chip
      filterChips.forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      
      // Update active filter
      activeFilter = chip.dataset.filter;
      
      // Filter locations
      const searchTerm = searchInput.value.toLowerCase().trim();
      filterLocations(searchTerm, activeFilter);
    });
  });
  
  function filterLocations(searchTerm, filter) {
    let visibleCount = 0;
    
    locationCards.forEach((card) => {
      let showCard = true;
      
      // Search filter
      if (searchTerm) {
        const cardText = card.textContent.toLowerCase();
        if (!cardText.includes(searchTerm)) {
          showCard = false;
        }
      }
      
      // Status and service filters
      if (filter !== 'all') {
        if (filter === 'open') {
          if (card.dataset.status !== 'open') {
            showCard = false;
          }
        } else {
          // Service filters
          const services = card.dataset.services || '';
          if (!services.includes(filter)) {
            showCard = false;
          }
        }
      }
      
      // Show/hide card with animation
      if (showCard) {
        card.style.display = 'grid';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 10);
        visibleCount++;
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
    
    // Update count
    if (locationCount) {
      locationCount.textContent = visibleCount;
    }
    
    // Show/hide no results message
    if (noResults) {
      if (visibleCount === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }
  }
  
  // Reset filters function (global for button onclick)
  window.resetFilters = function() {
    searchInput.value = '';
    filterChips.forEach((chip) => chip.classList.remove('active'));
    filterChips[0].classList.add('active');
    activeFilter = 'all';
    filterLocations('', 'all');
  };
  
  // Initialize card transitions
  locationCards.forEach((card) => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
}

/* ============================================
   SMOOTH SCROLL ENHANCEMENTS
   ============================================ */

// Enhanced smooth scroll behavior for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if href is just "#"
    if (href === '#') return;
    
    e.preventDefault();
    
    const target = document.querySelector(href);
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================
   GLASS CARD PARALLAX EFFECT
   ============================================ */

// Subtle parallax effect for glass cards on scroll
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  const glassCards = document.querySelectorAll('.glass-hero-card, .glass-metric-card, .feature-card-glass');
  
  if (glassCards.length > 0) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      glassCards.forEach((card, index) => {
        const speed = 0.05 + (index * 0.01);
        const yPos = -(scrolled * speed);
        
        // Only apply if card is in viewport
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          card.style.transform = `translateY(${yPos}px)`;
        }
      });
    });
  }
}

/* ============================================
   MOBILE MENU ENHANCEMENTS
   ============================================ */

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (navLinks && menuToggle) {
    if (navLinks.classList.contains('is-open')) {
      if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  }
});

// Close mobile menu on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (navLinks && menuToggle && navLinks.classList.contains('is-open')) {
      navLinks.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  }
});

/* ============================================
   PERFORMANCE OPTIMIZATIONS
   ============================================ */

// Lazy load images with intersection observer
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          // If image has data-src, load it
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(img);
        }
      });
    },
    { rootMargin: '50px' }
  );
  
  // Observe all images with data-src attribute
  document.querySelectorAll('img[data-src]').forEach((img) => {
    imageObserver.observe(img);
  });
}

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ============================================
   ACCESSIBILITY ENHANCEMENTS
   ============================================ */

// Announce page changes to screen readers
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.style.position = 'absolute';
  announcement.style.left = '-10000px';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.overflow = 'hidden';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// Announce filter changes
if (document.getElementById('location-search')) {
  const originalFilterLocations = filterLocations;
  filterLocations = function(searchTerm, filter) {
    originalFilterLocations(searchTerm, filter);
    
    const count = document.getElementById('location-count').textContent;
    announceToScreenReader(`${count} locations found`);
  };
}

/* ============================================
   GLASS EFFECT FALLBACKS
   ============================================ */

// Check if backdrop-filter is supported
if (!CSS.supports('backdrop-filter', 'blur(10px)') && !CSS.supports('-webkit-backdrop-filter', 'blur(10px)')) {
  // Add fallback class for browsers that don't support backdrop-filter
  document.documentElement.classList.add('no-backdrop-filter');
  
  // Adjust opacity for glass elements to maintain readability
  const glassElements = document.querySelectorAll(
    '.glass-hero-card, .glass-metric-card, .feature-card-glass, ' +
    '.care-card-glass, .testimonial-glass-card, .location-service-card, ' +
    '.physician-card-glass, .location-details-card'
  );
  
  glassElements.forEach((element) => {
    // Increase opacity for better readability without backdrop-filter
    const currentBg = window.getComputedStyle(element).backgroundColor;
    if (currentBg.includes('rgba')) {
      // Increase alpha channel
      element.style.backgroundColor = currentBg.replace(/[\d.]+\)$/g, '0.95)');
    }
  });
}

console.log('✨ Onevia 2.0 Liquid Glass - Enhanced features loaded');
