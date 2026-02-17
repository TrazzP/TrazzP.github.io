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

  // Track membership step progress
  const currentPath = window.location.pathname.split('/').pop();
  if (currentPath && currentPath.startsWith('membership')) {
    localStorage.setItem(STEP_KEY, currentPath);
    setCookie(STEP_KEY, currentPath);
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

// Location Search and Filter (multi-select)
if (document.getElementById('location-search')) {
  const searchInput = document.getElementById('location-search');
  const filterChips = document.querySelectorAll('.filter-chip');
  const locationCards = document.querySelectorAll('.location-card[data-location-id]');
  const locationCountContainer = document.getElementById('location-count');
  const locationCountText = document.getElementById('location-count-text');
  const noResults = document.getElementById('no-results');
  const totalLocations = locationCards.length;

  const STATUS_FILTERS = new Set(['open', 'planned']);
  const SERVICE_FILTERS = new Set(['primary-care', 'pharmacy', 'dental', 'vision']);
  let activeFilters = new Set();

  function updateChipVisuals() {
    const allChip = document.querySelector('.filter-chip[data-filter="all"]');
    filterChips.forEach((chip) => {
      const f = chip.dataset.filter;
      if (f === 'all') {
        chip.classList.toggle('active', activeFilters.size === 0);
      } else {
        chip.classList.toggle('active', activeFilters.has(f));
      }
    });
  }

  function updateLocationCount(count) {
    if (locationCountContainer && locationCountText) {
      if (count < totalLocations && (activeFilters.size > 0 || searchInput.value.trim())) {
        locationCountText.textContent = `${count} location${count !== 1 ? 's' : ''} found`;
        locationCountContainer.style.display = 'block';
      } else {
        locationCountContainer.style.display = 'none';
      }
    }
  }

  searchInput.addEventListener('input', () => {
    runFilter();
  });

  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = chip.dataset.filter;

      if (filter === 'all') {
        activeFilters.clear();
      } else {
        if (activeFilters.has(filter)) {
          activeFilters.delete(filter);
        } else {
          activeFilters.add(filter);
        }
      }

      updateChipVisuals();
      runFilter();
    });
  });

  function runFilter() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    // Separate active filters into status and service groups
    const activeStatusFilters = [];
    const activeServiceFilters = [];
    activeFilters.forEach((f) => {
      if (STATUS_FILTERS.has(f)) activeStatusFilters.push(f);
      if (SERVICE_FILTERS.has(f)) activeServiceFilters.push(f);
    });

    locationCards.forEach((card) => {
      let showCard = true;

      // Text search
      if (searchTerm) {
        const cardText = card.textContent.toLowerCase();
        const cardCity = (card.dataset.city || '').toLowerCase();
        if (!cardText.includes(searchTerm) && !cardCity.includes(searchTerm)) {
          showCard = false;
        }
      }

      // Status filter: card must match at least ONE active status filter
      if (showCard && activeStatusFilters.length > 0) {
        const cardStatus = card.dataset.status || '';
        if (!activeStatusFilters.includes(cardStatus)) {
          showCard = false;
        }
      }

      // Service filter: card must have ALL active service filters (intersection)
      if (showCard && activeServiceFilters.length > 0) {
        const cardServices = (card.dataset.services || '').split(',');
        const hasAllServices = activeServiceFilters.every((f) => cardServices.includes(f));
        if (!hasAllServices) {
          showCard = false;
        }
      }

      // Show/hide card with animation
      if (showCard) {
        card.style.display = '';
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

    updateLocationCount(visibleCount);

    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Reset filters (global for button onclick)
  window.resetFilters = function() {
    searchInput.value = '';
    activeFilters.clear();
    updateChipVisuals();
    runFilter();
  };

  // Initialize card transitions
  locationCards.forEach((card) => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });

  // URL parameter support (e.g., ?filter=primary-care from services page)
  const urlParams = new URLSearchParams(window.location.search);
  const preFilter = urlParams.get('filter');
  if (preFilter && (STATUS_FILTERS.has(preFilter) || SERVICE_FILTERS.has(preFilter))) {
    activeFilters.add(preFilter);
    updateChipVisuals();
    runFilter();
  }
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

/* Glass cards use CSS transitions only - no JS parallax to avoid layout inconsistency */

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

/* Filter change announcements handled inline in filterLocations */

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

/* Onevia 2.0 loaded */

/* ============================================
   IP-BASED LOCATION DETECTION
   ============================================ */

// Clinic locations with coordinates
const CLINICS = [
  { id: 'missoula', name: 'Missoula', lat: 46.8721, lon: -113.9940, status: 'open' },
  { id: 'bozeman', name: 'Bozeman', lat: 45.6770, lon: -111.0429, status: 'open' },
  { id: 'billings', name: 'Billings', lat: 45.7833, lon: -108.5007, status: 'open' },
  { id: 'greatfalls', name: 'Great Falls', lat: 47.5002, lon: -111.3008, status: 'planned' }
];

// Convert degrees to radians
function toRad(degrees) {
  return degrees * (Math.PI / 180);
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

// Display location cards with distance badges
function displayLocationCards(clinicsWithDistance) {
  clinicsWithDistance.forEach((clinic) => {
    const distanceBadge = document.querySelector(`[data-location-distance="${clinic.id}"]`);
    if (distanceBadge && clinic.distance !== undefined) {
      const miles = Math.round(clinic.distance);
      distanceBadge.textContent = `${miles} miles away`;
      distanceBadge.style.display = 'inline-block';
    }
  });

  // Reorder cards by distance
  const container = document.getElementById('location-cards-container');
  if (container) {
    const cards = Array.from(container.querySelectorAll('.location-card'));

    // Sort cards based on clinic order
    cards.sort((a, b) => {
      const aId = a.dataset.locationId;
      const bId = b.dataset.locationId;
      const aIndex = clinicsWithDistance.findIndex(c => c.id === aId);
      const bIndex = clinicsWithDistance.findIndex(c => c.id === bId);
      return aIndex - bIndex;
    });

    // Reappend in sorted order
    cards.forEach(card => container.appendChild(card));
  }
}

// Load nearest locations based on IP geolocation
async function loadNearestLocations() {
  try {
    const response = await fetch('https://ipapi.co/json/');

    if (!response.ok) {
      throw new Error('Geolocation API failed');
    }

    const data = await response.json();
    const userLat = data.latitude;
    const userLon = data.longitude;
    const userRegion = data.region || '';

    // Calculate distances
    const clinicsWithDistance = CLINICS.map(clinic => ({
      ...clinic,
      distance: calculateDistance(userLat, userLon, clinic.lat, clinic.lon)
    }));

    // Sort by distance (nearest first)
    clinicsWithDistance.sort((a, b) => a.distance - b.distance);

    // Display all 3 locations with distance badges
    displayLocationCards(clinicsWithDistance.slice(0, 3));

  } catch (error) {
    // Fallback: show all locations without distance badges (default order)
    displayLocationCards(CLINICS);
  }
}

// Initialize location detection on page load
document.addEventListener('DOMContentLoaded', () => {
  const locationContainer = document.getElementById('location-cards-container');

  if (locationContainer) {
    // Load nearest locations based on IP
    loadNearestLocations();
  }
});

/* ============================================
   LOCATION-AWARE MEMBERSHIP FLOW
   ============================================ */

// Location data structure
const LOCATION_DATA = {
  missoula: {
    name: 'Onevia - Missoula',
    shortName: 'Missoula',
    status: 'open',
    services: ['primary', 'pharmacy', 'dental', 'vision'],
    description: 'Full-service clinic with all available services'
  },
  bozeman: {
    name: 'Onevia - Bozeman',
    shortName: 'Bozeman',
    status: 'open',
    services: ['primary', 'pharmacy', 'dental'],
    description: 'Primary Care, Pharmacy, and Dental services'
  },
  billings: {
    name: 'Onevia - Billings',
    shortName: 'Billings',
    status: 'open',
    services: ['primary', 'pharmacy'],
    description: 'Primary Care and Pharmacy services'
  },
  greatfalls: {
    name: 'Onevia - Great Falls',
    shortName: 'Great Falls',
    status: 'planned',
    services: ['primary'],
    description: 'Coming soon with Primary Care'
  }
};

// Resolve path from any page depth back to site root
function siteRoot() {
  const path = window.location.pathname;
  // City subdirectories are one level deep (e.g., /missoula/index.html)
  const segments = path.split('/').filter(Boolean);
  if (segments.length >= 2 && segments[segments.length - 1] === 'index.html') {
    return '../';
  }
  return '';
}

// Store selected location and start membership flow
function selectLocation(locationKey, locationName) {
  localStorage.setItem('selectedLocation', locationKey);
  localStorage.setItem('selectedLocationName', locationName);
  window.location.href = siteRoot() + 'membership-plan.html';
}

// Join waitlist function
function joinWaitlist(locationKey, locationName) {
  localStorage.setItem('waitlistLocation', locationKey);
  localStorage.setItem('waitlistLocationName', locationName);
  window.location.href = siteRoot() + 'waitlist.html';
}

// Get available services for a location
function getAvailableServices(locationKey) {
  const location = LOCATION_DATA[locationKey];
  return location ? location.services : ['primary'];
}

// Check if service is available at selected location
function isServiceAvailable(serviceKey) {
  const locationKey = localStorage.getItem('selectedLocation') || 'missoula';
  const services = getAvailableServices(locationKey);
  return services.includes(serviceKey);
}

// Update location indicator on membership pages
function updateLocationIndicator() {
  const locationIndicator = document.getElementById('location-indicator');
  const locationNameEl = document.getElementById('location-name');

  if (locationIndicator && locationNameEl) {
    const locationKey = localStorage.getItem('selectedLocation') || 'missoula';
    const locationName = localStorage.getItem('selectedLocationName') || 'Onevia - Missoula';

    locationNameEl.textContent = locationName;

    // Show/hide based on available services
    const currentPage = window.location.pathname.split('/').pop();

    // Check if current service page should be skipped
    if (currentPage === 'membership-rx.html' && !isServiceAvailable('pharmacy')) {
      window.location.href = 'membership-dental.html';
      return;
    }

    if (currentPage === 'membership-dental.html' && !isServiceAvailable('dental')) {
      window.location.href = 'membership-vision.html';
      return;
    }

    if (currentPage === 'membership-vision.html' && !isServiceAvailable('vision')) {
      window.location.href = 'membership-details.html';
      return;
    }
  }
}

// Update waitlist page with location information
function updateWaitlistPage() {
  const waitlistLocationKey = localStorage.getItem('waitlistLocation');
  const waitlistLocationName = localStorage.getItem('waitlistLocationName');

  if (!waitlistLocationKey || !waitlistLocationName) {
    // Redirect back to membership if no waitlist location selected
    window.location.href = siteRoot() + 'locations.html';
    return;
  }

  const locationData = LOCATION_DATA[waitlistLocationKey];
  if (!locationData) {
    window.location.href = siteRoot() + 'locations.html';
    return;
  }

  // Update heading
  const heading = document.getElementById('waitlist-heading');
  if (heading) {
    heading.textContent = `Join the ${locationData.name} waitlist.`;
  }

  // Update description
  const description = document.getElementById('waitlist-description');
  if (description) {
    description.textContent = `Be the first to know when we open in ${locationData.shortName}.`;
  }

  // Update sidebar location name
  const sidebarName = document.getElementById('waitlist-location-name');
  if (sidebarName) {
    sidebarName.textContent = locationData.name;
  }

  // Update short name in description
  const shortNameEl = document.getElementById('location-short-name');
  if (shortNameEl) {
    shortNameEl.textContent = locationData.shortName;
  }

  // Update available services in sidebar
  const servicesList = document.getElementById('waitlist-services');
  if (servicesList) {
    servicesList.innerHTML = '';
    locationData.services.forEach((service) => {
      const serviceName = {
        primary: 'Primary Care',
        pharmacy: 'Pharmacy',
        dental: 'Dental',
        vision: 'Vision'
      }[service];

      const li = document.createElement('li');
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '0.5rem';
      li.innerHTML = `<span style="font-size: 1.2rem;">&#10003;</span> ${serviceName}`;
      servicesList.appendChild(li);
    });
  }

  // Show/hide service checkboxes based on location
  const pharmacyOption = document.getElementById('pharmacy-option');
  const dentalOption = document.getElementById('dental-option');
  const visionOption = document.getElementById('vision-option');

  if (pharmacyOption) {
    pharmacyOption.style.display = locationData.services.includes('pharmacy') ? 'block' : 'none';
  }
  if (dentalOption) {
    dentalOption.style.display = locationData.services.includes('dental') ? 'block' : 'none';
  }
  if (visionOption) {
    visionOption.style.display = locationData.services.includes('vision') ? 'block' : 'none';
  }
}

// Handle waitlist form submission
function handleWaitlistSubmit(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);
  const data = {
    location: localStorage.getItem('waitlistLocation'),
    locationName: localStorage.getItem('waitlistLocationName'),
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    services: formData.getAll('services'),
    message: formData.get('message')
  };

  console.log('Waitlist submission:', data);

  // In a real implementation, you would send this to your backend
  // For now, show a success message
  alert(`Thank you for joining the waitlist for ${data.locationName}! We will notify you when this location opens.`);

  // Clear waitlist data
  localStorage.removeItem('waitlistLocation');
  localStorage.removeItem('waitlistLocationName');

  // Redirect to home or confirmation page
  window.location.href = 'index.html';
}

// Handle notify/email capture form (homepage)
function handleNotifySubmit(event) {
  event.preventDefault();
  const email = document.getElementById('notify-email').value;
  console.log('Notify submission:', { email });

  // In a real implementation, send to backend/email service
  const form = event.target;
  form.innerHTML = '<p style="font-size: 1.1rem; color: var(--accent); font-weight: 600; padding: 1rem 0;">Thanks! We\'ll let you know when Onevia expands to your area.</p>';
}

// Initialize location-aware features
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();

  // Update location indicator on membership flow pages
  if (currentPage.startsWith('membership-')) {
    updateLocationIndicator();
  }

  // Initialize waitlist page
  if (currentPage === 'waitlist.html') {
    updateWaitlistPage();

    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
      waitlistForm.addEventListener('submit', handleWaitlistSubmit);
    }
  }

  // Redirect to location selection if no location is selected
  if (currentPage.startsWith('membership-')) {
    const selectedLocation = localStorage.getItem('selectedLocation');
    if (!selectedLocation) {
      window.location.href = siteRoot() + 'locations.html';
    }
  }
});

