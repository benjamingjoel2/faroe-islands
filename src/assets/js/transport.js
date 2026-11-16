/* Tunnel, ferry and helicopter planner — runs only on /getting-around.
   Finds the quickest sensible route between two places over the link graph. */
(() => {
  const d = document;
  const D = JSON.parse(d.getElementById('transport-data').textContent);
  const T = D.t;
  const $ = (id) => d.getElementById(id);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const md = (s) => esc(s).replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="link" href="$2" rel="noopener" target="_blank">$1</a>');
  const fmt = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] ?? m));
  const ICON = {
    tunnel: '<path d="M2 14V8a6 6 0 0 1 12 0v6M6 14V9a2 2 0 0 1 4 0v5"/>',
    road: '<path d="M5 1 3 15M11 1l2 14M8 2v2M8 7v2M8 12v2"/>',
    ferry: '<path d="M1 12c2 1.5 4 1.5 7 0s5-1.5 7 0M2.5 10 4 6h8l1.5 4M6 6V3h4v3"/>',
    boat: '<path d="M1 12c2 1.5 4 1.5 7 0s5-1.5 7 0M3 10h10l-1.5-3H8V2L4 7"/>',
    heli: '<path d="M1 3h14M8 3v2M3 9a4 3 0 0 1 4-3h3a3 3 0 0 1 0 6H6M10 12v2M5 14h7M13 9h2"/>',
  };
  const svg = (m) => `<svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4">${ICON[m]}</svg>`;

  const adj = {};
  D.edges.forEach(e => { (adj[e.from] ||= []).push([e.to, e]); (adj[e.to] ||= []).push([e.from, e]); });
  const weight = (e, pref) => {
    let w = e.mins;
    if (e.mode === 'ferry' || e.mode === 'boat') w += 30;          // waiting for a sailing
    if (e.mode === 'heli') w = pref === 'heli' ? w * 0.5 : w * 6 + 120; // limited seats, residents first
    return w;
  };
  const route = (a, b, pref) => {
    const dist = { [a]: 0 }, prev = {}, seen = new Set();
    while (true) {
      let u = null;
      for (const k in dist) if (!seen.has(k) && (u === null || dist[k] < dist[u])) u = k;
      if (u === null || u === b) break;
      seen.add(u);
      for (const [v, e] of adj[u] || []) {
        const nd = dist[u] + weight(e, pref);
        if (dist[v] === undefined || nd < dist[v]) { dist[v] = nd; prev[v] = [u, e]; }
      }
    }
    if (dist[b] === undefined) return null;
    const steps = [];
    for (let v = b; v !== a; v = prev[v][0]) steps.unshift({ from: prev[v][0], to: v, e: prev[v][1] });
    return steps;
  };

  const out = $('r-out'), map = $('tmap');
  const show = () => {
    const a = $('r-from').value, b = $('r-to').value, pref = $('r-pref').value;
    map.classList.remove('has-route');
    map.querySelectorAll('.is-on').forEach(x => x.classList.remove('is-on'));
    if (a === b) { out.innerHTML = `<p class="muted">${esc(T.same)}</p>`; return; }
    const steps = route(a, b, pref);
    if (!steps) { out.innerHTML = `<p class="muted">${esc(T.none)}</p>`; return; }
    const mins = steps.reduce((s, x) => s + x.e.mins, 0);
    const waits = steps.filter(x => x.e.mode === 'ferry' || x.e.mode === 'boat').length;
    const weather = steps.some(x => x.e.weather);
    const h = Math.floor(mins / 60), m = mins % 60;
    const total = h ? fmt(T.hm, { h, m }) : fmt(T.m, { m });
    out.innerHTML = `
      <p class="eyebrow">${esc(T.result)}</p>
      <h2 class="h2 mt-s">${esc(D.nodes[a].name)} → ${esc(D.nodes[b].name)}</h2>
      <div class="kpis kpis--2 mt-m"><div><span class="eyebrow">${esc(T.moving)}</span><b>${esc(total)}</b><span class="small muted">${esc(waits ? fmt(T.plusWaits, { n: waits }) : T.noWaits)}</span></div>
      <div><span class="eyebrow">${esc(T.legs)}</span><b>${steps.length}</b><span class="small muted">${esc([...new Set(steps.map(s => D.modes[s.e.mode]))].join(' · '))}</span></div></div>
      <ol class="route mt-m">${steps.map(s => `<li><span class="ic">${svg(s.e.mode)}</span><div>
        <h3 class="h4">${esc(D.nodes[s.from].name)} → ${esc(D.nodes[s.to].name)}</h3>
        <p>${esc(s.e.name || D.modes[s.e.mode])}</p>
        <div class="meta"><span>${esc(fmt(T.about, { n: s.e.mins }))}</span>${s.e.cost ? `<span>${esc(s.e.cost)}</span>` : ''}${s.e.weather ? `<span class="chip chip--dot">${esc(T.weatherFlag)}</span>` : ''}</div>
        ${s.e.booking ? `<p class="small mt-s">${md(s.e.booking)}</p>` : ''}</div></li>`).join('')}</ol>
      ${weather ? `<div class="callout mt-m"><h3 class="h4">${esc(T.weatherTitle)}</h3><p class="small mt-s">${esc(T.weatherText)}</p></div>` : ''}
      ${pref === 'foot' ? `<p class="note mt-m">${esc(T.footNote)}</p>` : ''}`;
    map.classList.add('has-route');
    steps.forEach(s => { map.querySelector(`[data-e="${s.e.id}"]`)?.classList.add('is-on'); map.querySelector(`[data-n="${s.from}"]`)?.classList.add('is-on'); map.querySelector(`[data-n="${s.to}"]`)?.classList.add('is-on'); });
    history.replaceState(null, '', `?from=${a}&to=${b}${pref !== 'car' ? `&pref=${pref}` : ''}`);
  };
  const q = new URLSearchParams(location.search);
  if (D.nodes[q.get('from')]) $('r-from').value = q.get('from');
  if (D.nodes[q.get('to')]) $('r-to').value = q.get('to');
  if (['car', 'foot', 'heli'].includes(q.get('pref'))) $('r-pref').value = q.get('pref');
  $('route-form').addEventListener('submit', (e) => { e.preventDefault(); show(); });
  ['r-from', 'r-to', 'r-pref'].forEach(id => $(id).addEventListener('change', show));
  // Click a place on the map: first click sets "from", second sets "to"
  let pick = 'from';
  map.querySelectorAll('.nd').forEach(n => { n.style.cursor = 'pointer'; n.addEventListener('click', () => { $(`r-${pick}`).value = n.dataset.n; pick = pick === 'from' ? 'to' : 'from'; show(); }); });
  show();
})();
