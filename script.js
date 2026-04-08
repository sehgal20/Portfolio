'use strict';

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
(function setupCursor() {
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursorDot');
  if (!cursor || !cursorDot) return;

  let mx = -100, my = -100;
  let cx = -100, cy = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
  });

  // Smooth lag for outer ring
  function animateCursor() {
    cx += (mx - cx) * 0.12;
    cy += (my - cy) * 0.12;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Scale on interactive elements
  document.querySelectorAll('a, button, .skill-tag, .value-card, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '56px';
      cursor.style.height = '56px';
      cursor.style.opacity = '.6';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '36px';
      cursor.style.height = '36px';
      cursor.style.opacity = '1';
    });
  });
})();

/* ── STAR CANVAS ─────────────────────────────────────────── */
(function setupStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.005 + 0.002,
        dir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a += s.speed * s.dir;
      if (s.a > 1 || s.a < 0.1) s.dir *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  resize();
  makeStars(160);
  drawStars();
  window.addEventListener('resize', () => { resize(); makeStars(160); });
})();

/* ── TYPEWRITER ──────────────────────────────────────────── */
(function setupTypewriter() {
  const el = document.getElementById('typed');
  if (!el) return;

  const words = ['Developer', 'Designer', 'Freelancer', 'Innovator'];
  let wIdx = 0, cIdx = 0, del = false;

  function type() {
    const word = words[wIdx];
    el.textContent = word.slice(0, cIdx);

    if (!del && cIdx === word.length) {
      del = true;
      setTimeout(type, 1600);
      return;
    }
    if (del && cIdx === 0) {
      del = false;
      wIdx = (wIdx + 1) % words.length;
      setTimeout(type, 400);
      return;
    }
    cIdx += del ? -1 : 1;
    setTimeout(type, del ? 45 : 90);
  }
  type();
})();

/* ── SCROLL REVEAL ───────────────────────────────────────── */
(function setupReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

/* ── NAV SCROLL STATE ────────────────────────────────────── */
(function setupNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const tick = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ── ACTIVE NAV HIGHLIGHT ────────────────────────────────── */
(function setupActiveLinks() {
  const sections = [...document.querySelectorAll('section[id]')];
  const links = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.style.color = '');
      const active = links.find(l => l.getAttribute('href') === '#' + e.target.id);
      if (active) active.style.color = 'var(--accent)';
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sections.forEach(s => io.observe(s));
})();

/* ── MOBILE DRAWER ───────────────────────────────────────── */
(function setupDrawer() {
  const btn = document.getElementById('hamburger');
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const closeBtn = document.getElementById('drawerClose');
  if (!btn || !drawer) return;

  const open = () => { drawer.classList.add('open'); overlay.classList.add('visible'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('visible'); document.body.style.overflow = ''; };

  btn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.querySelectorAll('[data-close]').forEach(a => a.addEventListener('click', close));
})();

/* ── SMOOTH SCROLL ───────────────────────────────────────── */
(function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ── COUNTER ANIMATION ───────────────────────────────────── */
(function setupCounters() {
  const counters = document.querySelectorAll('.stat-n[data-target]');
  if (!counters.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const target = parseInt(e.target.dataset.target, 10);
      const duration = 1600;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
        e.target.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
})();

/* ── CONTACT FORM ────────────────────────────────────────── */


document.querySelector("form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const status = form.querySelector(".form-status");
  const btn = form.querySelector("button");

  const name = form.querySelector('input[name="name"]').value.trim();
  const subject = form.querySelector('input[name="subject"]');
  const fromName = form.querySelector('input[name="from_name"]');

  if (subject) {
    subject.value = `${name || "Someone"} sent you a message 🚀`;
  }

  if (fromName) {
    fromName.value = name || "Portfolio User";
  }

  btn.textContent = "Sending...";
  btn.disabled = true;

  const data = new FormData(form);

  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: data
    });

    const result = await res.json();

    if (result.success) {
      status.textContent = "Message sent successfully 🚀";
      status.style.color = "var(--accent)";
      form.reset();
    } else {
      status.textContent = "Something went wrong ❌";
      status.style.color = "#f87171";
    }
  } catch (error) {
    status.textContent = "Something went wrong ❌";
    status.style.color = "#f87171";
  }

  btn.textContent = "Send Message";
  btn.disabled = false;
});
window.handleSubmit = handleSubmit;