# NFC / Personal CV page — Context file

> **Purpose.** One document that gives a human collaborator or an LLM all the context needed to continue development on Arthur's personal NFC/CV page without reading every source file first.

---

## 1. What is this page?

The root `index.html` in the `my-cv` repository is Arthur Callewaert's **personal/CV landing page**.

- Deployed on **GitHub Pages** at `https://arthurcallewaert03.github.io/my-cv/`
- The page also doubles as an **NFC networking page** — it embeds a QR code that links back to itself and is the destination URL stored on Arthur's physical NFC business card / tag.
- **No framework, no build step, no external CSS/JS.** All CSS is inlined in `<style>` in `<head>`; all JS is inlined in `<script>` at the bottom of `<body>`.

---

## 2. Repository layout (relevant files)

```
my-cv/  (root = GitHub Pages site)
├── index.html                  # The page (fully self-contained)
├── arthur-callewaert.vcf       # vCard 3.0 download (Save my contact)
├── cv3_30_sept.pdf             # CV PDF download
├── Arthur Callewaert 336213.jpg  # Portrait photograph
├── assets/
│   ├── networking-qr.svg       # QR code → https://arthurcallewaert03.github.io/my-cv/
│   └── networking-qr.png       # Same QR, downloadable PNG
├── my-links/                   # Separate link-tree sub-project (see my-links/CONTEXT.md)
└── tapkit/                     # Separate NFC/QR/RFID app (see tapkit/CONTEXT.md)
```

---

## 3. Page sections

| Section | ID | Description |
|---|---|---|
| Header (sticky) | — | `ac.` monogram; nav: Work · About · Contact |
| Hero | — | Name, tagline, role, intro text; portrait photo; LinkedIn + Save contact buttons; CV link |
| Journey bar | — | Three-stop timeline: Engineering → Data science → Business & AI |
| Work | `#work` | Two project cards: Regulatory Watch (featured) + Everest Analytics Data Challenge (award winner 2026) |
| About / Opportunity | `#about` | Personal interests; graduate role search callout |
| Icebreaker | — | "Next time we meet, ask me about…" — hockey coaching, home servers, cooking |
| Contact | `#contact` | Email + Save contact; expandable networking QR code section |
| Footer | — | Tagline + back-to-top |

---

## 4. Design tokens (CSS custom properties)

```css
:root {
  --ink:   #172e40;   /* primary dark navy — text, borders, buttons */
  --muted: #52616b;   /* secondary grey — body copy, labels */
  --paper: #f5f4ef;   /* page background (warm off-white) */
  --line:  #dcded9;   /* dividers, card borders */
  --sage:  #687d70;   /* accent green — journey dot 2, signature bar 2 */
  --gold:  #8a6b32;   /* accent gold — journey dot 3, signature bar 3, award card */
}
```

Typography: `"Segoe UI", Arial, sans-serif` for body; `Georgia, serif` for headings and taglines.

---

## 5. Key components / CSS classes

| Class | Purpose |
|---|---|
| `.page` | Max-width 1080 px, centred, responsive padding |
| `.header` | Sticky top nav with monogram and Work/About/Contact links |
| `.hero` | Two-column grid (copy + portrait); collapses on mobile |
| `.signature` | Three coloured bars (ink, sage, gold) — decorative eyebrow element |
| `.button` | Base button; variants: `.button-primary`, `.button-secondary`, `.button-linkedin` |
| `.portrait` | Figure with offset border decoration |
| `.journey` | Horizontal list with coloured bullet dots |
| `.project` | Card with border; `.award` variant has gold/cream bg |
| `.tags li` | Pill tag (border, rounded) |
| `.contact` | Two-column green-tinted card at bottom |
| `.share` | `<details>` element — expands to show QR code |
| `.qr` | 140 × 140 px QR image block |
| `.copy-button` | "Copy email" — shown only when `navigator.clipboard` is available |
| `.skip-link` | Accessibility — "Skip to content" (visible on focus) |

---

## 6. JavaScript (inline, bottom of `<body>`)