// Make functions globally available
window.selectLocation = selectLocation;
window.joinWaitlist = joinWaitlist;
window.getAvailableServices = getAvailableServices;
window.isServiceAvailable = isServiceAvailable;

/* ============================================
   LOCATION PAGE HOURS AND MAPS FUNCTIONALITY
   ============================================ */

// Detect if user is on iOS device
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Open Apple Maps with address
function openAppleMaps(address) {
  const encoded = encodeURIComponent(address);
  window.open(`maps://maps.apple.com/?q=${encoded}`, '_blank');
}

// Open Google Maps with address
function openGoogleMaps(address) {
  const encoded = encodeURIComponent(address);
  window.open(`https://www.google.com/maps/search/?api=1&query=${encoded}`, '_blank');
}

// Universal maps function that detects platform
function openInMaps(address) {
  if (isIOS()) {
    openAppleMaps(address);
  } else {
    openGoogleMaps(address);
  }
}

// Populate hours grid with today highlighted
function populateHoursGrid(hoursData) {
  const hoursGrid = document.getElementById('hours-grid');
  if (!hoursGrid) return;

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();

  hoursGrid.innerHTML = '';

  days.forEach((day, index) => {
    const hours = hoursData[day.toLowerCase()] || 'Closed';
    const isToday = index === today;

    const row = document.createElement('div');
    row.className = `hours-row${isToday ? ' today' : ''}${hours === 'Closed' ? ' closed' : ''}`;

    row.innerHTML = `
      <div class="hours-day">${day}${isToday ? ' (Today)' : ''}</div>
      <div class="hours-time">${hours}</div>
    `;

    hoursGrid.appendChild(row);
  });
}

