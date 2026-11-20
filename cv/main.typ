#import "@preview/basic-resume:0.2.9": *

#let name = "Do Anh Nghia"
#let location = "Ho Chi Minh City, Vietnam (GMT+7)"
#let email = "anhnghia9a633@gmail.com"
#let phone = "+84 7988 760 74"
#let personal-site = "do-anh-nghia-uiux-portfolio.vercel.app"

#show: resume.with(
  author: name,
  location: location,
  email: email,
  phone: phone,
  personal-site: personal-site,
  accent-color: "#111111",
  font: "Source Sans 3",
  paper: "a4",
  author-position: left,
  personal-info-position: left,
)

#show heading: set text(font: "Libertinus Serif")

*Product Designer* with 2+ years of professional experience across agency and product teams. I design money flows, operational tools and commerce journeys, from information architecture and interaction states to coded prototypes and developer handoff. Open to remote roles.

== Experience

#work(
  title: "UI/UX Designer",
  location: "Full-time",
  company: "MangoAds — SEO Optimization & Web Design Agency",
  dates: dates-helper(start-date: "Dec 2025", end-date: "Sep 2026"),
)
- Redesigned information architecture and UI across 8+ client-facing web platforms, standardizing reusable components, responsive rules and developer handoff.
- Translated business requirements into user flows, responsive UI systems and interaction states.

#work(
  title: "UI/UX Designer",
  location: "Full-time",
  company: "Tikera Technology & Brand Development",
  dates: dates-helper(start-date: "Jan 2025", end-date: "Oct 2025"),
)
- Structured user flows, wireframes and design systems for 15+ product journeys, including loading, empty, error and edge-case states.

#work(
  title: "UI/UX Design Intern",
  location: "Remote",
  company: "Trésor Solution",
  dates: dates-helper(start-date: "Sep 2024", end-date: "Dec 2024"),
)
- Supported responsive MVP flows, reusable UI patterns and developer handoff.

== Selected Product Work

#project(
  name: "LuxRoom — Furniture E-commerce",
  role: "Product Design, Commerce UX",
  dates: "2026",
)
- *Problem:* Premium imagery creates desire but does not resolve room fit, dimensions, materials, access and delivery uncertainty. *Outcome:* Designed a continuous decision journey across discovery, comparison, saved configuration, cart and checkout, with explicit recovery when purchase confidence breaks down.

#project(
  name: "Flux — B2B Payments",
  role: "Product Design, Finance Operations",
  dates: "2026",
)
- *Problem:* Payment approvals, permissions and the decision trail need to stay in context for finance teams moving money across currencies. *Outcome:* Designed a payments workspace with a visible approval control chain, role-based permissions and clear exception states, delivered as a working prototype.

#project(
  name: "Atelier — Fashion E-commerce",
  role: "Product Design, Art Direction",
  dates: "2026",
)
- *Problem:* Fashion commerce has to balance editorial expression with product discovery and shopping clarity. *Outcome:* Designed a mobile-first storefront where editorial storytelling supports discovery, evaluation and purchase, delivered as a live prototype.

#project(
  name: "Sentry — B2B Fraud Operations",
  role: "Product Design, Operational Systems",
  dates: "2026",
)
- *Problem:* Fraud analysts make high-stakes decisions while evidence is fragmented across systems and difficult to reconstruct. *Outcome:* Unified alert priority, forensic evidence, decision controls, rationale and audit recovery in one investigation model with conflict, escalation and failure states.

== Education

#edu(
  institution: "University of Science, VNU-HCM (HCMUS)",
  location: "Ho Chi Minh City, Vietnam",
  dates: dates-helper(start-date: "2021", end-date: "2026"),
  degree: "Information Technology",
)

#edu(
  institution: "Université Claude Bernard Lyon 1",
  location: "Lyon, France",
  dates: dates-helper(start-date: "2021", end-date: "2025"),
  degree: "Information Technology",
)

- Google UX Design Foundations (2026)

== Skills

- *Product design:* product thinking, information architecture and user flows, interaction and state design, design systems, responsive UI, research, usability testing.
- *Business analysis:* requirements gathering, user stories, acceptance criteria.
- *Design to code:* Figma, HTML, CSS and JavaScript, React and Next.js prototypes (AI-assisted), Git and GitHub, Playwright and axe-core.
- *Workflow:* UIUX Factory for repository grounding, implementation support, browser QA and evidence-aware iteration.
