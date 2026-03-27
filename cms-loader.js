// CMS Content Loader
// Fetches content from JSON files and updates the page

async function loadContent(page) {
  try {
    const res = await fetch(`/content/${page}.json?v=${Date.now()}`);
    if (!res.ok) return;
    return await res.json();
  } catch(e) {
    console.log('CMS content not loaded:', e);
    return null;
  }
}

function set(id, html) {
  const el = document.getElementById(id);
  if (el && html) el.innerHTML = html;
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el && text) el.textContent = text;
}

function setImg(id, src, alt) {
  const el = document.getElementById(id);
  if (el && src) { el.src = src; if (alt) el.alt = alt; }
}

// Resolve image: uploaded path takes priority over Unsplash ID
function resolveImage(item, w, h) {
  if (item.image && item.image.startsWith('/')) return item.image;
  if (item.image && item.image.startsWith('http')) return item.image;
  const id = item.image_id || item.image;
  if (id) return `https://images.unsplash.com/${id}?w=${w}&q=75&fit=crop`;
  return '';
}

// ── HOME PAGE ──────────────────────────────────────────
async function loadHome() {
  const data = await loadContent('home');
  bindBookingButtons();
  if (!data) return;

  // Hero
  set('hero-title', data.hero_title);
  set('hero-sub', data.hero_subtitle);
  if (data.hero_image) {
    const bg = document.getElementById('heroBg');
    if (bg) bg.src = data.hero_image;
  }

  // About
  set('about-title', data.about_title);
  set('about-body', data.about_body);
  set('about-quote', data.about_quote);
  if (data.about_image) {
    const img = document.getElementById('about-img');
    if (img) img.src = data.about_image;
  }

  // Phone (all instances)
  if (data.phone) {
    document.querySelectorAll('.site-phone').forEach(el => {
      el.textContent = data.phone;
      if (el.tagName === 'A') el.href = `tel:${data.phone.replace(/\D/g,'')}`;
    });
  }

  // Instagram links
  if (data.instagram_url) {
    document.querySelectorAll('.site-instagram-link, .site-instagram').forEach(el => {
      el.href = data.instagram_url;
    });
  }

  // Area
  set('area-title', data.area_title);
  set('area-sub', data.area_subtitle);
  if (data.area_cities) {
    const container = document.getElementById('area-cities');
    if (container) {
      container.innerHTML = data.area_cities
        .map(city => `<span class="area-tag-v2">${city}</span>`)
        .join('');
    }
  }

  // CTA
  set('cta-title', data.cta_title);
  set('cta-sub', data.cta_subtitle);
  if (data.cta_image) {
    const bg = document.getElementById('cta-img');
    if (bg) bg.src = data.cta_image;
  }

  // Services preview carousel
  if (data.services_preview) {
    const grid = document.getElementById('services-grid');
    if (grid) {
      grid.innerHTML = data.services_preview.map(s => {
        const imgSrc = resolveImage(s, 900, 600);
        return `
          <article class="service-card-v2 service-card-carousel">
            ${imgSrc ? `<img class="service-card-img" src="${imgSrc}" alt="${s.name}" loading="lazy">` : ''}
            <div class="service-card-body">
              <div class="service-num">${s.num}</div>
              <div class="service-name-v2">${s.name}</div>
              <p class="service-desc-v2">${s.description}</p>
              <div class="service-card-actions">
                <button type="button" class="btn btn-outline-gold service-learn-btn" data-service="${s.name.replace(/\"/g, '&quot;')}" onclick="openServiceModal(decodeURIComponent(this.dataset.service.replace(/&amp;/g, '&'))); return false;">Learn More</button>
                <button type="button" class="btn btn-gold service-book-btn booking-trigger" data-service="${s.name.replace(/\"/g, '&quot;')}">Book Now</button>
              </div>
            </div>
          </article>
        `;
      }).join('');
      bindServiceLearnButtons();
      bindBookingButtons();
      initServicesCarouselStatus();
    }
  }
}

