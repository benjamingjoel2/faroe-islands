# Facts to verify

Every fact the site states that can change, or that we could only partly confirm. Researched on **16 November 2026**. Check each item before launch and then **every season**, especially fees, timetables and fares.

Where the copy lives:
- Destination pages: `src/content/<lang>/places.mjs`
- Walks, planner, transport and month strip: `src/content/<lang>/tools.mjs`, `src/data/walks.mjs`, `src/data/transport.mjs`, `src/data/climate.mjs`
- FAQ, journeys, journal: `src/content/<lang>/pages.mjs`

Change English first, then the same keys in `fr`, `de` and `es`.

Confidence: **[C]** confirmed on an official or primary source · **[L]** likely: consistent secondary sources · **[U]** unsure: conflicting, old or not found.

---

## 1. Business address
- [ ] **Hugskotið, Vestara Bryggja 15, FO-100 Tórshavn** (in Sjóvinnuhúsið, the business building by the west harbour). [C] address from hugskotid.fo.
  - We found no commercial "premium" coworking brand in Tórshavn. Hugskotið is the municipal innovation house and coworking space, and the only Tórshavn workspace with a verifiable official address.
  - Confirm that the business actually has membership or a desk agreement there before publishing. If not, change `address` in `src/config.mjs`; the footer, contact page, legal pages and JSON-LD all update from it.

## 2. Entry rules (they differ by nationality)
- [ ] The Faroes are part of the Kingdom of Denmark but **outside the EU and Schengen**. [C] visitfaroeislands.com/en/passport-and-visa
- [ ] A Schengen or Danish visa is **not** valid for the Faroes. Visa-required nationals need a visa marked valid for the Faroe Islands, applied for through a Danish mission. [C] nyidanmark.dk, um.dk
- [ ] EU/Schengen citizens need no visa; a passport or national ID card is accepted. Nordic citizens need photo ID. [L]
- [ ] Flights via Copenhagen involve Schengen checks. [L]
- [ ] EU "roam like at home" does not apply. [L]
- [ ] Faroese króna at par with the Danish krone; Danish notes are accepted. [C] nationalbanken.dk
- [ ] Visitor sustainability fee: DKK 20 per night for ages 16+ in paid accommodation, capped at DKK 200 per stay, from 1 Feb 2026. [C]

## 3. Hiking fees, guides and rules (per walk)
Official table: visitfaroeislands.com, "Hiking guidelines & restrictions". The page warns that fees may change under the new sustainable tourism law.

| Walk | What the site says | Confidence |
|---|---|---|
| Trælanípa / Sørvágsvatn | Unguided From DKK 200; guided From DKK 450, three times a day; guide **not** compulsory; book at tralanipan.fo | [C] |
| Drangarnir | From DKK 600 including guide; guide compulsory; set days, about Apr–Oct; hiking.fo | [C] |
| Gásadalur postman’s path | "No published fee found" | [U] |
| Mykines | Guide compulsory 1 May–31 Aug; landowner fee From DKK 400 online (500 on the day); a September fee still applies (reported as DKK 250, no guide) | [C] / Sept [L] |
| Mykines lighthouse path | Closed after a landslide | [C] check if reopened |
| Saksun lagoon | Farm-gate fee of DKK 75 (since 2019); current status not confirmed | [U] |
| Tjørnuvík–Saksun ridge | "No published fee found" | [U] |
| Slættaratindur | "No published fee found"; not recommended without a guide in winter | [U] / [C] |
| Gjógv gorge path | No fee | [U] |
| Kallur (Kalsoy) | From DKK 200 adult, less for ages 13–17, free under 13; cards on site; no guide | [C] |
| Villingardalsfjall | From DKK 200, paid in the box at the gate; no guide | [C] |
| Enniberg | Booked guide compulsory; fee not found | [C] guide / [U] fee |
| Klakkur | "No published fee found" | [U] |
| Nólsoy | Free for individuals; commercial groups pay a permit fee (DKK 100) | [C] |
| Kirkjubøur old path, Skúvoy, Søltuvík, Beinisvørð | "No published fee found" | [U] |

