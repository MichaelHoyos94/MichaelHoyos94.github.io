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
 * Initializes the static portfolio shell.
 */
function initPortfolio() {
  document.documentElement.dataset.appReady = "true";
  renderTechnologies();
}

initPortfolio();