// ── SERVICES PAGE ──────────────────────────────────────
async function loadServices() {
  bindBookingButtons();
  const data = await loadContent('services');
  if (!data) return;

  set('page-title', data.page_title);

  const buildRow = (s) => {
    const priceHtml = s.price ? `<div class="service-row-price">${s.price}</div>` : '';
    return `
      <div class="service-row-v2 reveal">
        <div class="service-row-body">
          <div class="service-row-top">
            <div class="service-row-name">${s.name}</div>
            ${priceHtml}
          </div>
          <p class="service-row-desc">${s.description}</p>
        </div>
      </div>
    `;
  };

  const dogContainer = document.getElementById('dog-services');
  if (dogContainer && data.dog_services) {
    dogContainer.innerHTML = data.dog_services.map(buildRow).join('');
  }

  const catContainer = document.getElementById('cat-services');
  if (catContainer && data.cat_services) {
    catContainer.innerHTML = data.cat_services.map(buildRow).join('');
  }

  const programsContainer = document.getElementById('programs');
  if (programsContainer && data.programs) {
    programsContainer.innerHTML = data.programs.map(buildRow).join('');
  }

  const pricingNote = document.getElementById('pricing-note');
  if (pricingNote) {
    if (data.pricing_note) {
      pricingNote.textContent = data.pricing_note;
      pricingNote.style.display = '';
    } else {
      pricingNote.style.display = 'none';
    }
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ── CONTACT PAGE ───────────────────────────────────────
async function loadContact() {
  const data = await loadContent('contact');
  if (!data) return;

  set('page-title', data.page_title);
  set('intro-title', data.intro_title);

  // Phone
  if (data.phone) {
    document.querySelectorAll('.site-phone').forEach(el => {
      el.textContent = data.phone;
      if (el.tagName === 'A') el.href = `tel:${data.phone.replace(/\D/g,'')}`;
    });
  }

  set('phone-note', data.phone_note);
  set('service-area', data.service_area);
  set('service-area-note', data.service_area_note);
}



function normalizeServiceName(serviceName) {
  return (serviceName || '').replace(/&amp;/g, '&').trim();
}

function getPetForService(serviceName) {
  const name = normalizeServiceName(serviceName).toLowerCase();
  if (name.includes('cat')) return 'cat';
  return 'dog';
}

function getBookingHref(serviceName) {
  const normalized = normalizeServiceName(serviceName);
  const pet = getPetForService(normalized);
  return `contact.html?service=${encodeURIComponent(normalized)}&pet=${encodeURIComponent(pet)}#booking-form`;
}

function updateModalBookLink(serviceName) {
  const btn = document.getElementById('serviceModalBookBtn');
  if (!btn) return;
  const normalized = normalizeServiceName(serviceName);
  btn.dataset.service = normalized;
  btn.dataset.pet = getPetForService(normalized);
}

function initServicesCarouselStatus() {
  const track = document.getElementById('services-grid');
  const status = document.getElementById('servicesCarouselStatus');
  if (!track || !status) return;
  const cards = Array.from(track.querySelectorAll('.service-card-carousel'));
  if (!cards.length) {
    status.innerHTML = '';
    return;
  }
  status.innerHTML = cards.map((_, i) => `<button type="button" class="services-carousel-dot${i === 0 ? ' active' : ''}" aria-label="Go to service ${i + 1}" data-index="${i}"></button>`).join('');
  const dots = Array.from(status.querySelectorAll('.services-carousel-dot'));
  const setActive = (index) => dots.forEach((dot, i) => dot.classList.toggle('active', i == index));
  const getClosestIndex = () => {
    const rect = track.getBoundingClientRect();
    const center = rect.left + (rect.width / 2);
    let activeIndex = 0;
    let closest = Infinity;
    cards.forEach((card, index) => {
      const c = card.getBoundingClientRect();
      const cardCenter = c.left + (c.width / 2);
      const distance = Math.abs(center - cardCenter);
      if (distance < closest) {
        closest = distance;
        activeIndex = index;
      }
    });
    return activeIndex;
  };
  let rafId = null;
  const onScroll = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => setActive(getClosestIndex()));
  };
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      cards[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      setActive(index);
    });
  });
  track.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  setTimeout(() => setActive(getClosestIndex()), 80);
}



function setBookingPet(petValue) {
  const hidden = document.getElementById('bookingPetType');
  if (hidden) hidden.value = petValue || '';
  document.querySelectorAll('.booking-pet-option').forEach(btn => {
    btn.classList.toggle('active', (btn.dataset.pet || '').toLowerCase() === (petValue || '').toLowerCase());
  });
}

