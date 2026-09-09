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
    title: "VittaSelf - ERP",
    description:
      "VittaSelf es un ERP ligero para una plataforma de ventas multinivel. Permite gestionar empresarios, productos, ordenes, carrito de compras, sanciones, auditorias, cajas registradoras, centros de costo, planes, beneficios y metricas de negocio.",
    imageUrl:
      "https://i.postimg.cc/NfXd8CLq/dashboard-vittaself.png",
    imageAlt: "Panel principal demo de VittaSelf - ERP",
    projectUrl: "https://vittaself-develop.onrender.com/",
    credentials: [
      {
        role: "Asesor",
        available: true,
        username: "asesor-armenia@vittaself.com",
        password: "Vitta$elf",
      },
      {
        role: "Empresario",
        available: true,
        username: "empresario@vittaself.com",
        password: "Vitta$elf",
      }
    ],
  },
  {
    year: "2025",
    title: "API Unimarket",
    description:
      "Servidor API REST para una plataforma E-Commerce. Proyecto academico de programacion avanzada en la Uniquindio.",
    imageUrl:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Captura demo del Proyecto B con entorno de desarrollo",
    projectUrl: "https://github.com/MichaelHoyos94/unimarket",
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
 * Creates the optional demo credentials panel for a project.
 */
function renderCredentials(credentials = []) {
  const availableCredentials = credentials.filter(
    (credential) => credential.available && credential.username && credential.password,
  );

  if (!availableCredentials.length) {
    return "";
  }

  const credentialRows = availableCredentials
    .map(
      (credential) => `
        <div class="credential-row">
          <div>
            <span class="credential-role">${credential.role}</span>
            <dl class="credential-values">
              <div>
                <dt>Usuario</dt>
                <dd>${credential.username}</dd>
              </div>
              <div>
                <dt>Contrasena</dt>
                <dd>${credential.password}</dd>
              </div>
            </dl>
          </div>
          <div class="credential-actions">
            <button class="copy-credential-button" type="button" data-copy-value="${credential.username}">
              Copiar usuario
            </button>
            <button class="copy-credential-button" type="button" data-copy-value="${credential.password}">
              Copiar contrasena
            </button>
          </div>
        </div>
      `,
    )
    .join("");

  return `
    <section class="credentials-panel" aria-label="Credenciales demo">
      <div class="credentials-heading">
        <div>
          <span class="credentials-kicker">Acceso controlado</span>
          <h4>Credenciales demo</h4>
        </div>
        <span class="credentials-badge">Publicas</span>
      </div>
      <p class="credentials-note">Usa estos datos solo para explorar el despliegue de demostracion.</p>
      <div class="credentials-list">${credentialRows}</div>
      <p class="copy-feedback" role="status" aria-live="polite"></p>
    </section>
  `;
}

/**
 * Copies a credential value and reports the result to the project panel.
 */
async function copyCredential(button) {
  const value = button.dataset.copyValue;
  const feedback = button.closest(".credentials-panel")?.querySelector(".copy-feedback");

  if (!value || !feedback) {
    return;
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const fallbackInput = document.createElement("textarea");
      fallbackInput.className = "clipboard-fallback";
      fallbackInput.value = value;
      document.body.appendChild(fallbackInput);
      fallbackInput.select();
      document.execCommand("copy");
      fallbackInput.remove();
    }

    feedback.textContent = "Copiado";
  } catch {
    feedback.textContent = "No disponible: copia el valor manualmente";
  }

  window.setTimeout(() => {
    feedback.textContent = "";
  }, 2200);
}

/**
 * Enables copy controls inside rendered credential panels.
 */
function bindCredentialCopyButtons() {
  document.querySelectorAll(".copy-credential-button").forEach((button) => {
    button.addEventListener("click", () => copyCredential(button));
  });
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
            ${renderCredentials(project.credentials)}
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
  bindCredentialCopyButtons();
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
