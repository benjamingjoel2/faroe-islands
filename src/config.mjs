// ─────────────────────────────────────────────────────────────
//  BRAND CONFIG — the single place to swap the brand.
//  Name, contact details, address, palette, fonts and URLs live here.
//  Every page, the footer, legal pages and JSON-LD read from this file.
// ─────────────────────────────────────────────────────────────

export default {
  brand: {
    name: 'Eighteen Islands',
    shortName: 'Eighteen Islands',
    // Wordmark split used by the giant hero type and the logo
    wordmark: ['Eighteen', 'Islands'],
    legalName: 'Eighteen Islands',
    foundingYear: 2026,
  },

  // Live site URL (no trailing slash). Format: eighteenislands.tourground.com
  siteUrl: 'https://eighteenislands.tourground.com',
  // Vercel production URL (filled in after the first deploy)
  vercelUrl: 'https://faroe-islands.vercel.app',

  contact: {
    // The only email address used anywhere on the site
    email: 'eighteenislands@tourground.com',
  },

  // Business address — the coworking space we work from in Tórshavn.
  address: {
    venue: 'Hugskotið (Sjóvinnuhúsið)',
    street: 'Vestara Bryggja 15',
    postalCode: 'FO-100',
    locality: 'Tórshavn',
    country: 'Faroe Islands',
    countryCode: 'FO',
  },

  // Enquiry form endpoint. FormSubmit forwards submissions to the email
  // above; the first submission sends an activation email to that inbox.
  // Swap for any endpoint that accepts a standard POST.
  formEndpoint: 'https://formsubmit.co/ajax/eighteenislands@tourground.com',
  formFallback: 'https://formsubmit.co/eighteenislands@tourground.com',

  // Palette — TURF ROOF AND FOG. Written into :root as CSS variables.
  palette: {
    tar: '#121412',        // tar black (tarred wood)
    tar2: '#1a1e1a',       // a lifted tar for panels
    turf: '#3e5b34',       // turf green (grass roofs)
    turfDeep: '#22341d',
    fog: '#c7ccc5',        // fog grey
    fogDeep: '#8d958b',
    wool: '#eee8db',       // wool cream
    woolDeep: '#ddd5c3',
    puffin: '#e2652a',     // puffin-beak orange — accent only
    puffinInk: '#a8440f',  // darker orange for text on cream (AA)
  },

  fonts: {
    display: "'Fraunces', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
    text: "'Schibsted Grotesk', 'Helvetica Neue', Arial, sans-serif",
    mono: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace",
  },

  // Languages: English at the root, others in sub-folders.
  locales: ['en', 'fr', 'de', 'es'],
  defaultLocale: 'en',
};
