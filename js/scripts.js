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
