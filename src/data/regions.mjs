// Language-neutral data for the nine destination pages.
// Text for each lives in src/content/<lang>/places.mjs under the same id.
// hero / gallery reference files in src/images/raw (see manifest.json).

export const REGIONS = [
  { id: 'torshavn', slug: 'torshavn-kirkjubour', num: '01', hero: 'torshavn-1.jpg', card: 'torshavn-1.jpg', gallery: ['kirkjubour-1.jpg', 'torshavn-2.jpg', 'kirkjubour-2.jpg', 'kirkjubour-3.jpg'], walks: ['kirkjubour-path'], node: 'torshavn' },
  { id: 'vagar', slug: 'vagar', num: '02', hero: 'vagar-bour-1.jpg', card: 'vagar-bour-1.jpg', gallery: ['vagar-gasadalur-1.jpg', 'vagar-sorvagsvatn-1.jpg', 'vagar-bour-2.jpg'], walks: ['traelanipan', 'gasadalur-postal', 'drangarnir'], node: 'sorvagur' },
  { id: 'mykines', slug: 'mykines', num: '03', hero: 'mykines-1.jpg', card: 'puffin-1.jpg', gallery: ['puffin-1.jpg', 'mykines-2.jpg', 'hero-village-2.jpg'], walks: ['mykines'], node: 'mykines' },
  { id: 'streymoy', slug: 'streymoy-north', num: '04', hero: 'saksun-1.jpg', card: 'saksun-1.jpg', gallery: ['tjornuvik-1.jpg', 'vestmanna-1.jpg', 'saksun-2.jpg', 'turf-roof-1.jpg'], walks: ['saksun-lagoon', 'tjornuvik-saksun'], node: 'saksun' },
  { id: 'eysturoy', slug: 'eysturoy', num: '05', hero: 'gjogv-1.jpg', card: 'gjogv-1.jpg', gallery: ['slaettaratindur-1.jpg', 'funningur-1.jpg', 'hero-cliffs-2.jpg', 'sheep-1.jpg'], walks: ['slaettaratindur', 'gjogv-gorge'], node: 'gjogv' },
  { id: 'north', slug: 'klaksvik-northern-isles', num: '06', hero: 'kallur-1.jpg', card: 'kallur-1.jpg', gallery: ['klaksvik-1.jpg', 'vidoy-enniberg-1.jpg', 'kunoy-1.jpg', 'kallur-2.jpg'], walks: ['kallur', 'villingadalsfjall', 'klakkur'], node: 'klaksvik' },
  { id: 'nolsoy', slug: 'nolsoy', num: '07', hero: 'nolsoy-1.jpg', card: 'nolsoy-1.jpg', gallery: ['nolsoy-2.jpg'], walks: ['nolsoy-lighthouse'], node: 'nolsoy' },
  { id: 'sandoy', slug: 'sandoy-skuvoy', num: '08', hero: 'sandoy-1.jpg', card: 'sandoy-1.jpg', gallery: ['skuvoy-1.jpg', 'sandoy-2.jpg'], walks: ['skuvoy-cliffs', 'soltuvik'], node: 'sandur' },
  { id: 'suduroy', slug: 'suduroy', num: '09', hero: 'suduroy-1.jpg', card: 'suduroy-1.jpg', gallery: ['hero-cliffs-3.jpg', 'suduroy-2.jpg', 'basalt-1.jpg', 'ferry-1.jpg'], walks: ['beinisvord'], node: 'tvoroyri' },
];

export const regionById = Object.fromEntries(REGIONS.map(r => [r.id, r]));
