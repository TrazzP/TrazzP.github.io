document.addEventListener('DOMContentLoaded', () => {
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
      price: 'Family bundle',
      note: 'Custom pricing for households. Ask about pediatric add-ons.',
      features: [
        'One shared care plan for the whole family',
        'Unlimited primary care visits',
        'Direct messaging for parents and caregivers',
        'Transparent monthly pricing',
      ],
    },
    employer: {
      label: 'Employer membership',
      price: 'Call for pricing',
      note: 'Pricing depends on team size and access needs. Contact us for a quote.',
      features: [
        'Improved access and retention',
        'Reduced time away from work',
        'Dedicated onboarding for teams',
        'Clear reporting and shared outcomes',
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

  const STORAGE_KEY = 'oneviaMembership';
  const defaultMembership = {
    plan: {
      key: 'individual',
      label: 'Individual membership',
      price: 100,
    },
    addons: {
      rx: { label: 'Onevia Rx', price: 25, selected: false },
      dental: { label: 'Dental membership', price: 40, selected: false },
      vision: { label: 'Vision membership', price: 10, selected: false },
    },
  };

  const loadMembership = () => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!stored) return { ...defaultMembership };
      return {
        plan: {
          ...defaultMembership.plan,
          ...stored.plan,
        },
        addons: {
          rx: { ...defaultMembership.addons.rx, ...(stored.addons || {}).rx },
          dental: { ...defaultMembership.addons.dental, ...(stored.addons || {}).dental },
          vision: { ...defaultMembership.addons.vision, ...(stored.addons || {}).vision },
        },
      };
    } catch (error) {
      return { ...defaultMembership };
    }
  };

  const saveMembership = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const updateSummary = (data) => {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    if (!orderItems || !orderTotal) return;

    orderItems.innerHTML = '';
    let total = 0;

    if (data.plan) {
      total += Number(data.plan.price || 0);
      const li = document.createElement('li');
      li.innerHTML = `<span>${data.plan.label}</span><span>$${data.plan.price}</span>`;
      orderItems.appendChild(li);
    }

    Object.values(data.addons || {}).forEach((addon) => {
      if (!addon.selected) return;
      total += Number(addon.price || 0);
      const li = document.createElement('li');
      li.innerHTML = `<span>${addon.label}</span><span>$${addon.price}</span>`;
      orderItems.appendChild(li);
    });

    orderTotal.textContent = `$${total} / month`;
  };

  const membershipData = loadMembership();

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
});
