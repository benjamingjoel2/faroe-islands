# Eighteen Islands

A fast, static, four-language travel website for the Faroe Islands: trips planned around the weather.

- **Live site:** __LIVE_URL__
- **Intended domain:** https://eighteenislands.tourground.com (set in `src/config.mjs → siteUrl`, used for canonical URLs, hreflang, the sitemap and JSON-LD)
- **Languages:** English at `/`, French at `/fr/`, German at `/de/`, Spanish at `/es/`

There is no framework and no client-side translation. A small Node script renders every page in every language to plain HTML in `dist/`.

---

## Run it locally

Requires Node 18 or newer.

```bash
npm install
```

```bash
npm run dev
```

This builds the site and serves `dist/` at http://localhost:4321, with the same clean URLs as Vercel.

Other commands:

| Command | What it does |
|---|---|
| `npm run build` | Renders all pages to `dist/` (about a second). This is what Vercel runs. |
| `npm run serve` | Serves the existing `dist/` without rebuilding. |
| `npm run images` | Makes responsive AVIF/WebP versions of new photos in `src/images/raw/` (see below). |
| `node scripts/check-i18n.mjs` | Checks that French, German and Spanish have exactly the same structure as English. |

The build stops with an error if a translation is missing a key, has a different number of items, or changes a number, placeholder or link. Fix the locale file and build again.

---

## Where things live

```
src/
  config.mjs            ← brand name, email, address, palette, fonts, site URL, form endpoint
  content/
    en/ fr/ de/ es/     ← ALL the words, one folder per language
      ui.mjs            navigation, footer, buttons, month names, 404
      pages.mjs         home, journeys, stays, about, FAQ, journal, enquiry form
      places.mjs        the nine destination pages
      tools.mjs         weather planner, hiking access guide, transport planner
      legal.mjs         privacy policy, booking terms, cookie policy, credits text
      alts.mjs          image alt text, per photo
  data/
    regions.mjs         which photos and walks belong to each destination
    walks.mjs           fees, guide rules, exposure, per walk
    transport.mjs       places and links for the tunnel/ferry/helicopter planner
    climate.mjs         monthly temperature, rain days, wind and fog levels, seasons
  templates/            HTML for the layout and every page type
  assets/css/site.css   the whole design system (inlined into each page)
  assets/js/            site.js (menus, animations, form), planner.js, transport.js
  images/raw/           original photos (input to npm run images)
  images/manifest.json  source, author, licence and location of every photo
  fonts/                self-hosted Fraunces and Schibsted Grotesk (woff2)
public/img/             generated responsive images (committed, so Vercel doesn't regenerate them)
scripts/                build, images, local server, i18n checker
```

### Change the brand
Edit `src/config.mjs`. The brand name, email, business address, palette (CSS variables), font stacks and site URL are all set there. The footer, contact page, legal pages and JSON-LD all read from it.

### Change the words
Edit `src/content/en/…`, then make the same change in `fr`, `de` and `es`, and run `npm run build`.
- `*words*` in copy become the italic serif accent.
- `[text](url)` becomes a link. Internal links such as `/weather-planner` get the right language prefix automatically.
- `{placeholders}` such as `{n}` or `{email}` are filled in at build time. Keep them in every language.

### Change fees, fares or timetables
Fees per walk: `src/data/walks.mjs` (the number) and `src/content/<lang>/tools.mjs → walks` (the text). Fares and tolls: `src/content/<lang>/tools.mjs → transport.edges`. Journey times: `src/data/transport.mjs`. Every price must read **"From …"**. Never add a price you can't source. Check everything in **FACTS-TO-VERIFY.md** each season.

### Add or replace a photo
1. Put a high-quality JPEG (at least 2000 px on the long edge) in `src/images/raw/`, named like `place-1.jpg`.
2. Add an entry to `src/images/manifest.json` with location, source, author and licence. Creative Commons photos are credited automatically on the Credits page; Unsplash photos are never credited on the site.
3. Add alt text for the file to `src/content/<lang>/alts.mjs` in all four languages.
4. Run `npm run images`, then reference the file in `src/data/regions.mjs` or the content.
5. Only use a photo whose location matches the place it illustrates. For named hotels, restaurants or cafés, follow **IMAGES-NEEDED.md**.

### Enquiry form
The form posts to [FormSubmit](https://formsubmit.co), which forwards submissions to the email in `src/config.mjs`. **The first submission sends an activation email to that inbox: click the link once to start receiving enquiries.** To use another service, change `formEndpoint` (AJAX/JSON) and `formFallback` (plain POST without JavaScript) in `src/config.mjs`.

---

## Performance

- No render-blocking JavaScript; `site.js` is deferred (about 4 KB). The planner scripts load only on their own pages.
- CSS is minified and inlined into each page.
- Fonts: three self-hosted woff2 files, Latin subset, `font-display: swap`, with the two main ones preloaded.
- Images: AVIF and WebP at 480 to 2560 px with `srcset`/`sizes`, and `width`/`height` on every image. Below-the-fold images are lazy-loaded. The hero is preloaded with `fetchpriority="high"`.
- `vercel.json` sets one-year immutable caching for `/img`, `/fonts` and `/assets`.
- There is no video, so mobile only ever loads still images.

## Deploying (Vercel)

`vercel.json` sets the build command (`npm run build`), output folder (`dist`) and clean URLs. Pushing to `main` on GitHub triggers a production deploy.

## Documents

- **FACTS-TO-VERIFY.md**: every fact that needs checking before launch and each season.
- **IMAGES-NEEDED.md**: venue photos still to source, and the photo rules.
