/* =====================================================================
   MAISON KM — interactions page d'accueil (horlogerie de luxe)
   HTML + CSS + JS vanilla, sans build.
   ===================================================================== */

/* ---------- Montre SVG (placeholder élégant, cadran paramétrable) ---------- */
function watch(dial, accent, strap = "#20242c") {
  const marks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * Math.PI / 180;
    const r1 = 40, r2 = i % 3 === 0 ? 33 : 36;
    const x1 = 50 + r1 * Math.cos(a), y1 = 50 + r1 * Math.sin(a);
    const x2 = 50 + r2 * Math.cos(a), y2 = 50 + r2 * Math.sin(a);
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${accent}" stroke-width="${i % 3 === 0 ? 1.6 : .9}" stroke-linecap="round"/>`;
  }).join("");
  return `
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <radialGradient id="g-${accent.replace('#','')}" cx="42%" cy="38%" r="70%">
        <stop offset="0%" stop-color="${dial}" stop-opacity="1"/>
        <stop offset="100%" stop-color="#000" stop-opacity=".55"/>
      </radialGradient>
    </defs>
    <!-- bracelet -->
    <rect x="41" y="2"  width="18" height="22" rx="4" fill="${strap}"/>
    <rect x="41" y="76" width="18" height="22" rx="4" fill="${strap}"/>
    <!-- couronne -->
    <rect x="86" y="46" width="6" height="8" rx="1.5" fill="${accent}"/>
    <!-- boîtier -->
    <circle cx="50" cy="50" r="46" fill="none" stroke="${accent}" stroke-width="1.2" opacity=".5"/>
    <circle cx="50" cy="50" r="43" fill="${accent}"/>
    <circle cx="50" cy="50" r="40" fill="url(#g-${accent.replace('#','')})"/>
    <!-- index -->
    ${marks}
    <!-- sous-cadrans (chrono) -->
    <circle cx="50" cy="66" r="7" fill="none" stroke="${accent}" stroke-width=".8" opacity=".7"/>
    <circle cx="36" cy="50" r="6" fill="none" stroke="${accent}" stroke-width=".7" opacity=".55"/>
    <circle cx="64" cy="50" r="6" fill="none" stroke="${accent}" stroke-width=".7" opacity=".55"/>
    <!-- aiguilles -->
    <line x1="50" y1="50" x2="50" y2="28" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="68" y2="58" stroke="${accent}" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="50" y1="50" x2="42" y2="40" stroke="#e8e2d4" stroke-width="1" stroke-linecap="round" opacity=".9"/>
    <circle cx="50" cy="50" r="2.4" fill="${accent}"/>
  </svg>`;
}

/* ---------- Catalogue ---------- */
const CATALOG = {
  slimited: [
    { name: "KM 7712 · Glacier",  ref: "S-Limited", price: 289, old: 390, dial: "#1c2b3a", accent: "#9db7cf", stars: 5, badge: "Nouveauté" },
    { name: "KM 3050 · Orion",    ref: "S-Limited", price: 269, old: 360, dial: "#14161c", accent: "#c7ccd6", stars: 5 },
    { name: "KM 4400 · Ardoise",  ref: "S-Limited", price: 249, old: 320, dial: "#232529", accent: "#aeb2ba", stars: 4 },
    { name: "KM 2200 · Ivoire",   ref: "S-Limited", price: 279, old: 359, dial: "#efe9dc", accent: "#8a7d5f", strap: "#3a2f22", stars: 5, badge: "Best-seller" },
  ],
  signature: [
    { name: "KM 9001 · Impérial",  ref: "Signature · 300 ex.", price: 549, old: 720, dial: "#2a1f14", accent: "#c9a86a", stars: 5, badge: "Édition limitée" },
    { name: "KM 8800 · Onyx Or",   ref: "Signature · 300 ex.", price: 599, old: 780, dial: "#0f0f12", accent: "#d8b878", stars: 5, badge: "Numérotée" },
    { name: "KM 7000 · Tourbillon",ref: "Signature · 300 ex.", price: 690, old: 890, dial: "#151a22", accent: "#c9a86a", stars: 5, badge: "Tourbillon" },
    { name: "KM 6500 · Émeraude",  ref: "Signature · 300 ex.", price: 569, old: 740, dial: "#132a22", accent: "#7fbfa0", stars: 5, sold: true },
  ],
  top: [
    { name: "KM 9001 · Impérial",  ref: "Signature", price: 549, old: 720, dial: "#2a1f14", accent: "#c9a86a", stars: 5, badge: "N°1" },
    { name: "KM 2200 · Ivoire",    ref: "S-Limited", price: 279, old: 359, dial: "#efe9dc", accent: "#8a7d5f", strap: "#3a2f22", stars: 5 },
    { name: "KM 7000 · Tourbillon",ref: "Signature", price: 690, old: 890, dial: "#151a22", accent: "#c9a86a", stars: 5 },
    { name: "KM 7712 · Glacier",   ref: "S-Limited", price: 289, old: 390, dial: "#1c2b3a", accent: "#9db7cf", stars: 5 },
  ],
};