Two small behaviours, no libraries:

```js
// 1. "Copy email" button — only shown if clipboard API is available
const copyButton = document.getElementById('copy-email');
if (navigator.clipboard && window.isSecureContext) {
  copyButton.hidden = false;
  copyButton.addEventListener('click', async () => {
    await navigator.clipboard.writeText('arthur.callewaert03@gmail.com');
    // sets copyStatus.textContent on success/failure
  });
}
```

No other JS. The share button in `my-links` is separate.

---

## 7. Static assets

| File | Use |
|---|---|
| `arthur-callewaert.vcf` | vCard 3.0 — name, email, URL, LinkedIn. Downloaded via `download` attribute. |
| `cv3_30_sept.pdf` | CV PDF. Linked from hero and Work section. |
| `Arthur Callewaert 336213.jpg` | Portrait. Loaded with `fetchpriority="high"`. Referenced by `my-links` too. |
| `assets/networking-qr.svg` | QR pointing to this page (`https://arthurcallewaert03.github.io/my-cv/`). Shown in expandable contact section. |
| `assets/networking-qr.png` | Same QR as PNG — user-downloadable via `download` attribute. |

---

## 8. Responsive behaviour

| Breakpoint | Changes |
|---|---|
| `≤ 960 px` | Narrower page padding; journey label hidden; share-content stacks vertically |
| `≤ 760 px` | Single-column layout; hero becomes name + portrait side-by-side; brand label hidden; smaller type |
| `≤ 350 px` | Portrait shrinks; nav gap tightens |

---

## 9. SEO / accessibility

- Single `<h1>` (name).
- `<h2>` per section.
- All images have `alt` text.
- Skip-to-content link.
- `aria-label` on nav and sections.
- `role="status"` on copy feedback paragraph.
- `fetchpriority="high"` on the portrait (LCP element).
- Meta description: *"Arthur Callewaert — engineering mind, business perspective. Business Analytics & AI student at Vlerick, exploring graduate opportunities in analytics and AI."*
- `theme-color`: `#172e40` (navy).

---

## 10. NFC integration context

The physical NFC tag / QR code that Arthur carries points to this page (`https://arthurcallewaert03.github.io/my-cv/`).  
The **tapkit** mobile app (see `tapkit/CONTEXT.md`) is the tool used to read and write those NFC tags.  
The **my-links** page (`github.io/my-links/`) is the simplified link-tree version — also potentially stored on NFC/QR.

---

## 11. What is NOT implemented / future ideas

| Area | Notes |
|---|---|
| Dark mode | Not implemented |
| Analytics | None — deliberately excluded |
| Contact form | Email link only; no server-side form |
| Blog or writing section | Not present |
| Project detail pages | No sub-pages; everything is on one scrolling page |
| CMS | Content is hardcoded in HTML |
| Build pipeline | None needed — pure static |
| More work projects | Two cards today; easy to add more `.project` articles in `.work-grid` |

---

## 12. How to update content

| Task | Where |
|---|---|
| Add a project card | Duplicate `<article class="project">` inside `.work-grid` |
| Change tagline or intro text | In the `.hero-copy` block of `index.html` |
| Update CV file | Replace `cv3_30_sept.pdf` and update both `href` attributes referencing it |
| Update portrait | Replace `Arthur Callewaert 336213.jpg` and update `src` in `<figure>` |
| Update QR code | Regenerate `assets/networking-qr.svg` and `.png` (use tapkit or any QR generator) |
| Change colours | Edit CSS custom properties in `:root {}` |
| Change contact email | Two places: `href="mailto:…"` links AND the JS string `'arthur.callewaert03@gmail.com'` |
| Update vCard | Edit `arthur-callewaert.vcf` |

---

## 13. Deploy

GitHub Pages — Settings → Pages → Deploy from branch `main`, root `/`.  
Expected URL: `https://arthurcallewaert03.github.io/my-cv/`

No CI/CD or build step needed. Push to `main` and Pages re-deploys automatically.
