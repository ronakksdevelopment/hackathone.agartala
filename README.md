# Agartala AI Website Hackathon 2026 — Official Website

A production-ready, responsive, accessible static website for the **Agartala AI
Website Hackathon 2026** — an independent community hackathon for students,
developers, freelancers, and tech enthusiasts in Agartala, Tripura.

Built with **plain HTML, CSS, and vanilla JavaScript** (no build step required),
using a Claude-inspired color palette.

---

## 🎨 Design system

All colors are defined as CSS custom properties in `css/tokens.css` so the
palette can be maintained centrally:

```css
--primary: #C15F3C;   /* CTAs, links, active states, highlights */
--white: #FFFFFF;     /* cards, nav, clean surfaces */
--warm-bg: #F4F3EE;   /* page background */
--neutral: #B1ADA1;   /* muted text, dividers, disabled states */
```

Typography uses **Fraunces** (display/headings), **Inter** (body), and
**IBM Plex Mono** (numbers/countdowns/participant IDs), loaded from Google
Fonts.

---

## 📁 Project structure

```
hackathon-site/
├── index.html              # Home page
├── pages/
│   ├── about.html
│   ├── rules.html
│   ├── schedule.html
│   ├── prizes.html
│   ├── register.html       # Registration form
│   ├── faq.html
│   ├── contact.html
│   ├── results.html
│   ├── privacy.html
│   ├── terms.html
│   └── refund.html
├── css/
│   ├── tokens.css          # Design tokens / CSS variables
│   ├── base.css            # Reset + typography + layout helpers
│   ├── components.css       # Buttons, cards, nav, footer, forms, etc.
│   ├── home.css             # Home-page-specific styles
│   └── register.css         # Registration-page-specific styles
├── js/
│   ├── config.js            # Single source of truth for event data (EDIT HERE)
│   ├── layout.js             # Injects shared header/nav/footer on every page
│   ├── countdown.js          # Countdown timer logic (handles expiry gracefully)
│   ├── seats.js              # Seat availability logic (Early Bird / Standard)
│   └── register.js           # Registration form validation + submit flow
├── assets/images/            # Optimized JPEGs used across the site
├── robots.txt
├── sitemap.xml
├── .nojekyll                 # Required for GitHub Pages to serve assets correctly
└── README.md
```

---

## 🚀 Local development

No build tools, package manager, or dependencies are required.

```bash
# From the project root:
python3 -m http.server 8000
# or
npx serve .
```

Then open `http://localhost:8000` in your browser.

Because the site uses relative paths (`../css/...` from `pages/`), it must be
served over HTTP(S) — opening `index.html` directly via `file://` will break
some relative asset paths and the layout-injection script.

---

## ⚙️ Environment / configuration

All event facts (date, seat counts, prices, prize amounts, judging rubric,
contact details) live in **`js/config.js`** — edit this one file to update the
event across every page:

```js
window.HACKATHON_CONFIG = {
  eventDateISO: "2026-12-12T17:30:00+05:30",
  totalSeats: 50,
  earlyBirdSeats: 5,
  earlyBirdPrice: 299,
  standardPrice: 499,
  mockRegisteredCount: 21, // ⚠️ DEMO ONLY — see backend section below
  ...
};
```

There are no secret keys or environment variables in this static front-end —
by design, nothing sensitive should ever be hard-coded into client-side code.

---

## ⚠️ IMPORTANT: this is a front-end demo — backend integration required

This repository is a **complete front-end** only. Several behaviors are
**simulated client-side for demonstration purposes** and must be replaced with
real backend functionality before collecting real registrations or payments:

| Feature | Current (demo) behavior | What production needs |
|---|---|---|
| Seat counts | Read from a hard-coded number in `js/config.js` (`mockRegisteredCount`) | A live database/API endpoint that increments on confirmed, paid registrations. **Never trust a client-side seat count** — someone could edit it in devtools. |
| Payment | Not implemented — form submits instantly with a simulated delay | A real, PCI-compliant payment gateway (e.g. Razorpay, Stripe) integrated server-side. Payment confirmation must be verified server-side via webhook, never assumed from the client. |
| Registration storage | Not persisted — exists only in the browser for the current session (`sessionStorage` duplicate-guard only) | A real database (Postgres, Firebase, Airtable, etc.) with server-side validation mirroring (at minimum) the client-side rules in `js/register.js`. |
| Participant ID generation | Generated randomly in the browser (`AAWH26-XXXXX`) | Generated server-side to guarantee uniqueness and prevent spoofing. |
| WhatsApp group invite | A static `wa.me` link with a pre-filled message | Could remain a static group invite link, or be automated via WhatsApp Business API after verified payment. |
| Email confirmation | Not sent | A transactional email service (SendGrid, Postmark, SES, etc.) triggered server-side after successful, verified registration. |