// Initialize location page features
document.addEventListener('DOMContentLoaded', () => {
  const locationPage = document.querySelector('.location-page');

  if (locationPage) {
    // Show Apple Maps button on iOS devices
    if (isIOS()) {
      const appleMapsButtons = document.querySelectorAll('.btn-apple-maps');
      appleMapsButtons.forEach(btn => {
        btn.style.display = 'inline-flex';
      });
    }

    // Get location-specific hours data from data attribute
    const locationKey = locationPage.dataset.location;

    // Default hours structure - can be customized per location
    const defaultHours = {
      monday: '8:00 AM - 5:00 PM',
      tuesday: '8:00 AM - 5:00 PM',
      wednesday: '8:00 AM - 5:00 PM',
      thursday: '8:00 AM - 5:00 PM',
      friday: '8:00 AM - 5:00 PM',
      saturday: 'Closed',
      sunday: 'Closed'
    };

    // Location-specific hours (can be expanded)
    const locationHours = {
      missoula: {
        monday: '8:00 AM - 6:00 PM',
        tuesday: '8:00 AM - 6:00 PM',
        wednesday: '8:00 AM - 6:00 PM',
        thursday: '8:00 AM - 6:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: '9:00 AM - 1:00 PM',
        sunday: 'Closed'
      },
      bozeman: {
        monday: '8:00 AM - 5:00 PM',
        tuesday: '8:00 AM - 5:00 PM',
        wednesday: '8:00 AM - 5:00 PM',
        thursday: '8:00 AM - 5:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: 'Closed',
        sunday: 'Closed'
      },
      billings: {
        monday: '8:00 AM - 5:00 PM',
        tuesday: '8:00 AM - 5:00 PM',
        wednesday: '8:00 AM - 5:00 PM',
        thursday: '8:00 AM - 5:00 PM',
        friday: '8:00 AM - 5:00 PM',
        saturday: 'Closed',
        sunday: 'Closed'
      }
    };

    // Populate hours grid
    const hours = locationHours[locationKey] || defaultHours;
    populateHoursGrid(hours);
  }
});

