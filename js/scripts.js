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

  const orderSummary = document.querySelector('[data-order-summary]');
  if (orderSummary) {
    const orderItems = document.getElementById('order-items');
    const orderTotal = document.getElementById('order-total');
    const planInputs = document.querySelectorAll('input[name=\"plan\"]');
    const addonInputs = document.querySelectorAll('input[name=\"addon\"]');

    const formatPrice = (value) => `$${value} / month`;

    const updateOrder = () => {
      let total = 0;
      let hasContactPricing = false;
      const items = [];

      planInputs.forEach((input) => {
        if (input.checked) {
          const contact = input.dataset.contact === 'true';
          const price = Number(input.dataset.price || 0);
          if (contact) {
            hasContactPricing = true;
          } else {
            total += price;
          }
          items.push({
            label: input.dataset.label || 'Membership',
            price,
            contact,
          });
        }
      });

      addonInputs.forEach((input) => {
        if (input.checked) {
          const contact = input.dataset.contact === 'true';
          const price = Number(input.dataset.price || 0);
          if (contact) {
            hasContactPricing = true;
          } else {
            total += price;
          }
          items.push({
            label: input.dataset.label || 'Add-on',
            price,
            contact,
          });
        }
      });

      if (orderItems) {
        orderItems.innerHTML = '';
        items.forEach((item) => {
          const li = document.createElement('li');
          const label = document.createElement('span');
          const value = document.createElement('span');
          label.textContent = item.label;
          value.textContent = item.contact ? 'Call' : `$${item.price}`;
          li.append(label, value);
          orderItems.appendChild(li);
        });
      }

      if (orderTotal) {
        orderTotal.textContent = hasContactPricing ? 'Call for pricing' : formatPrice(total);
      }
    };

    planInputs.forEach((input) => input.addEventListener('change', updateOrder));
    addonInputs.forEach((input) => input.addEventListener('change', updateOrder));
    updateOrder();
  }
});
