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
    imageAlt: "Captura del entorno de desarrollo de la API Unimarket",
    projectUrl: "https://github.com/MichaelHoyos94/unimarket",
  },
  {
    year: "2024",
    title: "GShop",
    description:
      "API Desarrollada en node.js para una tienda de juegos sencilla. Permite gestionar los usuarios, autenticación, compras y reseñas a videojuegos.",
    imageUrl:
      "https://i.postimg.cc/hvMH826Y/code-tienda-juegos.png",
    imageAlt: "Captura del codigo de GShop, API de tienda de videojuegos",
    projectUrl: "https://github.com/MichaelHoyos94/tiendaJuegos",
  },
];

/**
 * Groups technologies by type, keeping the order in which each type first appears.
 * @param {{ type: string, name: string }[]} items Technologies to group.
 * @returns {Map<string, string[]>} Technology names indexed by type.
 */
function groupTechnologiesByType(items) {
  return items.reduce((groups, technology) => {
    const names = groups.get(technology.type) ?? [];
    names.push(technology.name);
    groups.set(technology.type, names);
    return groups;
  }, new Map());
}

/**
 * Renders one technology block per category from the editable technologies data array.
 */
function renderTechnologies() {
  const technologyList = document.querySelector("#technology-list");

  if (!technologyList) {
    return;
  }

  const technologyGroups = groupTechnologiesByType(technologies);

  technologyList.innerHTML = Array.from(
    technologyGroups,
    ([type, names]) => `
      <article class="technology-group">
        <div class="technology-group-header">
          <h3 class="technology-group-title">${type}</h3>
          <span class="technology-group-count">${names.length}</span>
        </div>
        <ul class="technology-chips">
          ${names.map((name) => `<li class="technology-chip">${name}</li>`).join("")}
        </ul>
      </article>
    `,
  ).join("");

  // Se difiere un frame: si la pagina carga con un enlace directo a una
  // seccion (ej. #arsenal-tecnologico), el salto automatico del navegador
  // puede no haber terminado todavia en este mismo tick, y el observer
  // mediria la posicion equivocada en su primera lectura.
  window.requestAnimationFrame(observeTechnologyGroups);
}

/**
 * Reveals technology groups with a clip-path stagger as the stack section
 * enters the viewport. Runs once per group: it is reference content, not a
 * timeline, so it does not need to replay on every scroll pass.
 *
 * Usa una comprobacion manual de posicion por cada frame (en vez de confiar
 * solo en IntersectionObserver o en el evento "scroll") mientras dura un
 * posible desplazamiento: se detecto que ni el observer ni el evento
 * "scroll" se disparan de forma fiable cuando el salto llega por un clic en
 * el nav del header o por un enlace directo con hash, dejando la seccion
 * invisible para siempre.
 */
