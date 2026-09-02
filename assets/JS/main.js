const technologies = [
  { type: "Lenguaje", name: "JavaScript" },
  { type: "Lenguaje", name: "Java" },
  { type: "Lenguaje", name: "C#" },
  { type: "Framework", name: "Springboot" },
  { type: "Framework", name: "Node.js | Express" },
  { type: "Framework", name: "Laravel" },
  { type: "Marcado", name: "HTML" },
  { type: "Estilos", name: "CSS" },
  { type: "Framework CSS", name: "Tailwind CSS" },
  { type: "Base de datos", name: "MySQL" },
  { type: "Base de datos", name: "PostgreSQL" },
  { type: "Control de versiones", name: "Git" },
  { type: "Plataforma", name: "GitHub" },
];

const projects = [
  {
    year: "2026",
    title: "Proyecto A",
    description:
      "Demo de aplicacion web orientada a presentar una experiencia clara, responsive y desplegada para validacion tecnica.",
    imageUrl:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Captura demo del Proyecto A con codigo en pantalla",
    projectUrl: "https://example.com/proyecto-a",
  },
  {
    year: "2025",
    title: "Proyecto B",
    description:
      "Demo de sistema con enfoque en estructura, organizacion de contenido y presentacion directa de funcionalidades principales.",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Captura demo del Proyecto B con entorno de desarrollo",
    projectUrl: "https://example.com/proyecto-b",
  },
  {
    year: "2024",
    title: "Proyecto C",
    description:
      "Demo de solucion estatica desplegable, enfocada en rendimiento, contenido accesible y mantenimiento sencillo.",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Captura demo del Proyecto C en un espacio de trabajo",
    projectUrl: "https://example.com/proyecto-c",
  },
];

/**
 * Renders technology cards from the editable technologies data array.
 */
function renderTechnologies() {
  const technologyList = document.querySelector("#technology-list");

  if (!technologyList) {
    return;
  }

  technologyList.innerHTML = technologies
    .map(
      (technology) => `
        <article class="technology-card rounded-xl border border-slate-800 bg-slate-900/70 p-5 transition-colors hover:border-slate-400">
          <span class="relative text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            ${technology.type}
          </span>
          <h3 class="relative mt-3 text-xl font-semibold text-white">
            ${technology.name}
          </h3>
        </article>
      `,
    )
    .join("");
}

/**
 * Reveals timeline items as they enter the viewport.
 */
function observeTimelineItems() {
  const timelineItems = document.querySelectorAll(".timeline-item");

  if (!timelineItems.length) {
    return;
  }

  if (!("IntersectionObserver" in window)) {
    timelineItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const timelineObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.22 },
  );

  timelineItems.forEach((item) => timelineObserver.observe(item));
}

/**
 * Renders project timeline cards from the editable projects data array.
 */
function renderProjects() {
  const projectTimeline = document.querySelector("#project-timeline");

  if (!projectTimeline) {
    return;
  }

  const sortedProjects = [...projects].sort((firstProject, secondProject) => {
    return Number(secondProject.year) - Number(firstProject.year);
  });

  projectTimeline.innerHTML = sortedProjects
    .map((project, index) => {
      const isReversed = index % 2 === 1;
      const contentOrder = isReversed ? "md:order-3" : "md:order-1";
      const imageOrder = isReversed ? "md:order-1" : "md:order-3";

      return `
        <article class="timeline-item relative mb-14 pl-9 md:grid md:grid-cols-[1fr_48px_1fr] md:items-center md:gap-6 md:pl-0">
          <div class="timeline-card order-1 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 transition-colors hover:border-slate-400 ${contentOrder}">
            <span class="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              ${project.year}
            </span>
            <h3 class="mt-3 text-2xl font-semibold text-white">
              ${project.title}
            </h3>
            <p class="mt-3 text-sm leading-6 text-slate-400">
              ${project.description}
            </p>
            <a class="mt-5 inline-flex text-sm font-semibold uppercase tracking-[0.2em] text-slate-200 underline decoration-slate-600 underline-offset-8 transition-colors hover:text-white" href="${project.projectUrl}" target="_blank" rel="noopener noreferrer">
              Ver despliegue
            </a>
          </div>

          <div class="absolute left-1 top-8 z-10 md:static md:order-2 md:flex md:justify-center">
            <div class="timeline-node"></div>
          </div>

          <a class="timeline-image-link order-3 mt-5 block rounded-2xl border border-slate-800 bg-slate-900/70 md:mt-0 ${imageOrder}" href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" aria-label="Abrir despliegue de ${project.title}">
            <img class="timeline-image" src="${project.imageUrl}" alt="${project.imageAlt}" loading="lazy" />
          </a>
        </article>
      `;
    })
    .join("");

  observeTimelineItems();
}

/**
 * Marks the current navigation link based on the section visible in the viewport.
 */
function observeActiveNavigation() {
  const navigationLinks = document.querySelectorAll("[data-nav-link]");

  if (!navigationLinks.length || !("IntersectionObserver" in window)) {
    return;
  }

  const linkBySectionId = Array.from(navigationLinks).reduce((links, link) => {
    const sectionId = link.getAttribute("href")?.replace("#", "");

    if (sectionId) {
      links.set(sectionId, link);
    }

    return links;
  }, new Map());

  const sections = Array.from(linkBySectionId.keys())
    .map((sectionId) => document.querySelector(`#${sectionId}`))
    .filter(Boolean);

  const setActiveLink = (sectionId) => {
    navigationLinks.forEach((link) => {
      link.classList.remove("is-active");
      link.removeAttribute("aria-current");
    });

    const activeLink = linkBySectionId.get(sectionId);

    if (activeLink) {
      activeLink.classList.add("is-active");
      activeLink.setAttribute("aria-current", "page");
    }
  };

  const navigationObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries.find((entry) => entry.isIntersecting);

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    },
    { rootMargin: "-34% 0px -56% 0px", threshold: 0 },
  );

  sections.forEach((section) => navigationObserver.observe(section));
}

/**
 * Initializes the static portfolio shell.
 */
function initPortfolio() {
  document.documentElement.dataset.appReady = "true";
  renderTechnologies();
  renderProjects();
  observeActiveNavigation();
}

initPortfolio();
