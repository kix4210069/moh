(function(){
  var root = document.getElementById('ketshop-home');
  if (!root) return;
  root.innerHTML = `<!-- ===== Announcement bar ===== -->
  <div class="announce">
    <div class="announce__track">
      <span>2 ACHETÉS = 3ÈME OFFERT</span><span class="dot">•</span>
      <span>LIVRAISON EXPRESS DISPONIBLE</span><span class="dot">•</span>
      <span>RÉCEPTION ENTRE 8 ET 14 JOURS</span><span class="dot">•</span>
      <span>2 ACHETÉS = 3ÈME OFFERT</span><span class="dot">•</span>
      <span>LIVRAISON EXPRESS DISPONIBLE</span><span class="dot">•</span>
      <span>RÉCEPTION ENTRE 8 ET 14 JOURS</span><span class="dot">•</span>
    </div>
  </div>

  <!-- ===== Header ===== -->
  <header class="header">
    <button class="icon-btn nav-toggle" aria-label="Menu" id="navToggle">
      <span></span><span></span><span></span>
    </button>

    <a href="#" class="logo">
      <span class="logo__mark">KETSHOP</span>
      <span class="logo__sub">MAILLOT</span>
    </a>

    <nav class="main-nav" id="mainNav">
      <a href="#nouveautes">Nouveautés</a>
      <a href="#ligues">Ligues</a>
      <a href="#cdm">CDM 2026</a>
      <a href="#retro">Rétro</a>
      <a href="#crampons">Crampons</a>
      <a href="#training">Training</a>
    </nav>

    <div class="header__actions">
      <button class="pill">France | EUR € <span class="chev">▾</span></button>
      <button class="icon-btn" aria-label="Recherche">🔍</button>
      <button class="icon-btn" aria-label="Compte">👤</button>
      <button class="icon-btn cart" aria-label="Panier">🛍️<span class="cart__badge">1</span></button>
    </div>
  </header>

  <!-- ===== Hero ===== -->
  <section class="hero">
    <div class="hero__bg"></div>
    <div class="hero__overlay-text">BACK<br>2<br>BACK</div>
    <div class="hero__content">
      <p class="eyebrow">ÉDITION LIMITÉE</p>
      <h1>Maillot Collector<br>Champions d'Europe</h1>
      <a href="#nouveautes" class="btn btn--primary">Découvrir la collection</a>
    </div>
  </section>

  <!-- ===== Ligues ===== -->
  <section class="section" id="ligues">
    <p class="eyebrow center">PARCOURIR PAR LIGUE</p>
    <h2 class="center">Toutes les ligues</h2>
    <div class="leagues">
      <div class="league">Ligue 1</div>
      <div class="league">La Liga</div>
      <div class="league">Premier League</div>
      <div class="league">Bundesliga</div>
      <div class="league">Serie A</div>
      <div class="league">FIFA</div>
      <div class="league">Liga Portugal</div>
      <div class="league">Eredivisie</div>
    </div>
  </section>

  <!-- ===== Nos maillots du moment ===== -->
  <section class="section" id="nouveautes">
    <div class="section__head">
      <div>
        <p class="eyebrow">SÉLECTION</p>
        <h2>Nos maillots du moment</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row>
      <!-- products injected by JS -->
    </div>
  </section>

  <!-- ===== Saison 2025/2026 ===== -->
  <section class="section dark-strip" id="saison">
    <div class="section__head">
      <div>
        <p class="eyebrow">NOUVEAUTÉ</p>
        <h2>Saison 2025/2026</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row></div>
  </section>

  <!-- ===== Promo banner ===== -->
  <section class="promo">
    <p class="eyebrow red">OFFRE LIMITÉE</p>
    <h2 class="promo__title">2 ACHETÉS = 1 OFFERT<br>+ LIVRAISON OFFERTE</h2>
    <p class="promo__sub">Sur toute la boutique — jusqu'à épuisement des stocks</p>
    <div class="countdown" id="countdown">
      <div class="count"><span class="count__num" data-h>08</span><span class="count__lbl">HEURES</span></div>
      <div class="count"><span class="count__num" data-m>59</span><span class="count__lbl">MINUTES</span></div>
      <div class="count"><span class="count__num" data-s>53</span><span class="count__lbl">SECONDES</span></div>
      <a href="#nouveautes" class="btn btn--primary promo__cta">En profiter maintenant</a>
    </div>
  </section>

  <!-- ===== CDM 2026 ===== -->
  <section class="section" id="cdm">
    <div class="section__head">
      <div>
        <p class="eyebrow">NOS MAILLOTS</p>
        <h2>CDM 2026</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row></div>
  </section>

  <!-- ===== Feature banner Real Madrid ===== -->
  <section class="feature">
    <div class="feature__img feature__img--rm"></div>
    <div class="feature__text">
      <h3>Maillot Real Madrid Domicile<br>2026/2027</h3>
      <p class="price">€29,90</p>
      <a href="#" class="btn btn--outline">Acheter</a>
    </div>
  </section>

  <!-- ===== Feature banner BACK 2 BACK ===== -->
  <section class="feature feature--reverse">
    <div class="feature__img feature__img--back"></div>
    <div class="feature__text">
      <h3>Les maillots exclusifs<br>du BACK 2 BACK !</h3>
      <a href="#" class="btn btn--outline">Voir la collection</a>
    </div>
  </section>

  <!-- ===== Concept ===== -->
  <section class="section" id="concept">
    <div class="section__head">
      <div>
        <p class="eyebrow">ÉDITION SPÉCIALE</p>
        <h2>Concept</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row></div>
  </section>

  <!-- ===== Kits Enfants ===== -->
  <section class="section dark-strip" id="enfants">
    <div class="section__head">
      <div>
        <p class="eyebrow">POUR LES PETITS</p>
        <h2>Nos kits pour Enfants</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row></div>
  </section>

  <!-- ===== Stats ===== -->
  <section class="stats">
    <div class="stats__img"></div>
    <div class="stats__content">
      <p class="eyebrow red">NOTRE COMMUNAUTÉ</p>
      <h2>Passionnés de foot depuis 2018</h2>
      <div class="stats__grid">
        <div><span class="stats__num">+41 843</span><span class="stats__lbl">Clients satisfaits</span></div>
        <div><span class="stats__num">+279</span><span class="stats__lbl">Modèles disponibles</span></div>
        <div><span class="stats__num">4.8/5</span><span class="stats__lbl">Note moyenne</span></div>
      </div>
    </div>
  </section>

  <!-- ===== Rétro / Vintage ===== -->
  <section class="section" id="retro">
    <div class="section__head">
      <div>
        <p class="eyebrow">NOS MAILLOTS</p>
        <h2>Rétro / Vintage</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row></div>
  </section>

  <!-- ===== Top maillots du moment ===== -->
  <section class="section dark-strip">
    <div class="section__head"><div><h2>Top Maillots du moment</h2></div></div>
    <div class="top-grid">
      <a href="#" class="top-card top-card--1"><span>Saint-Germain</span></a>
      <a href="#" class="top-card top-card--2"><span>Real Madrid</span></a>
      <a href="#" class="top-card top-card--3"><span>FC Barcelone</span></a>
      <a href="#" class="top-card top-card--4"><span>Équipe de France</span></a>
    </div>
  </section>

  <!-- ===== Crampons ===== -->
  <section class="section" id="crampons">
    <div class="section__head">
      <div>
        <p class="eyebrow">CHAUSSURES</p>
        <h2>Nos Crampons</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row></div>
  </section>

  <!-- ===== Training ===== -->
  <section class="section" id="training">
    <div class="section__head">
      <div>
        <p class="eyebrow">SUMMER COLLECTION</p>
        <h2>Nos Training pour cet été</h2>
      </div>
      <div class="arrows"><button class="arrow" data-scroll="prev">‹</button><button class="arrow" data-scroll="next">›</button></div>
    </div>
    <div class="product-row" data-row></div>
  </section>

  <!-- ===== Avis clients ===== -->
  <section class="reviews">
    <p class="eyebrow red center">AVIS CLIENTS</p>
    <h2 class="center">Ce qu'ils pensent de nous</h2>
    <div class="reviews__score">
      <strong>Excellent</strong>
      <span class="reviews__rating">4.8 / 5</span>
      <span class="stars">★★★★★</span>
      <span class="reviews__count">Voir nos 1 523 avis vérifiés</span>
    </div>
    <div class="reviews__grid">
      <article class="review">
        <span class="stars">★★★★★</span>
        <p>"Franchement lourd, le flocage est propre. Reçu vite, le rendu en vrai est encore mieux."</p>
        <div class="review__author"><span class="avatar">Y</span> Yanis M.</div>
      </article>
      <article class="review">
        <span class="stars">★★★★★</span>
        <p>"Qualité top, taille conforme, maillot identique à la description. Je recommande !"</p>
        <div class="review__author"><span class="avatar">K</span> Karim L.</div>
      </article>
      <article class="review">
        <span class="stars">★★★★★</span>
        <p>"Très beau maillot, livraison rapide. Le flocage est nickel, je reviendrai."</p>
        <div class="review__author"><span class="avatar">T</span> Thomas R.</div>
      </article>
    </div>
  </section>

  <!-- ===== FAQ ===== -->
  <section class="faq">
    <p class="eyebrow red center">SUPPORT</p>
    <h2 class="center">Vos questions / Nos réponses</h2>
    <div class="faq__list">
      <details class="faq__item"><summary>Quel est le délai de préparation de ma commande ?<span class="plus">+</span></summary><p>Votre commande est préparée sous 24 à 48h ouvrées après validation du paiement.</p></details>
      <details class="faq__item"><summary>Quels sont les délais de livraison ?<span class="plus">+</span></summary><p>La réception se fait généralement entre 8 et 14 jours. Une livraison express est disponible au choix.</p></details>
      <details class="faq__item"><summary>Puis-je suivre ma commande ?<span class="plus">+</span></summary><p>Oui, un numéro de suivi vous est envoyé par e-mail dès l'expédition de votre colis.</p></details>
      <details class="faq__item"><summary>Proposez-vous des tailles enfant et adulte ?<span class="plus">+</span></summary><p>Oui, la plupart de nos maillots sont disponibles en tailles enfant et adulte (S à XXL).</p></details>
      <details class="faq__item"><summary>Peut-on personnaliser un maillot (flocage) ?<span class="plus">+</span></summary><p>Absolument, vous pouvez ajouter le nom et le numéro de votre choix lors de la commande.</p></details>
      <details class="faq__item"><summary>Comment entretenir et laver mon maillot ?<span class="plus">+</span></summary><p>Lavage à 30°C sur l'envers, sans sèche-linge, pour préserver le flocage et les couleurs.</p></details>
    </div>
  </section>

  <!-- ===== Footer ===== -->
  <footer class="footer">
    <div class="footer__info">
      <div class="finfo"><span class="finfo__icon">💬</span><div><strong>Service client</strong><span>Lun–Dim, 9h–18h</span></div></div>
      <div class="finfo"><span class="finfo__icon">🚚</span><div><strong>Livraison suivie</strong><span>Colis tracké</span></div></div>
      <div class="finfo"><span class="finfo__icon">✉️</span><div><strong>Nous contacter</strong><span>contact@ketshopmaillot.com</span></div></div>
      <div class="finfo"><span class="finfo__icon">📍</span><div><strong>Adresse</strong><span>Paris, France</span></div></div>
    </div>

    <div class="footer__main">
      <div class="newsletter">
        <h3>S'abonner à nos e-mails</h3>
        <form class="newsletter__form" onsubmit="return false">
          <input type="email" placeholder="E-mail" aria-label="E-mail" />
          <button type="submit" aria-label="S'abonner">→</button>
        </form>
      </div>
      <div class="footer__social">
        <a href="#" aria-label="Instagram">📷</a>
        <a href="#" aria-label="TikTok">🎵</a>
      </div>
    </div>

    <div class="footer__bottom">
      <div class="footer__region">
        <span>Pays/région</span>
        <button class="pill">France | EUR € <span class="chev">▾</span></button>
      </div>
      <div class="footer__pay">
        <span class="pay">AMEX</span><span class="pay">Pay</span><span class="pay">CB</span>
        <span class="pay">Maestro</span><span class="pay">MC</span><span class="pay">PayPal</span><span class="pay">VISA</span>
      </div>
    </div>

    <div class="footer__legal">
      <span>© 2026, KetShopMaillot</span>
      <a href="#">Politique de confidentialité</a>
      <a href="#">Politique d'expédition</a>
      <a href="#">Politique de remboursement</a>
      <a href="#">Conditions générales de vente</a>
      <a href="#">Mentions légales</a>
    </div>
  </footer>`;

/* --- interactions --- */
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

})();
