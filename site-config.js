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

  // Highlighted button at the right end of the menu. Delete this line to hide it.
  // `color` also tints the menu's hover effects, scroll bar and announcement strip.
  navButton: { label: "Play on Steam", url: "https://store.steampowered.com/app/3553350/The_Hilltop_Funeral/", color: "#dbc816", ink: "#1c1c1c" },

  // Thin strip above the menu on every page. Delete this line to hide it.
  announcement: { text: "The Hilltop Funeral is out now in Early Access", link: "Learn more", url: "/the-hilltop-funeral/" },

  // ── Games ─────────────────────────────────────────────────
  // Shown on /games/, the home page, and "You may also like".
  // Order here = order on the site. `id` must match the page folder name.
  games: [
    {
      id:    "the-hilltop-funeral",
      title: "The Hilltop Funeral",
      year:  "2025",
      label: "Physics Co-op",
      cover: "/images/covers/the-hilltop-funeral.png",
      badge: "Early Access · Out now",   // optional label on the card
      badgeColor: "#dbc816",              // optional badge colour (leave out for a dark badge)
      // Used by the big rows on /games/:
      blurb:  "A chaotic 2-player co-op game where you are a pair of professional pallbearers, carrying a valued client to the funeral home at the hilltop.",
      store:  { label: "Play on Steam", url: "https://store.steampowered.com/app/3553350/The_Hilltop_Funeral/" },
      accent: "#dbc816", accentInk: "#1c1c1c",
    },
    {
      id:    "inkression",
      title: "Inkression",
      year:  "2027",
      label: "Narrative Exploration",
      cover: "/images/covers/inkression.png",
      badge: "Demo on Steam",
      blurb:  "A 3D narrative exploration game about collecting the final moments of a dying neighborhood as a tattoo artist.",
      store:  { label: "Play the demo", url: "https://store.steampowered.com/app/2965930/Inkression/" },
      accent: "#fcad72", accentInk: "#111111",
    },
  ],

  // ── Event years ───────────────────────────────────────────
  // Shown on /events/ and "Browse More Events". Newest first.
  events: [
    // `label` is the small line under the year on the card
    { id: "events-2025", title: "2025", cover: "/images/covers/events-2025.jpg", label: "8 events · Tokyo · Shanghai · San Francisco · NYC" },
    { id: "events-2024", title: "2024", cover: "/images/covers/events-2024.jpg", label: "4 events · New York City" },
  ],
};
