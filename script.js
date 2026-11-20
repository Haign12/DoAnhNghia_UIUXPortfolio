(() => {
  const root = document.documentElement;
  const menuButton = document.getElementById("menuBtn");
  const navigation = document.getElementById("navLinks");
  const themeButton = document.getElementById("themeToggle");
  const mobile = window.matchMedia("(max-width: 839px)");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");

  root.classList.add("js");
  menuButton.hidden = false;
  themeButton.hidden = false;

  function closeMenu(returnFocus = false) {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("open"))
      closeMenu(true);
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".site-nav")) closeMenu();
  });
  mobile.addEventListener("change", () => closeMenu());

  function isDark() {
    return root.dataset.theme
      ? root.dataset.theme === "dark"
      : systemTheme.matches;
  }
  function updateThemeLabel() {
    const dark = isDark();
    // The theme control is a switch: its name stays "Dark theme", the state lives in aria-checked.
    themeButton.setAttribute("aria-checked", String(dark));
    document.querySelector('meta[name="theme-color"]').content =
      getComputedStyle(root).getPropertyValue("--ds-surface-page").trim();
    document.querySelector('link[rel="icon"]').href =
      `assets/images/brand/xii-an-${dark ? "dark" : "light"}.svg`;
  }
  themeButton.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Theme works without persistence. */
    }
    updateThemeLabel();
  });
  systemTheme.addEventListener("change", updateThemeLabel);
  updateThemeLabel();

  const filterRow = document.querySelector(".filter-row");
  const catalog = document.getElementById("more-work");
  const selectedWork = document.getElementById("work");
  const grid = document.getElementById("projectResults");
  const cards = [...grid.querySelectorAll(".index-card")];
  // Each card belongs to exactly one industry; filters are built from the cards in page order.
  const industries = [];
  cards.forEach((card) => {
    let industry = industries.find(({ id }) => id === card.dataset.category);
    if (!industry) {
      industry = { id: card.dataset.category, label: card.dataset.categoryLabel, cards: [] };
      industries.push(industry);
    }
    industry.cards.push(card);
  });
  const filters = [{ id: "all", label: "All Projects", size: cards.length }, ...industries.map(
    ({ id, label, cards: members }) => ({ id, label, size: members.length }),
  )].map(({ id, label, size }) => {
    const button = document.createElement("button");
    button.className = "filter";
    button.type = "button";
    button.dataset.filter = id;
    button.setAttribute("aria-controls", "projectResults");
    button.textContent = label;
    const badge = document.createElement("span");
    badge.textContent = String(size);
    button.append(badge);
    filterRow.append(button);
    return button;
  });
  const search = document.getElementById("projectSearch");
  const empty = document.getElementById("catalogEmpty");
  const filterStatus = document.getElementById("filterStatus");
  let category = "all";
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .replaceAll("đ", "d");
  const searchable = new Map(cards.map((card) => [card, normalize(
    card.dataset.categoryLabel + " " + [...card.querySelector(".index-card-copy").children]
      .filter((field) => !field.classList.contains("artifact-links"))
      .map((field) => field.textContent).join(" "),
  )]));

  function filterProjects() {
    const query = normalize(search.value.trim());
    filters.forEach((filter) => {
      const active = filter.dataset.filter === category;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
      if (active) {
        // The tab row scrolls sideways on narrow screens; keep the chosen industry in view.
        const row = filterRow.getBoundingClientRect();
        const tab = filter.getBoundingClientRect();
        if (tab.left < row.left || tab.right > row.right)
          filterRow.scrollLeft += tab.left - row.left - (row.width - tab.width) / 2;
      }
    });
    const shown = new Set();
    cards.forEach((card) => {
      card.hidden =
        (category !== "all" && card.dataset.category !== category) ||
        !searchable.get(card).includes(query);
      if (!card.hidden) shown.add(card.dataset.category);
    });
    const count = cards.filter((card) => !card.hidden).length;
    empty.hidden = count > 0;
    filterStatus.textContent = `${count} ${count === 1 ? "project" : "projects"} in ${shown.size} ${shown.size === 1 ? "industry" : "industries"}`;
  }

  filterRow.addEventListener("click", (event) => {
    const button = event.target.closest(".filter");
    if (!button) return;
    category = button.dataset.filter;
    filterProjects();
  });
  search.addEventListener("input", filterProjects);
  document.getElementById("resetProjects").addEventListener("click", () => {
    category = "all";
    search.value = "";
    filterProjects();
    search.focus();
  });

  // #industry-<id> opens one industry. Older #group-* links map to the industry that now holds
  // those projects, or to all projects when that group mixed several industries.
  const legacyGroups = {
    "group-fintech": "fintech",
    "group-product": "fintech",
    "group-enterprise": "saas",
    "group-realestate": "realestate",
    "group-web": "realestate",
    "group-healthcare": "healthcare",
    "group-education": "education",
    "group-mobility": "automotive",
  };
  function revealAnchor() {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const requested = hash.startsWith("industry-") ? hash.slice(9) : legacyGroups[hash];
    if (requested !== undefined || hash.startsWith("group-")) {
      // Industries whose projects all moved to Selected work have no filter; show them there.
      if (!industries.some(({ id }) => id === requested) &&
          selectedWork.querySelector(`.index-card[data-category="${CSS.escape(requested || "")}"]`)) {
        selectedWork.scrollIntoView({ block: "start", behavior: "instant" });
        return;
      }
      category = industries.some(({ id }) => id === requested) ? requested : "all";
      search.value = "";
      filterProjects();
      catalog.scrollIntoView({ block: "start", behavior: "instant" });
      return;
    }
    const target = document.getElementById(hash);
    if (target && grid.contains(target) && target.closest(".index-card")?.hidden) {
      category = "all";
      search.value = "";
      filterProjects();
      target.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }
  filterProjects();
  filterStatus.hidden = false;
  catalog.querySelector(".project-tools").hidden = false;
  window.addEventListener("hashchange", revealAnchor);
  revealAnchor();
  // Coming back from a case study (#project-<slug>): the first jump happens before fonts and images settle,
  // so align the project row again once the page has finished loading.
  // Late font and image swaps can still move it, so keep it aligned while the layout settles (up to 1.5 s),
  // and stop as soon as the visitor scrolls, touches or presses a key.
  window.addEventListener("load", () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const card = id.startsWith("project-") && document.getElementById(id);
    if (!card) return;
    let settled = false;
    const align = () => { if (!settled) card.scrollIntoView({ block: "start", behavior: "instant" }); };
    const stop = () => { settled = true; resizeWatch.disconnect(); };
    const resizeWatch = new ResizeObserver(align);
    ["wheel", "touchstart", "keydown"].forEach((type) =>
      window.addEventListener(type, stop, { once: true, passive: true }));
    align();
    resizeWatch.observe(document.querySelector("main"));
    document.fonts?.ready.then(align);
    setTimeout(stop, 1500);
  });

  // Reading progress, floating back-to-top and the current-section marker in the nav share one scroll pass.
  const progressBar = document.getElementById("scrollProgress");
  const toTop = document.getElementById("toTop");
  const sectionLinks = [...navigation.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, targets: [document.querySelector(link.getAttribute("href"))] }))
    .filter((item) => item.targets[0]);
  // "Work" covers Selected work and More projects.
  const workItem = sectionLinks.find((item) => item.link.getAttribute("href") === "#work");
  if (workItem && catalog) workItem.targets.push(catalog);
  let scrollQueued = false;
  function updateScrollState() {
    scrollQueued = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    if (toTop) toTop.classList.toggle("is-visible", y > window.innerHeight * 0.8);
    // The current section is the one whose top passed 35% of the viewport most recently (closest above the line),
    // so it follows the visual order, which differs from the nav order on small screens.
    const line = window.innerHeight * 0.35;
    let current = null;
    let currentTop = -Infinity;
    sectionLinks.forEach((item) => {
      item.targets.forEach((t) => {
        const top = t.getBoundingClientRect().top;
        if (top <= line && top > currentTop) { current = item; currentTop = top; }
      });
    });
    if (max > 0 && y >= max - 2) current = sectionLinks[sectionLinks.length - 1];
    sectionLinks.forEach((item) => {
      if (item === current) item.link.setAttribute("aria-current", "location");
      else item.link.removeAttribute("aria-current");
    });
  }
  window.addEventListener("scroll", () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScrollState); }
  }, { passive: true });
  window.addEventListener("resize", updateScrollState);
  updateScrollState();

  // One-tap email copy; the mailto link stays as the fallback when the clipboard is unavailable.
  const copyButton = document.getElementById("copyEmail");
  const copyStatus = document.getElementById("copyStatus");
  if (copyButton && navigator.clipboard && window.isSecureContext) {
    copyButton.hidden = false;
    let resetTimer;
    copyButton.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(copyButton.dataset.copy);
        copyButton.textContent = "Copied";
        copyStatus.textContent = "Email address copied";
      } catch {
        copyButton.textContent = "Copy failed";
        copyStatus.textContent = "Could not copy. Use the email link instead.";
      }
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        copyButton.textContent = "Copy email";
        copyStatus.textContent = "";
      }, 1500);
    });
  }
})();
