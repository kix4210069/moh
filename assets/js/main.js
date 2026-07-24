/* =====================================================================
   MAISON KM — Haute Horlogerie · interactions (HTML/CSS/JS vanilla)
   Reproduction fidèle de la page d'accueil (thème sombre monochrome).
   ===================================================================== */

/* ---------- Utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => n.toFixed(2).replace(".", ",") + " €";

/* ---------- Montre SVG (lunette octogonale, style sport-chic) ---------- */
function octagon(cx, cy, r) {
  return Array.from({ length: 8 }, (_, k) => {
    const a = (22.5 + 45 * k) * Math.PI / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}
function watch(dial = "#15161a", ring = "#3a3c42", strap = "#202227", accent = "#c9cbd1") {
  const marks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * Math.PI / 180;
    const r1 = 30, r2 = i % 3 === 0 ? 24 : 26.5;
    return `<line x1="${(50 + r1 * Math.cos(a)).toFixed(1)}" y1="${(50 + r1 * Math.sin(a)).toFixed(1)}" x2="${(50 + r2 * Math.cos(a)).toFixed(1)}" y2="${(50 + r2 * Math.sin(a)).toFixed(1)}" stroke="${accent}" stroke-width="${i % 3 === 0 ? 1.4 : .8}" opacity=".85"/>`;
  }).join("");
  return `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="lg${ring.slice(1)}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${ring}"/><stop offset=".5" stop-color="#0c0c0e"/><stop offset="1" stop-color="${ring}"/>
      </linearGradient>
      <radialGradient id="rd${dial.slice(1)}" cx="42%" cy="38%" r="70%">
        <stop offset="0" stop-color="${dial}"/><stop offset="1" stop-color="#050506"/>
      </radialGradient>
    </defs>
    <rect x="40" y="2"  width="20" height="24" rx="5" fill="${strap}"/>
    <rect x="40" y="74" width="20" height="24" rx="5" fill="${strap}"/>
    <rect x="86" y="46" width="6" height="8" rx="1.5" fill="${ring}"/>
    <polygon points="${octagon(50,50,45)}" fill="url(#lg${ring.slice(1)})" stroke="${ring}" stroke-width="1"/>
    <polygon points="${octagon(50,50,38)}" fill="#0a0a0b"/>
    <circle cx="50" cy="50" r="33" fill="url(#rd${dial.slice(1)})" stroke="${accent}" stroke-width=".5" opacity=".95"/>
    ${marks}
    <circle cx="50" cy="63" r="6" fill="none" stroke="${accent}" stroke-width=".7" opacity=".6"/>
    <circle cx="38" cy="50" r="5" fill="none" stroke="${accent}" stroke-width=".6" opacity=".45"/>
    <circle cx="62" cy="50" r="5" fill="none" stroke="${accent}" stroke-width=".6" opacity=".45"/>
    <line x1="50" y1="50" x2="50" y2="31" stroke="${accent}" stroke-width="1.8"/>
    <line x1="50" y1="50" x2="64" y2="57" stroke="${accent}" stroke-width="1.4"/>
    <circle cx="50" cy="50" r="2" fill="${accent}"/>
  </svg>`;
}

/* ---------- Coffret horloger SVG ---------- */
function box(lining = "#3f7d92", shell = "#20242a") {
  const cushions = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++)
    cushions.push(`<rect x="${26 + c * 13}" y="${52 + r * 15}" width="10" height="11" rx="3" fill="${lining}" opacity=".8" stroke="#000" stroke-opacity=".15"/>`);
  return `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <polygon points="18,34 82,34 88,44 12,44" fill="${shell}" stroke="#000" stroke-opacity=".25"/>
    <rect x="12" y="44" width="76" height="42" rx="3" fill="${shell}" stroke="#000" stroke-opacity=".25"/>
    <rect x="18" y="48" width="64" height="34" rx="2" fill="${lining}" opacity=".28"/>
    ${cushions.join("")}
    <polygon points="12,44 88,44 82,20 18,20" fill="${lining}" opacity=".9"/>
    <polygon points="18,20 82,20 82,22 18,22" fill="#000" opacity=".2"/>
    <circle cx="50" cy="33" r="4" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1"/>
  </svg>`;
}

