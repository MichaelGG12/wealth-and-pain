/* ===========================
   WEALTH AND PAIN — JS
   =========================== */

'use strict';

// ── Init App ──
document.addEventListener('componentsLoaded', () => {
  initNavbar();
  initMobileMenu();
  initActiveNav();
  initScrollAnimations();
  initCounters();
  initParticles();
  initFAQ();
  initGameFilter();
  initSearch();
  initSmoothScroll();
  initLightbox();
  initTrailer();
  initCursorGlow();
  initCopyEmail();
});

// ── Navbar scroll ──
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile menu ──
function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      toggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ── Active nav link ──
function initActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href') || '';

    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Scroll-triggered animations ──
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.fade-up, .fade-in').forEach(el => observer.observe(el));
};

// ── Animated counters ──
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function animateCounter(el) {
    const target    = parseFloat(el.dataset.count);
    const suffix    = el.dataset.suffix || '';
    const prefix    = el.dataset.prefix || '';
    const decimals  = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
    const duration  = 2000;
    const start     = performance.now();

    const update = (now) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const value   = easeOut(elapsed) * target;
      el.textContent = prefix + value.toFixed(decimals) + suffix;
      if (elapsed < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
};

// ── Particle system ──
function initParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const count = window.innerWidth < 768 ? 30 : 60;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      size: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      hue: Math.random() > 0.5 ? 190 : 260
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: count }, createParticle);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < -5) { particles[i] = createParticle(); particles[i].y = H + 5; }
      if (p.x < -5 || p.x > W + 5) particles[i] = createParticle();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener('resize', () => { resize(); }, { passive: true });
};

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Screenshot lightbox ──
(function initLightbox() {
  const items = document.querySelectorAll('.screenshot-item');
  if (!items.length) return;
 
  // Create lightbox
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = `
    <div class="lb-overlay"></div>
    <div class="lb-content">
      <div class="lb-inner"></div>
      <button class="lb-close">✕</button>
      <button class="lb-prev">‹</button>
      <button class="lb-next">›</button>
    </div>`;
  document.body.appendChild(lb);
 
  const style = document.createElement('style');
  style.textContent = `
    #lightbox { position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center; }
    #lightbox.open { display:flex; }
    .lb-overlay { position:absolute;inset:0;background:rgba(0,0,0,0.92);backdrop-filter:blur(10px); }
    .lb-content { position:relative;z-index:1;display:flex;align-items:center;gap:20px;padding:0 16px; }
    .lb-inner {
      border-radius:12px;overflow:hidden;
      max-width:90vw;max-height:90vh;
      background:linear-gradient(135deg,#0d1628,#1a2040);
      display:flex;align-items:center;justify-content:center;
      font-size:8rem;
      /* Sin width/height fijos: el contenedor se adapta al contenido */
    }
    .lb-inner img {
      display:block;
      /* Imagen a tamaño natural, acotada al viewport */
      max-width:min(85vw, 600px);
      max-height:85vh;
      width:auto;
      height:auto;
      /* contain muestra la imagen completa sin recortar */
      object-fit:contain;
    }
    .lb-close { position:fixed;top:20px;right:24px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
      color:#fff;width:40px;height:40px;border-radius:50%;cursor:pointer;font-size:1rem;transition:all 0.3s; }
    .lb-close:hover { background:rgba(0,212,255,0.2);border-color:#00d4ff; }
    .lb-prev,.lb-next { background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;
      width:44px;height:44px;border-radius:50%;cursor:pointer;font-size:1.4rem;transition:all 0.3s;flex-shrink:0; }
    .lb-prev:hover,.lb-next:hover { background:rgba(0,212,255,0.15);border-color:#00d4ff; }`;
  document.head.appendChild(style);
 
  let current = 0;
  const inner = lb.querySelector('.lb-inner');
 
  function show(i) {
    current = (i + items.length) % items.length;
    const item = items[current];
    const img = item.querySelector('img');
    if (img) {
      inner.innerHTML = `<img src="${img.src}" alt="">`;
    } else {
      inner.textContent = item.textContent;
    }
  }
 
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      show(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
 
  lb.querySelector('.lb-overlay').addEventListener('click', close);
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
 
  function close() {
    lb.classList.remove('open');
    document.body.style.overflow = '';
  }
 
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
})();

// ── Cursor glow ──
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;width:300px;height:300px;border-radius:50%;pointer-events:none;z-index:9998;
    background:radial-gradient(circle,rgba(0,212,255,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);transition:transform 0.15s ease;will-change:left,top;`;
  document.body.appendChild(glow);

  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
};

// ── Toast notification utility ──
window.showToast = function(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:10000;display:flex;flex-direction:column;gap:8px;';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = { info: '#00d4ff', success: '#00ff88', error: '#ff4444' };
  toast.style.cssText = `
    background:rgba(13,22,40,0.95);border:1px solid ${colors[type] || colors.info};border-radius:8px;
    padding:12px 20px;font-family:'Rajdhani',sans-serif;font-size:0.9rem;font-weight:500;
    color:#e8f0ff;backdrop-filter:blur(20px);animation:toast-in 0.3s ease;max-width:300px;
    box-shadow:0 8px 32px rgba(0,0,0,0.4);`;
  toast.textContent = msg;

  const style = document.getElementById('toast-style');
  if (!style) {
    const s = document.createElement('style');
    s.id = 'toast-style';
    s.textContent = `@keyframes toast-in{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}
      @keyframes toast-out{from{opacity:1}to{opacity:0;transform:translateX(20px)}}`;
    document.head.appendChild(s);
  }

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toast-out 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// ── Copy email utility ──
document.querySelectorAll('[data-copy-email]').forEach(el => {
  el.addEventListener('click', () => {
    const email = el.dataset.copyEmail;
    navigator.clipboard.writeText(email)
      .then(() => window.showToast('Email copied to clipboard!', 'success'))
      .catch(() => window.showToast(email, 'info'));
  });
});