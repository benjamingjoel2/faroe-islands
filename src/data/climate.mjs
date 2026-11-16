// Typical conditions by month in Tórshavn.
// temp = mean °C and rain = days with ≥1 mm: DMI climate normals 1991–2020.
// wind and fog are our qualitative 0–3 scales (0 calmest/clearest, 3 worst), based on
// published descriptions: storms strongest in winter, sea fog commonest in July–August.
// Daylight is calculated, not stored (see src/templates/lib.mjs → sunTimes).
// Season keys are labelled in src/content/<lang>/tools.mjs → seasons. See FACTS-TO-VERIFY.md.
export const CLIMATE = [
  { temp: 4.3, rain: 21, wind: 3, fog: 1, seasons: ['dark'] },
  { temp: 4.0, rain: 17, wind: 3, fog: 1, seasons: [] },
  { temp: 4.3, rain: 19, wind: 3, fog: 1, seasons: [] },
  { temp: 5.5, rain: 15, wind: 2, fog: 1, seasons: ['mykinesLimited', 'puffinsArrive'] },
  { temp: 7.1, rain: 12, wind: 1, fog: 2, seasons: ['puffins', 'mykines', 'lambing'] },
  { temp: 9.1, rain: 9, wind: 1, fog: 2, seasons: ['puffins', 'mykines', 'light', 'joansoka'] },
  { temp: 10.8, rain: 11, wind: 1, fog: 3, seasons: ['puffins', 'mykines', 'festivals', 'olavsoka'] },
  { temp: 11.2, rain: 13, wind: 1, fog: 3, seasons: ['puffins', 'mykines', 'festivals'] },
  { temp: 10.0, rain: 16, wind: 2, fog: 2, seasons: ['mykinesLimited'] },
  { temp: 7.8, rain: 19, wind: 2, fog: 1, seasons: ['mykinesLimited'] },
  { temp: 5.8, rain: 20, wind: 3, fog: 1, seasons: ['hare'] },
  { temp: 4.5, rain: 20, wind: 3, fog: 1, seasons: ['hare', 'dark'] },
];

// Fixed-date events the planner flags (month is 1–12)
export const EVENTS = [
  { key: 'olavsoka', from: [7, 28], to: [7, 29] },
  { key: 'maintenance', from: [4, 30], to: [5, 2], year: 2026 },
];
