// Page renderers. Each returns { title, description, body, image, preloadImage, ... }.
// C = context: { lang, slug, ui, pages, places, tools, legal, alts, langNames }
import config from '../config.mjs';
import { esc, md, paras, href, locPrefix, img, btn, tlink, icon, basalt, fogbank, words, sunTimes, manifest, abs } from './lib.mjs';
import { REGIONS, regionById } from '../data/regions.mjs';
import { CLIMATE } from '../data/climate.mjs';
import { WALKS } from '../data/walks.mjs';
import { NODES, EDGES } from '../data/transport.mjs';
import { addressLines } from './layout.mjs';

const loc = (C, arr) => [].concat(arr).map(x => String(x).replace(/\]\(\//g, `](${locPrefix(C.lang)}/`));
const alt = (C, file) => C.alts[file] ?? '';
const pic = (C, file, o = {}) => img(file, { alt: o.alt ?? alt(C, file), ...o });
const sec = (label) => `<p class="eyebrow">${esc(label)}</p>`;
const sh = (eyebrow, title, link) => `<div class="sh rv">${sec(eyebrow)}<h2 class="sh__title">${md(title)}</h2>${link ? `<div class="sh__link">${link}</div>` : ''}</div>`;
const statement = (text, cls = '') => `<p class="statement ${cls}" data-reveal style="--n:1.25">${words(text)}</p>`;
const fmt = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] ?? m));
const hhmm = (mins) => { const m = ((Math.round(mins) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
// Faroe local time: UTC+0 in winter, UTC+1 in summer time (last Sun Mar → last Sun Oct)
const lastSunday = (y, m) => { const d = new Date(Date.UTC(y, m + 1, 0)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d; };
const tzOffset = (date) => { const y = date.getUTCFullYear(); return date >= lastSunday(y, 2) && date < lastSunday(y, 9) ? 60 : 0; };
export const monthSun = (m) => { const d = new Date(Date.UTC(2026, m, 15)); const s = sunTimes(d); const o = tzOffset(d); return { rise: hhmm(s.rise + o), set: hhmm(s.set + o), hours: s.daylight }; };

const walkName = (C, id) => C.tools.walks[id]?.name || id;
const placeHref = (C, id) => href(C.lang, regionById[id].slug);

// ---------- shared blocks ----------
const monthsStrip = (C, opts = {}) => {
  const T = C.tools;
  const maxH = 22;
  return `<div class="months" role="table" aria-label="${esc(T.monthsAria)}">
  ${CLIMATE.map((m, i) => {
    const s = monthSun(i);
    const chips = m.seasons.map(k => `<span class="chip ${k === 'puffins' || k === 'olavsoka' ? 'chip--dot' : ''}">${esc(T.seasons[k].short)}</span>`).join('');
    return `<div role="row"><span class="m" role="rowheader">${esc(C.ui.monthsShort[i])}</span>
      <div class="bar" role="cell" aria-label="${esc(fmt(T.daylightAria, { h: s.hours.toFixed(1) }))}"><i style="height:${Math.max(6, s.hours / maxH * 100).toFixed(1)}%"></i></div>
      <span class="v" role="cell"><b>${s.hours.toFixed(1).replace('.', T.decimal)} h</b><br>${s.rise}–${s.set}</span>
      <span class="v" role="cell">${String(m.temp).replace('.', T.decimal)}°C · ${esc(fmt(T.rainDays, { n: m.rain }))}</span>
      <span class="v" role="cell">${esc(T.windLevels[m.wind])}<br>${esc(T.fogLevels[m.fog])}</span>
      <span class="chips" role="cell">${chips}</span></div>`;
  }).join('')}
  </div>`;
};

const transitMap = (C, id = 'tmap') => {
  const lines = EDGES.map(e => {
    const a = NODES[e.from], b = NODES[e.to];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const bend = e.mode === 'heli' ? -40 : e.mode === 'ferry' || e.mode === 'boat' ? 18 : 0;
    const d = bend ? `M${a.x} ${a.y} Q${mx + bend} ${my - bend} ${b.x} ${b.y}` : `M${a.x} ${a.y} L${b.x} ${b.y}`;
    const cls = e.mode === 'boat' ? 'ferry' : e.mode;
    return `<path class="ln ln--${cls}" data-e="${e.id}" d="${d}"/>`;
  }).join('');
  const nodes = Object.entries(NODES).map(([k, n]) => `<g class="nd" data-n="${k}"><circle cx="${n.x}" cy="${n.y}" r="${n.major ? 6 : 4.5}"/><text x="${n.x + (n.lx ?? 10)}" y="${n.y + (n.ly ?? 4)}"${n.anchor ? ` text-anchor="${n.anchor}"` : ''}>${esc(n.name)}</text></g>`).join('');
  return `<svg class="tmap" id="${id}" viewBox="0 0 760 900" role="img" aria-label="${esc(C.tools.transport.mapAria)}">${lines}${nodes}</svg>`;
};
const mapKey = (C) => {
  const k = C.tools.transport.modes;
  return `<div class="key"><span><i style="border-color:var(--wool)"></i>${esc(k.tunnel)}</span><span><i style="border-color:var(--fogDeep)"></i>${esc(k.road)}</span><span><i style="border-top-style:dashed;border-color:var(--fog)"></i>${esc(k.ferry)}</span><span><i style="border-top-style:dotted;border-color:var(--puffin)"></i>${esc(k.heli)}</span></div>`;
};

const walkTags = (C, w) => {
  const T = C.tools.access;
  const tags = [];
  if (w.guide === 'required') tags.push(`<span class="chip chip--hot">${esc(T.tags.guide)}</span>`);
  if (w.guide === 'seasonal') tags.push(`<span class="chip chip--ok">${esc(T.tags.guideSeasonal)}</span>`);
  if (w.farmland) tags.push(`<span class="chip">${esc(T.tags.farmland)}</span>`);
  if (w.fee != null) tags.push(`<span class="chip">${esc(fmt(T.tags.fee, { amount: w.fee }))}</span>`);
  if (w.fee == null && !w.farmland) tags.push(`<span class="chip">${esc(T.tags.free)}</span>`);
  if (w.nesting) tags.push(`<span class="chip chip--dot">${esc(T.tags.nesting)}</span>`);
  if (w.exposure === 'high') tags.push(`<span class="chip">${esc(T.tags.exposed)}</span>`);
  return tags.join('');
};

const walkRow = (C, w) => {
  const T = C.tools.access, L = C.tools.walks[w.id];
  const feeTxt = w.fee != null ? fmt(T.feeFrom, { amount: w.fee }) : (w.farmland ? T.feeUnknown : T.feeNone);
  const tags = [w.region, w.guide === 'required' ? 'guide' : '', w.fee != null ? 'fee' : 'nofee', w.exposure === 'high' ? 'exposed' : ''].filter(Boolean).join(' ');
  return `<article class="walk" id="walk-${w.id}" data-tags="${tags}">
    <div>
      <p class="mono" style="opacity:.7">${esc(C.places[w.region].name)}</p>
      <h3>${esc(L.name)}</h3>
      <p class="small muted">${esc(L.summary)}</p>
      <div class="walk__tags">${walkTags(C, w)}</div>
    </div>
    <dl>
      <div><dt>${esc(T.cols.length)}</dt><dd>${esc(L.length)}</dd></div>
      <div><dt>${esc(T.cols.farmland)}</dt><dd>${esc(w.farmland ? T.yes : T.no)}${L.farmland ? ` — ${esc(L.farmland)}` : ''}</dd></div>
      <div><dt>${esc(T.cols.fee)}</dt><dd>${esc(feeTxt)}</dd></div>
      <div><dt>${esc(T.cols.pay)}</dt><dd>${md(L.pay)}</dd></div>
      <div><dt>${esc(T.cols.guide)}</dt><dd>${md(L.guide)}</dd></div>
      <div><dt>${esc(T.cols.rules)}</dt><dd>${md(L.rules)}</dd></div>
    </dl>
  </article>`;
};

// ---------- HOME ----------
export const home = (C) => {
  const H = C.pages.home;
  const heroFile = 'hero-village-1.jpg';
  const tabs = H.tabs.map(t => `<a href="${placeHref(C, t.region)}"><span class="mono">${regionById[t.region].num}</span><b>${esc(C.places[t.region].name)}</b><small>${esc(t.s)}</small></a>`).join('');
  const isles = REGIONS.map((r, i) => `<a class="isle rv" href="${href(C.lang, r.slug)}">
      <div class="media media--zoom">${pic(C, r.card, { sizes: '(min-width:900px) 40vw, 50vw', maxW: 1600 })}<span class="isle__t"><span class="mono">${r.num}</span><b>${esc(C.places[r.id].name)}</b></span></div>
      <span class="isle__sub">${esc(C.places[r.id].sub)}</span></a>`).join('');
  const J = C.pages.journeys.list;
  const slices = J.map((j, i) => `<div class="slice${i === 0 ? ' is-open' : ''}">
      <div class="media">${pic(C, j.img, { alt: '', sizes: '(min-width:900px) 60vw, 100vw', maxW: 1600 })}</div>
      <button class="slice__btn" type="button" aria-expanded="${i === 0}"><span class="mono">0${i + 1}</span><b>${esc(j.title)}</b></button>
      <div class="slice__body">
        <div class="slice__facts mono"><span>${esc(fmt(C.ui.common.nights, { n: j.nights }))}</span><span>${esc(fmt(C.ui.common.spareDays, { n: j.spare }))}</span><span>${esc(j.season)}</span></div>
        <p>${esc(j.summary)}</p>
        ${btn(`${href(C.lang, 'journeys')}#${j.id}`, C.ui.common.seeJourney, 'btn--sm')}
      </div></div>`).join('');
  // day timeline on a midsummer day
  const june = sunTimes(new Date(Date.UTC(2026, 5, 21)));
  const rise = june.rise + 60, set = june.set + 60;
  const tl = H.day.items.map(it => {
    const [hh, mm] = it.time.split(':').map(Number);
    const frac = ((hh * 60 + mm) - rise) / (set - rise);
    return `<li data-time="${it.time}" data-frac="${frac.toFixed(3)}"><time>${it.time}</time><div><h4>${esc(it.t)}</h4><p>${esc(it.p)}</p>${it.flag ? `<span class="chip chip--dot flag">${esc(it.flag)}</span>` : ''}</div><div class="media">${pic(C, it.img, { sizes: '110px', maxW: 480 })}</div></li>`;
  }).join('');
  const walks = WALKS.filter(w => H.access.walks.includes(w.id));
  const faqs = C.pages.faq.groups.flatMap(g => g.items).filter(q => q.home).slice(0, 5);
  const posts = C.pages.journal.posts;
  return {
    title: H.metaTitle, description: H.metaDesc, image: heroFile, preloadImage: heroFile, preloadSizes: '100vw',
    body: `
<section class="hero hero--home" aria-label="${esc(H.heroLabel)}">
  <div class="hero__media">${pic(C, heroFile, { priority: true, sizes: '100vw' })}</div>
  ${fogbank()}
  <div class="hero__inner">
    <h1 class="giant hero__word"><span>${esc(config.brand.wordmark[0])}</span><span>${esc(config.brand.wordmark[1])}</span></h1>
    <p class="eyebrow hero__coord">${esc(H.coord)}</p>
    <div class="hero__aside">
      <p>${esc(H.intro)}</p>
      <div class="hero__btns">${btn(href(C.lang, 'weather-planner'), H.ctaPrimary)} ${btn('#islands', H.ctaSecondary, 'btn--ghost')}</div>
    </div>
  </div>
  <nav class="hero__tabs" aria-label="${esc(H.tabsLabel)}">${tabs}</nav>
</section>

<section class="sec s-dark cols-lines" aria-labelledby="idea-h">
  <div class="grid">
    <div class="c-3">${sec(H.idea.eyebrow)}<h2 id="idea-h" class="sr-only">${esc(H.idea.eyebrow)}</h2></div>
    <div class="c-9">${statement(H.idea.text)}</div>
  </div>
</section>

<section class="cliffs" aria-labelledby="cliffs-h">
  <div class="cliffs__stick">
    <div class="cliffs__frame">${pic(C, 'hero-cliffs-1.jpg', { sizes: '100vw' })}</div>
    <div class="cliffs__fogtop" aria-hidden="true"></div>
    ${fogbank()}
    <div class="cliffs__txt"><h2 id="cliffs-h" class="h1">${md(H.cliffs.title)}</h2><p>${esc(H.cliffs.text)}</p></div>
  </div>
</section>

<section class="sec s-dark" id="islands" aria-labelledby="isl-h">
  <div class="sh rv">${sec(H.islands.eyebrow)}<h2 id="isl-h" class="sh__title">${md(H.islands.title)}</h2><div class="sh__link">${tlink(href(C.lang, 'getting-around'), H.islands.link)}</div></div>
  <div class="isles">${isles}</div>
</section>

${basalt('wool')}
<section class="sec s-wool" aria-labelledby="wx-h">
  <div class="sh rv">${sec(H.weather.eyebrow)}<h2 id="wx-h" class="sh__title">${md(H.weather.title)}</h2><div class="sh__link">${tlink(href(C.lang, 'weather-planner'), H.weather.link)}</div></div>
  <div class="grid"><p class="c-6 lead rv" style="margin-bottom:40px">${md(H.weather.text)}</p></div>
  ${monthsStrip(C)}
  <p class="note mt-m">${esc(C.tools.climateNote)}</p>
</section>
${basalt('tar', true)}

<section class="sec s-dark" aria-labelledby="jr-h">
  <div class="sh rv">${sec(H.journeys.eyebrow)}<h2 id="jr-h" class="sh__title">${md(H.journeys.title)}</h2><div class="sh__link">${tlink(href(C.lang, 'journeys'), H.journeys.link)}</div></div>
  <div class="slices" data-slices>${slices}</div>
</section>

<section class="band sec" aria-labelledby="how-h">
  <div class="media">${pic(C, 'fog-hills-2.jpg', { alt: '', sizes: '100vw', maxW: 2000 })}</div>
  ${sec(H.how.eyebrow)}
  <h2 id="how-h" class="h1 mt-s" style="max-width:12ch">${md(H.how.title)}</h2>
  <div class="steps">
    <div><p>${esc(H.how.text)}</p></div>
    ${H.how.steps.map((s, i) => `<div class="rv"><span class="num">0${i + 1}</span><h3>${esc(s.t)}</h3><p>${esc(s.p)}</p></div>`).join('')}
  </div>
</section>

<section class="sec s-dark" aria-labelledby="day-h">
  <div class="day">
    <div class="day__l">
      ${sec(H.day.eyebrow)}
      <h2 id="day-h" class="h2 mt-s">${md(H.day.title)}</h2>
      <p class="muted mt-s" style="max-width:40ch">${esc(H.day.text)}</p>
      <div class="day__arc mt-m" aria-hidden="true">
        <svg viewBox="0 0 400 210"><path d="M20 200 A180 180 0 0 1 380 200" fill="none" stroke="currentColor" stroke-opacity=".35" stroke-dasharray="2 6"/><line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" stroke-opacity=".35"/><circle data-sun cx="20" cy="200" r="7" fill="var(--puffin)"/></svg>
        <p class="day__clock" data-clock>${H.day.items[0].time}</p>
        <p class="mono muted">${esc(fmt(H.day.sunNote, { rise: hhmm(rise), set: hhmm(set) }))}</p>
      </div>
    </div>
    <ol class="tl" data-timeline>${tl}</ol>
  </div>
</section>

${basalt('fog')}
<section class="sec s-fog" aria-labelledby="acc-h">
  <div class="sh rv">${sec(H.access.eyebrow)}<h2 id="acc-h" class="sh__title">${md(H.access.title)}</h2><div class="sh__link">${tlink(href(C.lang, 'hiking-access'), H.access.link)}</div></div>
  <div class="grid"><p class="c-7 lead rv" style="margin-bottom:40px">${md(H.access.text)}</p></div>
  <div class="tbl-wrap"><table class="tbl tbl--stack">
    <thead><tr><th>${esc(C.tools.access.cols.walk)}</th><th>${esc(C.tools.access.cols.island)}</th><th>${esc(C.tools.access.cols.farmland)}</th><th>${esc(C.tools.access.cols.fee)}</th><th>${esc(C.tools.access.cols.guide)}</th><th></th></tr></thead>
    <tbody>${walks.map(w => `<tr><td><b>${esc(walkName(C, w.id))}</b></td><td data-l="${esc(C.tools.access.cols.island)}">${esc(C.places[w.region].name)}</td><td data-l="${esc(C.tools.access.cols.farmland)}">${esc(w.farmland ? C.tools.access.yes : C.tools.access.no)}</td><td data-l="${esc(C.tools.access.cols.fee)}">${esc(w.fee != null ? fmt(C.tools.access.feeFrom, { amount: w.fee }) : (w.farmland ? C.tools.access.feeUnknown : C.tools.access.feeNone))}</td><td data-l="${esc(C.tools.access.cols.guide)}">${w.guide === 'required' ? `<span class="chip chip--hot">${esc(C.tools.access.tags.guide)}</span>` : w.guide === 'seasonal' ? `<span class="chip chip--hot">${esc(C.tools.access.tags.guideSeasonal)}</span>` : w.guide === 'optional' ? esc(C.tools.access.optional) : esc(C.tools.access.no)}</td><td class="r"><a class="link" href="${href(C.lang, 'hiking-access')}#walk-${w.id}">${esc(C.ui.common.details)}</a></td></tr>`).join('')}</tbody>
  </table></div>
</section>
${basalt('tar', true)}

<section class="sec s-dark" aria-labelledby="tr-h">
  <div class="sh rv">${sec(H.transport.eyebrow)}<h2 id="tr-h" class="sh__title">${md(H.transport.title)}</h2><div class="sh__link">${tlink(href(C.lang, 'getting-around'), H.transport.link)}</div></div>
  <div class="split">
    <div class="stack"><p class="lead rv">${md(H.transport.text)}</p>${mapKey(C)}
      <ul class="route mt-m">${H.transport.examples.map(x => `<li><span class="ic">${icon[x.mode]}</span><div><h4>${esc(x.t)}</h4><p>${esc(x.p)}</p></div></li>`).join('')}</ul>
      <div class="mt-m">${btn(href(C.lang, 'getting-around'), H.transport.cta)}</div>
    </div>
    <div class="rv">${transitMap(C, 'tmap-home')}</div>
  </div>
</section>

<section class="sec s-tar2" aria-labelledby="faq-h">
  <div class="split">
    <div class="stack">${sec(H.faq.eyebrow)}<h2 id="faq-h" class="h2">${md(H.faq.title)}</h2><p class="muted" style="max-width:36ch">${esc(H.faq.text)}</p>${btn(href(C.lang, 'faq'), H.faq.link, 'btn--ghost btn--sm')}</div>
    <div class="faq">${faqs.map((q, i) => `<details><summary><span class="mono">0${i + 1}</span><span>${esc(q.q)}</span><span class="pm" aria-hidden="true"></span></summary><div class="a">${paras(loc(C, q.a))}</div></details>`).join('')}</div>
  </div>
</section>

<section class="sec s-dark" aria-labelledby="jn-h">
  <div class="sh rv">${sec(H.journal.eyebrow)}<h2 id="jn-h" class="sh__title">${md(H.journal.title)}</h2><div class="sh__link">${tlink(href(C.lang, 'journal'), H.journal.link)}</div></div>
  <div class="cards cards--3">${posts.map(p => postCard(C, p)).join('')}</div>
</section>`,
  };
};

const postCard = (C, p) => `<a class="card rv" href="${href(C.lang, `journal/${p.slug}`)}">
  <div class="media media--zoom r-4x3">${pic(C, p.img, { sizes: '(min-width:1100px) 32vw, (min-width:700px) 50vw, 100vw', maxW: 1200 })}</div>
  <div class="card__meta mono"><span>${esc(p.cat)}</span><span>${esc(fmt(C.ui.common.minRead, { n: p.mins }))}</span></div>
  <h3>${esc(p.title)}</h3></a>`;

// ---------- PLACE PAGE ----------
export const place = (C, id) => {
  const r = regionById[id], P = C.places[id];
  const idx = REGIONS.indexOf(r);
  const nxt = REGIONS[(idx + 1) % REGIONS.length];
  const walks = WALKS.filter(w => r.walks.includes(w.id));
  const crumbs = `<nav class="crumbs mono" aria-label="${esc(C.ui.common.breadcrumb)}"><a href="${href(C.lang)}">${esc(C.ui.nav.home)}</a><span aria-hidden="true">/</span><a href="${href(C.lang)}#islands">${esc(C.ui.nav.islands)}</a><span aria-hidden="true">/</span><span aria-current="page">${esc(P.name)}</span></nav>`;
  return {
    title: P.metaTitle, description: P.metaDesc, image: r.hero, preloadImage: r.hero,
    jsonld: [{ '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: C.ui.nav.home, item: abs(href(C.lang)) }, { '@type': 'ListItem', position: 2, name: P.name, item: abs(href(C.lang, r.slug)) }] }, { '@type': 'TouristDestination', name: P.name, description: P.metaDesc, containedInPlace: { '@type': 'Country', name: 'Faroe Islands' } }],
    footerImage: nxt.hero,
    body: `
<section class="phero">
  <div class="media">${pic(C, r.hero, { priority: true, sizes: '100vw' })}</div>
  <div class="phero__in">${crumbs}<h1 class="giant">${esc(P.name)}</h1><p>${esc(P.intro)}</p></div>
</section>

<section class="sec s-dark">
  <div class="split">
    <div>${sec(`(01) ${C.ui.common.thePlace}`)}<dl class="facts mt-s">${P.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
    <div class="stack">${statement(P.lead)}<div class="prose muted measure">${paras(P.body)}</div></div>
  </div>
  <div class="mosaic mt-l">${r.gallery.concat([]).slice(0, 4).map((f, i) => `<div class="media rv-img">${pic(C, f, { sizes: i === 0 ? '(min-width:900px) 50vw, 100vw' : '(min-width:900px) 25vw, 50vw', maxW: i === 0 ? 2000 : 1200 })}</div>`).join('')}</div>
</section>

${basalt('wool')}
<section class="sec s-wool">
  ${sh(`(02) ${C.ui.common.whatWePlan}`, P.planTitle)}
  <ol class="hl">${P.highlights.map((h, i) => `<li class="rv"><span class="mono">0${i + 1}</span><h3>${esc(h.t)}</h3><p>${md(h.p)}</p></li>`).join('')}</ol>
  <div class="split mt-l">
    <div class="callout rv"><p class="eyebrow" style="margin-bottom:12px">(03) ${esc(C.ui.common.ifWeatherTurns)}</p><h3>${esc(P.weather.t)}</h3><div class="prose">${paras(P.weather.p)}</div></div>
    <div class="stack rv"><p class="eyebrow">(04) ${esc(C.ui.common.gettingThere)}</p><div class="prose">${paras(P.getting)}</div><p>${tlink(href(C.lang, 'getting-around') + `?from=torshavn&to=${r.node}`, C.ui.common.openTransport)}</p></div>
  </div>
</section>
${basalt('tar', true)}

<section class="sec s-dark">
  ${sh(`(05) ${C.ui.common.walksHere}`, P.walksTitle, tlink(href(C.lang, 'hiking-access'), C.ui.common.fullAccessGuide))}
  <div class="walks">${walks.map(w => walkRow(C, w)).join('')}</div>
  <div class="mt-m">${btn(href(C.lang, 'weather-planner'), C.ui.common.planAround)} ${btn(href(C.lang, 'enquire') + `?region=${id}`, C.ui.nav.enquire, 'btn--ghost')}</div>
</section>

<a class="next" href="${href(C.lang, nxt.slug)}">
  <div class="media">${pic(C, nxt.hero, { alt: '', sizes: '100vw', maxW: 2000 })}</div>
  <div class="next__in"><div><p class="eyebrow">${esc(C.ui.common.nextIsland)} · ${nxt.num}</p><p class="giant" style="font-size:clamp(3rem,10vw,9rem)">${esc(C.places[nxt.id].name)}</p></div><span class="btn"><span>${esc(C.places[nxt.id].sub)}</span><span class="btn__i">${icon.arrow}</span></span></div>
</a>`,
  };
};

// ---------- simple text hero ----------
const textHero = (C, eyebrow, title, intro, extra = '') => `
<section class="phero phero--text sec s-dark" style="padding-bottom:clamp(40px,6vw,88px)">
  ${fogbank(true)}
  <div class="grid" style="position:relative;z-index:2;align-items:end">
    <div class="c-8">${sec(eyebrow)}<h1 class="h1 mt-s">${md(title)}</h1></div>
    <div class="c-4"><p class="muted" style="max-width:40ch">${md(intro)}</p>${extra}</div>
  </div>
</section>`;

const imgHero = (C, file, eyebrow, title, intro) => `
<section class="phero phero--short">
  <div class="media">${pic(C, file, { priority: true, sizes: '100vw' })}</div>
  <div class="phero__in"><p class="eyebrow crumbs">${esc(eyebrow)}</p><h1 class="h1">${md(title)}</h1><p>${md(intro)}</p></div>
</section>`;

// ---------- JOURNEYS ----------
export const journeys = (C) => {
  const J = C.pages.journeys;
  return {
    title: J.metaTitle, description: J.metaDesc, image: J.list[0].img, preloadImage: 'hero-cliffs-2.jpg',
    body: `${imgHero(C, 'hero-cliffs-2.jpg', J.eyebrow, J.title, J.intro)}
<section class="sec s-dark">
  <div class="grid"><div class="c-3">${sec(J.principlesEyebrow)}</div><div class="c-9">${statement(J.principles)}</div></div>
</section>
${J.list.map((j, i) => `
<section class="sec ${i % 2 ? 's-tar2' : 's-dark'} rule" id="${j.id}" aria-labelledby="${j.id}-h">
  <div class="split">
    <div class="stack" style="align-self:start;position:sticky;top:calc(var(--head-h) + 24px)">
      <p class="eyebrow">0${i + 1} · ${esc(j.season)}</p>
      <h2 id="${j.id}-h" class="h2">${esc(j.title)}</h2>
      <p class="muted">${esc(j.summary)}</p>
      <div class="stat"><div><b>${j.nights}</b><span class="mono">${esc(C.ui.common.nightsLabel)}</span></div><div><b>${j.spare}</b><span class="mono">${esc(C.ui.common.spareLabel)}</span></div></div>
      <div class="media r-4x3 rv-img">${pic(C, j.img, { sizes: '(min-width:900px) 40vw, 100vw', maxW: 1600 })}</div>
      <p class="small muted">${esc(j.fit)}</p>
      <div>${btn(href(C.lang, 'enquire') + `?journey=${j.id}`, J.cta)}</div>
    </div>
    <ol class="plan">${j.days.map(d => `<li class="${d.spare ? 'spare' : ''}"><span class="d">${esc(d.d)}</span><div><h4>${esc(d.t)}</h4><p>${md(d.p)}</p>${d.spare ? `<div class="flags"><span class="chip chip--dot">${esc(C.ui.common.spareDay)}</span></div>` : ''}</div></li>`).join('')}</ol>
  </div>
</section>`).join('')}
<section class="sec s-wool"><div class="split"><div>${sec(J.noteEyebrow)}</div><div class="prose measure">${paras(J.note)}</div></div></section>`,
  };
};

// ---------- STAYS ----------
export const stays = (C) => {
  const S = C.pages.stays;
  return {
    title: S.metaTitle, description: S.metaDesc, image: 'turf-roof-1.jpg', preloadImage: 'turf-roof-1.jpg',
    body: `${imgHero(C, 'turf-roof-1.jpg', S.eyebrow, S.title, S.intro)}
<section class="sec s-dark">
  <div class="grid"><div class="c-3">${sec(S.approachEyebrow)}</div><div class="c-9">${statement(S.approach)}</div></div>
  <p class="note mt-m" style="max-width:70ch">${esc(S.placeholderNote)}</p>
</section>
<section class="sec s-dark" style="padding-top:0">
  <div class="cards">${S.list.map(s => `<article class="card rv" id="${s.id}">
    <div class="media r-4x3">${pic(C, s.img, { sizes: '(min-width:700px) 50vw, 100vw', maxW: 1600 })}<span class="badge" style="position:absolute;left:14px;top:14px">${esc(s.type)}</span></div>
    <div class="card__meta mono"><span>${esc(C.places[s.region].name)}</span><span>${esc(s.place)}</span></div>
    <h3 class="h3" style="font-family:var(--font-display);font-size:var(--fs-h3)">${esc(s.name)}</h3>
    <p class="muted small">${esc(s.p)}</p>
    <p class="small"><b>${esc(S.whyLabel)}</b> ${esc(s.why)}</p>
  </article>`).join('')}</div>
</section>`,
  };
};

// ---------- ABOUT ----------
export const about = (C) => {
  const A = C.pages.about;
  return {
    title: A.metaTitle, description: A.metaDesc, image: 'hero-village-2.jpg', preloadImage: 'hero-village-2.jpg',
    body: `${imgHero(C, 'hero-village-2.jpg', A.eyebrow, A.title, A.intro)}
<section class="sec s-dark cols-lines"><div class="grid"><div class="c-3">${sec(A.storyEyebrow)}</div><div class="c-9">${statement(A.story)}</div></div></section>
<section class="sec s-dark" style="padding-top:0"><div class="split"><div class="media r-4x5 rv-img">${pic(C, 'turf-roof-1.jpg', { sizes: '(min-width:900px) 40vw, 100vw', maxW: 1600 })}</div><div class="prose measure muted">${paras(A.body)}</div></div></section>
${basalt('wool')}
<section class="sec s-wool">
  ${sh(A.principlesEyebrow, A.principlesTitle)}
  <ol class="hl">${A.principles.map((h, i) => `<li class="rv"><span class="mono">0${i + 1}</span><h3>${esc(h.t)}</h3><p>${md(h.p)}</p></li>`).join('')}</ol>
</section>
${basalt('tar', true)}
<section class="sec s-dark"><div class="split">
  <div>${sec(A.whereEyebrow)}<h2 class="h2 mt-s">${md(A.whereTitle)}</h2></div>
  <div class="stack"><p class="muted measure">${esc(A.whereText)}</p><address class="lead" style="font-style:normal">${addressLines().map(esc).join('<br>')}</address><p><a class="link" href="mailto:${config.contact.email}">${esc(config.contact.email)}</a></p><div>${btn(href(C.lang, 'enquire'), C.ui.nav.enquire)}</div></div>
</div></section>`,
  };
};

// ---------- FAQ ----------
export const faq = (C) => {
  const F = C.pages.faq;
  let n = 0;
  return {
    title: F.metaTitle, description: F.metaDesc, image: 'fog-hills-1.jpg',
    jsonld: [{ '@type': 'FAQPage', mainEntity: F.groups.flatMap(g => g.items).map(q => ({ '@type': 'Question', name: q.q, acceptedAnswer: { '@type': 'Answer', text: [].concat(q.a).join(' ').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*/g, '') } })) }],
    body: `${textHero(C, F.eyebrow, F.title, F.intro)}
<section class="sec s-dark" style="padding-top:0">
${F.groups.map(g => `<div class="split mt-l"><div><h2 class="h3">${esc(g.title)}</h2></div><div class="faq">${g.items.map(q => { n++; return `<details id="${q.id || ''}"><summary><span class="mono">${String(n).padStart(2, '0')}</span><span>${esc(q.q)}</span><span class="pm" aria-hidden="true"></span></summary><div class="a">${paras(loc(C, q.a))}</div></details>`; }).join('')}</div></div>`).join('')}
</section>`,
  };
};

// ---------- JOURNAL ----------
export const journal = (C) => {
  const J = C.pages.journal;
  return {
    title: J.metaTitle, description: J.metaDesc, image: J.posts[0].img,
    body: `${textHero(C, J.eyebrow, J.title, J.intro)}
<section class="sec s-dark" style="padding-top:0"><div class="cards cards--3">${J.posts.map(p => postCard(C, p)).join('')}</div></section>`,
  };
};
export const article = (C, p) => {
  const J = C.pages.journal;
  const others = J.posts.filter(x => x.slug !== p.slug);
  return {
    title: p.title, description: p.dek, image: p.img, preloadImage: p.img,
    jsonld: [{ '@type': 'Article', headline: p.title, description: p.dek, inLanguage: C.ui.htmlLang, image: abs(`/img/${p.img.replace('.jpg', '')}-1200.jpg`), author: { '@type': 'Organization', name: config.brand.name }, publisher: { '@id': `${config.siteUrl}/#org` }, datePublished: p.date }],
    body: `
<section class="phero phero--short">
  <div class="media">${pic(C, p.img, { priority: true, sizes: '100vw' })}</div>
  <div class="phero__in"><nav class="crumbs mono" aria-label="${esc(C.ui.common.breadcrumb)}"><a href="${href(C.lang, 'journal')}">${esc(C.ui.nav.journal)}</a><span aria-hidden="true">/</span><span>${esc(p.cat)}</span></nav><h1 class="h1">${esc(p.title)}</h1><p>${esc(p.dek)}</p></div>
</section>
<section class="sec s-dark"><div class="grid">
  <aside class="c-3"><p class="mono muted">${esc(fmt(C.ui.common.minRead, { n: p.mins }))}</p></aside>
  <div class="c-9 art">${p.body.map(b => typeof b === 'string' ? `<p>${md(b)}</p>` : `<h2>${esc(b.h)}</h2>`).join('')}</div>
</div></section>
<section class="sec s-tar2">${sh(J.moreEyebrow, J.moreTitle, tlink(href(C.lang, 'journal'), J.allLink))}<div class="cards">${others.map(o => postCard(C, o)).join('')}</div></section>`,
  };
};

// ---------- ENQUIRE ----------
export const enquire = (C) => {
  const E = C.pages.enquire, f = E.form;
  const field = (name, label, input, req = true, hint = '', cls = '') => `<div class="field ${cls}"${req ? ' data-req' : ''}><label for="f-${name}">${esc(label)}${req ? ' *' : ''}</label>${input}${hint ? `<p class="hint" id="h-${name}">${esc(hint)}</p>` : ''}${req ? `<p class="err" id="e-${name}">${esc(f.required)}</p>` : ''}</div>`;
  const opts = (name, list) => `<div class="opts">${list.map((o, i) => `<label class="opt"><input type="checkbox" name="${name}" value="${esc(o)}"><span>${esc(o)}</span></label>`).join('')}</div>`;
  return {
    title: E.metaTitle, description: E.metaDesc, image: 'hero-village-1.jpg',
    body: `${textHero(C, E.eyebrow, E.title, E.intro)}
<section class="sec s-wool">
  <div class="split">
    <div class="stack">
      ${sec(E.howEyebrow)}
      <ol class="hl">${E.how.map((s, i) => `<li><span class="mono">0${i + 1}</span><div><h4>${esc(s.t)}</h4><p class="small">${esc(s.p)}</p></div></li>`).join('')}</ol>
      <div class="mt-m"><p class="eyebrow">${esc(C.ui.footer.contact)}</p><p class="mt-s"><a class="link" href="mailto:${config.contact.email}">${esc(config.contact.email)}</a></p><address class="small mt-s" style="font-style:normal">${addressLines().map(esc).join('<br>')}</address></div>
    </div>
    <form class="form" data-enquiry data-endpoint="${config.formEndpoint}" data-thanks="${href(C.lang, 'enquire/thanks')}" action="${config.formFallback}" method="POST" novalidate>
      <input type="hidden" name="_subject" value="${esc(E.subject)}">
      <input type="hidden" name="_template" value="table">
      <input type="hidden" name="_captcha" value="false">
      <input type="hidden" name="_next" value="${abs(href(C.lang, 'enquire/thanks'))}">
      <input type="hidden" name="language" value="${C.lang}">
      <div class="hp" aria-hidden="true"><label>Leave empty<input type="text" name="_honey" tabindex="-1" autocomplete="off"></label></div>
      ${field('name', f.name, `<input id="f-name" name="name" type="text" autocomplete="name" aria-describedby="e-name">`)}
      ${field('email', f.email, `<input id="f-email" name="email" type="email" autocomplete="email" aria-describedby="e-email">`)}
      ${field('arrive', f.arrive, `<input id="f-arrive" name="arrive" type="date">`, false, f.datesHint)}
      ${field('nights', f.nights, `<select id="f-nights" name="nights">${f.nightsOpts.map(o => `<option>${esc(o)}</option>`).join('')}</select>`, false)}
      ${field('group', f.group, `<select id="f-group" name="group">${f.groupOpts.map(o => `<option>${esc(o)}</option>`).join('')}</select>`, false)}
      ${field('flex', f.flex, `<select id="f-flex" name="flexibility">${f.flexOpts.map(o => `<option>${esc(o)}</option>`).join('')}</select>`, false)}
      <div class="field full"><fieldset><legend>${esc(f.interests)}</legend>${opts('interests', f.interestOpts)}</fieldset></div>
      <div class="field full"><fieldset><legend>${esc(f.regions)}</legend>${opts('regions', REGIONS.map(r => C.places[r.id].name))}</fieldset></div>
      ${field('message', f.message, `<textarea id="f-message" name="message" aria-describedby="e-message"></textarea>`, true, '', 'full')}
      <div class="field full" data-req><label class="check" for="f-consent"><input id="f-consent" type="checkbox" name="consent" value="yes"><span>${md(fmt(f.consent, { privacy: href(C.lang, 'privacy') }))}</span></label><p class="err">${esc(f.consentErr)}</p></div>
      <div class="full"><p id="form-status" class="form-status" tabindex="-1" role="alert" data-error="${esc(fmt(f.error, { email: config.contact.email }))}"></p></div>
      <div class="full"><button class="btn" type="submit"><span>${esc(f.submit)}</span><span class="btn__i">${icon.arrow}</span></button></div>
    </form>
  </div>
</section>`,
  };
};
export const thanks = (C) => {
  const T = C.pages.enquire.thanks;
  return { title: T.title, description: T.text, noindex: true, body: `${textHero(C, T.eyebrow, T.title, T.text, `<div class="mt-m">${btn(href(C.lang, 'weather-planner'), C.ui.nav.planner)}</div>`)}` };
};

// ---------- LEGAL ----------
export const legal = (C, key) => {
  const L = C.legal[key];
  const a = config.address;
  const vars = { brand: config.brand.name, email: config.contact.email, address: addressLines().join(', '), site: config.siteUrl.replace('https://', ''), updated: C.legal.updated };
  return {
    title: L.title, description: fmt(L.description, vars),
    body: `${textHero(C, C.ui.footer.legalNav, L.title, fmt(L.intro, vars))}
<section class="sec s-wool"><div class="grid">
  <nav class="c-3" aria-label="${esc(L.title)}"><div class="toc mono">${L.sections.map((s, i) => `<a href="#s${i + 1}">${String(i + 1).padStart(2, '0')} ${esc(s.h)}</a>`).join('')}</div></nav>
  <div class="c-8 prose measure">${L.sections.map((s, i) => `<h2 id="s${i + 1}">${esc(s.h)}</h2>${s.p.map(p => Array.isArray(p) ? `<ul>${p.map(li => `<li>${md(fmt(li, vars))}</li>`).join('')}</ul>` : `<p>${md(fmt(p, vars))}</p>`).join('')}`).join('')}
  <p class="mono mt-l">${esc(fmt(C.legal.updatedLabel, vars))}</p></div>
</div></section>`,
  };
};

export const credits = (C) => {
  const K = C.legal.credits;
  const list = manifest().filter(m => m.source !== 'unsplash');
  return {
    title: K.title, description: K.description,
    body: `${textHero(C, C.ui.footer.legalNav, K.title, K.intro)}
<section class="sec s-wool"><div class="tbl-wrap"><table class="tbl tbl--stack">
<thead><tr><th>${esc(K.cols.photo)}</th><th>${esc(K.cols.place)}</th><th>${esc(K.cols.author)}</th><th>${esc(K.cols.licence)}</th></tr></thead>
<tbody>${list.map(m => `<tr><td><a class="link" href="${esc(m.sourceUrl)}" rel="noopener" target="_blank">${esc(alt(C, m.file) || m.description)}</a></td><td data-l="${esc(K.cols.place)}">${esc(m.location)}</td><td data-l="${esc(K.cols.author)}">${esc(m.author)}</td><td data-l="${esc(K.cols.licence)}"><a class="link" href="${esc(m.licenceUrl)}" rel="noopener" target="_blank">${esc(m.licence)}</a></td></tr>`).join('')}</tbody>
</table></div><p class="note mt-m">${esc(K.note)}</p></section>`,
  };
};

// ---------- TOOLS ----------
export const planner = (C) => {
  const T = C.tools.planner;
  const today = new Date();
  return {
    title: T.metaTitle, description: T.metaDesc, image: 'fog-hills-1.jpg', scripts: ['__PLANNER_JS__'],
    body: `${textHero(C, T.eyebrow, T.title, T.intro)}
<section class="sec s-dark" style="padding-top:0">
  <form class="tool" id="planner" novalidate>
    <div class="row">
      <div class="field"><label for="p-from">${esc(T.arrive)}</label><input id="p-from" type="date" required></div>
      <div class="field"><label for="p-to">${esc(T.leave)}</label><input id="p-to" type="date" required></div>
      <div class="field"><label for="p-car">${esc(T.transport)}</label><select id="p-car"><option value="car">${esc(T.car)}</option><option value="nocar">${esc(T.nocar)}</option></select></div>
      <button class="btn" type="submit"><span>${esc(T.build)}</span><span class="btn__i">${icon.arrow}</span></button>
    </div>
    <p class="note mt-s" id="p-msg" aria-live="polite">${esc(T.hint)}</p>
  </form>
  <div class="res" id="p-res" hidden aria-live="polite">
    <div class="sh">${sec(T.resEyebrow)}<h2 class="sh__title" id="p-title"></h2></div>
    <div class="kpis" id="p-kpis"></div>
    <div class="split mt-l">
      <div class="stack"><h3 class="h3">${esc(T.seasonsTitle)}</h3><ul class="exposed" id="p-seasons"></ul>
        <div class="callout mt-m" id="p-today"><p class="eyebrow">${esc(T.todayEyebrow)}</p><h3 class="mt-s">${esc(T.todayTitle)}</h3><p class="small muted mt-s">${esc(T.todayText)}</p>
          <div class="row mt-s" style="display:flex;flex-wrap:wrap;gap:16px">
            <div class="field" style="flex:1 1 140px"><label for="t-wind">${esc(T.wind)}</label><input id="t-wind" type="number" min="0" max="60" step="1" inputmode="numeric"></div>
            <div class="field" style="flex:1 1 140px"><label for="t-gust">${esc(T.gust)}</label><input id="t-gust" type="number" min="0" max="80" step="1" inputmode="numeric"></div>
            <div class="field" style="flex:1 1 160px"><label for="t-vis">${esc(T.vis)}</label><select id="t-vis">${T.visOpts.map((o, i) => `<option value="${i}">${esc(o)}</option>`).join('')}</select></div>
          </div>
          <ul class="exposed mt-s" id="p-exposed"></ul>
          <p class="note mt-s">${md(T.todayNote)}</p>
        </div>
      </div>
      <div><h3 class="h3">${esc(T.routeTitle)}</h3><ol class="plan mt-s" id="p-plan"></ol><div class="mt-m" id="p-cta"></div></div>
    </div>
  </div>
</section>
<section class="sec s-wool">
  ${sh(T.yearEyebrow, T.yearTitle)}
  ${monthsStrip(C)}
  <p class="note mt-m">${esc(C.tools.climateNote)}</p>
</section>
<section class="sec s-dark"><div class="split"><div>${sec(T.howEyebrow)}<h2 class="h2 mt-s">${md(T.howTitle)}</h2></div><div class="prose muted measure">${paras(T.how)}</div></div></section>
<script type="application/json" id="planner-data">${JSON.stringify(plannerData(C)).replace(/</g, '\\u003c')}</script>`,
  };
};

const plannerData = (C) => {
  const T = C.tools.planner;
  return {
    lang: C.ui.htmlLang,
    climate: CLIMATE,
    months: C.ui.months,
    fogLevels: C.tools.fogLevels,
    windLevels: C.tools.windLevels,
    seasons: C.tools.seasons,
    blocks: T.blocks,
    walks: WALKS.filter(w => w.exposure === 'high').map(w => ({ id: w.id, name: C.tools.walks[w.id].name, region: w.region, kind: w.kind || 'cliff' })),
    places: Object.fromEntries(REGIONS.map(r => [r.id, { name: C.places[r.id].name, href: href(C.lang, r.slug) }])),
    t: T.js,
    enquire: href(C.lang, 'enquire'),
  };
};

export const access = (C) => {
  const T = C.tools.access;
  const regionsUsed = [...new Set(WALKS.map(w => w.region))];
  return {
    title: T.metaTitle, description: T.metaDesc, image: 'sheep-1.jpg', preloadImage: 'sheep-1.jpg',
    body: `${imgHero(C, 'sheep-1.jpg', T.eyebrow, T.title, T.intro)}
<section class="sec s-dark">
  <div class="split"><div>${sec(T.rulesEyebrow)}<h2 class="h2 mt-s">${md(T.rulesTitle)}</h2></div>
  <ol class="hl">${T.rules.map((r, i) => `<li><span class="mono">0${i + 1}</span><h3>${esc(r.t)}</h3><p>${md(r.p)}</p></li>`).join('')}</ol></div>
</section>
<section class="sec s-tar2" id="walks">
  ${sh(T.listEyebrow, T.listTitle)}
  <div class="filters" data-filter-group="#walk-list" data-live="#walk-count" role="group" aria-label="${esc(T.filterLabel)}">
    <button type="button" data-f="all" aria-pressed="true">${esc(T.filters.all)}</button>
    <button type="button" data-f="guide" aria-pressed="false">${esc(T.filters.guide)}</button>
    <button type="button" data-f="fee" aria-pressed="false">${esc(T.filters.fee)}</button>
    <button type="button" data-f="nofee" aria-pressed="false">${esc(T.filters.nofee)}</button>
    <button type="button" data-f="exposed" aria-pressed="false">${esc(T.filters.exposed)}</button>
    ${regionsUsed.map(r => `<button type="button" data-f="${r}" aria-pressed="false">${esc(C.places[r].name)}</button>`).join('')}
  </div>
  <p class="mono muted" id="walk-count" data-tpl="${esc(T.count)}" aria-live="polite">${esc(fmt(T.count, { n: WALKS.length }))}</p>
  <div class="walks mt-s" id="walk-list">${WALKS.map(w => walkRow(C, w)).join('')}</div>
</section>
${basalt('wool')}
<section class="sec s-wool"><div class="split"><div>${sec(T.seasonEyebrow)}<h2 class="h2 mt-s">${md(T.seasonTitle)}</h2></div><div class="prose measure">${paras(T.season)}</div></div>
<p class="note mt-l">${esc(T.verifyNote)}</p></section>`,
  };
};

export const transport = (C) => {
  const T = C.tools.transport;
  const opt = (sel) => Object.entries(NODES).sort((a, b) => a[1].name.localeCompare(b[1].name, 'fo')).map(([k, n]) => `<option value="${k}"${k === sel ? ' selected' : ''}>${esc(n.name)}${n.island ? ` — ${esc(n.island)}` : ''}</option>`).join('');
  const modeName = (m) => T.modes[m];
  const rows = EDGES.map(e => {
    const L = T.edges[e.id] || {};
    return `<tr><td><b>${esc(NODES[e.from].name)} – ${esc(NODES[e.to].name)}</b><br><span class="small muted">${esc(L.name || '')}</span></td><td data-l="${esc(T.cols.mode)}">${esc(modeName(e.mode))}</td><td data-l="${esc(T.cols.time)}">${esc(fmt(T.minutes, { n: e.mins }))}</td><td data-l="${esc(T.cols.cost)}">${esc(L.cost || T.noCost)}</td><td data-l="${esc(T.cols.booking)}">${md(L.booking || '')}</td></tr>`;
  }).join('');
  return {
    title: T.metaTitle, description: T.metaDesc, image: 'ferry-1.jpg', scripts: ['__TRANSPORT_JS__'],
    body: `${textHero(C, T.eyebrow, T.title, T.intro)}
<section class="sec s-dark" style="padding-top:0">
  <form class="tool" id="route-form" novalidate>
    <div class="row">
      <div class="field"><label for="r-from">${esc(T.from)}</label><select id="r-from">${opt('airport')}</select></div>
      <div class="field"><label for="r-to">${esc(T.to)}</label><select id="r-to">${opt('kallur')}</select></div>
      <div class="field"><label for="r-pref">${esc(T.pref)}</label><select id="r-pref"><option value="car">${esc(T.prefCar)}</option><option value="foot">${esc(T.prefFoot)}</option><option value="heli">${esc(T.prefHeli)}</option></select></div>
      <button class="btn" type="submit"><span>${esc(T.go)}</span><span class="btn__i">${icon.arrow}</span></button>
    </div>
  </form>
  <div class="split mt-l">
    <div><div id="r-out" aria-live="polite"><p class="muted">${esc(T.empty)}</p></div></div>
    <div>${transitMap(C)}<div class="mt-s">${mapKey(C)}</div></div>
  </div>
</section>
${basalt('wool')}
<section class="sec s-wool">
  ${sh(T.tableEyebrow, T.tableTitle)}
  <div class="tbl-wrap"><table class="tbl tbl--stack"><thead><tr><th>${esc(T.cols.link)}</th><th>${esc(T.cols.mode)}</th><th>${esc(T.cols.time)}</th><th>${esc(T.cols.cost)}</th><th>${esc(T.cols.booking)}</th></tr></thead><tbody>${rows}</tbody></table></div>
  <div class="split mt-l"><div>${sec(T.rulesEyebrow)}<h2 class="h2 mt-s">${md(T.rulesTitle)}</h2></div><ol class="hl">${T.rules.map((r, i) => `<li><span class="mono">0${i + 1}</span><h3>${esc(r.t)}</h3><p>${md(r.p)}</p></li>`).join('')}</ol></div>
  <p class="note mt-l">${esc(T.verifyNote)}</p>
</section>
<script type="application/json" id="transport-data">${JSON.stringify({ nodes: Object.fromEntries(Object.entries(NODES).map(([k, n]) => [k, { name: n.name, island: n.island }])), edges: EDGES.map(e => ({ ...e, ...(T.edges[e.id] || {}) })), modes: T.modes, t: T.js }).replace(/</g, '\\u003c')}</script>`,
  };
};

// ---------- 404 ----------
export const notFound = (C) => ({
  title: C.ui.notFound.title, description: C.ui.notFound.text, noindex: true,
  body: `<section class="phero err404"><div class="media">${pic(C, 'fog-hills-1.jpg', { sizes: '100vw', priority: true })}</div><div class="phero__in"><p class="eyebrow crumbs">404</p><h1 class="giant">${esc(C.ui.notFound.title)}</h1><p>${esc(C.ui.notFound.text)}</p><div style="grid-column:1/-1">${btn(href(C.lang), C.ui.notFound.home)}</div></div></section>`,
});
