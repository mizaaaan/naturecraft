# Nature Craft

A small bilingual landscape-design website for Nature Craft in Doha. The project is plain HTML, CSS, and JavaScript: it has no build step or package dependencies.

## Project map

| File or folder      | What it contains                                                                                      |
| ------------------- | ----------------------------------------------------------------------------------------------------- |
| `index.html`        | Page structure, navigation, and clearly labeled sections in display order.                            |
| `styles.css`        | Design tokens, shared layout, component styles, responsive rules, and reduced-motion handling.        |
| `app.js`            | Bilingual copy and site data, garden-scene illustration helpers, section rendering, and interactions. |
| `media/`            | Local CC0 garden photographs used in the hero and style selector.                                     |
| `MEDIA-LICENSES.md` | Photo sources and licensing notes.                                                                    |

## Page sections

The matching HTML comments and section IDs make each section easy to find in `index.html`:

1. `#top` — hero and introduction
2. `#services` — service cards
3. `#styles` — garden-style photo selector and morning / dusk / night controls
4. `#plants` — plant selector and care facts
5. `#process` — project timeline
6. `#year` — seasonal garden calendar
7. `#plans` — care-plan cards
8. `#contact` — enquiry form

The site header and footer sit outside `<main>` and have their own labels.

## Where to edit content

- **English and Arabic wording:** edit the `en` and `ar` values in the data groups near the top of `app.js`.
- **Garden selector photos and alt text:** edit `SCENE_MEDIA` in `app.js`; keep the photo file and its credit in `media/` and `MEDIA-LICENSES.md` in sync.
- **Plants and care information:** edit `PLANTS` in `app.js`.
- **Business phone, email, and WhatsApp:** set the real values in `CONFIG` in `app.js` before launch. Contact rows stay hidden while blank. The WhatsApp button opens the configured business chat when a number is set; otherwise it opens WhatsApp's recipient picker with the enquiry text ready. Use the international country code without `+` or spaces for WhatsApp (for example, `974...`).
- **Care-plan enquiries:** each plan card carries its selected plan into the contact message automatically.
- **Colors and fonts:** edit the custom properties at the top of `styles.css`.
- **Layout and appearance:** use the named component groups in `styles.css` (navigation, hero, garden designer, plants, process, calendar, plans, contact, footer).
- **Page structure:** edit the named section in `index.html`; keep its `id` if navigation links depend on it.

## Run locally

From this folder, start any static file server. If Python is installed, run:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. The site loads its scripts, stylesheet, and photos from this folder. Google Fonts are loaded from the web.

## Before handover or launch

- Add the business phone, email, and WhatsApp number to `CONFIG` in `app.js`.
- Confirm the contact section's service areas and the callback wording in `index.html` match the business.
- Check the photo credits in `MEDIA-LICENSES.md` if media files are replaced.
- Open the page in a browser and check both English and Arabic, desktop and mobile layouts, each garden-style/time-of-day control, the plant selector, seasonal tabs, and an enquiry from every care plan.

## How the JavaScript is organized

`app.js` is wrapped in a private function so its helpers do not create global variables. Its labeled groups are:

1. Scene color palettes, SVG primitives, and four garden compositions
2. Bilingual website content and configuration
3. Shared selections and section renderers
4. Language switching, contact-message helpers, and event bindings
5. Initialization

The photo-based garden selector is separate from the hero's animated concept illustration. The illustration engine remains available for the hero scene; the selector photo changes with the chosen garden and time of day.
