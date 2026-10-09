// ================================================================
//  site-config.js — STUDIO-WIDE SETTINGS
//  Things that appear on every page (menu, socials, footer) and the
//  lists of games/events used for the card grids.
//  Each page's own content lives in that page's index.html.
//  See README.md for how to add pages.
// ================================================================

window.SITE = {

  name:    "BROKENCIGS",
  legal:   "BROKENCIGS, LLC, All rights reserved.",
  email:   "contact@brokencigs.com",
  logo:    "/images/brand/wordmark.png",   // white logo on transparent background

  // Top menu — order here = order on the site
  nav: [
    { label: "Games",    url: "/games/" },
    { label: "Events",   url: "/events/" },
    { label: "Press",    url: "/press/" },
    { label: "About us", url: "/about-us/" },
  ],

  // Icons available: x, linkedin, instagram, tiktok, bluesky, youtube, email
  // (any other icon name just shows the label as text)
  socials: [
    { label: "X / Twitter", icon: "x",         url: "https://twitter.com/brokencigsgames" },
    { label: "LinkedIn",    icon: "linkedin",  url: "https://www.linkedin.com/company/brokencigs" },
    { label: "Instagram",   icon: "instagram", url: "https://www.instagram.com/brokencigsgames/" },
    { label: "TikTok",      icon: "tiktok",    url: "https://www.tiktok.com/@brokencigsgame" },
    { label: "Bluesky",     icon: "bluesky",   url: "https://bsky.app/profile/inkression.bsky.social" },
    { label: "YouTube",     icon: "youtube",   url: "https://www.youtube.com/@BROKENCIGS" },
    { label: "Email",       icon: "email",     url: "mailto:contact@brokencigs.com" },
  ],

  subscribe: { label: "Subscribe", url: "https://mailchi.mp/brokencigs/subscribe" },

  // ── Games ─────────────────────────────────────────────────
  // Shown on /games/, the home page, and "You may also like".
  // Order here = order on the site. `id` must match the page folder name.
  games: [
    {
      id:    "the-hilltop-funeral",
      title: "The Hilltop Funeral",
      year:  "2025",
      label: "Physics Co-op · Early Access",
      cover: "/images/covers/the-hilltop-funeral.png",
    },
    {
      id:    "inkression",
      title: "Inkression",
      year:  "2027",
      label: "Narrative Exploration",
      cover: "/images/covers/inkression.png",
    },
  ],

  // ── Event years ───────────────────────────────────────────
  // Shown on /events/ and "Browse More Events". Newest first.
  events: [
    { id: "events-2025", title: "2025", cover: "/images/covers/events-2025.jpg" },
    { id: "events-2024", title: "2024", cover: "/images/covers/events-2024.jpg" },
  ],
};
