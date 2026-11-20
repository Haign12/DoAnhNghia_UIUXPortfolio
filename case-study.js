(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme-toggle');
  const icon = document.getElementById('theme-icon');
  const label = themeButton?.querySelector('[data-theme-label]');
  const themeKey = 'portfolio-theme';

  const readTheme = () => {
    try { return localStorage.getItem(themeKey) || localStorage.getItem('theme'); }
    catch (_) { return null; }
  };

  const setTheme = (theme, persist = false) => {
    const nextTheme = theme === 'dark' ? 'dark' : 'light';
    root.dataset.theme = nextTheme;
    if (persist) { try { localStorage.setItem(themeKey, nextTheme); } catch (_) { /* persistence is optional */ } }
    if (themeButton) {
      // A toggle keeps one name; the on/off state lives in aria-pressed.
      themeButton.setAttribute('aria-pressed', String(nextTheme === 'dark'));
      themeButton.setAttribute('aria-label', 'Dark theme');
    }
  };
  // The switch draws its sun and moon from these two spans, so they carry no text.
  if (icon) icon.textContent = '';
  if (label) label.textContent = '';

  setTheme(readTheme() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (!readTheme()) setTheme(event.matches ? 'dark' : 'light');
  });
  themeButton?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

  const pageName = window.location.pathname.split('/').pop() || '';

  /* Canonical case-study artifact hierarchy.
     On the case page the narrative is already open, so the artifact sequence is
     Live -> Figma -> Source. Missing public artifacts are omitted, never faked. */
  const caseArtifactRegistry = {
    'case-study-nova.html': { live:'https://nova-gamma-eosin.vercel.app/', figma:'https://www.figma.com/design/AxsWZgEvTOkzOQB71iAdcx/Nova?node-id=4-2052&t=83Wo9YlCjxLTFzxv-1', source:'https://github.com/Ngh1aa/Nova' },
    'case-study-sentry.html': { live:'https://sentry-xi-lime.vercel.app/', figma:'https://www.figma.com/design/1W6rwPXiTfcZn6OhieVUDe/Sentry?node-id=0-1&t=BvIxuJu3KrFWy5Lg-1', source:'https://github.com/Ngh1aa/Sentry' },
    'case-study-luxroom.html': { live:'https://lux-room.vercel.app/', figma:'https://www.figma.com/design/50eyqHuzpiqIYoIT9ngwcT/LuxRoom?node-id=0-1&t=HPp6OlvriN9MeZCW-1', source:'https://github.com/Ngh1aa/LuxRoom' },
    'case-study-atelier.html': { live:'https://atelier-henna-tau.vercel.app/', figma:'https://www.figma.com/design/Di6yDrXBRps8sN0hEZn66F/Atelier?node-id=75-3&t=Rjoe3Smq5PpayEKI-1', source:'https://github.com/Ngh1aa/Atelier' },
    'case-study-capital-place.html': { live:'https://capital-weld.vercel.app/', figma:'https://www.figma.com/design/E7hF6BmKkaNv2AsJlF9kIi/RedesignCapital?m=auto&t=LykADgxvJ62WCIu7-1', source:'https://github.com/Ngh1aa/Capital' },
    'case-study-lava.html': { live:'https://ngh1aa.github.io/Lava/', source:'https://github.com/Ngh1aa/Lava' },
    'case-study-aegis.html': { live:'https://ngh1aa.github.io/Aegis/', source:'https://github.com/Ngh1aa/Aegis' },
    'case-study-vas-education.html': { live:'https://redesign-vas.vercel.app/', figma:'https://www.figma.com/design/E07BqE4X8apHhziPardmDG/RedesignVAS?m=auto&t=LykADgxvJ62WCIu7-1', source:'https://github.com/Ngh1aa/RedesignVAS' },
    'case-study-qtsc.html': { live:'https://ngh1aa.github.io/QTSC/', figma:'https://www.figma.com/design/wugoCyDEEfzSgu0gQoyum5/QTSC?node-id=0-1&t=LykADgxvJ62WCIu7-1', source:'https://github.com/Ngh1aa/QTSC' },
    'case-study-violet-marketplace.html': { live:'https://violet-marketplace.vercel.app/', figma:'https://www.figma.com/design/tPghPU31brDIbky1M6MCCC/violet?t=LykADgxvJ62WCIu7-1', source:'https://github.com/Ngh1aa/VioletMarketplace' },
    'case-study-voltis.html': { live:'https://voltis-one.vercel.app/', figma:'https://www.figma.com/design/iS0ur2VbuhnLAfSHasnYgp/TRUST.vn---Layout-Website-Test---%C4%90%E1%BB%97-Anh-Ngh%C4%A9a?m=auto&t=LykADgxvJ62WCIu7-1', source:'https://github.com/Ngh1aa/Voltis' },
    'case-study-cennext.html': { live:'https://cennext-b2b-prototype.vercel.app/', figma:'https://www.figma.com/design/RVcp6uzpJvTMHtlS7ilQb7/CenNext---Web-Designer-Test---Do-Anh-Nghia?m=auto&t=LykADgxvJ62WCIu7-1', source:'https://github.com/Ngh1aa/cennext-b2b-prototype' },
    'case-study-flux.html': { live:'https://flux-six-liard.vercel.app/', figma:'https://www.figma.com/design/bZIqaMK97vwzBuSdD8risu/Flux?node-id=1-3427&t=BvIxuJu3KrFWy5Lg-1', source:'https://github.com/Ngh1aa/Flux' },
    'case-study-access.html': { live:'https://access-nbuz.vercel.app/people.html#/users', figma:'https://www.figma.com/design/tQzqKtw8x6Iu4ohKy9LOwo/access?node-id=6-1428&t=2W8CDU1K7QISp6eC-1', source:'https://github.com/Ngh1aa/Access' },
    'case-study-flowcrm.html': { live:'https://ngh1aa.github.io/FlowCRM/', source:'https://github.com/Ngh1aa/FlowCRM' },
    'case-study-careflow.html': { live:'https://ngh1aa.github.io/Patient-Journey-App/staff-prototype/', source:'https://github.com/Ngh1aa/Patient-Journey-App' },
    'case-study-lumen.html': { live:'https://ngh1aa.github.io/Lumen/', source:'https://github.com/Ngh1aa/Lumen' },
  };

  const caseArtifacts = caseArtifactRegistry[pageName];
  if (caseArtifacts) {
    const artifactSpecs = [
      caseArtifacts.live ? { kind:'live', label:'Live prototype ↗', href:caseArtifacts.live } : null,
      caseArtifacts.figma ? { kind:'figma', label:'View Figma ↗', href:caseArtifacts.figma } : null,
      caseArtifacts.source ? { kind:'source', label:'Source ↗', href:caseArtifacts.source } : null,
    ].filter(Boolean);

    const matchesArtifactAction = (link) => {
      const label = link.textContent.trim().toLowerCase();
      return /^(live|try |open live|live demo|demo|prototype|view figma|figma|source|source code|repository|open repository|inspect source|back to work|back to projects)/.test(label);
    };

    const buildArtifactLink = (spec, hero = false, primary = false) => {
      const link = document.createElement('a');
      link.href = spec.href;
      link.textContent = spec.label;
      link.dataset.artifactKind = spec.kind;
      if (hero) link.className = `case-action${primary ? ' case-action-primary' : ''}`;
      const external = /^https?:/i.test(spec.href) || spec.kind !== 'live';
      if (external || spec.href.endsWith('.html')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      return link;
    };

    const heroActions = document.querySelector('.case-hero-actions');
    if (heroActions) {
      const artifactURLs = new Set(artifactSpecs.map((spec) => new URL(spec.href, document.baseURI).href));
      const preserved = [...heroActions.querySelectorAll('a')].filter((link) => !matchesArtifactAction(link) && !artifactURLs.has(link.href));
      const artifactLinks = artifactSpecs.map((spec, index) => buildArtifactLink(spec, true, index === 0));
      heroActions.classList.add('case-artifact-actions');
      heroActions.replaceChildren(...artifactLinks, ...preserved);
    }

    const navActions = document.querySelector('.case-nav-actions');
    if (navActions) {
      const preserved = [...navActions.children].filter((node) => node.tagName !== 'A' || !matchesArtifactAction(node));
      const artifactLinks = artifactSpecs.map((spec) => buildArtifactLink(spec, false, false));
      navActions.replaceChildren(...artifactLinks, ...preserved);
    }
  }

  /* Pages with an evidence section get a jump link to it in the case navigation. */
  const evidenceSection = document.querySelector('.case-evidence-details');
  const caseNavActions = document.querySelector('.case-nav-actions');
  if (evidenceSection && caseNavActions && !caseNavActions.querySelector('[data-evidence-link]')) {
    const link = document.createElement('a');
    link.href = '#case-evidence';
    link.dataset.evidenceLink = 'true';
    link.textContent = 'Evidence details ↓';
    caseNavActions.prepend(link);
  }

  /* Keep project reality explicit, but frame it as context rather than a warning. */
  const caseIndex = document.querySelector('.case-index');
  if (caseIndex) {
    caseIndex.textContent = caseIndex.textContent
      .replace('INDEPENDENT CONCEPT', 'SELF-INITIATED CONCEPT')
      .replace('INDEPENDENT REDESIGN', 'REDESIGN PROTOTYPE');
  }
  document.querySelectorAll('.case-boundary strong').forEach((node) => {
    if (node.textContent.trim().toUpperCase() === 'NOT CLAIMED') node.textContent = 'EVIDENCE BOUNDARY';
  });

  /* Header steps out of the way while reading down and returns on any upward scroll (wave 2). */
  const stickyNav = document.querySelector('.sticky-nav');
  if (stickyNav) {
    let lastY = window.scrollY;
    let queued = false;
    window.addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (Math.abs(y - lastY) > 6) {
          stickyNav.classList.toggle('is-hidden', y > lastY && y > 160);
          lastY = y;
        }
        queued = false;
      });
    }, { passive: true });
  }

  const sections = [...document.querySelectorAll('.case-section[id]')];
  const tocLinks = [...document.querySelectorAll('.toc a')];
  if ('IntersectionObserver' in window && sections.length && tocLinks.length) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      tocLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }), { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach((section) => observer.observe(section));
  }

  // Keep evidence deep links usable when the supporting audit is collapsed.
  function revealEvidenceTarget() {
    const id = location.hash.slice(1);
    const target = id ? document.getElementById(id) : null;
    const details = target?.closest('.case-evidence-details');
    if (details) {
      details.open = true;
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  }
  document.querySelectorAll('a[href="#case-evidence"]').forEach(link => link.addEventListener('click', () => {
    document.getElementById('case-evidence').open = true;
  }));
  window.addEventListener('hashchange', revealEvidenceTarget);
  revealEvidenceTarget();
})();