/* ---------- Données ---------- */
const COLLECTIONS = [
  { n: "Collection Signature", num: "01 — Ligne", desc: "Le style intemporel, épuré et élégant.", from: 289.99, dial: "#16171b", ring: "#c9cbd1", accent: "#e6e7ea" },
  { n: "Collection S-Limited", num: "02 — Ligne", desc: "L'ultra-exclusif. Pour ceux qui veulent ce que personne ne peut avoir.", from: 329.99, dial: "#101216", ring: "#4a4d55", accent: "#aeb2ba" },
  { n: "Collection Velatura", num: "03 — Ligne", desc: "Légèreté et performance, inspirées par le textile technique et l'univers sportif.", from: 299.99, dial: "#0f1a1f", ring: "#3f7d92", accent: "#8fc7d6" },
];

const MONTRES = [
  { name: "KM 4402D — Onyx", ref: "S-4402D", price: 329.99, dial: "#141416", ring: "#2f3136", accent: "#b9bcc4" },
  { name: "KM 8806D — Aster", ref: "S-8806D-A", price: 289.99, dial: "#101a1e", ring: "#3f7d92", accent: "#7fc3d4", variants: 2 },
  { name: "KM 8806D — Phantom", ref: "S-8806D-P", price: 289.99, dial: "#0f0f12", ring: "#26272c", accent: "#8a8d95" },
  { name: "KM 8169A — Argentum Frosted", ref: "KM-8169A", price: 349.99, dial: "#20222a", ring: "#d7dae0", accent: "#eef0f3" },
  { name: "KM 8806D — Phantom Canvas", ref: "S-8806D-PC", price: 299.99, dial: "#161311", ring: "#5a4e3c", accent: "#c8b38a" },
  { name: "KM 8891D — Onyx Rubber", ref: "S-8891D", price: 329.99, dial: "#0e0e10", ring: "#33353b", accent: "#a7abb3" },
  { name: "KM 8890D — Glacier Rubber", ref: "S-8890D", price: 289.99, dial: "#0d1720", ring: "#3d6f9c", accent: "#8fb9df" },
  { name: "KM 8831D — Snow Canvas", ref: "S-8831D", price: 329.99, dial: "#1c1e22", ring: "#e2e4e8", accent: "#f2f3f5" },
];

const ACCESSOIRES = [
  { name: "Coffret 8-12 berceaux horlogers KM", ref: "coffret-8-12-berceaux-horlogers-km", price: 350.00, lining: "#4aa8c4", shell: "#e9edf0" },
  { name: "Coffret 3 berceaux horlogers KM", ref: "coffret-3-berceaux-horlogers-km", price: 150.00, lining: "#5a6b58", shell: "#1c3a2a" },
  { name: "Coffret 5 berceaux horlogers KM", ref: "coffret-5-berceaux-horlogers-km", price: 200.00, lining: "#4aa8c4", shell: "#16181c" },
  { name: "Coffret 8 berceaux horlogers KM", ref: "coffret-8-berceaux-horlogers-km", price: 400.00, lining: "#5bb6d0", shell: "#20242a" },
];

/* ---------- Rendu : collections ---------- */
const collTrack = $("#collTrack");
if (collTrack) collTrack.innerHTML = COLLECTIONS.map(c => `
  <a class="coll" href="#montres">
    <div class="coll__media">
      ${watch(c.dial, c.ring, "#1c1e22", c.accent)}
      <span class="coll__line">${c.num}</span>
      <span class="coll__name">${c.n.replace("Collection ", "")}</span>
    </div>
    <div class="coll__body">
      <p class="coll__desc">${c.desc}</p>
      <p class="coll__from">À partir de ${eur(c.from)}</p>
      <span class="coll__link">Découvrez →</span>
    </div>
  </a>`).join("");

/* carrousel : flèches */
(function () {
  const track = $("#collTrack");
  if (!track) return;
  const step = () => track.querySelector(".coll")?.offsetWidth + 26 || 320;
  $("#collPrev").addEventListener("click", () => track.scrollBy({ left: -step(), behavior: "smooth" }));
  $("#collNext").addEventListener("click", () => track.scrollBy({ left: step(), behavior: "smooth" }));
})();