// Make maps functions globally available
window.openInMaps = openInMaps;
window.openAppleMaps = openAppleMaps;
window.openGoogleMaps = openGoogleMaps;

/* ============================================
   MOBILE-SPECIFIC ENHANCEMENTS
   ============================================ */

// Enhanced Video Background for Mobile
(function() {
  const isMobile = window.innerWidth <= 768;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isAndroid = /Android/.test(navigator.userAgent);

  // Detect network speed for video optimization
  let connectionSpeed = 'unknown';
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && connection.effectiveType) {
      connectionSpeed = connection.effectiveType; // '4g', '3g', '2g', 'slow-2g'
    }
  }

  // Enhanced video loading with mobile optimizations
  const videoBackgrounds = document.querySelectorAll('.video-hero-bg, .location-hero-video');

  videoBackgrounds.forEach((video) => {
    // On slow connections or 3G, prefer poster image
    if (isMobile && (connectionSpeed === '3g' || connectionSpeed === '2g' || connectionSpeed === 'slow-2g')) {
      video.style.display = 'none';
      if (video.poster) {
        const posterImg = document.createElement('img');
        posterImg.src = video.poster;
        posterImg.style.width = '100%';
        posterImg.style.height = '100%';
        posterImg.style.objectFit = 'cover';
        posterImg.style.position = 'absolute';
        posterImg.style.inset = '0';
        posterImg.style.zIndex = '0';
        video.parentElement.insertBefore(posterImg, video);
      }
      return;
    }

    // iOS-specific video handling
    if (isIOS) {
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      video.setAttribute('x-webkit-airplay', 'allow');
      video.muted = true;

      // iOS sometimes needs user interaction, prepare fallback
      const iosVideoFallback = () => {
        if (video.paused && video.poster) {
          video.style.opacity = '0.01';
        }
      };

      video.addEventListener('pause', iosVideoFallback);
    }

    // Android-specific optimizations
    if (isAndroid) {
      video.setAttribute('preload', 'metadata');
      video.muted = true;
    }
  });
})();

