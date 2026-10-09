# BROKENCIGS — studio website

Plain HTML + JavaScript. No build step, no framework, no editor. Edit a file, save, refresh.

```
brokencigs-website/
├── site-config.js          ← EDIT: menu, socials, footer, list of games & event years
├── index.html              ← Home page
├── games/index.html        ← /games  (card grid, built from site-config.js)
├── the-hilltop-funeral/index.html
├── inkression/index.html
├── events/index.html       ← /events (year cards, built from site-config.js)
├── events-2025/index.html
├── events-2024/index.html
├── press/index.html
├── about-us/index.html
├── 404.html                ← "page not found"
├── home/, copy-of-2025/    ← redirects for old Adobe Portfolio URLs (leave them)
├── assets/
│   ├── site.css            ← colours, fonts, layout (colours/fonts at the very top)
│   └── site.js             ← the engine that turns page content into HTML (rarely touched)
├── images/                 ← every image, one folder per page
├── CNAME                   ← tells GitHub Pages the domain is brokencigs.com
└── .nojekyll
```

Every page's URL is its folder name: `inkression/index.html` → `brokencigs.com/inkression/`.

---

## Previewing locally

The site uses absolute paths (`/images/...`), so open it through a tiny local server, not by double-clicking the file:

```bash
cd C:\Users\lukel\Downloads\brokencigs-website
python serve.py
```

Then open http://localhost:8080. If port 8080 is busy, run `python serve.py 8081` and open http://localhost:8081 instead. `serve.py` turns off browser caching, so a normal refresh always shows your latest edits. If a page ever looks out of date somewhere else, press **Ctrl+Shift+R** to force a fresh load. (VS Code's "Live Server" extension works too — open the folder itself, not a parent folder.)

---

## How a page works

Each page's `index.html` has two parts:

1. **`<head>`** — the browser tab title, description, and share image (what shows up when the link is posted on Discord/Twitter/etc.).
2. **`PAGE = { blocks: [ ... ] }`** — the page content as a list of blocks, top to bottom. Reorder, delete, or copy blocks freely.

```js
PAGE = {
  section: "/games/",    // optional: which menu item to highlight
  accent:  "#dcc918",    // optional: button/highlight colour for this page
  blocks: [
    { type: "page-title", text: "Games" },
    { type: "text", title: "About", body: "First paragraph.\n\nSecond paragraph." },
  ],
};
```

### Text formatting (works in any text field)