/* ---------- Carte produit ---------- */
function stars(n) { return "★".repeat(n) + "☆".repeat(5 - n); }
function cardHTML(p, i) {
  const media = `<div class="card__media" style="background:linear-gradient(150deg,#f7f3ea,#efe8d7)">${watch(p.dial, p.accent, p.strap)}</div>`;
  const badge = p.sold
    ? `<span class="card__badge card__badge--sold">Épuisé</span>`
    : (p.badge ? `<span class="card__badge">${p.badge}</span>` : "");
  const price = `<div class="card__price">${p.price} €${p.old ? `<span class="old">${p.old} €</span>` : ""}</div>`;
  const btn = p.sold
    ? `<button class="card__add" disabled style="opacity:.45;cursor:not-allowed">Liste d'attente</button>`
    : `<button class="card__add" data-add="${encodeURIComponent(JSON.stringify({ name: p.name, ref: p.ref, price: p.price, dial: p.dial, accent: p.accent, strap: p.strap || "#20242c" }))}">Ajouter au panier</button>`;
  return `
  <article class="card">
    ${badge}
    <button class="card__fav" aria-label="Favori">♡</button>
    ${media}
    <div class="card__body">
      <span class="card__coll">${p.ref.split("·")[0].trim()}</span>
      <h3 class="card__name">${p.name.split("·")[0].trim()}</h3>
      <div class="card__ref">${p.name.includes("·") ? p.name.split("·")[1].trim() : p.ref}</div>
      <div class="card__stars">${stars(p.stars)}</div>
      ${price}
      ${btn}
    </div>
  </article>`;
}
function renderGrid(id, list) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = list.map(cardHTML).join("");
}
renderGrid("gridSLimited", CATALOG.slimited);
renderGrid("gridSignatureItems", CATALOG.signature);
renderGrid("gridTop", CATALOG.top);

/* ---------- Fonds des vignettes collections ---------- */
document.querySelectorAll(".collection__media").forEach((el) => {
  const dial = el.dataset.dial, accent = el.dataset.accent;
  el.style.background = `radial-gradient(circle at 50% 40%, ${accent}22, transparent 55%), linear-gradient(160deg,#141418,#0b0b0e)`;
  el.innerHTML = `<div style="width:190px;height:190px">${watch(dial, accent)}</div>`;
});

