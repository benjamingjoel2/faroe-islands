// Document shell: <head>, header (desktop nav + islands mega menu + mobile menu), footer.
import config from '../config.mjs';
import { esc, href, abs, icon, btn, img, preload, ogImage, KNIT_SVG, locPrefix } from './lib.mjs';
import { REGIONS } from '../data/regions.mjs';

const P = config.palette;
const rootVars = `:root{--tar:${P.tar};--tar2:${P.tar2};--turf:${P.turf};--turfDeep:${P.turfDeep};--fog:${P.fog};--fogDeep:${P.fogDeep};--wool:${P.wool};--woolDeep:${P.woolDeep};--puffin:${P.puffin};--puffinInk:${P.puffinInk};--font-display:${config.fonts.display};--font-text:${config.fonts.text};--font-mono:${config.fonts.mono};--knit:${KNIT_SVG}}`;

export const addressLines = () => {
  const a = config.address;
  return [a.venue, a.street, `${a.postalCode} ${a.locality}`, a.country].filter(Boolean);
};

export const orgJsonLd = (C) => ({
  '@type': 'TravelAgency',
  '@id': `${config.siteUrl}/#org`,
  name: config.brand.name,
  url: config.siteUrl + (locPrefix(C.lang) || '/'),
  email: config.contact.email,
  description: C.ui.meta.orgDescription,
  areaServed: { '@type': 'Place', name: 'Faroe Islands' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: [config.address.venue, config.address.street].filter(Boolean).join(', '),
    postalCode: config.address.postalCode,
    addressLocality: config.address.locality,
    addressCountry: config.address.countryCode,
  },
  knowsLanguage: config.locales,
});

const langSwitch = (C) => {
  const items = config.locales.map(l => {
    const cur = l === C.lang;
    return `<a href="${href(l, C.slug)}" hreflang="${l}" lang="${l}"${cur ? ' aria-current="true"' : ''} aria-label="${esc(C.langNames[l])}">${l.toUpperCase()}</a>`;
  });
  return `<nav class="lang" aria-label="${esc(C.ui.nav.language)}">${items.join('<span class="sep" aria-hidden="true">·</span>')}</nav>`;
};

