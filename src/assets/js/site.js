/* Eighteen Islands — core interactions (deferred, no dependencies) */
(() => {
  const d = document, root = d.documentElement;
  root.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Header: solid after scroll, hide on scroll down, show on scroll up */
  const hdr = d.querySelector('.hdr');
  let lastY = scrollY;
  const onHeader = () => {
    const y = scrollY;
    hdr.classList.toggle('is-solid', y > 40 || d.body.classList.contains('menu-open') || !!d.querySelector('.mega.is-open'));
    if (!d.body.classList.contains('menu-open') && !d.querySelector('.mega.is-open')) hdr.classList.toggle('is-hidden', y > 400 && y > lastY + 4);
    if (y < lastY - 4) hdr.classList.remove('is-hidden');
    lastY = y;
  };

  /* Mega menu (Islands) */
  const megaBtn = d.querySelector('[data-mega]');
  const mega = d.getElementById('mega');
  const setMega = (open) => {
    if (!mega) return;
    mega.classList.toggle('is-open', open);
    megaBtn.setAttribute('aria-expanded', open);
    onHeader();
  };
  if (megaBtn && mega) {
    megaBtn.addEventListener('click', () => setMega(megaBtn.getAttribute('aria-expanded') !== 'true'));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && mega.classList.contains('is-open')) { setMega(false); megaBtn.focus(); } });
    d.addEventListener('click', e => { if (mega.classList.contains('is-open') && !mega.contains(e.target) && !megaBtn.contains(e.target)) setMega(false); });
    mega.addEventListener('focusout', e => { if (!mega.contains(e.relatedTarget) && e.relatedTarget !== megaBtn) setMega(false); });
  }

  /* Mobile menu */
  const burger = d.querySelector('.hdr__burger');
  const mnav = d.getElementById('mnav');
  if (burger && mnav) {
    const set = (open) => {
      burger.setAttribute('aria-expanded', open);
      mnav.classList.toggle('is-open', open);
      d.body.classList.toggle('menu-open', open);
      mnav.inert = !open;
      if (open) mnav.querySelector('a')?.focus();
      onHeader();
    };
    mnav.inert = true;
    burger.addEventListener('click', () => set(burger.getAttribute('aria-expanded') !== 'true'));
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('is-open')) { set(false); burger.focus(); } });
  }

  /* Reveal on scroll */
  const rvs = d.querySelectorAll('.rv,.rv-img');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .08 });
    rvs.forEach(el => io.observe(el));
  } else rvs.forEach(el => el.classList.add('in'));

  /* Scroll-linked effects: hero fog lift, word reveal, cliffs frame, parallax, day timeline */
  const hero = d.querySelector('.hero--home');
  const statements = [...d.querySelectorAll('.statement[data-reveal]')];
  const cliffs = d.querySelector('.cliffs');
  const phero = d.querySelector('.phero .media img');
  const tl = d.querySelector('[data-timeline]');
  const tlItems = tl ? [...tl.querySelectorAll('li')] : [];
  const clock = d.querySelector('[data-clock]');
  const sunDot = d.querySelector('[data-sun]');
  const vh = () => innerHeight;
  let ticking = false;
  const frame = () => {
    ticking = false;
    onHeader();
    if (reduce) return;
    const h = vh();
    if (hero) hero.style.setProperty('--lift', Math.min(1, scrollY / h).toFixed(3));
    for (const s of statements) {
      const r = s.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (h * .9 - r.top) / (r.height + h * .45)));
      s.style.setProperty('--p', p.toFixed(3));
    }
    if (cliffs) {
      const r = cliffs.getBoundingClientRect();
      const e = Math.min(1, Math.max(0, -r.top / (r.height - h) * 1.25));
      cliffs.style.setProperty('--e', e.toFixed(3));
      cliffs.style.setProperty('--e-inv', (1 - e).toFixed(3));
    }
    if (phero && scrollY < h * 1.2) phero.style.setProperty('--py', (scrollY * .22).toFixed(1));
    if (tl) {
      let on = 0;
      tlItems.forEach((li, i) => { if (li.getBoundingClientRect().top < h * .55) on = i; });
      tlItems.forEach((li, i) => li.classList.toggle('is-on', i === on));
      const t = tlItems[on]?.dataset;
      if (t && clock && clock.textContent !== t.time) clock.textContent = t.time;
      if (t && sunDot) {
        const f = +t.frac; // 0..1 across daylight
        const a = Math.PI * (1 - Math.min(1, Math.max(0, f)));
        sunDot.setAttribute('cx', (200 + 180 * Math.cos(a)).toFixed(1));
        sunDot.setAttribute('cy', (200 - 180 * Math.sin(a) * (f < 0 || f > 1 ? 0 : 1)).toFixed(1));
      }
    }
  };
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();

  /* Expanding journey slices */
  d.querySelectorAll('[data-slices]').forEach(group => {
    const slices = [...group.querySelectorAll('.slice')];
    slices.forEach(s => {
      const b = s.querySelector('.slice__btn');
      b.addEventListener('click', () => {
        slices.forEach(o => { o.classList.toggle('is-open', o === s); o.querySelector('.slice__btn').setAttribute('aria-expanded', o === s); });
      });
    });
  });

  /* Filters (walk guide, journal) */
  d.querySelectorAll('[data-filter-group]').forEach(g => {
    const target = d.querySelector(g.dataset.filterGroup);
    const btns = [...g.querySelectorAll('button')];
    btns.forEach(b => b.addEventListener('click', () => {
      btns.forEach(x => x.setAttribute('aria-pressed', x === b));
      const f = b.dataset.f;
      let n = 0;
      target.querySelectorAll('[data-tags]').forEach(el => {
        const show = f === 'all' || el.dataset.tags.split(' ').includes(f);
        el.hidden = !show; if (show) n++;
      });
      const live = d.querySelector(g.dataset.live);
      if (live) live.textContent = live.dataset.tpl.replace('{n}', n);
    }));
  });

  /* Enquiry form (progressive enhancement: posts as JSON, falls back to normal POST) */
  const form = d.querySelector('form[data-enquiry]');
  if (form) {
    const status = d.getElementById('form-status');
    const validate = () => {
      let ok = true, first = null;
      form.querySelectorAll('[data-req]').forEach(f => {
        const el = f.querySelector('input,select,textarea');
        let bad = false;
        if (el.type === 'checkbox') bad = !el.checked;
        else if (el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim());
        else bad = !el.value.trim();
        f.classList.toggle('is-bad', bad);
        el.setAttribute('aria-invalid', bad);
        if (bad && !first) first = el;
        ok = ok && !bad;
      });
      if (first) first.focus();
      return ok;
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validate()) return;
      const btn = form.querySelector('[type=submit]');
      btn.disabled = true;
      const data = Object.fromEntries(new FormData(form).entries());
      try {
        const res = await fetch(form.dataset.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
        location.href = form.dataset.thanks;
      } catch (err) {
        status.textContent = status.dataset.error;
        status.classList.add('is-on');
        status.focus();
        btn.disabled = false;
      }
    });
  }
})();
