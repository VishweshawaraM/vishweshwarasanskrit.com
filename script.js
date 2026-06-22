/* ==========================================================================
   VISHWESHWARA SANSKRIT — Interactive Engine
   Particles • Scroll Reveal • Nav Shrink • Multi-Step Form • Upload
   ========================================================================== */

'use strict';

/* ──────────────────────────────────────────────────────────────────────────
   1. PARTICLE CANVAS — Gold Cosmic Field
   ────────────────────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomRange(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x     = randomRange(0, W);
      this.y     = randomRange(0, H);
      this.r     = randomRange(0.4, 1.6);
      this.vx    = randomRange(-0.12, 0.12);
      this.vy    = randomRange(-0.15, -0.04);
      this.alpha = randomRange(0.1, 0.7);
      this.da    = randomRange(-0.003, 0.003);
      const goldens = ['212,175,55', '197,160,40', '240,208,96', '180,140,30'];
      this.color = goldens[Math.floor(Math.random() * goldens.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += this.da;
      if (this.alpha <= 0 || this.alpha >= 0.9) this.da *= -1;
      if (this.y < -4 || this.x < -4 || this.x > W + 4) this.reset();
    }
    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticlePool() {
    particles = [];
    const count = Math.min(Math.floor(W * H / 5000), 180);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    // Subtle radial gold mist at center
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.min(W, H) * 0.55);
    grad.addColorStop(0,   'rgba(212,175,55,0.04)');
    grad.addColorStop(0.5, 'rgba(212,175,55,0.01)');
    grad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initParticlePool(); });
  resize();
  initParticlePool();
  draw();
})();

/* ──────────────────────────────────────────────────────────────────────────
   2. NAVIGATION — Shrink on scroll + Mobile menu
   ────────────────────────────────────────────────────────────────────────── */
(function initNav() {
  const nav        = document.getElementById('main-nav');
  const hamburger  = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else                      nav.classList.remove('scrolled');
  }, { passive: true });

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }
})();

/* ──────────────────────────────────────────────────────────────────────────
   3. SCROLL REVEAL — IntersectionObserver
   ────────────────────────────────────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ──────────────────────────────────────────────────────────────────────────
   4. CERTIFICATE LIGHTBOX
   ────────────────────────────────────────────────────────────────────────── */
