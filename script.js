/* ============================================================
   chiragvasava.me — main script
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. THEME TOGGLE ─────────────────────────────────────── */
  const THEME_KEY = 'cv-theme';
  const root = document.documentElement;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  root.setAttribute('data-theme', savedTheme);

  function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
  }

  const themeBtn       = document.getElementById('theme-toggle');
  const themeBtnMobile = document.getElementById('theme-toggle-mobile');
  if (themeBtn)       themeBtn.addEventListener('click', toggleTheme);
  if (themeBtnMobile) themeBtnMobile.addEventListener('click', toggleTheme);


  /* ── 2. MOBILE NAV ───────────────────────────────────────── */
  const burger    = document.getElementById('burger');
  const navMobile = document.getElementById('navMobile');

  if (burger && navMobile) {
    burger.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      navMobile.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        navMobile.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }


  /* ── 3. NAVBAR SCROLL BEHAVIOUR ─────────────────────────── */
  const nav = document.getElementById('nav');
  let lastScrollY = 0;
  let ticking = false;

  function handleNavScroll() {
    const y = window.scrollY;
    if (nav) {
      // Add "scrolled" shadow once past 60px
      nav.classList.toggle('scrolled', y > 60);
      // Hide nav on scroll-down (past 200px), reveal on scroll-up
      if (y > lastScrollY && y > 200) {
        nav.classList.add('hidden');
      } else {
        nav.classList.remove('hidden');
      }
    }
    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  }, { passive: true });


  /* ── 4. SCROLLSPY — active nav link ─────────────────────── */
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const navLinks  = document.querySelectorAll('.nav__link');

  const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-60px 0px -40% 0px' });

  sections.forEach(s => spyObserver.observe(s));


  /* ── 5. SCROLL REVEAL ANIMATION ─────────────────────────── */
  const revealClasses = ['.reveal-fade', '.reveal-up', '.reveal-left', '.reveal-right'];
  const revealEls = document.querySelectorAll(revealClasses.join(', '));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // Immediately reveal hero elements (already in viewport)
  document.querySelectorAll('.hero .reveal-fade, .hero .reveal-up').forEach(el => {
    el.classList.add('visible');
  });


  /* ── 6. DEPLOY TICKER (typewriter) ──────────────────────── */
  const tickerLines = [
    '$ deploying testforge-ai → vercel ✓',
    '$ lighthouse testforge-ai 100/98/100/100 ✓',
    '$ deploying dayflow → render ✓',
    '$ lighthouse dayflow — 100/100 performance ✓',
    '$ deploying uninest-ai → aws ec2 ✓',
    '$ build passing — ci/cd github actions ✓',
    '$ deploying playloud → vercel ✓',
  ];

  const tickerEl = document.getElementById('tickerLine');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (tickerEl) {
    if (reducedMotion) {
      tickerEl.textContent = tickerLines[0];
    } else {
      let lineIndex = 0;

      function typeLine(text, onDone) {
        let i = 0;
        tickerEl.textContent = '';
        const interval = setInterval(() => {
          tickerEl.textContent += text[i++];
          if (i >= text.length) {
            clearInterval(interval);
            setTimeout(onDone, 2000);
          }
        }, 30);
      }

      function eraseLine(onDone) {
        const interval = setInterval(() => {
          const t = tickerEl.textContent;
          if (t.length === 0) { clearInterval(interval); onDone(); return; }
          tickerEl.textContent = t.slice(0, -1);
        }, 18);
      }

      function runTicker() {
        typeLine(tickerLines[lineIndex], () => {
          eraseLine(() => {
            lineIndex = (lineIndex + 1) % tickerLines.length;
            runTicker();
          });
        });
      }

      runTicker();
    }
  }


  /* ── 7. BACK TO TOP ─────────────────────────────────────── */
  const btt = document.getElementById('backToTop');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ── 8. SMOOTH SCROLL for anchor links ───────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ── 9. PROJECT CARD hover tilt (subtle) ─────────────────── */
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rx = ((y - cy) / cy) * 3;
      const ry = ((x - cx) / cx) * -3;
      card.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      card.style.transformStyle = 'preserve-3d';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ── 10. KEYBOARD NAVIGATION ────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (navMobile && navMobile.classList.contains('open')) {
        navMobile.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }
  });

})();
