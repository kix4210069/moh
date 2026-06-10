/* ====== KetShop Maillot — homepage interactions ====== */

/* ---- SVG jersey placeholder (colored) ---- */
function jersey(primary, secondary) {
  return `
  <svg class="card__jersey" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M35 12 L20 20 L12 34 L22 42 L28 36 L28 86 L72 86 L72 36 L78 42 L88 34 L80 20 L65 12
             C62 18 55 20 50 20 C45 20 38 18 35 12 Z" fill="${primary}" stroke="rgba(0,0,0,.15)" stroke-width="1"/>
    <path d="M40 14 C43 19 47 21 50 21 C53 21 57 19 60 14 L65 12 C62 18 55 20 50 20 C45 20 38 18 35 12 Z" fill="${secondary}"/>
    <rect x="44" y="40" width="12" height="14" rx="2" fill="${secondary}" opacity=".85"/>
  </svg>`;
}

/* ---- Background gradients for media tiles ---- */
const bgs = [
  "linear-gradient(135deg,#eef1f5,#dde3ea)",
  "linear-gradient(135deg,#1c1c20,#33333a)",
  "linear-gradient(135deg,#e9eef7,#cfd9ea)",
  "linear-gradient(135deg,#f3e9ec,#e6cfd8)",
  "linear-gradient(135deg,#e8f3ee,#cfe6da)"
];

/* ---- Product datasets per section ---- */
const data = {
  nouveautes: [
    { t: "Maillot PSG Domicile 2025/2026", p: "29,90", o: "89,90", c: ["#0b1b3a", "#c8102e"], badge: "PROMO" },
    { t: "Maillot Real Madrid Domicile 2025/2026", p: "29,90", o: "89,90", c: ["#ffffff", "#cda349"] },
    { t: "Maillot France Extérieur 2025/2026", p: "29,90", o: "89,90", c: ["#0b1b3a", "#c8102e"] },
    { t: "Maillot Argentine Domicile 2025/2026", p: "29,90", o: "89,90", c: ["#7ec8e3", "#ffffff"] },
    { t: "Maillot Barcelone Domicile 2025/2026", p: "29,90", o: "89,90", c: ["#a50044", "#004d98"], badge: "PROMO" }
  ],
  saison: [
    { t: "Maillot France Extérieur Coupe du Monde 2026", p: "29,90", o: "89,90", c: ["#3fae9b", "#ffffff"], badge: "NEW" },
    { t: "Maillot Paris Away Édition 2025/2026", p: "29,90", o: "89,90", c: ["#1c1c20", "#c8102e"] },
    { t: "Maillot France Maroco Coupe du Monde 2026", p: "29,90", o: "89,90", c: ["#0b1b3a", "#ffffff"] },
    { t: "Maillot PSG Domicile Champions d'Europe", p: "29,90", o: "89,90", c: ["#0b1b3a", "#c8102e"], badge: "B2B" }
  ],
  cdm: [
    { t: "Maillot Brésil Extérieur CDM 2026", p: "29,90", o: "89,90", c: ["#3fae9b", "#ffd400"] },
    { t: "Maillot France Domicile CDM 2026", p: "29,90", o: "89,90", c: ["#1c2a55", "#c8102e"] },
    { t: "Maillot Maroc Domicile CDM 2026", p: "29,90", o: "89,90", c: ["#1c1c2a", "#c8102e"] },
    { t: "Maillot Mexique Extérieur CDM 2026", p: "29,90", o: "89,90", c: ["#e7efe9", "#3aa76d"] }
  ],
  concept: [
    { t: "Maillot Concept PSG Rose", p: "34,90", o: "99,90", c: ["#f4a6c0", "#1c1c20"], badge: "EXCLU" },
    { t: "Maillot Concept France Rose", p: "34,90", o: "99,90", c: ["#f6b8cf", "#0b1b3a"] },
    { t: "Maillot Concept Real Rose", p: "34,90", o: "99,90", c: ["#f7c4d6", "#cda349"] },
    { t: "Maillot Concept Barça Rose", p: "34,90", o: "99,90", c: ["#f4a6c0", "#004d98"] }
  ],
  enfants: [
    { t: "Kit Enfant France Domicile", p: "34,90", o: "79,90", c: ["#1c2a55", "#c8102e"] },
    { t: "Kit Enfant PSG Domicile", p: "34,90", o: "79,90", c: ["#0b1b3a", "#c8102e"] },
    { t: "Kit Enfant Real Madrid", p: "34,90", o: "79,90", c: ["#ffffff", "#cda349"] },
    { t: "Kit Enfant Brésil", p: "34,90", o: "79,90", c: ["#ffd400", "#3aa76d"] }
  ],
  retro: [
    { t: "Maillot Rétro PSG 1998 Domicile", p: "34,90", o: "84,90", c: ["#0b1b3a", "#c8102e"] },
    { t: "Maillot Rétro France 1998 Domicile", p: "34,90", o: "84,90", c: ["#1c2a55", "#ffffff"] },
    { t: "Maillot Rétro FC Barcelone 2009", p: "34,90", o: "84,90", c: ["#a50044", "#004d98"] },
    { t: "Maillot Rétro Maroc Extérieur", p: "34,90", o: "84,90", c: ["#2a5d3a", "#c8102e"] }
  ],
  crampons: [
    { t: "Phantom Luna Elite", p: "99,90", o: "179,90", c: ["#c77dff", "#7b2cbf"] },
    { t: "Phantom Luna Elite", p: "99,90", o: "179,90", c: ["#1c1c20", "#444"] },
    { t: "Air Zoom Mercurial Vapor 16 Elite", p: "99,90", o: "179,90", c: ["#f1f1f1", "#c8102e"] },
    { t: "Air Zoom Mercurial Vapor XV Elite", p: "99,90", o: "179,90", c: ["#ffd400", "#1c1c20"] }
  ],
  training: [
    { t: "Training Été Haut/Bas France 2022-2023", p: "49,90", o: "99,90", c: ["#e7ecf5", "#1c2a55"], badge: "PROMO" },
    { t: "Training Brésil 2023-2024", p: "49,90", o: "110,00", c: ["#3fae9b", "#ffd400"], badge: "PROMO" },
    { t: "Training Été Haut/Bas Portugal 2022-2023", p: "49,90", o: "99,90", c: ["#1c2a3a", "#c8102e"], badge: "PROMO" },
    { t: "Training Été Haut/Bas Espagne 2022-2023", p: "49,90", o: "99,90", c: ["#1c2a55", "#c8102e"], badge: "PROMO" }
  ]
};