(function initLightbox() {
  const trigger  = document.getElementById('cert-trigger');
  const lightbox = document.getElementById('cert-lightbox');
  const closer   = document.getElementById('cert-close');

  if (!trigger || !lightbox) return;

  trigger.addEventListener('click', () => {
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const close = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  closer && closer.addEventListener('click', close);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ──────────────────────────────────────────────────────────────────────────
   5. ADHIKARI-PARIKSHA — 4-Step Multi-Step Form
   ────────────────────────────────────────────────────────────────────────── */
(function initPariksha() {
  let currentStep = 1;
  const TOTAL = 4;
  const answers = {};

  const steps     = document.querySelectorAll('.pariksha-step');
  const dots      = document.querySelectorAll('.p-step-dot');
  const lines     = document.querySelectorAll('.p-step-line');
  const nextBtns  = document.querySelectorAll('.pariksha-next');
  const backBtns  = document.querySelectorAll('.pariksha-back');
  const submitBtn = document.getElementById('pariksha-submit');
  const resultWrap = document.getElementById('pariksha-result');
  const formWrap  = document.getElementById('pariksha-form-wrap');

  if (!steps.length) return;

  function showStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    const target = document.getElementById(`step-${n}`);
    if (target) target.classList.add('active');

    dots.forEach((d, i) => {
      d.classList.remove('active', 'done');
      if (i + 1 < n) d.classList.add('done');
      else if (i + 1 === n) d.classList.add('active');
    });
    lines.forEach((l, i) => {
      l.classList.remove('done');
      if (i + 1 < n) l.classList.add('done');
    });
  }

  function collectStep(n) {
    const step = document.getElementById(`step-${n}`);
    if (!step) return;
    step.querySelectorAll('input, select, textarea').forEach(el => {
      if (el.name) answers[el.name] = el.value;
    });
    step.querySelectorAll('.choice-btn.selected').forEach(btn => {
      const key = btn.closest('.choice-grid')?.dataset.key;
      if (key) answers[key] = btn.dataset.value;
    });
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      collectStep(currentStep);
      if (currentStep < TOTAL) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  // Choice button toggle
  document.querySelectorAll('.choice-grid').forEach(grid => {
    grid.querySelectorAll('.choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  });

  // Build WhatsApp message from answers
  function buildWhatsAppMsg() {
    const lines = [
      `🙏 *Adhikari-Pariksha — Consultation Request*`,
      ``,
      `*Name:* ${answers.name || '—'}`,
      `*Age:* ${answers.age || '—'}`,
      `*Location:* ${answers.location || '—'}`,
      `*Language Background:* ${answers.language || '—'}`,
      ``,
      `*Learning Intent:* ${answers.intent || '—'}`,
      `*Prior Knowledge:* ${answers.prior || '—'}`,
      ``,
      `*Dedication (hrs/week):* ${answers.dedication || '—'}`,
      `*Learning Pace:* ${answers.pace || '—'}`,
      ``,
      `*Personal Note:* ${answers.note || '—'}`,
      ``,
      `Sent via vishweshwarasanskrit.com`
    ];
    return encodeURIComponent(lines.join('\n'));
  }

  function buildEmailBody() {
    return `Subject: Consultation Request — Adhikari-Pariksha\n\n` +
      `Name: ${answers.name || '—'}\n` +
      `Age: ${answers.age || '—'}\n` +
      `Location: ${answers.location || '—'}\n` +
      `Language: ${answers.language || '—'}\n\n` +
      `Intent: ${answers.intent || '—'}\n` +
      `Prior Knowledge: ${answers.prior || '—'}\n\n` +
      `Dedication: ${answers.dedication || '—'}\n` +
      `Pace: ${answers.pace || '—'}\n\n` +
      `Note: ${answers.note || '—'}`;
  }

  function renderResult() {
    const intentLabels = {
      spiritual: 'Spiritual Awakening & Philosophy',
      academic:  'Academic Excellence & CBSE',
      cultural:  'Cultural Heritage & Roots',
      research:  'Scriptural Research & Scholarship'
    };
    const paceLabels = {
      accelerated: 'Accelerated — Intensive immersion',
      balanced:    'Balanced — 3–4 sessions/week',
      reflective:  'Reflective — Traditional gradual pace'
    };

    const intentKey = answers.intent || 'spiritual';
    const paceKey   = answers.pace   || 'balanced';

    const resultEl = document.getElementById('result-summary');
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="result-journey-visual">
          <div class="section-label" style="justify-content:flex-start"><span>Your Personalized Path</span></div>
          <h3 class="t-title" style="margin-bottom:8px;color:var(--gold-pure)">${answers.name ? answers.name + '\'s' : 'Your'} Gurukula Journey</h3>
          <p class="t-body" style="color:var(--text-secondary);margin-bottom:20px">
            Based on your responses, Vishweshwara will design a customized curriculum for you.
          </p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px">
            <div class="cert-detail-item"><div class="d-label">Primary Focus</div><div class="d-value">${intentLabels[intentKey] || intentKey}</div></div>
            <div class="cert-detail-item"><div class="d-label">Learning Pace</div><div class="d-value">${paceLabels[paceKey] || paceKey}</div></div>
            <div class="cert-detail-item"><div class="d-label">Location</div><div class="d-value">${answers.location || '—'}</div></div>
            <div class="cert-detail-item"><div class="d-label">Commitment</div><div class="d-value">${answers.dedication || '—'} hrs/week</div></div>
          </div>
          <p class="t-body" style="color:var(--text-muted);font-size:0.85rem">
            🙏 Vishweshwara will review your profile personally and reach out within 24 hours to schedule your first consultation.
          </p>
        </div>`;
    }

    // Set link hrefs
    const waLink = document.getElementById('result-wa');
    const emLink = document.getElementById('result-email');
    if (waLink) waLink.href = `https://wa.me/919482698612?text=${buildWhatsAppMsg()}`;
    if (emLink) emLink.href = `mailto:visanskrit.solopreneur@gmail.com?body=${encodeURIComponent(buildEmailBody())}`;
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      collectStep(TOTAL);
      renderResult();
      if (formWrap)  formWrap.style.display = 'none';
      if (resultWrap) {
        resultWrap.style.display = 'block';
        resultWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  showStep(1);
})();

/* ──────────────────────────────────────────────────────────────────────────
   6. SCREENSHOT UPLOAD — Drag & Drop + Click
   ────────────────────────────────────────────────────────────────────────── */
(function initUpload() {
  const zone     = document.getElementById('upload-zone');
  const input    = document.getElementById('upload-input');
  const confirm  = document.getElementById('upload-confirm');
  const filename = document.getElementById('upload-filename');

  if (!zone) return;

  zone.addEventListener('click', () => input && input.click());

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  input && input.addEventListener('change', () => handleFile(input.files[0]));

  function handleFile(file) {
    if (!file) return;
    zone.style.display    = 'none';
    if (confirm)  confirm.classList.add('show');
    if (filename) filename.textContent = file.name;
  }
})();

/* ──────────────────────────────────────────────────────────────────────────
   7. COPY UPI ID
   ────────────────────────────────────────────────────────────────────────── */
(function initCopyUPI() {
  const btn = document.getElementById('copy-upi');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const upi = document.getElementById('upi-text');
    if (upi) {
      navigator.clipboard.writeText(upi.textContent).then(() => {
        btn.textContent = 'Copied ✓';
        btn.style.color = 'var(--gold-pure)';
        setTimeout(() => { btn.textContent = 'Copy'; btn.style.color = ''; }, 2000);
      });
    }
  });
})();

/* ──────────────────────────────────────────────────────────────────────────
   8. FAQ ACCORDION
   ────────────────────────────────────────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        const ia = i.querySelector('.faq-a');
        if (ia) ia.style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
})();

/* ──────────────────────────────────────────────────────────────────────────
   9. COUNTER ANIMATION — Hero stats
   ────────────────────────────────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el  = e.target;
      const end = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let start = 0, duration = 1800;
      const step = (ts) => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * end) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
})();

/* ──────────────────────────────────────────────────────────────────────────
   10. ACTIVE NAV HIGHLIGHT — Highlight nav link based on scroll position
   ────────────────────────────────────────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
  }, { passive: true });
})();