/* ---------- Avis clients ---------- */
const REVIEWS = [
  { t: "Une pièce d'une élégance rare. La finition du cadran est bluffante pour le prix, et l'écrin fait vraiment luxe.", n: "Alexandre M.", m: "KM 9001 · Impérial" },
  { t: "Reçue en 3 jours, numérotée 148/300. On sent le soin apporté à chaque détail. Je recommande les yeux fermés.", n: "Camille R.", m: "KM 7000 · Tourbillon" },
  { t: "J'hésitais à cause du prix, mais la montre dépasse mes attentes. Le service client français est impeccable.", n: "Julien P.", m: "KM 2200 · Ivoire" },
];
const rg = document.getElementById("reviewsGrid");
if (rg) rg.innerHTML = REVIEWS.map(r => `
  <div class="review">
    <div class="review__stars">★★★★★</div>
    <p class="review__text">« ${r.t} »</p>
    <p class="review__who"><b>${r.n}</b> — ${r.m} · Achat vérifié</p>
  </div>`).join("");

/* ---------- FAQ ---------- */
const FAQ = [
  { q: "Vos montres sont-elles vraiment en édition limitée ?", a: "Oui. Chaque modèle de la collection Signature est produit à 300 exemplaires numérotés à la main, puis n'est jamais réédité. Vous recevez un certificat d'authenticité indiquant votre numéro d'édition." },
  { q: "Quels sont les délais de livraison ?", a: "La livraison est offerte dans le monde entier. Comptez 2 à 5 jours ouvrés en France et 5 à 10 jours à l'international, avec suivi et assurance colis inclus." },
  { q: "Quelle garantie proposez-vous ?", a: "Toutes nos montres bénéficient d'une garantie de 2 ans couvrant le mouvement, assurée par notre service après-vente basé en France." },
  { q: "Puis-je retourner ma montre ?", a: "Vous disposez de 30 jours pour changer d'avis. La montre doit être retournée dans son écrin d'origine, non portée. Le remboursement est effectué sous 5 jours ouvrés après réception." },
  { q: "Les montres sont-elles étanches ?", a: "Oui, l'ensemble de nos garde-temps sont étanches jusqu'à 3 ATM (30 m), résistant aux éclaboussures et à la pluie. Nous déconseillons la baignade prolongée." },
];
const fq = document.getElementById("faq");
if (fq) {
  fq.innerHTML = FAQ.map(f => `
    <div class="faq__item">
      <button class="faq__q">${f.q}<span>+</span></button>
      <div class="faq__a"><p>${f.a}</p></div>
    </div>`).join("");
  fq.querySelectorAll(".faq__q").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const open = item.classList.contains("open");
      fq.querySelectorAll(".faq__item").forEach(it => { it.classList.remove("open"); it.querySelector(".faq__a").style.maxHeight = null; });
      if (!open) { item.classList.add("open"); const a = item.querySelector(".faq__a"); a.style.maxHeight = a.scrollHeight + "px"; }
    });
  });
}

/* ---------- Icônes de paiement ---------- */
const payIcons = document.getElementById("payIcons");
if (payIcons) {
  const card = (label, bg, fg = "#fff") => `<svg viewBox="0 0 48 30" width="40" height="25" role="img" aria-label="${label}"><rect width="48" height="30" rx="4" fill="${bg}"/><text x="24" y="20" font-family="Arial" font-size="9" font-weight="700" fill="${fg}" text-anchor="middle" letter-spacing=".5">${label}</text></svg>`;
  payIcons.innerHTML =
    card("VISA", "#1a1f71") +
    card("MC", "#222") +
    card("AMEX", "#2e77bc") +
    card("PayPal", "#fff", "#003087") +
    card("Klarna", "#ffb3c7", "#000");
}

/* ---------- Compte à rebours (fin d'édition) ---------- */
(function () {
  const cd = document.getElementById("countdown");
  if (!cd) return;
  // cible : dans ~11 jours à partir du chargement (démo)
  const target = Date.now() + (11 * 24 * 60 * 60 + 6 * 3600 + 42 * 60) * 1000;
  const pad = n => String(n).padStart(2, "0");
  const els = { d: cdD, h: cdH, m: cdM, s: cdS };
  function tick() {
    let diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000); diff -= d * 86400000;
    const h = Math.floor(diff / 3600000); diff -= h * 3600000;
    const m = Math.floor(diff / 60000); diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    els.d.textContent = pad(d); els.h.textContent = pad(h);
    els.m.textContent = pad(m); els.s.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);
})();