/* ---- Render products ---- */
function cardHTML(item, i) {
  const bg = bgs[i % bgs.length];
  const badge = item.badge ? `<span class="card__badge">${item.badge}</span>` : "";
  const old = item.o ? `<span class="old">€${item.o}</span>` : "";
  return `
    <a class="card" href="#">
      <div class="card__media" style="background:${bg}">
        ${badge}
        ${jersey(item.c[0], item.c[1])}
      </div>
      <div class="card__title">${item.t}</div>
      <div class="card__price">€${item.p}${old}</div>
    </a>`;
}

document.querySelectorAll("section[id]").forEach(sec => {
  const row = sec.querySelector("[data-row]");
  const set = data[sec.id];
  if (row && set) {
    row.innerHTML = set.map((it, i) => cardHTML(it, i)).join("");
  }
});

/* ---- Carousel arrows ---- */
document.querySelectorAll(".section__head .arrows, .dark-strip .arrows").forEach(group => {
  const sec = group.closest("section");
  const row = sec.querySelector("[data-row]") || sec.querySelector(".leagues");
  if (!row) return;
  group.querySelectorAll(".arrow").forEach(btn => {
    btn.addEventListener("click", () => {
      const dir = btn.dataset.scroll === "prev" ? -1 : 1;
      row.scrollBy({ left: dir * row.clientWidth * 0.8, behavior: "smooth" });
    });
  });
});

/* ---- Mobile nav toggle ---- */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  mainNav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => mainNav.classList.remove("open")));
}

/* ---- Countdown timer ---- */
(function () {
  const root = document.getElementById("countdown");
  if (!root) return;
  const hEl = root.querySelector("[data-h]");
  const mEl = root.querySelector("[data-m]");
  const sEl = root.querySelector("[data-s]");
  // Resets every day at midnight (local) — total seconds until end of day
  function tick() {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    let diff = Math.max(0, Math.floor((end - now) / 1000));
    const h = String(Math.floor(diff / 3600)).padStart(2, "0");
    const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
    const s = String(diff % 60).padStart(2, "0");
    hEl.textContent = h; mEl.textContent = m; sEl.textContent = s;
  }
  tick();
  setInterval(tick, 1000);
})();
