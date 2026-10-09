// ================================================================
//  site.js — builds every page from SITE (site-config.js) and PAGE
//  (the <script> block inside each page's index.html).
//  You normally never need to edit this file.
// ================================================================

(function () {
  const SITE = window.SITE || {};
  const PAGE = window.PAGE || { blocks: [] };

  // ── Helpers ───────────────────────────────────────────────
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const isExternal = (url) => /^(https?:)?\/\//.test(url || "");
  const linkAttrs = (url) =>
    `href="${esc(url)}"` + (isExternal(url) ? ' target="_blank" rel="noopener"' : "");

  // Tiny markdown: [text](url), **bold**, *italic*, blank line = new paragraph
  function inline(s) {
    return esc(s)
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, t, u) => `<a ${linkAttrs(u)}>${t}</a>`)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/\n/g, "<br>");
  }
  const paras = (s) =>
    s ? String(s).trim().split(/\n\s*\n/).map((p) => `<p>${inline(p)}</p>`).join("") : "";

  const isVideo = (src) => /\.(mp4|webm)$/i.test(src || "");

  // An image (or .mp4/.webm, which plays like a GIF). Accepts "path" or {src, alt, caption}
  function media(item, opts = {}) {
    const m = typeof item === "string" ? { src: item } : item;
    if (isVideo(m.src)) {
      return `<video class="media" src="${esc(m.src)}" autoplay muted loop playsinline></video>`;
    }
    const lb = opts.lightbox ? ` data-lightbox="${esc(opts.lightbox)}"` : "";
    return `<img class="media" src="${esc(m.src)}" alt="${esc(m.alt || m.caption || "")}" loading="lazy" decoding="async"${lb}>`;
  }

  function buttons(items, cls = "") {
    if (!items || !items.length) return "";
    return `<div class="buttons ${cls}">` + items.map((b) =>
      `<a class="btn ${b.style === "ghost" ? "btn--ghost" : ""}" ${linkAttrs(b.url)}>${esc(b.label)}</a>`
    ).join("") + `</div>`;
  }

  const title = (t, tag = "h2") => (t ? `<${tag} class="block-title">${inline(t)}</${tag}>` : "");

  // ── Icons ─────────────────────────────────────────────────
  const ICONS = {
    x: '<path d="M4 4l16 16M20 4L4 20"/>',
    linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    tiktok: '<path d="M14 3v11.5a4 4 0 1 1-4-4"/><path d="M14 3c.4 2.6 2.2 4.4 5 4.6"/>',
    bluesky: '<path d="M12 11C10 7 6.5 4.5 4.5 4.5 3.3 4.5 3 5.5 3 7c0 1.6.6 4.2 3.5 4.6-2.6.6-3 2.7-1.4 4.2C7 17.6 9.5 16 12 12.5c2.5 3.5 5 5.1 6.9 3.3 1.6-1.5 1.2-3.6-1.4-4.2C20.4 11.2 21 8.6 21 7c0-1.5-.3-2.5-1.5-2.5C17.5 4.5 14 7 12 11z"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z" fill="currentColor"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6l8.5 7 8.5-7"/>',
  };
  function socials(cls) {
    return `<ul class="socials ${cls || ""}">` + (SITE.socials || []).map((s) => {
      const icon = ICONS[s.icon];
      const inner = icon
        ? `<svg viewBox="0 0 24 24" aria-hidden="true">${icon}</svg><span class="sr-only">${esc(s.label)}</span>`
        : esc(s.label);
      return `<li><a ${linkAttrs(s.url)} title="${esc(s.label)}">${inner}</a></li>`;
    }).join("") + `</ul>`;
  }

  // ── Cards (games / events grids) ──────────────────────────
  function cardsFrom(source) {
    if (source === "events") {
      return (SITE.events || []).map((e) => ({
        id: e.id, url: `/${e.id}/`, title: e.title, cover: e.cover, label: e.label || "Events", big: true,
      }));
    }
    return (SITE.games || []).map((g) => ({
      id: g.id, url: g.url || `/${g.id}/`, title: g.title, cover: g.cover, label: g.label, year: g.year,
      badge: g.badge, badgeColor: g.badgeColor,
    }));
  }
  function cardGrid(cards) {
    return `<div class="cards">` + cards.map((c) => `
      <a class="card ${c.big ? "card--big-title" : ""}" ${linkAttrs(c.url)}>
        ${c.badge ? `<span class="card__badge" ${c.badgeColor ? `style="--badge:${esc(c.badgeColor)}"` : ""}>${esc(c.badge)}</span>` : ""}
        <div class="card__img"><img src="${esc(c.cover)}" alt="" loading="lazy"></div>
        <div class="card__body">
          <h3 class="card__title">${esc(c.title)}</h3>
          ${c.label || c.year ? `<p class="card__meta">${esc([c.label, c.year].filter(Boolean).join(" · "))}</p>` : ""}
        </div>
      </a>`).join("") + `</div>`;
  }

  // ── Block renderers ───────────────────────────────────────
  // Each key is a block `type` you can use in a page's PAGE.blocks list.
  const BLOCKS = {

    // Game page header: the game's title logo (clickable if `link` is set) + buttons
    "game-hero": (b) => {
      const logo = `<img src="${esc(b.logo)}" alt="${esc(b.title || "")}">`;
      return `
      <section class="game-hero">
        ${b.link ? `<a class="game-hero__title-logo" ${linkAttrs(b.link)}>${logo}</a>`
                 : `<div class="game-hero__title-logo">${logo}</div>`}
        ${b.subtitle ? `<p class="game-hero__sub">${inline(b.subtitle)}</p>` : ""}
        ${buttons(b.buttons, "buttons--center")}
      </section>`;
    },

    // Full-screen spotlight for a featured game (home page).
    // Change `accent` to recolour the badge, button and glow for another game.
    promo: (b) => {
      const vars = [b.accent && `--accent:${b.accent};--btn-bg:${b.accent}`, b.accentInk && `--btn-ink:${b.accentInk}`]
        .filter(Boolean).join(";");
      const logo = b.logo ? `<img src="${esc(b.logo)}" alt="${esc(b.title || "")}">` : `<h1 class="page-title">${esc(b.title)}</h1>`;
      return `
      <section class="promo full" style="${esc(vars)}">
        <div class="promo__bg" style="background-image:url('${esc(b.background)}')"></div>
        <div class="promo__inner">
          ${b.badge ? `<p class="promo__badge"><span class="promo__dot"></span>${inline(b.badge)}</p>` : ""}
          ${b.link ? `<a class="promo__logo" ${linkAttrs(b.link)}>${logo}</a>` : `<div class="promo__logo">${logo}</div>`}
          ${b.text ? `<p class="promo__text">${inline(b.text)}</p>` : ""}
          ${buttons(b.buttons, "buttons--center")}
          ${b.meta ? `<ul class="promo__meta">${b.meta.map((m) => `<li>${inline(m)}</li>`).join("")}</ul>` : ""}
        </div>
      </section>`;
    },

    // Scrolling ticker band. color / ink set the band and text colours.
    marquee: (b) => {
      const row = (b.items || []).map((i) => `<span>${inline(i)}</span><span class="marquee__sep">✢</span>`).join("");
      const band = `<div class="marquee__track"><div class="marquee__row">${row}</div><div class="marquee__row" aria-hidden="true">${row}</div></div>`;
      const vars = [b.color && `--marquee-bg:${b.color}`, b.ink && `--marquee-ink:${b.ink}`].filter(Boolean).join(";");
      return `
      <div class="marquee full" style="${esc(vars)}">
        ${b.link ? `<a class="marquee__band" ${linkAttrs(b.link)}>${band}</a>` : `<div class="marquee__band">${band}</div>`}
      </div>`;
    },

    // Text on one side, image on the other (flip: true swaps sides)
    split: (b) => `
      <section class="split ${b.flip ? "split--flip" : ""}">
        <div class="split__text">
          ${b.eyebrow ? `<p class="eyebrow">${inline(b.eyebrow)}</p>` : ""}
          ${b.title ? `<h2 class="split__title">${inline(b.title)}</h2>` : ""}
          <div class="prose">${paras(b.body)}</div>
          ${buttons(b.buttons)}
        </div>
        <div class="split__media">${media(b.image, { lightbox: "split" })}</div>
      </section>`,

    // A row of names separated by ✢, e.g. events we've shown at
    chips: (b) => `
      <section class="chips" ${b.hover ? `style="--chip-hover:${esc(b.hover)}"` : ""}>
        ${b.title ? `<p class="eyebrow chips__title">${inline(b.title)}</p>` : ""}
        <ul>${(b.items || []).map((i) => {
          const it = typeof i === "string" ? { label: i } : i;
          return `<li>${it.url ? `<a ${linkAttrs(it.url)}>${esc(it.label)}</a>` : esc(it.label)}</li>`;
        }).join("")}</ul>
      </section>`,

    // Press headline cards
    quotes: (b) => `
      <section class="quotes">
        ${title(b.title)}
        <div class="quotes__grid">${(b.items || []).map((q) => `
          <a class="quote" ${linkAttrs(q.url)}>
            <blockquote>“${esc(q.text)}”</blockquote>
            <p class="quote__src">${esc(q.source)}</p>
          </a>`).join("")}</div>
        ${buttons(b.buttons, "buttons--center")}
      </section>`,

    // Call-to-action panel (newsletter etc). socials: true adds the social icons.
    cta: (b) => `
      <section class="cta">
        ${b.eyebrow ? `<p class="eyebrow">${inline(b.eyebrow)}</p>` : ""}
        <h2 class="cta__title">${inline(b.title)}</h2>
        ${b.text ? `<p class="cta__text">${inline(b.text)}</p>` : ""}
        ${buttons(b.buttons, "buttons--center")}
        ${b.socials ? socials("socials--cta") : ""}
      </section>`,

    // Big centered image with optional heading above and buttons below
    hero: (b) => `
      <section class="hero">
        ${b.title ? `<h1 class="hero__title">${inline(b.title)}</h1>` : ""}
        ${b.image ? (b.link ? `<a class="hero__img" ${linkAttrs(b.link)}>${media(b.image)}</a>`
                            : `<div class="hero__img">${media(b.image)}</div>`) : ""}
        ${buttons(b.buttons, "buttons--center")}
      </section>`,

    // Page title (h1)
    "page-title": (b) => `
      <header class="page-head">
        ${b.eyebrow ? `<p class="eyebrow">${inline(b.eyebrow)}</p>` : ""}
        <h1 class="page-title">${inline(b.text)}</h1>
        ${b.intro ? `<div class="page-intro">${paras(b.intro)}</div>` : ""}
      </header>`,

    heading: (b) => `<h2 class="section-heading">${inline(b.text)}</h2>`,

    text: (b) => `
      <section class="text ${b.center ? "text--center" : ""}">
        ${title(b.title)}
        <div class="prose">${paras(b.body)}</div>
      </section>`,

    // Short centered lines, e.g. a game's tagline or the studio motto
    tagline: (b) => `
      <section class="tagline">${(b.lines || []).map((l) => `<p>${inline(l)}</p>`).join("")}</section>`,

    buttons: (b) => buttons(b.items, b.align === "left" ? "" : "buttons--center"),

    // YouTube video. `youtube` = the video id (the part after watch?v=)
    video: (b) => `
      <section class="video">
        ${title(b.title)}
        <div class="video__frame">
          <iframe src="https://www.youtube-nocookie.com/embed/${esc(b.youtube)}${b.start ? `?start=${+b.start}` : ""}"
            title="${esc(b.title || "Video")}" loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
        </div>
      </section>`,

    // Label / value pairs, e.g. Genre, Engine, Platform
    facts: (b) => `
      <dl class="facts">${(b.items || []).map(([k, v]) =>
        `<div class="fact"><dt>${esc(k)}</dt><dd>${inline(v)}</dd></div>`).join("")}</dl>`,

    image: (b) => {
      const img = media(b, { lightbox: b.link ? null : "single" });
      return `
      <figure class="image image--${b.size || "wide"}">
        ${b.link ? `<a ${linkAttrs(b.link)}>${img}</a>` : img}
        ${b.caption ? `<figcaption>${inline(b.caption)}</figcaption>` : ""}
      </figure>`;
    },

    // A feature description followed by one or more images/GIFs
    feature: (b) => `
      <section class="feature">
        <p class="feature__text">${inline(b.text)}</p>
        <div class="feature__media cols-${Math.min((b.media || []).length, 3)}">
          ${(b.media || []).map((m) => media(m)).join("")}
        </div>
      </section>`,

    list: (b) => `
      <section class="list">
        ${title(b.title)}
        ${b.intro ? `<div class="prose">${paras(b.intro)}</div>` : ""}
        <ul class="bullets">${(b.items || []).map((i) => `<li>${inline(i)}</li>`).join("")}</ul>
        ${b.outro ? `<div class="prose">${paras(b.outro)}</div>` : ""}
      </section>`,

    // Image beside text, alternating sides
    characters: (b) => `
      <section class="characters">
        ${title(b.title)}
        ${(b.items || []).map((c, i) => `
          <article class="character ${i % 2 ? "character--flip" : ""}">
            <div class="character__img">${media(c.image, { lightbox: "characters" })}</div>
            <div class="character__text">
              <h3>${esc(c.name)}</h3>
              ${c.role ? `<p class="eyebrow">${esc(c.role)}</p>` : ""}
              <div class="prose">${paras(c.bio)}</div>
            </div>
          </article>`).join("")}
      </section>`,

    // Grid of images that open full-screen on click
    gallery: (b) => {
      const group = "g" + Math.random().toString(36).slice(2, 7);
      return `
      <section class="gallery">
        ${title(b.title)}
        <div class="gallery__grid">${(b.images || []).map((m) => media(m, { lightbox: group })).join("")}</div>
      </section>`;
    },

    divider: () => `<hr class="divider">`,

    // One event on an events page
    event: (b) => {
      const lead = b.image ? (b.link
        ? `<a class="event__lead" ${linkAttrs(b.link)}>${media(b.image)}</a>`
        : `<div class="event__lead">${media(b.image, { lightbox: "lead-" + esc(b.title) })}</div>`) : "";
      const group = "e" + Math.random().toString(36).slice(2, 7);
      return `
      <article class="event">
        <header class="event__head">
          <p class="eyebrow">${esc([b.date, b.location].filter(Boolean).join("  ·  "))}</p>
          <h2 class="event__title">${inline(b.title)}</h2>
        </header>
        <div class="event__main ${lead || b.youtube ? "" : "event__main--solo"}">
          <div class="prose">${paras(b.body)}</div>
          ${b.youtube ? `<div class="video__frame"><iframe src="https://www.youtube-nocookie.com/embed/${esc(b.youtube)}${b.start ? `?start=${+b.start}` : ""}" title="${esc(b.title)}" loading="lazy" allowfullscreen></iframe></div>` : lead}
        </div>
        ${b.photos && b.photos.length
          ? `<div class="event__photos cols-${Math.min(b.photos.length, 3)}">${b.photos.map((p) => media(p, { lightbox: group })).join("")}</div>` : ""}
      </article>`;
    },

    // Card grid of games or event years (from site-config.js)
    // { type: "cards", source: "games" | "events", exclude: "<id>" }
    cards: (b) => {
      const cards = cardsFrom(b.source).filter((c) => c.id !== b.exclude);
      if (!cards.length) return "";
      return `<section class="cards-wrap">${title(b.title)}${cardGrid(cards)}</section>`;
    },

    // List of external links, e.g. press coverage
    links: (b) => `
      <section class="links">
        ${title(b.title)}
        <ul>${(b.items || []).map((l) => `
          <li><a ${linkAttrs(l.url)}>
            <span class="links__title">${esc(l.title)}</span>
            ${l.meta ? `<span class="links__meta">${esc(l.meta)}</span>` : ""}
            <span class="links__arrow" aria-hidden="true">↗</span>
          </a></li>`).join("")}</ul>
      </section>`,

    // Escape hatch: raw HTML for anything the blocks don't cover
    html: (b) => b.html || "",
  };

  function renderBlock(b) {
    const fn = BLOCKS[b.type];
    if (!fn) {
      console.warn("Unknown block type:", b.type, b);
      return `<p class="block-error">Unknown block type "${esc(b.type)}"</p>`;
    }
    return fn(b);
  }

  // ── Page shell ────────────────────────────────────────────
  const here = location.pathname.replace(/index\.html$/, "");
  const navLinks = (SITE.nav || []).map((n) => {
    const active = here === n.url || (PAGE.section && n.url.includes(PAGE.section));
    return `<li><a href="${esc(n.url)}" ${active ? 'aria-current="page"' : ""}>${esc(n.label)}</a></li>`;
  }).join("");

  const header = `
    <header class="site-header">
      <a class="brand" href="/" aria-label="${esc(SITE.name)} home">
        ${SITE.logo ? `<img src="${esc(SITE.logo)}" alt="${esc(SITE.name)}">` : `<span>${esc(SITE.name)}</span>`}
      </a>
      <nav class="site-nav" id="site-nav">
        <ul class="site-nav__links">${navLinks}</ul>
        ${socials("socials--nav")}
      </nav>
      <button class="menu-btn" aria-controls="site-nav" aria-expanded="false" aria-label="Menu">
        <span></span><span></span>
      </button>
    </header>`;

  const footer = `
    <footer class="site-footer">
      <div class="site-footer__top">
        <a class="brand brand--footer" href="/">${SITE.logo ? `<img src="${esc(SITE.logo)}" alt="${esc(SITE.name)}">` : `<span>${esc(SITE.name)}</span>`}</a>
        ${socials()}
      </div>
      <div class="site-footer__bottom">
        <span>© ${new Date().getFullYear()} ${esc(SITE.legal)}</span>
        <span class="site-footer__links">
          ${SITE.subscribe ? `<a ${linkAttrs(SITE.subscribe.url)}>${esc(SITE.subscribe.label)}</a>` : ""}
          <a href="#top" class="to-top">↑ Back to top</a>
        </span>
      </div>
    </footer>`;

  document.body.id = "top";
  const rootStyle = document.documentElement.style;
  if (PAGE.accent)    rootStyle.setProperty("--accent", PAGE.accent);
  if (PAGE.accentInk) rootStyle.setProperty("--accent-ink", PAGE.accentInk);
  if (PAGE.button)    rootStyle.setProperty("--btn-bg", PAGE.button);
  if (PAGE.buttonInk) rootStyle.setProperty("--btn-ink", PAGE.buttonInk);
  if (PAGE.headingColor) rootStyle.setProperty("--heading", PAGE.headingColor);

  // Optional page background art at the top, fading into the page colour
  if (PAGE.background && PAGE.background.image) {
    const bg = PAGE.background;
    const el = document.createElement("div");
    el.className = "page-bg";
    el.setAttribute("aria-hidden", "true");
    el.style.backgroundImage = `url("${bg.image}")`;
    el.style.backgroundSize = bg.size || "cover";
    el.style.backgroundPosition = bg.position || "top center";
    el.style.height = bg.height || "100vh";
    if (bg.opacity != null) el.style.opacity = bg.opacity;
    document.body.prepend(el);
  }
  if (PAGE.theme) document.body.classList.add("theme-" + PAGE.theme);

  const main = document.createElement("main");
  main.className = "site-main";
  main.innerHTML = (PAGE.blocks || []).map(renderBlock).join("\n");
  document.body.insertAdjacentHTML("afterbegin", header);
  document.querySelector(".site-header").after(main);
  main.insertAdjacentHTML("afterend", footer);

  // ── Mobile menu ───────────────────────────────────────────
  const btn = document.querySelector(".menu-btn");
  btn.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open);
  });

  // Header gets a background once you scroll
  const onScroll = () => document.body.classList.toggle("scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  document.querySelector(".to-top").addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ── Lightbox ──────────────────────────────────────────────
  const lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = `
    <button class="lightbox__close" aria-label="Close">×</button>
    <button class="lightbox__prev" aria-label="Previous">‹</button>
    <img alt="">
    <button class="lightbox__next" aria-label="Next">›</button>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector("img");
  let group = [], idx = 0;

  const show = (i) => {
    idx = (i + group.length) % group.length;
    lbImg.src = group[idx].currentSrc || group[idx].src;
    lb.classList.toggle("lightbox--single", group.length < 2);
  };
  const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };

  main.addEventListener("click", (e) => {
    const img = e.target.closest("img[data-lightbox]");
    if (!img) return;
    group = [...main.querySelectorAll(`img[data-lightbox="${CSS.escape(img.dataset.lightbox)}"]`)];
    show(group.indexOf(img));
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  });
  lb.addEventListener("click", (e) => {
    if (e.target.closest(".lightbox__prev")) return show(idx - 1);
    if (e.target.closest(".lightbox__next")) return show(idx + 1);
    if (e.target !== lbImg) close();
  });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  // Fade blocks in as they scroll into view
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px" });
    main.querySelectorAll(":scope > :not(:first-child)").forEach((el) => { el.classList.add("reveal"); io.observe(el); });
  }
})();