const header = (C) => {
  const u = C.ui.nav;
  const cur = (slug) => (C.slug === slug ? ' aria-current="page"' : '');
  const islandLinks = REGIONS.map(r => {
    const p = C.places[r.id];
    return `<li><a href="${href(C.lang, r.slug)}"${cur(r.slug)}><span class="mono">${r.num}</span><span>${esc(p.name)}<small>${esc(p.sub)}</small></span></a></li>`;
  }).join('');
  const tools = [['weather-planner', u.planner], ['hiking-access', u.access], ['getting-around', u.transport], ['journeys', u.journeys]];
  return `
<a class="skip" href="#main">${esc(C.ui.skip)}</a>
<header class="hdr">
  <a class="hdr__logo" href="${href(C.lang)}" aria-label="${esc(config.brand.name)} — ${esc(u.home)}">${icon.logo}<span>${esc(config.brand.name)}</span></a>
  <ul class="hdr__nav">
    <li><button class="nav-a knit-hover" type="button" data-mega aria-expanded="false" aria-controls="mega">${esc(u.islands)} ${icon.chev}</button></li>
    <li><a class="nav-a knit-hover" href="${href(C.lang, 'journeys')}"${cur('journeys')}>${esc(u.journeys)}</a></li>
    <li><a class="nav-a knit-hover" href="${href(C.lang, 'weather-planner')}"${cur('weather-planner')}>${esc(u.plan)}</a></li>
    <li><a class="nav-a knit-hover" href="${href(C.lang, 'stays')}"${cur('stays')}>${esc(u.stays)}</a></li>
    <li><a class="nav-a knit-hover" href="${href(C.lang, 'journal')}"${cur('journal')}>${esc(u.journal)}</a></li>
    <li><a class="nav-a knit-hover" href="${href(C.lang, 'about')}"${cur('about')}>${esc(u.about)}</a></li>
  </ul>
  <div class="hdr__right">
    ${langSwitch(C)}
    <a class="hdr__status" href="${href(C.lang, 'weather-planner')}"><span class="dot" aria-hidden="true"></span>${esc(C.ui.status)}</a>
    <div class="hdr__cta">${btn(href(C.lang, 'enquire'), u.enquire, 'btn--sm')}</div>
    <button class="hdr__burger" type="button" aria-expanded="false" aria-controls="mnav"><span>${esc(u.menu)}</span><span class="burger-i" aria-hidden="true"></span></button>
  </div>
</header>
<div class="mega" id="mega">
  <ul class="mega__list">${islandLinks}</ul>
  <div class="mega__tools"><p class="eyebrow">${esc(u.planTools)}</p>${tools.map(([s, l]) => `<a href="${href(C.lang, s)}">${esc(l)}</a>`).join('')}</div>
</div>
${C.slug === 'weather-planner' ? '' : `<a class="sidetab" href="${href(C.lang, 'weather-planner')}"><span>${esc(u.planTools)}</span><span aria-hidden="true">+</span></a>`}
<nav class="mnav" id="mnav" aria-label="${esc(u.menu)}">
  <div class="mnav__big">
    <a href="${href(C.lang)}"><span>+</span>${esc(u.home)}</a>
    <a href="${href(C.lang, 'journeys')}"><span>+</span>${esc(u.journeys)}</a>
    <a href="${href(C.lang, 'weather-planner')}"><span>+</span>${esc(u.plan)}</a>
    <a href="${href(C.lang, 'stays')}"><span>+</span>${esc(u.stays)}</a>
    <a href="${href(C.lang, 'enquire')}"><span>+</span>${esc(u.enquire)}</a>
  </div>
  <div><p class="eyebrow" style="opacity:.7;margin-bottom:8px">${esc(u.islands)}</p>
  <div class="mnav__sub">${REGIONS.map(r => `<a href="${href(C.lang, r.slug)}">${esc(C.places[r.id].name)}</a>`).join('')}</div></div>
  <div class="mnav__sub">
    <a href="${href(C.lang, 'hiking-access')}">${esc(u.access)}</a>
    <a href="${href(C.lang, 'getting-around')}">${esc(u.transport)}</a>
    <a href="${href(C.lang, 'journal')}">${esc(u.journal)}</a>
    <a href="${href(C.lang, 'about')}">${esc(u.about)}</a>
    <a href="${href(C.lang, 'faq')}">${esc(u.faq)}</a>
  </div>
  ${langSwitch(C)}
</nav>`;
};

