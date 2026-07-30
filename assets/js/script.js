// ============================================================
// Mobile nav toggle
// ============================================================
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');

burger.addEventListener('click', () => {
  const isOpen = navMobile.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', isOpen);
});

navMobile.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMobile.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ============================================================
// Scroll reveal (respects prefers-reduced-motion via CSS)
// ============================================================
const revealTargets = document.querySelectorAll(
  '.skill-card, .project-card, .timeline__item, .about__label, .about__body'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach(el => io.observe(el));

// ============================================================
// Signature element: deploy ticker
// Cycles through real project deploy lines, typewriter-style.
// ============================================================
const tickerLines = [
  '$ deploying testforge-ai → vercel ✓',
  '$ deploying dayflow → render ✓',
  '$ deploying uninest-ai → aws ec2 ✓',
  '$ lighthouse testforge-ai — 100/98/100/100 ✓',
  '$ lighthouse dayflow — 100/100 performance ✓',
  '$ build passing — ci/cd github actions ✓',
];

const tickerEl = document.getElementById('tickerLine');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lineIndex = 0;

function typeLine(text, onDone) {
  let i = 0;
  tickerEl.textContent = '';
  const interval = setInterval(() => {
    tickerEl.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      setTimeout(onDone, 1800);
    }
  }, 28);
}

function runTicker() {
  const line = tickerLines[lineIndex];
  typeLine(line, () => {
    lineIndex = (lineIndex + 1) % tickerLines.length;
    runTicker();
  });
}

if (reducedMotion) {
  tickerEl.textContent = tickerLines[0];
} else {
  runTicker();
}
