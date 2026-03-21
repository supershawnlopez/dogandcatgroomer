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

// Load Home Page content
async function loadHome() {
  const data = await loadContent('home');
  if (!data) return;

  // Hero
  set('hero-title', data.hero_title);
  set('hero-sub', data.hero_subtitle);

  // About
  set('about-title', data.about_title);
  set('about-body', data.about_body);
  set('about-quote', data.about_quote);

  // Contact info
  const phoneEls = document.querySelectorAll('.site-phone');
  phoneEls.forEach(el => { el.textContent = data.phone; el.href = `tel:${data.phone.replace(/\D/g,'')}`; });

  const emailEls = document.querySelectorAll('.site-email');
  emailEls.forEach(el => { el.textContent = data.email; el.href = `mailto:${data.email}`; });

  const igEls = document.querySelectorAll('.site-instagram');
  igEls.forEach(el => { el.textContent = data.instagram_handle; el.href = data.instagram_url; });

  // Area
  set('area-title', data.area_title);
  set('area-sub', data.area_subtitle);

  // Area cities
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

  // Services preview grid
  if (data.services_preview) {
    const grid = document.getElementById('services-grid');
    if (grid) {
      grid.innerHTML = data.services_preview.map(s => `
        <div class="service-card-v2 reveal">
          <img class="service-card-img"
            src="https://images.unsplash.com/${s.image}?w=600&q=75&fit=crop"
            alt="${s.name}" loading="lazy">
          <div class="service-num">${s.num}</div>
          <div class="service-name-v2">${s.name}</div>
          <p class="service-desc-v2">${s.description}</p>
        </div>
      `).join('');

      // Re-observe new elements
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.05 });
      grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }
  }
}

// Load Services Page content
async function loadServices() {
  const data = await loadContent('services');
  if (!data) return;

  set('page-title', data.page_title);

  const buildRow = (s) => `
    <div class="service-row-v2 reveal">
      <img class="service-row-img"
        src="https://images.unsplash.com/${s.image}?w=200&q=75&fit=crop"
        alt="${s.name}" loading="lazy">
      <div>
        <div class="service-row-name">${s.name}</div>
        <p class="service-row-desc">${s.description}</p>
      </div>
      <div class="service-row-price">${s.price}</div>
    </div>
  `;

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

  set('pricing-note', data.pricing_note);

  // Re-observe
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.05 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// Load Contact Page content
async function loadContact() {
  const data = await loadContent('contact');
  if (!data) return;

  set('page-title', data.page_title);
  set('intro-title', data.intro_title);

  const phoneEls = document.querySelectorAll('.site-phone');
  phoneEls.forEach(el => { el.textContent = data.phone; if(el.tagName === 'A') el.href = `tel:${data.phone.replace(/\D/g,'')}`; });

  const emailEls = document.querySelectorAll('.site-email');
  emailEls.forEach(el => { el.textContent = data.email; if(el.tagName === 'A') el.href = `mailto:${data.email}`; });

  set('phone-note', data.phone_note);
  set('email-note', data.email_note);
  set('service-area', data.service_area);
  set('service-area-note', data.service_area_note);
  set('walkins-note', data.walkins_note);

  const igEls = document.querySelectorAll('.site-instagram');
  igEls.forEach(el => { el.textContent = data.instagram; });
}
