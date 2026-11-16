// Popular walks — language-neutral facts. Names and notes: src/content/<lang>/tools.mjs → walks.
// fee: adult landowner/hiking fee in DKK as published (shown as "From DKK n"); null = none published.
// guide: 'required' | 'seasonal' (required part of the year) | 'optional' (guided option exists) | 'no'
// exposure: 'high' = cliff edges / summit / open ridge (gets the "too exposed today" check)
// All values need checking each season — see FACTS-TO-VERIFY.md.
export const WALKS = [
  { id: 'traelanipan', region: 'vagar', farmland: true, fee: 200, guide: 'optional', exposure: 'high', kind: 'cliff', nesting: false },
  { id: 'drangarnir', region: 'vagar', farmland: true, fee: 600, guide: 'required', exposure: 'high', kind: 'cliff', nesting: false },
  { id: 'gasadalur-postal', region: 'vagar', farmland: true, fee: null, guide: 'no', exposure: 'high', kind: 'ridge', nesting: false },
  { id: 'mykines', region: 'mykines', farmland: true, fee: 400, guide: 'seasonal', exposure: 'high', kind: 'cliff', nesting: true },
  { id: 'saksun-lagoon', region: 'streymoy', farmland: true, fee: 75, guide: 'no', exposure: 'low', kind: 'shore', nesting: false },
  { id: 'tjornuvik-saksun', region: 'streymoy', farmland: true, fee: null, guide: 'no', exposure: 'high', kind: 'ridge', nesting: false },
  { id: 'slaettaratindur', region: 'eysturoy', farmland: true, fee: null, guide: 'no', exposure: 'high', kind: 'summit', nesting: false },
  { id: 'gjogv-gorge', region: 'eysturoy', farmland: false, fee: null, guide: 'no', exposure: 'low', kind: 'shore', nesting: false },
  { id: 'kallur', region: 'north', farmland: true, fee: 200, guide: 'no', exposure: 'high', kind: 'cliff', nesting: false },
  { id: 'villingadalsfjall', region: 'north', farmland: true, fee: 200, guide: 'no', exposure: 'high', kind: 'summit', nesting: false },
  { id: 'enniberg', region: 'north', farmland: true, fee: null, guide: 'required', exposure: 'high', kind: 'cliff', nesting: true },
  { id: 'klakkur', region: 'north', farmland: true, fee: null, guide: 'no', exposure: 'high', kind: 'summit', nesting: false },
  { id: 'nolsoy-lighthouse', region: 'nolsoy', farmland: true, fee: null, guide: 'no', exposure: 'low', kind: 'shore', nesting: true },
  { id: 'kirkjubour-path', region: 'torshavn', farmland: true, fee: null, guide: 'no', exposure: 'low', kind: 'ridge', nesting: false },
  { id: 'skuvoy-cliffs', region: 'sandoy', farmland: true, fee: null, guide: 'no', exposure: 'high', kind: 'cliff', nesting: true },
  { id: 'soltuvik', region: 'sandoy', farmland: true, fee: null, guide: 'no', exposure: 'low', kind: 'shore', nesting: false },
  { id: 'beinisvord', region: 'suduroy', farmland: true, fee: null, guide: 'no', exposure: 'high', kind: 'cliff', nesting: true },
];