/* Mobile menu close handled by earlier event listener */

// Prevent body scroll when mobile menu is open
if (window.innerWidth <= 768) {
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('is-open');
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
  }
}

// Touch-friendly scroll improvements
if ('ontouchstart' in window) {
  // Add momentum scrolling for iOS
  document.body.style.webkitOverflowScrolling = 'touch';

  // Disable hover effects on touch devices
  document.body.classList.add('touch-device');
}

// Optimize images for mobile
if (window.innerWidth <= 768) {
  const images = document.querySelectorAll('img:not([data-src])');

  images.forEach((img) => {
    // Add loading="lazy" to images below the fold
    const rect = img.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight;

    if (!isInViewport) {
      img.setAttribute('loading', 'lazy');
    }
  });
}

/* Battery-aware: handled by OS power settings and prefers-reduced-motion */

// Mobile-specific performance monitoring
if (window.innerWidth <= 768) {
  // Monitor layout shifts for debugging
  let cls = 0;

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            cls += entry.value;
            if (cls > 0.1) {
              console.warn('Cumulative Layout Shift exceeded threshold:', cls);
            }
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      // PerformanceObserver not supported
    }
  }
}

// Viewport height fix for mobile browsers (addresses 100vh issues)
function setVH() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', throttle(setVH, 250));
window.addEventListener('orientationchange', setVH);

