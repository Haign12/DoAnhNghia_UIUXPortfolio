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
    themeButton.textContent = dark ? "Light" : "Dark";
    themeButton.setAttribute(
      "aria-label",
      dark ? "Switch to light theme" : "Switch to dark theme",
    );
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
  const catalog = document.getElementById("work");
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
  const projectsPerRow = 3;
  const slots = Array.from({ length: (projectsPerRow - cards.length % projectsPerRow) % projectsPerRow }, () => {
    const slot = document.createElement("p");
    slot.className = "project-slot";
    slot.textContent = "Coming soon";
    grid.append(slot);
    return slot;
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
    slots.forEach((slot) => { slot.hidden = Boolean(query) || category !== "all"; });
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
})();