/* ---------- Panier ---------- */
const CART = { items: JSON.parse(localStorage.getItem("km_cart") || "[]") };
const $ = s => document.querySelector(s);
const drawer = $("#drawer"), overlay = $("#drawerOverlay");
const fmt = n => `${n} €`;

function saveCart() { localStorage.setItem("km_cart", JSON.stringify(CART.items)); }
function cartCount() { return CART.items.reduce((s, i) => s + i.qty, 0); }
function cartTotal() { return CART.items.reduce((s, i) => s + i.qty * i.price, 0); }

function renderCart() {
  $("#cartCount").textContent = cartCount();
  $("#drawerTotal").textContent = fmt(cartTotal());
  const box = $("#drawerItems");
  if (!CART.items.length) { box.innerHTML = `<div class="drawer__empty">Votre panier est vide.<br>Découvrez nos collections.</div>`; return; }
  box.innerHTML = CART.items.map((it, idx) => `
    <div class="d-item">
      <div class="d-item__media" style="background:linear-gradient(150deg,#f7f3ea,#efe8d7)">${watch(it.dial, it.accent, it.strap)}</div>
      <div class="d-item__info">
        <div class="d-item__name">${it.name.split("·")[0].trim()}</div>
        <div class="d-item__ref">${it.ref}</div>
        <div class="d-item__row">
          <div class="d-qty">
            <button data-dec="${idx}">−</button><span>${it.qty}</span><button data-inc="${idx}">+</button>
          </div>
          <div class="d-item__price">${fmt(it.qty * it.price)}</div>
        </div>
        <button class="d-item__rm" data-rm="${idx}">Retirer</button>
      </div>
    </div>`).join("");
}

function addToCart(p) {
  const found = CART.items.find(i => i.name === p.name);
  if (found) found.qty += 1; else CART.items.push({ ...p, qty: 1 });
  saveCart(); renderCart(); openDrawer();
}
function openDrawer() { drawer.classList.add("open"); overlay.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); }
function closeDrawer() { drawer.classList.remove("open"); overlay.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); }

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  if (add) { addToCart(JSON.parse(decodeURIComponent(add.dataset.add))); return; }
  const inc = e.target.closest("[data-inc]"); if (inc) { CART.items[+inc.dataset.inc].qty++; saveCart(); renderCart(); return; }
  const dec = e.target.closest("[data-dec]"); if (dec) { const i = +dec.dataset.dec; CART.items[i].qty--; if (CART.items[i].qty <= 0) CART.items.splice(i, 1); saveCart(); renderCart(); return; }
  const rm = e.target.closest("[data-rm]"); if (rm) { CART.items.splice(+rm.dataset.rm, 1); saveCart(); renderCart(); return; }
});
$("#cartBtn").addEventListener("click", openDrawer);
$("#drawerClose").addEventListener("click", closeDrawer);
overlay.addEventListener("click", closeDrawer);
renderCart();

/* ---------- Header, recherche, menu mobile ---------- */
const header = $("#header");
window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20));

const searchbar = $("#searchbar");
$("#searchBtn").addEventListener("click", () => { searchbar.classList.toggle("open"); if (searchbar.classList.contains("open")) $("#searchInput").focus(); });
$("#searchClose").addEventListener("click", () => searchbar.classList.remove("open"));

const mobileMenu = $("#mobileMenu"), burger = $("#burger");
burger.addEventListener("click", () => { mobileMenu.classList.toggle("open"); burger.classList.toggle("active"); });
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => { mobileMenu.classList.remove("open"); }));

/* ---------- Newsletter ---------- */
const newsForm = $("#newsForm");
if (newsForm) newsForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $("#newsNote").textContent = "Merci ! Vous faites désormais partie du Cercle Maison KM. ✦";
  newsForm.reset();
});

/* ---------- Année ---------- */
document.getElementById("year").textContent = new Date().getFullYear();