**Never commit real API keys, payment secrets, or database credentials into
this repository.** Use environment variables on your backend/hosting platform
instead, and keep them out of any file that ships to the browser.

---

## ✅ Testing checklist (run before each deployment)

- [ ] All internal links (`nav`, footer, in-page CTAs) resolve correctly from both `index.html` and files under `pages/`
- [ ] Countdown timer counts down correctly and shows the "scheduled time has passed" message gracefully once `eventDateISO` is in the past
- [ ] Seat meter and Early Bird / Standard availability reflect `mockRegisteredCount` correctly, including the sold-out state when `mockRegisteredCount >= totalSeats`
- [ ] Registration form: required-field validation, email/phone/GitHub URL format validation, checkbox requirements, and the loading → success state transition all work
- [ ] Registering twice in the same browser session shows the duplicate-registration notice
- [ ] FAQ accordion opens/closes and is operable via keyboard (Tab + Enter/Space)
- [ ] Mobile nav toggle opens/closes and all links are reachable on a 360px-wide viewport
- [ ] Keyboard-only navigation reaches every interactive element with a visible focus ring
- [ ] No console errors in browser devtools on any page
- [ ] Lighthouse/axe accessibility checks pass with no critical issues

---

## 📦 Deploying to GitHub Pages

1. Push this project to a public GitHub repository (root of the repo should
   contain `index.html`, exactly as in this folder).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select the `main` branch and the **`/ (root)`** folder, then **Save**.
5. GitHub will publish the site at:
   `https://<your-username>.github.io/<repo-name>/`
6. Because this site uses **relative paths** (not a fixed base path), it works
   correctly whether deployed at the domain root or under a repo subpath — no
   extra base-path configuration is required.
7. The included **`.nojekyll`** file prevents GitHub's default Jekyll
   processing from interfering with the `assets/` folder or any files/folders
   starting with an underscore.
8. Update `robots.txt`, `sitemap.xml`, and every `<link rel="canonical">` /
   Open Graph URL in the `<head>` of each page to your real published domain
   before going live.

---

## 🔒 Security notes

- No secrets, API keys, or credentials exist anywhere in this codebase.
- All form inputs are validated client-side (see `js/register.js`) as a UX
  convenience only — **server-side validation is mandatory** before this goes
  live with real registrations, since client-side checks can always be
  bypassed.
- Text inserted into the DOM from configuration (`js/config.js`) is static,
  developer-controlled content, not user input, so it does not require
  additional sanitization in this demo. If you later render **user-submitted**
  content anywhere (e.g. a public leaderboard of names), sanitize/escape it
  before insertion to prevent XSS.
- Avoid storing any real personal data in client-side storage
  (`localStorage`/`sessionStorage`) beyond the ephemeral duplicate-submission
  guard already in place.

---

## ♿ Accessibility

- Semantic HTML5 landmarks (`header`, `nav`, `main`, `footer`) on every page
- Visible focus states on all interactive elements (`:focus-visible`)
- Skip-to-content link on every page
- Form fields have associated `<label>`s, inline error messages, and
  `aria-invalid` / `aria-describedby` wiring
- FAQ accordion uses `aria-expanded` / `aria-controls` and is fully
  keyboard-operable
- `prefers-reduced-motion` is respected (animations are disabled/shortened)
- Color choices maintain accessible contrast for body text (dark warm
  charcoal `#2B2722` / `#5B564E` on white and `--warm-bg`, not the muted
  `--neutral` tone, which is reserved for secondary/decorative use)

---

## 📝 License & attribution

Illustration images in `assets/images/` were provided for this project and
are included for this hackathon's own promotional use. Fonts are loaded from
Google Fonts under their respective open licenses (Fraunces, Inter, IBM Plex
Mono).

This is an **independent community hackathon**. It is not an official
Anthropic or GitHub-hosted or co-branded event unless explicitly stated
elsewhere with verified written authorization — see `pages/about.html`.