const footer = (C) => {
  const f = C.ui.footer, u = C.ui.nav;
  return `
<footer class="ftr">
  <div class="ftr__cta">
    <div class="media">${img(C.footerImage || 'fog-hills-1.jpg', { alt: '', sizes: '100vw', maxW: 2000 })}</div>
    ${'' /* decorative image: text carries the meaning */}
    <div class="ftr__cta-in">
      <h2 class="h2">${esc(f.ctaTitle)}</h2>
      ${btn(href(C.lang, 'enquire'), f.ctaBtn)}
    </div>
  </div>
  <div class="ftr__cols">
    <div class="ftr__col">
      <a class="hdr__logo" style="padding:0;height:auto" href="${href(C.lang)}">${icon.logo}<span>${esc(config.brand.name)}</span></a>
      <p class="small muted mt-s" style="max-width:32ch">${esc(f.blurb)}</p>
    </div>
    <nav class="ftr__big" aria-label="${esc(f.explore)}">
      <a href="${href(C.lang, 'vagar')}"><span>+</span>${esc(u.islands)}</a>
      <a href="${href(C.lang, 'journeys')}"><span>+</span>${esc(u.journeys)}</a>
      <a href="${href(C.lang, 'weather-planner')}"><span>+</span>${esc(u.plan)}</a>
      <a href="${href(C.lang, 'stays')}"><span>+</span>${esc(u.stays)}</a>
    </nav>
    <div class="ftr__col">
      <h3>${esc(f.planTitle)}</h3>
      <ul>
        <li><a href="${href(C.lang, 'weather-planner')}">${esc(u.planner)}</a></li>
        <li><a href="${href(C.lang, 'hiking-access')}">${esc(u.access)}</a></li>
        <li><a href="${href(C.lang, 'getting-around')}">${esc(u.transport)}</a></li>
        <li><a href="${href(C.lang, 'faq')}">${esc(u.faq)}</a></li>
        <li><a href="${href(C.lang, 'journal')}">${esc(u.journal)}</a></li>
        <li><a href="${href(C.lang, 'about')}">${esc(u.about)}</a></li>
      </ul>
    </div>
    <div class="ftr__col">
      <h3>${esc(f.contact)}</h3>
      <p><a href="mailto:${config.contact.email}">${esc(config.contact.email)}</a></p>
      <address class="small muted mt-s">${addressLines().map(esc).join('<br>')}</address>
      <p class="small mt-s"><a class="link" href="${href(C.lang, 'enquire')}">${esc(f.enquiryForm)}</a></p>
    </div>
  </div>
  <div class="ftr__base">
    <span>© ${new Date().getFullYear()} ${esc(config.brand.name)}</span>
    <nav aria-label="${esc(f.legalNav)}">
      <a href="${href(C.lang, 'privacy')}">${esc(f.privacy)}</a>
      <a href="${href(C.lang, 'booking-terms')}">${esc(f.terms)}</a>
      <a href="${href(C.lang, 'cookies')}">${esc(f.cookies)}</a>
      <a href="${href(C.lang, 'credits')}">${esc(f.credits)}</a>
    </nav>
    ${langSwitch(C)}
  </div>
</footer>`;
};

/**
 * page: { title, description, body, image, preloadImage, preloadSizes, jsonld:[], scripts:[], noindex, bodyClass }
 */
export const layout = (C, page, assets) => {
  const path = href(C.lang, C.slug);
  const alternates = config.locales.map(l => `<link rel="alternate" hreflang="${l}" href="${abs(href(l, C.slug))}">`).join('')
    + `<link rel="alternate" hreflang="x-default" href="${abs(href(config.defaultLocale, C.slug))}">`;
  const title = page.title === config.brand.name ? page.title : `${page.title} — ${config.brand.name}`;
  const og = page.image ? abs(ogImage(page.image)) : '';
  const ld = { '@context': 'https://schema.org', '@graph': [orgJsonLd(C), { '@type': 'WebSite', '@id': `${config.siteUrl}/#site`, url: config.siteUrl + '/', name: config.brand.name, inLanguage: C.lang, publisher: { '@id': `${config.siteUrl}/#org` } }, { '@type': 'WebPage', url: abs(path), name: page.title, description: page.description, inLanguage: C.ui.htmlLang, isPartOf: { '@id': `${config.siteUrl}/#site` } }, ...(page.jsonld || [])] };
  return `<!doctype html>
<html lang="${C.ui.htmlLang}" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex">' : ''}
<link rel="canonical" href="${abs(path)}">
${page.noindex ? '' : alternates}
<meta name="theme-color" content="${P.tar}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(config.brand.name)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${abs(path)}">
<meta property="og:locale" content="${C.ui.ogLocale}">
${og ? `<meta property="og:image" content="${og}"><meta name="twitter:card" content="summary_large_image">` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/fraunces-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/schibsted-grotesk.woff2" as="font" type="font/woff2" crossorigin>
${page.preloadImage ? preload(page.preloadImage, page.preloadSizes) : ''}
<style>${rootVars}${assets.css}</style>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>
<script src="${assets.js}" defer></script>
${(page.scripts || []).map(s => `<script src="${s}" defer></script>`).join('')}
</head>
<body${page.bodyClass ? ` class="${page.bodyClass}"` : ''}>
${header(C)}
<main id="main">
${page.body}
</main>
${page.noFooter ? '' : footer(C)}
</body>
</html>`;
};