// Handle safe area insets for notched devices
if (CSS.supports('padding-top: env(safe-area-inset-top)')) {
  document.documentElement.classList.add('has-safe-areas');
}

// Improved scroll behavior for mobile
let ticking = false;
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';

      // Add scroll direction class to header for hiding/showing on scroll
      const header = document.querySelector('.topbar');
      if (header && window.innerWidth <= 768) {
        if (scrollDirection === 'down' && currentScrollY > 100) {
          header.style.transform = 'translateY(-100%)';
        } else if (scrollDirection === 'up') {
          header.style.transform = 'translateY(0)';
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });

    ticking = true;
  }
});

// Handle form inputs on mobile (prevent zoom)
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input) => {
    if (!input.style.fontSize || parseInt(input.style.fontSize) < 16) {
      input.style.fontSize = '16px';
    }
  });
}

/* Backdrop-filter fallback handled by earlier glass effect detection */

// Optimize touch events
if ('ontouchstart' in window) {
  document.addEventListener('touchstart', () => {}, { passive: true });
  document.addEventListener('touchmove', () => {}, { passive: true });
}

// Mobile-specific accessibility improvements
function improveAccessibilityOnMobile() {
  if (window.innerWidth <= 768) {
    // Ensure all interactive elements have adequate size
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      // If element is too small, add padding class
      if (rect.width < 44 || rect.height < 44) {
        element.classList.add('touch-target-enhanced');
      }
    });

    // Add CSS for enhanced touch targets dynamically
    const style = document.createElement('style');
    style.textContent = `
      .touch-target-enhanced {
        min-width: 44px;
        min-height: 44px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
    `;
    document.head.appendChild(style);
  }
}

document.addEventListener('DOMContentLoaded', improveAccessibilityOnMobile);

// Network-aware loading
if ('connection' in navigator) {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (connection) {
    connection.addEventListener('change', () => {
      const effectiveType = connection.effectiveType;

      if (effectiveType === '2g' || effectiveType === 'slow-2g') {
        // Disable videos and heavy animations on slow connections
        document.querySelectorAll('video').forEach((video) => {
          video.pause();
          video.style.display = 'none';
        });

        document.documentElement.classList.add('slow-connection');
      }
    });
  }
}

/* ============================================
   SERVICES PAGE HOTBAR SCROLL HIGHLIGHTING
   ============================================ */

if (document.getElementById('services-hotbar')) {
  const hotbarItems = document.querySelectorAll('.services-hotbar-item');
  const sectionIds = ['primary-care', 'rx', 'dental', 'vision'];

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            hotbarItems.forEach((item) => {
              const href = item.getAttribute('href').replace('#', '');
              item.classList.toggle('active', href === id);
            });
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -40% 0px' }
    );

    sectionIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
  }
}

/* ============================================
   MEMBERSHIP FLOW DYNAMIC NAVIGATION
   ============================================ */

// Update membership step navigation based on available services
function updateMembershipNavigation() {
  const locationKey = localStorage.getItem('selectedLocation');
  if (!locationKey) return;

  const services = getAvailableServices(locationKey);
  const currentPage = window.location.pathname.split('/').pop();

  // Map service pages to service keys
  const pageServiceMap = {
    'membership-rx.html': 'pharmacy',
    'membership-dental.html': 'dental',
    'membership-vision.html': 'vision'
  };

  // Build the step sequence based on available services
  const allSteps = [
    { page: 'membership-plan.html', service: 'primary' },
    { page: 'membership-rx.html', service: 'pharmacy' },
    { page: 'membership-dental.html', service: 'dental' },
    { page: 'membership-vision.html', service: 'vision' },
    { page: 'membership-details.html', service: null }
  ];

  const availableSteps = allSteps.filter(
    (step) => step.service === null || step.service === 'primary' || services.includes(step.service)
  );

  // Find current step index
  const currentIndex = availableSteps.findIndex((step) => step.page === currentPage);
  if (currentIndex === -1) return;

  // Update step counter
  const stepBadge = document.querySelector('.badge');
  if (stepBadge) {
    stepBadge.textContent = `Step ${currentIndex + 1} of ${availableSteps.length}`;
  }

  // Update "Next" button to point to correct next step
  const nextStep = availableSteps[currentIndex + 1];
  const prevStep = availableSteps[currentIndex - 1];

  const stepperActions = document.querySelector('.stepper-actions');
  if (stepperActions && nextStep) {
    const nextLink = stepperActions.querySelector('.btn-primary');
    if (nextLink) {
      nextLink.href = nextStep.page;
      // Update button text based on next service
      const serviceNames = { pharmacy: 'Pharmacy', dental: 'Dental', vision: 'Vision' };
      if (nextStep.service && serviceNames[nextStep.service]) {
        nextLink.textContent = `Next: ${serviceNames[nextStep.service]}`;
      } else if (nextStep.page === 'membership-details.html') {
        nextLink.textContent = 'Next: Your Details';
      }
    }
  }
}