function openBookingSheet(serviceName = '', petType = '') {
  const sheet = document.getElementById('bookingSheet');
  if (!sheet) return;
  const serviceSelect = document.getElementById('bookingService');
  const normalizedService = normalizeServiceName(serviceName);
  if (serviceSelect) {
    if (normalizedService) {
      const target = Array.from(serviceSelect.options).find(opt => opt.text.trim().toLowerCase() === normalizedService.trim().toLowerCase());
      serviceSelect.value = target ? target.text : 'Not sure yet';
    } else {
      serviceSelect.value = 'Not sure yet';
    }
  }
  setBookingPet(petType || getPetForService(normalizedService || 'dog'));
  sheet.classList.add('open');
  sheet.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeBookingSheet() {
  const sheet = document.getElementById('bookingSheet');
  if (!sheet) return;
  sheet.classList.remove('open');
  sheet.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function bindBookingButtons() {
  document.querySelectorAll('.booking-trigger').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const service = normalizeServiceName(btn.dataset.service || '');
      const pet = btn.dataset.pet || getPetForService(service);
      openBookingSheet(service, pet);
    };
  });

  const modalBookBtn = document.getElementById('serviceModalBookBtn');
  if (modalBookBtn) {
    modalBookBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const service = normalizeServiceName(modalBookBtn.dataset.service || modalBookBtn.dataset.bookingService || document.getElementById('serviceModalTitle')?.textContent || '');
      openBookingSheet(service, getPetForService(service));
    };
  }

  const close = document.getElementById('bookingSheetClose');
  if (close) close.onclick = closeBookingSheet;
  document.querySelectorAll('[data-close-booking]').forEach(el => el.onclick = closeBookingSheet);
  document.querySelectorAll('.booking-pet-option').forEach(btn => {
    btn.onclick = () => setBookingPet(btn.dataset.pet || '');
  });
}


// ── HOMEPAGE SERVICE MODAL ─────────────────────────
const serviceModalContent = {
  "Full Groom": {
    text: "Our complete grooming visit for pets who need the full refresh — coat, clean-up, finishing details, and a polished look.",
    bestFor: "Regular maintenance, breed trims, and pets who need the full service experience.",
    includes: ["Bath and dry", "Haircut or trim", "Nail trim", "Ear cleaning"]
  },
  "Bath & Brush": {
    text: "A maintenance-focused appointment that gets pets fresh, clean, brushed out, and ready to go without a haircut.",
    bestFor: "In-between full grooms, fresher coats, and pets who mainly need bathing and de-shedding support.",
    includes: ["Bath", "Blow dry", "Brush out", "Light tidy-up as needed"]
  },
  "Cat Grooming": {
    text: "Comfort-first grooming designed specifically for cats, with gentler pacing and cat-appropriate handling.",
    bestFor: "Cats who need help with shedding, matting, nail care, or routine grooming upkeep.",
    includes: ["Bath or brush service", "Nail trim", "Ear cleaning", "Haircut options when needed"]
  },
  "Nail Trim": {
    text: "A quick, simple maintenance visit focused on safe, stress-light nail care for dogs and cats.",
    bestFor: "Pets who only need a fast upkeep appointment between larger grooming visits.",
    includes: ["Nail trim", "Quick paw check", "Fast in-and-out visit"]
  },
  "De-Shedding Treatment": {
    text: "A coat-focused treatment designed to loosen and remove excess undercoat for a cleaner home and healthier-feeling coat.",
    bestFor: "Heavy shedders, seasonal coat changes, and pets who need extra coat maintenance.",
    includes: ["Specialized wash", "Coat-release treatment", "Extended brush-out", "Finishing blow dry"]
  },
  "Add-On Services": {
    text: "Finishing details and helpful upgrades that can be added to a larger visit to personalize the appointment.",
    bestFor: "Pet parents who want a little extra care or a more complete service outcome.",
    includes: ["Teeth brushing", "Specialty shampoo", "Flea and tick treatment", "Other grooming extras"]
  }
};

function openServiceModal(serviceName) {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;
  const info = serviceModalContent[serviceName] || {
    text: "A client-favorite grooming service tailored for comfort, cleanliness, and polished results.",
    bestFor: "Routine care and a more personalized grooming experience.",
    includes: ["Service details", "Comfort-focused care", "Professional finishing"]
  };
  const title = document.getElementById('serviceModalTitle');
  const text = document.getElementById('serviceModalText');
  const bestFor = document.getElementById('serviceModalBestFor');
  const includes = document.getElementById('serviceModalIncludes');
  if (title) title.textContent = serviceName;
  if (text) text.textContent = info.text;
  if (bestFor) bestFor.textContent = info.bestFor;
  if (includes) includes.innerHTML = info.includes.map(item => `<li>${item}</li>`).join('');
  updateModalBookLink(serviceName);
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeServiceModal() {
  const modal = document.getElementById('serviceModal');
  if (!modal) return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function bindServiceLearnButtons() {
  document.querySelectorAll('.service-learn-btn').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openServiceModal(normalizeServiceName(btn.dataset.service || 'Service'));
    };
  });
  const closeBtn = document.getElementById('serviceModalClose');
  if (closeBtn) closeBtn.onclick = closeServiceModal;
  document.querySelectorAll('[data-close-modal]').forEach(el => { el.onclick = closeServiceModal; });
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeServiceModal(); closeBookingSheet(); } });
