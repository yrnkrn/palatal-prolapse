(() => {
  'use strict';
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const nav = $('#topNav');
  const menu = $('#menuToggle');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
    });
    $$('#topNav a').forEach((link) => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menu.setAttribute('aria-expanded', 'false');
    }));
  }
  const search = $('#refSearch');
  const items = $$('.reference-item');
  const filters = $$('.filter-button');
  let currentFilter = 'all';
  function renderReferences() {
    const q = (search?.value || '').trim().toLocaleLowerCase();
    let shown = 0;
    for (const item of items) {
      const match = (currentFilter === 'all' || item.dataset.type === currentFilter) && (!q || item.dataset.query.includes(q));
      item.hidden = !match;
      if (match) shown++;
    }
    const empty = $('#noRefs');
    if (empty) empty.hidden = shown !== 0;
  }
  search?.addEventListener('input', renderReferences);
  filters.forEach(btn => btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filters.forEach(b => {
      const selected = b === btn;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    renderReferences();
  }));
  // Update the reading indicator. No external scripts, cookies or analytics.
  const progress = $('#readingProgress');
  let ticking = false;
  function updateProgress() {
    const range = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (range > 0 ? Math.max(0,Math.min(100,100*window.scrollY/range)) : 0) + '%';
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateProgress); ticking = true; }
  }, {passive:true});
  updateProgress();
  const sections = $$('main section[id]');
  const navLinks = $$('.side-sticky>a, .top-nav>a');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio-a.intersectionRatio);
      if (!visible.length) return;
      const id = visible[0].target.id;
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
      });
    }, {rootMargin:'-15% 0px -60% 0px', threshold:[0,.15,.3,.5]});
    sections.forEach(section => observer.observe(section));
  }
})();
