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
    const img = document.getElementById('aboutImg');
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
    document.querySelectorAll('.site-instagram-link').forEach(el => {
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
    const bg = document.getElementById('ctaBg');
    if (bg) bg.src = data.cta_image;
  }

  // Services preview grid
  if (data.services_preview) {
    const grid = document.getElementById('services-grid');
    if (grid) {
      grid.innerHTML = data.services_preview.map(s => {
        const imgSrc = resolveImage(s, 600, 400);
        return `
          <div class="service-card-v2 reveal">
            ${imgSrc ? `<img class="service-card-img" src="${imgSrc}" alt="${s.name}" loading="lazy">` : ''}
            <div class="service-num">${s.num}</div>
            <div class="service-name-v2">${s.name}</div>
            <p class="service-desc-v2">${s.description}</p>
          </div>
        `;
      }).join('');

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
      }, { threshold: 0.05 });
      grid.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    }
  }
}

// ── SERVICES PAGE ──────────────────────────────────────
async function loadServices() {
  const data = await loadContent('services');
  if (!data) return;

  set('page-title', data.page_title);

  const buildRow = (s) => {
    const imgSrc = resolveImage(s, 200, 200);
    return `
      <div class="service-row-v2 reveal">
        ${imgSrc ? `<img class="service-row-img" src="${imgSrc}" alt="${s.name}" loading="lazy">` : ''}
        <div>
          <div class="service-row-name">${s.name}</div>
          <p class="service-row-desc">${s.description}</p>
        </div>
        <div class="service-row-price">${s.price}</div>
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

  set('pricing-note', data.pricing_note);

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
