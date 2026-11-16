/* Weather-window planner — runs only on /weather-planner. All copy comes pre-rendered
   in #planner-data (per language); no translation library in the browser. */
(() => {
  const d = document;
  const D = JSON.parse(d.getElementById('planner-data').textContent);
  const T = D.t;
  const $ = (id) => d.getElementById(id);
  const form = $('planner'), from = $('p-from'), to = $('p-to'), car = $('p-car');
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const fmt = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] ?? m));
  const DAY = 864e5;
  const dfmt = new Intl.DateTimeFormat(D.lang, { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
  const nfmt = new Intl.NumberFormat(D.lang, { maximumFractionDigits: 1 });
  const iso = (dt) => dt.toISOString().slice(0, 10);
  const parse = (v) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v); return m ? new Date(Date.UTC(+m[1], m[2] - 1, +m[3])) : null; };

  // NOAA sunrise/sunset for Tórshavn
  const daylight = (date) => {
    const rad = Math.PI / 180, lat = 62.0107;
    const day = Math.floor((date - Date.UTC(date.getUTCFullYear(), 0, 0)) / DAY);
    const g = 2 * Math.PI / 365 * (day - 1);
    const decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    const cosH = Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl);
    if (cosH < -1) return 24; if (cosH > 1) return 0;
    return 2 * Math.acos(cosH) / rad / 15;
  };

  // Defaults: a week starting about seven months ahead, or ?from=&to=
  const q = new URLSearchParams(location.search);
  const now = new Date();
  const start = parse(q.get('from') || '') || new Date(Date.UTC(now.getUTCFullYear() + (now.getUTCMonth() > 4 ? 1 : 0), 5, 8));
  const end = parse(q.get('to') || '') || new Date(start.getTime() + 7 * DAY);
  from.value = iso(start); to.value = iso(end);
  from.min = iso(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())));
  if (q.get('car') === 'nocar') car.value = 'nocar';

  // Order of regions by priority, and the order we put them in the trip
  const PRIORITY = ['mykines', 'north', 'eysturoy', 'streymoy', 'vagar', 'torshavn', 'sandoy', 'nolsoy', 'suduroy', 'suduroy2', 'north2'];
  const SEQUENCE = ['mykines', 'north', 'vagar', 'streymoy', 'eysturoy', 'north2', 'sandoy', 'suduroy', 'suduroy2', 'nolsoy', 'torshavn'];
  const EXPOSED = new Set(['mykines', 'north', 'vagar', 'eysturoy', 'north2', 'suduroy', 'sandoy', 'streymoy']);
  const BOOK = new Set(['mykines', 'north', 'suduroy', 'nolsoy']);

  const build = () => {
    const a = parse(from.value), b = parse(to.value);
    const msg = $('p-msg');
    if (!a || !b) { msg.textContent = T.errDates; return; }
    const nights = Math.round((b - a) / DAY);
    if (nights < 1) { msg.textContent = T.errOrder; return; }
    if (nights > 30) { msg.textContent = T.errLong; return; }
    msg.textContent = '';
    const days = [...Array(nights + 1)].map((_, i) => new Date(a.getTime() + i * DAY));
    const months = [...new Set(days.map(x => x.getUTCMonth()))];

    // KPIs
    const avgLight = days.reduce((s, x) => s + daylight(x), 0) / days.length;
    const cl = months.map(m => D.climate[m]);
    const temp = cl.reduce((s, c) => s + c.temp, 0) / cl.length;
    const rain = Math.round(cl.reduce((s, c) => s + c.rain, 0) / cl.length);
    const wind = Math.max(...cl.map(c => c.wind)), fog = Math.max(...cl.map(c => c.fog));
    $('p-title').textContent = fmt(T.title, { n: nights, from: dfmt.format(a), to: dfmt.format(b) });
    $('p-kpis').innerHTML = [
      [T.kDaylight, `${nfmt.format(avgLight)} h`, fmt(T.kDaylightSub, { min: nfmt.format(Math.min(...days.map(daylight))), max: nfmt.format(Math.max(...days.map(daylight))) })],
      [T.kTemp, `${nfmt.format(temp)}°C`, fmt(T.kTempSub, { n: rain })],
      [T.kWind, D.windLevels[wind], T.kWindSub],
      [T.kFog, D.fogLevels[fog], T.kFogSub],
    ].map(([l, v, s]) => `<div><span class="eyebrow">${esc(l)}</span><b>${esc(v)}</b><span class="small muted">${esc(s)}</span></div>`).join('');

    // Seasons & events in the window
    const keys = new Set(months.flatMap(m => D.climate[m].seasons));
    const inRange = (mo, da) => days.some(x => x.getUTCMonth() + 1 === mo && x.getUTCDate() === da);
    const notes = [...keys].map(k => D.seasons[k]);
    if (inRange(7, 28) || inRange(7, 29)) notes.unshift(D.seasons.olavsokaDays);
    $('p-seasons').innerHTML = (notes.length ? notes : [D.seasons.none]).map(s => `<li><div><b>${esc(s.short)}</b><p class="small muted">${esc(s.long)}</p></div></li>`).join('');

    // Route with spare days
    const mykinesOk = days.some(x => { const m = x.getUTCMonth(); return m >= 4 && m <= 7; });
    const mid = Math.max(0, nights - 1);
    const spares = nights >= 3 ? Math.max(1, Math.round(mid / 4)) : 0;
    const slots = Math.max(0, mid - spares);
    const chosen = PRIORITY.filter(k => k !== 'mykines' || mykinesOk).slice(0, slots).sort((x, y) => SEQUENCE.indexOf(x) - SEQUENCE.indexOf(y));
    const plan = [...chosen];
    if (spares >= 1) plan.splice(Math.min(2, plan.length), 0, 'spare');
    for (let i = 1; i < spares; i++) plan.splice(plan.length - (i - 1) * 3, 0, 'spare');
    const seq = ['arrive', ...plan, ...(nights >= 1 ? ['depart'] : [])].slice(0, days.length);
    const winter = months.every(m => m <= 1 || m >= 10);
    const heliDay = (dt) => [0, 3, 5].includes(dt.getUTCDay());
    $('p-plan').innerHTML = seq.map((k, i) => {
      const B = D.blocks[k];
      const flags = [];
      if (k === 'spare') flags.push(`<span class="chip chip--dot">${esc(T.fSpare)}</span>`);
      if (EXPOSED.has(k)) flags.push(`<span class="chip">${esc(T.fExposed)}</span>`);
      if (BOOK.has(k)) flags.push(`<span class="chip chip--ok">${esc(T.fBook)}</span>`);
      if (k === 'mykines' && heliDay(days[i])) flags.push(`<span class="chip">${esc(T.fHeli)}</span>`);
      if (car.value === 'nocar' && B.nocar) flags.push(`<span class="chip">${esc(B.nocar)}</span>`);
      return `<li class="${k === 'spare' ? 'spare' : ''}"><span class="d">${esc(fmt(T.dayN, { n: i + 1 }))}<br>${esc(dfmt.format(days[i]))}</span><div><h4>${esc(B.t)}</h4><p>${esc(B.p)}</p>${flags.length ? `<div class="flags">${flags.join('')}</div>` : ''}</div></li>`;
    }).join('') + (winter ? `<li><span class="d">${esc(T.noteLabel)}</span><div><p>${esc(T.winterNote)}</p></div></li>` : '') + (!mykinesOk ? `<li><span class="d">${esc(T.noteLabel)}</span><div><p>${esc(T.noMykines)}</p></div></li>` : '');
    $('p-cta').innerHTML = `<a class="btn" href="${D.enquire}?arrive=${iso(a)}&nights=${nights}"><span>${esc(T.cta)}</span><span class="btn__i"><svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3 11 11 3M4.5 3H11v6.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></span></a>`;
    $('p-res').hidden = false;
    exposed();
    history.replaceState(null, '', `?from=${iso(a)}&to=${iso(b)}${car.value === 'nocar' ? '&car=nocar' : ''}`);
  };

  // "Too exposed today" check for cliff and summit walks
  const exposed = () => {
    const w = parseFloat($('t-wind').value), g = parseFloat($('t-gust').value), v = +$('t-vis').value;
    const has = !isNaN(w) || !isNaN(g) || v > 0;
    $('p-exposed').innerHTML = D.walks.map(x => {
      let cls = 'go', label = T.vGo;
      if (!has) { cls = 'maybe'; label = T.vUnknown; }
      else if (v >= 2 || w >= 12 || g >= 18) { cls = 'no'; label = T.vNo; }
      else if (v === 1 || w >= 8 || g >= 13) { cls = 'maybe'; label = T.vMaybe; }
      return `<li><span><a class="link" href="${D.places[x.region].href}">${esc(x.name)}</a> <span class="small muted">· ${esc(D.places[x.region].name)}</span></span><span class="verdict verdict--${cls}">${esc(label)}</span></li>`;
    }).join('');
  };
  ['t-wind', 't-gust', 't-vis'].forEach(id => $(id).addEventListener('input', exposed));
  form.addEventListener('submit', (e) => { e.preventDefault(); build(); $('p-res').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); });
  build();
})();