/* ---------- Rendu : montres ---------- */
function productCard(p, type) {
  const media = type === "box" ? box(p.lining, p.shell) : watch(p.dial, p.ring, "#1c1e22", p.accent);
  const data = encodeURIComponent(JSON.stringify({ name: p.name, ref: p.ref, price: p.price, type, ...p }));
  return `
  <article class="card">
    <div class="card__media">
      ${p.variants ? `<span class="card__variants">${p.variants} variantes</span>` : ""}
      ${media}
      <button class="card__add" data-add="${data}">
        <svg viewBox="0 0 24 24"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>Ajouter
      </button>
    </div>
    <div class="card__body">
      <h3 class="card__name">${p.name}</h3>
      <p class="card__ref">${p.ref}</p>
      <p class="card__price">${eur(p.price)}</p>
    </div>
  </article>`;
}
$("#gridMontres").innerHTML = MONTRES.map(p => productCard(p, "watch")).join("");
$("#gridAccessoires").innerHTML = ACCESSOIRES.map(p => productCard(p, "box")).join("");

/* ---------- Panier ---------- */
const CART = { items: JSON.parse(localStorage.getItem("km_cart") || "[]") };
const drawer = $("#drawer"), overlay = $("#drawerOverlay");
const saveCart = () => localStorage.setItem("km_cart", JSON.stringify(CART.items));
const cartCount = () => CART.items.reduce((s, i) => s + i.qty, 0);
const cartTotal = () => CART.items.reduce((s, i) => s + i.qty * i.price, 0);

function renderCart() {
  $("#cartCount").textContent = cartCount();
  $("#drawerTotal").textContent = eur(cartTotal());
  const box2 = $("#drawerItems");
  if (!CART.items.length) { box2.innerHTML = `<div class="drawer__empty">Votre panier est vide.<br>Découvrez nos créations.</div>`; return; }
  box2.innerHTML = CART.items.map((it, i) => `
    <div class="d-item">
      <div class="d-item__media">${it.type === "box" ? box(it.lining, it.shell) : watch(it.dial, it.ring, "#1c1e22", it.accent)}</div>
      <div class="d-item__info">
        <div class="d-item__name">${it.name}</div>
        <div class="d-item__ref">${it.ref}</div>
        <div class="d-item__row">
          <div class="d-qty"><button data-dec="${i}">−</button><span>${it.qty}</span><button data-inc="${i}">+</button></div>
          <div class="d-item__price">${eur(it.qty * it.price)}</div>
        </div>
        <button class="d-item__rm" data-rm="${i}">Retirer</button>
      </div>
    </div>`).join("");
}
function addToCart(p) {
  const f = CART.items.find(i => i.name === p.name);
  if (f) f.qty += 1; else CART.items.push({ ...p, qty: 1 });
  saveCart(); renderCart(); openDrawer();
}
const openDrawer = () => { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); };
const closeDrawer = () => { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); };

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]"); if (add) { addToCart(JSON.parse(decodeURIComponent(add.dataset.add))); return; }
  const inc = e.target.closest("[data-inc]"); if (inc) { CART.items[+inc.dataset.inc].qty++; saveCart(); renderCart(); return; }
  const dec = e.target.closest("[data-dec]"); if (dec) { const i = +dec.dataset.dec; if (--CART.items[i].qty <= 0) CART.items.splice(i, 1); saveCart(); renderCart(); return; }
  const rm = e.target.closest("[data-rm]"); if (rm) { CART.items.splice(+rm.dataset.rm, 1); saveCart(); renderCart(); return; }
});
$("#cartBtn").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
renderCart();

/* ---------- Header / recherche / menu ---------- */
const searchbar = $("#searchbar");
const toggleSearch = () => { searchbar.classList.toggle("open"); if (searchbar.classList.contains("open")) $("#searchInput").focus(); };
$("#searchBtn").addEventListener("click", toggleSearch);
$("#floatSearch").addEventListener("click", () => { searchbar.classList.add("open"); $("#searchInput").focus(); window.scrollTo({ top: 0, behavior: "smooth" }); });
$("#searchClose").addEventListener("click", () => searchbar.classList.remove("open"));

const mobileMenu = $("#mobileMenu");
$("#burger").addEventListener("click", () => mobileMenu.classList.toggle("open"));
$$("#mobileMenu a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

/* ---------- Cookies ---------- */
const cookies = $("#cookies");
if (!localStorage.getItem("km_cookies")) setTimeout(() => cookies.classList.add("show"), 900);
const closeCookies = (v) => { localStorage.setItem("km_cookies", v); cookies.classList.remove("show"); };
$("#cookieAccept").addEventListener("click", () => closeCookies("accepted"));
$("#cookieRefuse").addEventListener("click", () => closeCookies("refused"));

/* ---------- Année ---------- */
$("#year").textContent = new Date().getFullYear();