// Run on membership pages
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage && currentPage.startsWith('membership-')) {
    updateMembershipNavigation();
  }
});

/* ============================================
   HERO SLIDER - AUTO-ROTATING TAGLINES
   ============================================ */

function initHeroSlider(sliderId, dotsId, interval) {
  const slider = document.getElementById(sliderId);
  const dotsContainer = document.getElementById(dotsId);
  if (!slider || !dotsContainer) return null;

  const slides = slider.querySelectorAll('.hero-slide');
  const dots = dotsContainer.querySelectorAll('.hero-dot');
  if (slides.length === 0) return null;

  let current = 0;
  let timer = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo(current + 1);
  }

  function startAutoPlay() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, interval || 4000);
  }

  function stopAutoPlay() {
    if (timer) clearInterval(timer);
  }

  // Dot click handlers
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goTo(Number(dot.dataset.slide));
      stopAutoPlay();
      startAutoPlay(); // restart timer after manual click
    });
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopAutoPlay);
  slider.addEventListener('mouseleave', startAutoPlay);

  // Respect reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    startAutoPlay();
  }

  return { goTo, next, startAutoPlay, stopAutoPlay };
}

document.addEventListener('DOMContentLoaded', () => {
  // Hero slider (3 taglines, 4s interval)
  initHeroSlider('hero-slider', 'hero-dots', 4000);

  // Why Onevia slider (4 taglines, 5s interval)
  initHeroSlider('why-slider', 'why-dots', 5000);
});

// Progress bar functionality for membership flow
document.addEventListener('DOMContentLoaded', () => {
  const progressContainer = document.querySelector('.progress-bar-container, .membership-progress-bar');
  if (!progressContainer) return;

  updateProgressBar();
  updateMembershipBrand();
});

// Update the brand text and link to show selected location
function updateMembershipBrand() {
  const brandText = document.getElementById('membership-brand-text');
  const brandLink = brandText ? brandText.closest('.brand') : null;
  if (!brandText) return;

  const locationKey = localStorage.getItem('selectedLocation') || 'missoula';
  const locationName = localStorage.getItem('selectedLocationName') || 'Onevia - Missoula';

  brandText.textContent = locationName;

  // Update brand link to go to location homepage
  if (brandLink) {
    brandLink.href = `${locationKey}/index.html`;
  }
}