| Write | Get |
|---|---|
| `\n\n` | new paragraph |
| `\n` | line break |
| `[Steam page](https://store.steampowered.com/...)` | a link (opens in a new tab if it's another site) |
| `[Inkression](/inkression/)` | a link to one of our pages |
| `**bold**`, `*italic*` | **bold**, *italic* |

Inside a `"..."` string, write `\"` for a double quote, or just use curly quotes “ ”.

---

## Block types

```js
// Page heading
{ type: "page-title", text: "Press", eyebrow: "small label above (optional)", intro: "optional paragraph" }

// Section heading with a line after it
{ type: "heading", text: "Features" }

// Paragraphs (title optional; center: true to center)
{ type: "text", title: "About", body: "Paragraph one.\n\nParagraph two." }

// Big centered lines (mottos, game taglines)
{ type: "tagline", lines: ["Creating what we believe.", "Believing in what we make."] }

// Buttons (centered; style: "ghost" = outlined; add align: "left" to left-align)
{ type: "buttons", items: [
    { label: "Play on Steam", url: "https://..." },
    { label: "Press Kit",     url: "https://...", style: "ghost" },
] }

// Home-page style hero: heading, big image (clickable if link is set), buttons
{ type: "hero", title: "Available now!", image: "/images/...", link: "/the-hilltop-funeral/", buttons: [ ... ] }

// Game page header: the game's title logo (transparent PNG) + buttons
{ type: "game-hero", title: "Game Name", logo: "/images/game/logo.png",
  link: "https://store.steampowered.com/...",   // optional: makes the logo clickable
  buttons: [ ... ] }

// YouTube video — the id is the part after "watch?v=" (start = seconds, optional)
{ type: "video", youtube: "ZoVOGycCqyU", start: 0 }

// Fact boxes
{ type: "facts", items: [ ["Genre", "Physics Co-op"], ["Engine", "Unity"] ] }

// Single image (size: "wide" or "narrow"; link and caption optional)
{ type: "image", src: "/images/about/team-at-gdc.jpg", alt: "description", caption: "", link: "" }

// Feature text + 1–3 images/GIFs/videos below it
{ type: "feature", text: "Tilt the casket...", media: ["/images/x/a.gif", "/images/x/b.gif"] }

// Bulleted list with optional paragraphs before/after
{ type: "list", title: "Early Access", intro: "...", items: ["**Race Mode:** ...", "..."], outro: "..." }

// Characters / people: image beside text, alternating sides (role optional)
{ type: "characters", title: "Characters", items: [
    { name: "Milly", role: "The Tattooist", image: "/images/inkression/milly.png", bio: "..." },
] }

// Image grid — click to view full screen, arrow keys to browse
{ type: "gallery", title: "Gallery", images: ["/images/...", "/images/..."] }

// One event (see events-2025/index.html). Use youtube instead of image for a video.
{ type: "event", title: "Tokyo Game Show", date: "September", location: "Tokyo, Japan",
  body: "...", image: "/images/events-2025/tgs.png", link: "https://... (optional)",
  photos: ["/images/...", "/images/...", "/images/..."] }

// Card grid of games or event years, pulled from site-config.js
{ type: "cards", source: "games", title: "You may also like", exclude: "inkression" }
{ type: "cards", source: "events", exclude: "events-2025" }

// List of outside links (press coverage)
{ type: "links", title: "Media", items: [
    { title: "Article headline", url: "https://...", meta: "April 2025 · Outlet · English" },
] }

// SECTION PAGE BLOCKS ──────────────────────────────────────

// Big header for Games / Events / Press / About: dimmed background photo + huge title
{ type: "page-hero", eyebrow: "small label", title: "Games", intro: "One line under the title",
  background: "/images/...", position: "center 40%",   // optional: which part of the photo to show
  opacity: 0.42,                                        // optional: photo strength 0–1 (default 0.42)
  aside: "New York City · 40.71° N 74.01° W" }          // optional: vertical text on the right

// Big alternating rows for every game in site-config.js (exclude: "<id>" to skip one).
// Each game's row uses its blurb, store button, badge and accent colour from site-config.js.
{ type: "showcase" }

// Card grid with your own cards instead of games/events
{ type: "cards", title: "Press kits", items: [
    { title: "The Hilltop Funeral", label: "Press kit ↗", cover: "/images/...", url: "https://..." },
] }

// HOME PAGE BLOCKS ─────────────────────────────────────────

// Full-screen spotlight on one game. accent recolours the badge, button and glow.
{ type: "promo", title: "Game Name", badge: "Early Access · Out now on Steam",
  logo: "/images/game/logo.png", link: "/game/", background: "/images/game/page-background.png",
  accent: "#dbc816", accentInk: "#1c1c1c",
  text: "One-line pitch.", buttons: [ ... ], meta: ["Genre", "2 Players", "Steam"] }

// Tilted scrolling ticker band (link optional; pauses on hover)
{ type: "marquee", link: "https://...", color: "#dbc816", ink: "#111111",
  items: ["The Hilltop Funeral", "Early Access out now", "Play on Steam"] }

// Text beside an image (flip: true puts the image on the left)
{ type: "split", eyebrow: "small label", title: "Big heading", body: "Paragraphs...",
  image: "/images/about/team-at-gdc.jpg", imageSize: "small",   // optional: "small" or "medium"
  buttons: [ ... ] }

// Big row of names separated by ✢ (url optional per item)
{ type: "chips", title: "Our games have been shown at",
  items: [ { label: "Tokyo Game Show", url: "/events-2025/" }, "GDC" ] }

// Press headline cards
{ type: "quotes", title: "In the press", items: [
    { text: "Headline", source: "Outlet · Month Year", url: "https://..." },
  ], buttons: [ ... ] }

// Call-to-action panel (socials: true adds the social icons)
{ type: "cta", eyebrow: "Stay in the loop", title: "Follow the studio", text: "...",
  buttons: [ { label: "Subscribe", url: "https://..." } ], socials: true }

// Thin horizontal line
{ type: "divider" }

// Escape hatch: any raw HTML
{ type: "html", html: "<p>Anything</p>" }
```

**Videos instead of GIFs:** any image path ending in `.mp4` or `.webm` plays as a silent looping video. Converting the big GIFs to MP4 (e.g. with https://ezgif.com/gif-to-mp4) makes pages load far faster. The two Inkression GIFs are ~40 MB each.

---

## Common tasks

### Add a new game
1. Copy the `inkression` folder and rename it, e.g. `my-new-game`. The folder name becomes the URL.
2. Put its images in `images/my-new-game/` and a 16:9 cover in `images/covers/my-new-game.png`.
3. Edit `my-new-game/index.html`: the `<title>`/description/og:image/canonical in the `<head>`, then the blocks.
4. Add it to `games` in `site-config.js`. Order there = order on the site.

```js
{ id: "my-new-game", title: "My New Game", year: "2028", label: "Genre", cover: "/images/covers/my-new-game.png",
  badge: "Coming soon",                        // optional label on the card
  blurb: "One or two sentences for /games/.",
  store: { label: "Wishlist on Steam", url: "https://..." },
  accent: "#ff4d4d", accentInk: "#111111" },  // this game's colour on /games/
```

### Add a new events year (e.g. 2026)
1. Copy `events-2025` → `events-2026` and replace the events in it.
2. Add `{ id: "events-2026", title: "2026", cover: "/images/covers/events-2026.jpg" }` to the **top** of `events` in `site-config.js`.

### Add an event to an existing year
Copy one `{ type: "event", ... }` block in that year's `index.html`, paste it at the top of the list, and edit it.

### Add a press article
Add a line to the top of the "Media" `items` in `press/index.html`. To feature it on the home page too, add it to the `quotes` block in `index.html`.

### Change the menu's button or the announcement strip
In `site-config.js`:
- `navButton`: the highlighted button at the right of the menu. Its `color` also tints the menu hover effect, the scroll progress line and the announcement strip.
- `announcement`: the thin strip above the menu on every page. Delete the line to hide it.

### Feature a different game on the home page
Edit the `promo` and `marquee` blocks at the top of `index.html`: swap the logo, background, link, accent colour and text. The card badges ("Early Access · Out now", "Demo on Steam") are the `badge` / `badgeColor` fields in `site-config.js`.

### Add a completely new page (e.g. /jobs)
Copy `about-us/` → `jobs/`, edit the content, and add `{ label: "Jobs", url: "/jobs/" }` to `nav` in `site-config.js` if it belongs in the menu.

### Change colours or fonts
Edit the `:root { ... }` block at the top of `assets/site.css`. Fonts come from Google Fonts. Change the `@import` URL on line 6 and the `--font-display` / `--font-body` names.

---

## Hosting on brokencigs.com (GitHub Pages)

Same setup as your personal portfolio (lilyinthelu.com):

1. Create a new GitHub repo (e.g. `brokencigs-website`) and push this folder to it.
2. Repo → **Settings → Pages** → Source: *Deploy from a branch* → `main` / `(root)`.
3. The `CNAME` file already says `brokencigs.com`. In Settings → Pages, confirm the custom domain shows `brokencigs.com`.
4. At your domain registrar, replace the Adobe Portfolio DNS records with:

   | Type | Name | Value |
   |---|---|---|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | `<your-github-username>.github.io` |

5. Wait for DNS to update (minutes to a few hours), then tick **Enforce HTTPS** in Settings → Pages.
6. Remove the custom domain from Adobe Portfolio so the two don't fight over it.

Old links keep working: `/inkression`, `/the-hilltop-funeral`, `/games`, `/events`, `/events-2025`, `/press`, `/about-us` map to the same pages. `/home` and `/copy-of-2025` redirect to `/` and `/events-2024/`.