- [ ] Dogs must not be taken into the outfield, all year. [C]
- [ ] Leave gates as you find them; don't disturb sheep or birds. [C]
- [ ] Lambing from the end of April into May. No official lambing-season trail ban was found. [U]
- [ ] Hare hunting from early November to the end of December; visitors advised to stay off the mountains. The exact dates vary by source (2 Nov–31 Dec or 1 Nov–1 Jan). [L]
- [ ] Bird rules on Mykines: stay with the guide and on the path. No separate published nesting regulations were found. [U]
- [ ] "Closed for Maintenance" weekend each spring (2026: 30 Apr–2 May). Check next year's dates. [C]
- [ ] Gásadalur: "park only in marked spaces". [U]

## 4. Mykines, puffins, Vestmanna
- [ ] Puffins arrive at the end of April or in May and leave by late August. [C] visitvagar.fo
- [ ] Mykines boat (route 36, Jósup): three sailings a day 1 May–31 Aug (Sørvágur 09:30, 13:30, 17:30 in 2026); fewer sailings in April and Sep–Oct; 45 min; From DKK 153 each way; book online; changes need 24 h notice; no cars. [C] ssl.fo
- [ ] Vestmanna bird-cliff boats: main season about April–October; bird numbers fall after mid-August. [L]
- [ ] Dúvugarðar museum farm in Saksun: open 1 May–30 Sep. [L]
- [ ] Nólsoy storm petrel colony and guided night visits. [U]

## 5. Festivals and dates
- [ ] Ólavsøka: 28–29 July every year; most businesses close on the 29th. [C]
- [ ] G! Festival (Gøta): mid-July (2026: 16–18 July). Check 2027. [C for 2026]
- [ ] Varmakelda (Fuglafjørður): early July (2026: 3–5 July). [L]
- [ ] Summarfestivalurin (Klaksvík): early August (2026: 6–8 Aug). [L]
- [ ] Jóansøka (Suðuroy): late June; Vágur in even years, Tvøroyri in odd years. [C for alternation]
- [ ] Header status line "Puffins return to Mykines in May" (`ui.status`). Update it seasonally.

## 6. Tunnels, ferries and helicopter
### Tunnels ([C] tunnil.fo, car up to 3,500 kg)
- [ ] Vágatunnilin: From DKK 50 return, charged once when leaving Vágar. 4.9 km, opened 2002.
- [ ] Norðoyatunnilin: From DKK 50 return, charged once when leaving Klaksvík. 6.2 km, opened 2006.
- [ ] Eysturoyartunnilin: From DKK 175 per passage (Streymoy–Eysturoy); Strendur–Runavík From DKK 125. 11.2 km with subsea roundabout, opened Dec 2020. Charged in each direction. [L]
- [ ] Sandoyartunnilin: From DKK 175 per passage, opened Dec 2023, 10.8 km. Charged in each direction. [L]
- [ ] Pay online at tunnil.fo within 6 days (late fee DKK 50). Rental cars: the rental company charges. Paying at petrol stations is no longer mentioned. [C] / [U]
- [ ] Artwork in the Eysturoyartunnilin roundabout by Tróndur Patursson. [L]

### Ferries and boats ([C] ssl.fo/en/prices, lowest listed adult fare)
- [ ] Route 7 Tórshavn–Krambatangi (Suðuroy), Smyril: about 2 h 05; 2–3 a day each way; From DKK 109 adult, car From DKK 229, each way; vehicles queue 15 min before.
- [ ] Route 90 Tórshavn–Nólsoy, Ternan: about 30 min; 5–7 a day; From DKK 131 return paid outbound; book both directions; arrive 10 min early.
- [ ] Route 56 Klaksvík–Syðradalur (Kalsoy), Sam: about 20 min; From DKK 131 return, car From DKK 336 return, paid outbound; more sailings 1 May–14 Sep.
- [ ] Route 58 Hvannasund–Svínoy–Kirkja–Hattarvík, Ritan: not daily; some on request (order 2 h ahead); From DKK 131 return.
- [ ] Route 61 Gamlarætt–Hestur: about 15 min (inferred) [L]; 5 a day on weekdays, 3 at weekends; From DKK 66 each way.
- [ ] Route 66 Sandur–Skúvoy: about 35 min; early sailings ordered by phone by 21:00 the day before; From DKK 66 each way.
- [ ] Tourist Travel Card (4-day DKK 500, 7-day DKK 700) excludes Mykines. Not shown on the site. [C]
- [ ] Airport bus 300 Tórshavn–airport: about 50 min. Fare not found. [C time]