function updateProgressBar() {
  const locationKey = localStorage.getItem('selectedLocation') || 'missoula';
  const services = getAvailableServices(locationKey);

  // Get current page to determine step
  const currentPath = window.location.pathname.split('/').pop();
  const pageStepMap = {
    'membership-plan.html': 'plan',
    'membership-rx.html': 'pharmacy',
    'membership-dental.html': 'dental',
    'membership-vision.html': 'vision',
    'membership-details.html': 'details'
  };

  const currentStep = pageStepMap[currentPath];
  if (!currentStep) return;

  // Build list of available steps
  const allSteps = ['plan'];
  if (services.includes('pharmacy')) allSteps.push('pharmacy');
  if (services.includes('dental')) allSteps.push('dental');
  if (services.includes('vision')) allSteps.push('vision');
  allSteps.push('details');

  // Update progress bar steps
  const progressSteps = document.querySelector('.progress-bar-steps');
  if (!progressSteps) return;

  // Clear existing steps
  const bg = progressSteps.querySelector('.progress-bar-bg');
  const fill = bg ? bg.querySelector('.progress-bar-fill') : null;
  progressSteps.innerHTML = '';

  // Re-add background
  const newBg = document.createElement('div');
  newBg.className = 'progress-bar-bg';
  const newFill = document.createElement('div');
  newFill.className = 'progress-bar-fill';
  newBg.appendChild(newFill);
  progressSteps.appendChild(newBg);

  // Calculate progress percentage
  const currentIndex = allSteps.indexOf(currentStep);
  const totalSteps = allSteps.length;
  const progressPercent = ((currentIndex + 1) / totalSteps) * 100;
  newFill.style.width = progressPercent + '%';

  // Step labels
  const stepLabels = {
    'plan': 'Membership',
    'pharmacy': 'Pharmacy',
    'dental': 'Dental',
    'vision': 'Vision',
    'details': 'Review'
  };

  // Create step elements
  allSteps.forEach((step, index) => {
    const stepEl = document.createElement('div');
    stepEl.className = 'progress-step';

    if (index < currentIndex) {
      stepEl.classList.add('completed');
    } else if (index === currentIndex) {
      stepEl.classList.add('active');
    }

    const circle = document.createElement('div');
    circle.className = 'progress-step-circle';
    if (index >= currentIndex) {
      circle.textContent = index + 1;
    }

    const label = document.createElement('span');
    label.className = 'progress-step-label';
    label.textContent = stepLabels[step] || step;

    stepEl.appendChild(circle);
    stepEl.appendChild(label);
    progressSteps.appendChild(stepEl);
  });
}

// Track membership flow progress
function trackMembershipProgress() {
  const currentLocation = localStorage.getItem('selectedLocation');
  const lastLocation = localStorage.getItem('membershipFlowLocation');

  // If location changed, reset progress
  if (currentLocation !== lastLocation) {
    localStorage.removeItem('membershipProgress');
    localStorage.setItem('membershipFlowLocation', currentLocation);
  }

  // Update current progress
  const currentPath = window.location.pathname.split('/').pop();
  if (currentPath && currentPath.startsWith('membership-')) {
    localStorage.setItem('membershipProgress', currentPath);
  }
}

// Location selection handler - reset progress when location changes
document.addEventListener('DOMContentLoaded', () => {
  const locationCards = document.querySelectorAll('[data-location-key]');
  locationCards.forEach(card => {
    card.addEventListener('click', function(e) {
      const newLocation = this.dataset.locationKey;
      const currentLocation = localStorage.getItem('selectedLocation');

      // If selecting a different location, reset progress
      if (newLocation !== currentLocation) {
        localStorage.removeItem('membershipProgress');
        localStorage.removeItem('membershipFlowLocation');
      }
    });
  });

  // Track progress on membership pages
  if (window.location.pathname.includes('membership-')) {
    trackMembershipProgress();
  }

  // Fix back button on membership-details page
  if (window.location.pathname.includes('membership-details.html')) {
    updateDetailsBackButton();
  }
});

// Update the back button on membership-details to go to the correct previous page
function updateDetailsBackButton() {
  const backButton = document.querySelector('.stepper-actions .btn-secondary');
  if (!backButton) return;

  const locationKey = localStorage.getItem('selectedLocation') || 'missoula';
  const services = getAvailableServices(locationKey);

  // Determine the last available service page
  let previousPage = 'membership-plan.html';

  if (services.includes('vision')) {
    previousPage = 'membership-vision.html';
  } else if (services.includes('dental')) {
    previousPage = 'membership-dental.html';
  } else if (services.includes('pharmacy')) {
    previousPage = 'membership-rx.html';
  }

  backButton.href = previousPage;
}

// Header hide/show on scroll
let lastScrollTop = 0;
let scrollTimer = null;

window.addEventListener('scroll', () => {
  const header = document.querySelector('.topbar');
  if (!header) return;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // If scrolling down, hide header
  if (scrollTop > lastScrollTop && scrollTop > 100) {
    header.classList.add('header-hidden');
  }
  // If scrolling up, show header
  else if (scrollTop < lastScrollTop) {
    header.classList.remove('header-hidden');
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, { passive: true });

// Progress bar sticky state detection
document.addEventListener('DOMContentLoaded', () => {
  const progressBar = document.querySelector('.progress-bar-container');
  if (!progressBar) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.intersectionRatio < 1) {
        progressBar.classList.add('is-stuck');
      } else {
        progressBar.classList.remove('is-stuck');
      }
    },
    { threshold: [1], rootMargin: '-64px 0px 0px 0px' }
  );

  observer.observe(progressBar);
});

/* End of scripts */