function observeTechnologyGroups() {
  const technologyGroups = document.querySelectorAll(".technology-group");

  if (!technologyGroups.length) {
    return;
  }

  const revealGroupsInViewport = () => {
    let hasPendingGroups = false;

    technologyGroups.forEach((group) => {
      if (group.classList.contains("is-visible")) {
        return;
      }

      const bounds = group.getBoundingClientRect();
      const isInViewport = bounds.top < window.innerHeight && bounds.bottom > 0;

      if (isInViewport) {
        group.classList.add("is-visible");
      } else {
        hasPendingGroups = true;
      }
    });

    return hasPendingGroups;
  };

  let isWatching = false;

  const watchUntilSettled = () => {
    if (isWatching) {
      return;
    }

    isWatching = true;

    // Cubre la duracion de un scroll suave (CSS scroll-behavior) mas un
    // margen: si tras ~1.5s todavia hay grupos pendientes, se abandona el
    // sondeo hasta el proximo scroll/resize/clic de nav.
    let framesLeft = 90;

    const step = () => {
      const hasPendingGroups = revealGroupsInViewport();

      framesLeft -= 1;

      if (hasPendingGroups && framesLeft > 0) {
        window.requestAnimationFrame(step);
      } else {
        isWatching = false;
      }
    };

    window.requestAnimationFrame(step);
  };

  window.addEventListener("scroll", watchUntilSettled, { passive: true });
  window.addEventListener("resize", watchUntilSettled);
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    link.addEventListener("click", watchUntilSettled);
  });

  watchUntilSettled();
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
  const panel = button.closest(".credentials-panel");
  const feedback = panel?.querySelector(".copy-feedback");

  if (!value || !feedback) {
    return;
  }

  let isCopied = false;

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
    isCopied = true;
  } catch {
    feedback.textContent = "No disponible: copia el valor manualmente";
  }

  panel.querySelectorAll(".copy-credential-button.is-copied").forEach((copiedButton) => {
    copiedButton.classList.remove("is-copied");
  });
  button.classList.toggle("is-copied", isCopied);
  feedback.classList.add("is-visible");

  window.clearTimeout(Number(panel.dataset.feedbackTimer));
  const feedbackTimer = window.setTimeout(() => {
    feedback.classList.remove("is-visible");
    button.classList.remove("is-copied");
    window.setTimeout(() => {
      feedback.textContent = "";
    }, 180);
  }, 2200);
  panel.dataset.feedbackTimer = String(feedbackTimer);
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
 * Toggles the visible state of timeline items as they enter or leave the viewport,
 * so entries fade in and out again while scrolling up and down.
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
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.1 },
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
        <article class="timeline-item relative mb-14 pl-9 last:mb-0 md:mb-20 md:grid md:grid-cols-[1fr_48px_1fr] md:items-center md:gap-6 md:pl-0">
          <div class="timeline-card order-1 ${contentOrder}">
            <span class="timeline-year">${project.year}</span>
            <h3 class="mt-2 text-2xl font-semibold tracking-tight text-ink">
              ${project.title}
            </h3>
            <p class="mt-3 text-[0.9375rem] leading-7 text-ink-muted">
              ${project.description}
            </p>
            <a class="project-link mt-5" href="${project.projectUrl}" target="_blank" rel="noopener noreferrer">
              Ver despliegue
            </a>
            ${renderCredentials(project.credentials)}
          </div>

          <div class="absolute left-1 top-8 z-10 md:static md:order-2 md:flex md:justify-center">
            <div class="timeline-node"></div>
          </div>

          <a class="timeline-image-link order-3 mt-5 block md:mt-0 ${imageOrder}" href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" aria-label="Abrir despliegue de ${project.title}">
            <img class="timeline-image" src="${project.imageUrl}" alt="${project.imageAlt}" loading="lazy" />
          </a>
        </article>
      `;
    })
    .join("");

  // Mismo motivo que en renderTechnologies(): esperar un frame antes de
  // observar, para no medir la posicion antes de que termine un salto
  // directo a #trayectoria u otra seccion.
  window.requestAnimationFrame(observeTimelineItems);
  bindCredentialCopyButtons();
}

/**
 * Forces a link active once the user reaches the bottom of the page. Short
 * sections near the end (like the footer) can be smaller than the scroll
 * observer's detection band and never trigger it on their own.
 * @param {(sectionId: string) => void} setActiveLink Activates the link for a section id.
 * @param {string | undefined} lastSectionId Id of the final tracked section.
 */
function bindBottomOfPageNavigation(setActiveLink, lastSectionId) {
  if (!lastSectionId) {
    return;
  }

  let isCheckQueued = false;

  const checkScrollPosition = () => {
    isCheckQueued = false;
    const hasReachedBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

    if (hasReachedBottom) {
      setActiveLink(lastSectionId);
    }
  };

  const queueCheck = () => {
    if (!isCheckQueued) {
      isCheckQueued = true;
      window.requestAnimationFrame(checkScrollPosition);
    }
  };

  window.addEventListener("scroll", queueCheck, { passive: true });
  window.addEventListener("resize", queueCheck);
  checkScrollPosition();
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

  const lastSectionId = Array.from(linkBySectionId.keys()).at(-1);
  bindBottomOfPageNavigation(setActiveLink, lastSectionId);
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