### Helicopter ([U]: the Atlantic Airways pages could not be read)
- [ ] Scheduled days Sunday, Wednesday and Friday (the planner flags these days as "Helicopter day"). [L]
- [ ] Booking opens 7 days ahead (2 days for Froðba); residents have priority. [L]
- [ ] Tourists can generally book one way only; no refund if you fly one way and the boat back is cancelled. [L]
- [ ] Vágar–Mykines fare reported as DKK 145 one way. **Not shown on the site** ("Fare on atlanticairways.com"). [U]
- [ ] Routes shown on the map (Vágar–Mykines, Klaksvík–Svínoy, Tórshavn–Skúvoy, Tórshavn–Froðba) and flight times (about 7–20 min) are approximate. [U]

### Driving times
- [ ] Road times in `src/data/transport.mjs` are typical estimates (e.g. airport–Tórshavn about 45 min). [L]

## 7. Daylight
- [ ] Calculated with the NOAA solar algorithm for Tórshavn (62.01° N, 6.77° W), with clocks on UTC+0 in winter and UTC+1 from the last Sunday in March to the last Sunday in October. Spot-checked against timeanddate.com to within about 3 minutes. [L]

## 8. Weather and safety
- [ ] Monthly mean temperatures and rain days: DMI climate normals 1991–2020 for Tórshavn. [L]
- [ ] **Wind and fog levels in `src/data/climate.mjs` are our qualitative guide, not measurements.** Storms are strongest in winter; sea fog is commonest in July–August. No monthly fog-day statistics were found. [U]
- [ ] "Too exposed today" thresholds (12 m/s mean, 18 m/s gusts or fog = too exposed; 8 m/s, 13 m/s gusts or low cloud = think twice) are **our own cautious guidance**, not an official standard. Consider review by a local guide.
- [ ] Forecasts at vedur.fo; road conditions at landsverk.fo; emergency number 112. [C]
- [ ] Mountain rescue is volunteer-based. [C]
- [ ] Popular hikes not recommended without a guide in winter. [C]

## 9. Driving rules
- [ ] Drive on the right; 50 km/h in towns and villages, 80 km/h elsewhere; headlights on at all times; seat belts. [C]
- [ ] Single-lane tunnels: the direction with the passing places on its side gives way. [L]
- [ ] Sheep roam freely on roads. [C]
- [ ] Off-road driving prohibited. [C]
- [ ] Drink-driving limit: not stated on the site (sources disagree: 0.5‰ vs 0.2‰). [U]
- [ ] Parking discs: not stated on the site (no source found). [U]

## 10. Places, heights, history
- [ ] Slættaratindur 880 m. [C] Enniberg 754 m. [C] Beinisvørð about 470 m. [C]
- [ ] Sørvágsvatn is the largest lake in the Faroes. [L]
- [ ] Viðareiði is the northernmost village. [L]
- [ ] Enniberg is "one of the highest sea cliffs in Europe". [L]
- [ ] Gjógv "one of the best preserved villages". [L]
- [ ] Magnus Cathedral ruin (about 1300); Ólavskirkjan (dated about 1111 by some sources, 13th century by others: the site avoids a date); Roykstovan lived in "for centuries" (the site avoids a date). [L]
- [ ] Tinganes: "said to have met since Viking times" (traditionally about 825 AD; the site avoids a date). [L]
- [ ] Hvalba coal mining history. [L]
- [ ] Eighteen islands, seventeen inhabited (Lítla Dímun is uninhabited). [C]
- [ ] Gásadalur was reachable only over the mountain or by sea before its tunnel. [L]
- [ ] Old postman's path Bøur–Gásadalur; Tjørnuvík–Saksun ridge path; Tórshavn–Kirkjubøur old path: these routes exist, but check condition and signage. [L]

## 11. Grindadráp (FAQ wording)
- [ ] Community drive hunt of long-finned pilot whales; legal and regulated (Act on Pilot Whales and Other Whales; Grindadráp Regulation); appointed foremen; participants certified; a required killing method; records since 1584 ("16th century"); most hunts July–September. [C] whaling.fo, Library of Congress
- [ ] Meat and blubber shared locally, not sold commercially. [L]
- [ ] A May 2026 regulation change was reported by an advocacy group but is not verified. It is **not** mentioned on the site. [U]

## 12. Prices on the site
Every price reads "From DKK …" and comes from an official fare or fee table. **No trip prices are published.** If any fare or fee changes, update it in all four languages.
