# Images needed

## Photo rules (from the brief)
- High quality only: at least 2000 px on the long edge, sharp, no watermarks.
- The photo's location must match the place it illustrates.
- **Unsplash** photos carry no credit line anywhere on the site.
- **Creative Commons** photos (for example from Wikimedia Commons) are credited automatically on `/credits` from `src/images/manifest.json`.
- **Named hotels, lodges, restaurants and cafés:** show the real place only with an image you are clearly allowed to use: the venue's media kit or press terms, a booking-platform partner feed, or Creative Commons. **Never copy images from a venue's own website.** If none exists, show a correct photo of the location and list the venue here.
- Never use the Sørvágsvatn "lake above the ocean" trick shot or the Múlafossur waterfall as a hero. Never show the grindadráp.

## 1. Stays (placeholder names)
The Stays page uses **working titles** for six partner houses. Each currently shows a photo of its **location**, not the building. When the real partners are chosen, replace the name in `src/content/<lang>/pages.mjs → stays.list` and source a permitted photo of the house itself (media kit, press terms or a booking-platform partner feed).

| Working title | Location | Photo now shown | Needed |
|---|---|---|---|
| The Harbour Rooms | Tórshavn | Tórshavn harbour | Permitted photo of the actual property |
| Fjord House, Bøur | Bøur, Vágar | Bøur and Tindhólmur | Permitted photo of the actual property |
| The Gorge House | Gjógv, Eysturoy | Gjógv village | Permitted photo of the actual property |
| Sound House | Klaksvík | Klaksvík | Permitted photo of the actual property |
| Dune Cottage | Sandur, Sandoy | Sandoy landscape | Permitted photo of the actual property |
| South House | Tvøroyri, Suðuroy | Suðuroy landscape | Permitted photo of the actual property |

## 2. Named places without their own photo
These are named in the copy but shown only through a photo of their surroundings (or not shown at all). Each needs a permitted photo of its own if you want one.

| Venue | Mentioned on | Note |
|---|---|---|
| Dúvugarðar museum farm, Saksun | North Streymoy page | Shown only as part of the Saksun landscape |
| Roykstovan, Kirkjubøur | Tórshavn & Kirkjubøur page | Historic farmhouse, still a private home: check any photo licence |
| Hugskotið / Sjóvinnuhúsið, Tórshavn (our office) | About, footer | No photo used |

## 3. Nice to have
- Winter photographs (snow, low sun, storm) for the "Four nights of winter light" journey, which currently uses a Tórshavn photo.
- A close-up of Faroese knitwear (the knitting motif is drawn in SVG for now).

## 4. Photos to upgrade to full resolution
Wikimedia Commons was rate-limiting downloads when the site was built, so these photos were saved at the largest size it would serve, 1920 px. The originals are larger. Download each one from its source page, replace the file in `src/images/raw/`, delete its old files in `public/img/` and run `npm run images`.

| File | Place | Current size | Source |
|---|---|---|---|
| `hero-cliffs-3.jpg` | Beinisvørð, Suðuroy | 1920×1278 | [source](https://commons.wikimedia.org/wiki/File:Beinisv%C3%B8r%C3%B0.Su%C3%B0uroy.1.jpg) |
| `kirkjubour-2.jpg` | Kirkjubøur, Streymoy | 1920×1280 | [source](https://commons.wikimedia.org/wiki/File:Kirkjub%C3%B8ur_2026_33.jpg) |
| `vagar-bour-1.jpg` | Bøur, Vágar | 1920×1277 | [source](https://commons.wikimedia.org/wiki/File:Is03102-Bour.jpg) |
| `vagar-bour-2.jpg` | Bøur, Vágar | 1920×1277 | [source](https://commons.wikimedia.org/wiki/File:Is03109-Bour.jpg) |
| `vestmanna-1.jpg` | Vestmanna bird cliffs, Streymoy | 1920×1278 | [source](https://commons.wikimedia.org/wiki/File:Vestmannabj%C3%B8rgini,_Faroe_Islands.JPG) |
| `gjogv-2.jpg` | Gjógv, Eysturoy | 1920×1280 | [source](https://commons.wikimedia.org/wiki/File:Gj%C3%B3gv_2026_02.jpg) |
| `vidoy-enniberg-1.jpg` | Enniberg, Viðoy | 1920×1536 | [source](https://commons.wikimedia.org/wiki/File:Enniberg_by_sea.jpg) |
| `nolsoy-2.jpg` | Nólsoy village, Nólsoy | 1920×1279 | [source](https://commons.wikimedia.org/wiki/File:N%C3%B3lsoy,_Faroe_Islands_02.jpg) |
| `sandoy-2.jpg` | Sandsvatn, Sandoy | 1920×1440 | [source](https://commons.wikimedia.org/wiki/File:Sandsvatn_a_Lake_on_Sandoy_in_the_Faroe_Islands.JPG) |
| `suduroy-1.jpg` | Hvalba, Suðuroy | 1920×1337 | [source](https://commons.wikimedia.org/wiki/File:Hvalba.Su%C3%B0uroy.1.jpg) |
| `helicopter-1.jpg` | Tórshavn | 1920×1440 | [source](https://commons.wikimedia.org/wiki/File:OY-HIL_helicopter_in_Torshavn.jpg) |
| `basalt-1.jpg` | Froðba, Suðuroy | 1920×1278 | [source](https://commons.wikimedia.org/wiki/File:Columnar_basalt_at_Fro%C3%B0ba,_Faroe_Islands.jpg) |
| `turf-roof-1.jpg` | Tjørnuvík, Streymoy | 1920×1277 | [source](https://commons.wikimedia.org/wiki/File:Is03071-Tjornuvik.jpg) |

## 5. Source photos available but not used yet
- `saksun-3.jpg`: Saksun valley in autumn
- `helicopter-1.jpg`: Atlantic Airways helicopter (for the transport planner)

