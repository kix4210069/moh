/* =========================================================================
   Instant Maillot — layout commun (header, menus, panier, recherche,
   quick-view, offre, footer, cookies, popup) + utilitaires boutique.
   ========================================================================= */
(function () {
  'use strict';

  const DATA = window.IM_DATA || { products: [], sections: {} };
  const BY_ID = {};
  DATA.products.forEach(p => (BY_ID[p.id] = p));

  /* ---------- Utils ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const fmt = n => '€' + n.toFixed(2).replace('.', ',');
  const fmtAfter = n => n.toFixed(2).replace('.', ',') + ' €';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const cap = s => String(s || '').replace(/(^|[\s(\-–'’])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase());
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } }
  };
  const productName = p => cap(p.team) + ' – ' + cap(p.sub);

  /* ---------- Icônes ---------- */
  const I = {
    logo: '<svg viewBox="0 0 136 114" aria-hidden="true"><g fill="none" stroke="#ff0066" stroke-width="13" stroke-linejoin="miter"><path d="M63 14 17 106"/><path d="M45 106 75 46 94 82"/><path d="M73 106 102 48 131 106"/></g></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20.5" r="1.2"/><circle cx="18" cy="20.5" r="1.2"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z"/></svg>',
    snap: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c3.1 0 5.3 2.4 5.3 5.4v2.3c.4.2.9.1 1.3-.1.6-.2 1.1.5.6 1-.5.4-1.3.7-1.9.9.4 1.6 1.8 3.3 3.6 3.8.4.1.4.6.1.8-.6.4-1.5.5-2.2.7-.2.4-.1 1-.6 1.1-.7.1-1.5-.2-2.4 0-1.2.3-2 1.8-3.8 1.8s-2.6-1.5-3.8-1.8c-.9-.2-1.7.1-2.4 0-.5-.1-.4-.7-.6-1.1-.7-.2-1.6-.3-2.2-.7-.3-.2-.3-.7.1-.8 1.8-.5 3.2-2.2 3.6-3.8-.6-.2-1.4-.5-1.9-.9-.5-.5 0-1.2.6-1 .4.2.9.3 1.3.1V7.9c0-3 2.2-5.4 5.3-5.4Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4" stroke-linecap="round"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5h11v8H8l-4 3V5Z"/><path d="M15 9h5v8l-3-2h-6v-2"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    burger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>',
    jersey: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3c-.5 1.5-2 2.5-4 2.5S8.5 4.5 8 3Z"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8h14v-8M12 8v12M12 8S10.5 4 8 4a2 2 0 0 0 0 4h4Zm0 0s1.5-4 4-4a2 2 0 0 1 0 4h-4Z"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>'
  };

  /* ---------- Liens ---------- */
  const COL = h => 'collection.html?c=' + h;
  const PAGE = p => 'page.html?p=' + p;
  const PROD = id => 'product.html?id=' + encodeURIComponent(id);

  /* ---------- Carte produit ---------- */
  function cardHTML(p, opts = {}) {
    if (!p) return '';
    return `<article class="pcard${opts.small ? ' pcard--sm' : ''}">
      <div class="pcard__media">
        <a href="${PROD(p.id)}" class="pcard__img" aria-label="${esc(productName(p))}">
          <img src="${p.img}" alt="${esc(productName(p))}" loading="lazy" decoding="async">
        </a>
        <div class="pcard__overlay">
          <a href="${PROD(p.id)}" class="pcard__name"><span class="pcard__team">${esc(p.team)}</span><span class="pcard__sub">${esc(p.sub)}</span></a>
          <button class="pcard__plus" type="button" data-qv="${esc(p.id)}" aria-label="Ajouter rapidement">${I.plus}</button>
        </div>
      </div>
      <div class="pcard__price"><b>${fmt(p.price)}</b> <s>${fmt(p.compare)}</s></div>
    </article>`;
  }

  /* ---------- Panier (3e offert) ---------- */
  const cart = {
    items: store.get('im_cart', []),
    save() { store.set('im_cart', this.items); updateCartUI(); },
    add(id, opts = {}) {
      const p = BY_ID[id]; if (!p) return;
      const key = [id, opts.size || '', opts.name || '', opts.number || '', opts.below || ''].join('|');
      const ex = this.items.find(i => i.key === key);
      if (ex) ex.qty += opts.qty || 1;
      else this.items.push({ key, id, size: opts.size || '', name: opts.name || '', number: opts.number || '', below: opts.below || '', qty: opts.qty || 1 });
      this.save();
    },
    setQty(key, q) {
      const it = this.items.find(i => i.key === key); if (!it) return;
      it.qty = Math.max(0, q);
      if (!it.qty) this.items = this.items.filter(i => i.key !== key);
      this.save();
    },
    count() { return this.items.reduce((a, i) => a + i.qty, 0); },
    totals() {
      const units = [];
      this.items.forEach(i => { const p = BY_ID[i.id]; if (p) for (let k = 0; k < i.qty; k++) units.push(p.price); });
      const sub = units.reduce((a, b) => a + b, 0);
      const free = Math.floor(units.length / 3);
      const disc = units.sort((a, b) => a - b).slice(0, free).reduce((a, b) => a + b, 0);
      return { sub, disc, total: sub - disc, count: units.length };
    }
  };

  /* ---------- Toast ---------- */
  let toastT;
  function toast(msg) {
    const t = $('#im-toast'); if (!t) return;
    t.innerHTML = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  }

  /* ---------- Overlays ---------- */
  let openLayer = null;
  function open(id) {
    close();
    const el = document.getElementById(id); if (!el) return;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    $('#im-backdrop').classList.add('is-on', el.dataset.backdrop === 'blur' ? 'is-blur' : 'x');
    openLayer = el;
    const f = el.querySelector('[data-autofocus]'); if (f) setTimeout(() => f.focus(), 60);
  }
  function close() {
    if (!openLayer) return;
    openLayer.classList.remove('is-open'); openLayer.setAttribute('aria-hidden', 'true');
    $('#im-backdrop').className = 'im-backdrop';
    document.body.classList.remove('no-scroll');
    openLayer = null;
  }

  /* ---------- Header / menus ---------- */
  const MEGA = [
    { t: 'Championnats', items: [['Ligue 1', 'ligue-1', 101, 'im-champ-ligue1.jpg'], ['Premier League', 'premiere-ligue', 97, 'im-champ-premier.jpg'], ['Liga', 'la-ligua', 166, 'im-champ-laliga.jpg'], ['Serie A', 'serie-a', 49, 'im-champ-seriea.jpg'], ['Bundesliga', 'bundesliga', 47, 'im-champ-bundesliga.jpg'], ['Autres championnats', 'autres-championnats', 43, 'im-cat-adulte.jpg']] },
    { t: 'Sélections', items: [['Coupe du Monde 2026', 'coupe-du-monde-2026', 61, 'im-cat-cdm.jpg'], ['France × B2B', 'maillot-psg-2-etoiles-champions-back-2-back', 16, 'im-cat-france-b2b.jpg'], ['Toutes les sélections', 'selections', 112, 'im-cat-retro.jpg']] },
    { t: 'Éditions', items: [['Concept', 'maillot-concept', 250, 'im-cat-concept.jpg'], ['Rétro', 'retro', 58, 'im-cat-retro.jpg'], ['Manches longues', 'manches-longues', 62, 'im-cat-ml.jpg'], ['Black Edition', 'black-edition', 30, 'im-black-edition.jpg'], ['Pink Edition', 'pink-edition', 23, 'im-pink-edition.jpg']] },
    { t: 'Et aussi', items: [['Best-sellers', 'best-sellers', 15, 'im-cat-bs.jpg'], ['Ensembles enfant', 'ensemble-enfant', 28, 'im-cat-kids.jpg'], ['Vestes', 'vestes', 8, 'veste-bresil-noire.jpg'], ['Pack Mystère', null, null, 'im-cat-adulte.jpg']] }
  ];
  const AIDE = [['🚚', 'Suivre ma commande', PAGE('suivi-colis')], ['📦', 'Mes commandes', PAGE('compte')], ['📏', 'Guide des tailles', PAGE('guide-des-tailles')], ['🧒', 'Guide des tailles enfant', PAGE('guide-des-tailles-enfant')], ['💬', 'FAQ', PAGE('faq')], ['✉️', 'Contact', PAGE('contact')]];

  function megaHTML() {
    const cols = MEGA.map(c => `<div class="mega__col"><p class="mega__title">${c.t}</p>${c.items.map(([n, h, k, img]) =>
      `<a class="mega__link" href="${h ? COL(h) : PAGE('pack-mystere')}"><img src="assets/img/${img}" alt="" loading="lazy"><span>${n}</span>${k ? `<em>${k}</em>` : ''}</a>`).join('')}</div>`).join('');
    return `<div class="mega" id="im-mega" role="menu"><div class="mega__inner">
      <div class="mega__cols">${cols}</div>
      <div class="mega__cards">
        <a class="mega__card" href="${COL('best-sellers')}"><img src="assets/img/im-cat-bs.jpg" alt=""><span class="mega__tag">Top ventes</span><b>Best-sellers</b><small>15 maillots →</small></a>
        <a class="mega__card" href="${COL('vestes')}"><img src="assets/img/im-cat-vestes.jpg" alt=""><span class="mega__tag">Vestes</span><b>Vestes</b><small>8 vestes →</small></a>
      </div></div>
      <div class="mega__foot"><span>2 maillots achetés · <b>le 3e offert</b>, automatiquement</span><a href="${COL('tout-les-maillots')}">Voir tous les maillots (986) →</a></div>
    </div>`;
  }

  function topHTML() {
    return `
    <div class="topbar">
      <div class="topbar__social">
        <a href="https://www.instagram.com/instantmaillot/" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a>
        <a href="https://www.tiktok.com/@instantmaillotfr" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a>
      </div>
      <p class="topbar__msg"><span class="d-only">Achète 2 maillots · le <mark>3e est offert</mark> automatiquement</span><span class="m-only">2 maillots achetés = <mark>le 3e offert</mark></span></p>
    </div>
    <header class="hdr" id="im-header">
      <div class="hdr__left">
        <button class="hdr__icon hdr__burger" type="button" data-open="im-mmenu" aria-label="Menu">${I.burger}</button>
        <button class="hdr__offre" type="button" data-open="im-offre">OFFRE</button>
        <nav class="hdr__nav" aria-label="Navigation principale">
          <div class="hdr__dd" data-dd="mega"><a href="${COL('tout-les-maillots')}" class="hdr__link">COLLECTIONS ${I.chev}</a>${megaHTML()}</div>
          <a href="${COL('vestes')}" class="hdr__link">VESTES</a>
          <a href="${COL('best-sellers')}" class="hdr__link">BEST SELLERS</a>
          <div class="hdr__dd" data-dd="aide"><a href="${PAGE('faq')}" class="hdr__link">AIDE ${I.chev}</a>
            <div class="aide" role="menu">${AIDE.map(([e, n, h]) => `<a href="${h}"><span>${e}</span>${n}</a>`).join('')}</div>
          </div>
        </nav>
      </div>
      <a href="index.html" class="hdr__logo" aria-label="Instant Maillot — accueil">${I.logo}</a>
      <div class="hdr__right">
        <button class="hdr__icon" type="button" data-open="im-search" aria-label="Recherche">${I.search}</button>
        <a class="hdr__icon hdr__user" href="${PAGE('compte')}" aria-label="Compte">${I.user}</a>
        <button class="hdr__icon hdr__cart" type="button" data-open="im-cart" aria-label="Panier">${I.cart}<span class="hdr__badge" data-cart-count>0</span></button>
      </div>
    </header>

    <!-- Menu mobile -->
    <aside class="drawer drawer--left mmenu" id="im-mmenu" aria-hidden="true">
      <div class="drawer__head"><a href="index.html" class="mmenu__logo">${I.logo}</a><button class="x-btn" data-close aria-label="Fermer">${I.close}</button></div>
      <div class="mmenu__body">
        <button class="mmenu__offre" data-open="im-offre">🎁 OFFRE DÉCOUVERTE <small>2 maillots pour 30,60€</small></button>
        ${MEGA.map(c => `<details class="mmenu__grp"><summary>${c.t}${I.chev}</summary>${c.items.map(([n, h]) => `<a href="${h ? COL(h) : PAGE('pack-mystere')}">${n}</a>`).join('')}</details>`).join('')}
        <a class="mmenu__top" href="${COL('vestes')}">Vestes</a>
        <a class="mmenu__top" href="${COL('best-sellers')}">Best sellers</a>
        <details class="mmenu__grp"><summary>Aide${I.chev}</summary>${AIDE.map(([e, n, h]) => `<a href="${h}">${e} ${n}</a>`).join('')}</details>
        <a class="mmenu__top" href="${PAGE('compte')}">Connexion</a>
      </div>
      <div class="mmenu__social"><a href="https://www.instagram.com/instantmaillot/" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a><a href="https://www.tiktok.com/@instantmaillotfr" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a></div>
    </aside>

    <!-- Recherche -->
    <div class="modal search" id="im-search" aria-hidden="true" data-backdrop="blur" role="dialog" aria-label="Recherche">
      <div class="search__card">
        <div class="search__head"><span>RECHERCHE</span><button class="x-btn x-btn--light" data-close aria-label="Fermer">${I.close}</button></div>
        <form class="search__form" id="im-search-form" role="search">
          <input type="search" id="im-search-input" placeholder="Rechercher un article" autocomplete="off" data-autofocus>
          <button type="submit" aria-label="Rechercher">${I.arrow}</button>
        </form>
        <p class="search__label" id="im-search-label">PRODUITS POPULAIRES</p>
        <div class="search__grid" id="im-search-grid"></div>
      </div>
    </div>

    <!-- Panier -->
    <aside class="drawer drawer--right cartd" id="im-cart" aria-hidden="true" data-backdrop="blur" aria-label="Panier">
      <div class="cartd__head"><span class="cartd__logo">${I.logo}</span><span class="cartd__count" data-cart-count>0</span><button class="x-btn x-btn--dark" data-close aria-label="Fermer">${I.close}</button></div>
      <div class="cartd__body">
        <div class="cartd__promo">
          <div class="cartd__steps" id="im-cart-steps"></div>
          <span class="cartd__chip">2+1 OFFERT</span>
          <p id="im-cart-promo-txt"><b>2 maillots achetés,</b><br>le 3ᵉ ajouté est offert</p>
          <a class="cartd__cta" href="${COL('best-sellers')}">J'en profite →</a>
        </div>
        <div id="im-cart-items"></div>
        <p class="cartd__label" id="im-cart-sug-label">COMMENCE TA COLLECTION</p>
        <div class="cartd__sug" id="im-cart-sug"></div>
        <p class="cartd__label">CATÉGORIES</p>
        <div class="cartd__cats">${[['Best-sellers', 'best-sellers'], ['CDM 2026', 'coupe-du-monde-2026'], ['Concept', 'maillot-concept'], ['Rétro', 'retro'], ['Manches longues', 'manches-longues'], ['Vestes', 'vestes']].map(([n, h]) => `<a href="${COL(h)}">${n}</a>`).join('')}</div>
      </div>
      <div class="cartd__foot">
        <div class="cartd__disc" id="im-cart-disc" hidden></div>
        <button class="cartd__pay" id="im-cart-pay" type="button">Payer · <span id="im-cart-total">€0.00</span></button>
        <details class="cartd__code"><summary>Saisir un code promo</summary><form id="im-promo-form"><input placeholder="Code promo" aria-label="Code promo"><button type="submit">OK</button></form></details>
      </div>
    </aside>

    <!-- Quick view -->
    <div class="modal qv" id="im-qv" aria-hidden="true" data-backdrop="blur" role="dialog" aria-label="Ajout rapide">
      <div class="qv__card">
        <button class="qv__x" data-close aria-label="Fermer">${I.close}</button>
        <div class="qv__top"><img id="im-qv-img" alt=""><div><p class="qv__name" id="im-qv-name"></p><p class="qv__price" id="im-qv-price"></p></div></div>
        <p class="qv__label">TAILLE : <span id="im-qv-size-lbl">À CHOISIR</span></p>
        <div class="qv__sizes" id="im-qv-sizes">${['S', 'M', 'L', 'XL', '2XL'].map(s => `<button type="button" data-size="${s}">${s}</button>`).join('')}</div>
        <input class="qv__in" id="im-qv-nom" placeholder="Nom ( ex : Fan )" maxlength="14">
        <input class="qv__in" id="im-qv-num" placeholder="Numéro ( ex : 2 )" inputmode="numeric" maxlength="2">
        <input class="qv__in" id="im-qv-below" placeholder="Nom en dessous du numéro ( ex : toi )" maxlength="14">
        <button class="qv__add" id="im-qv-add" type="button">AJOUTER AU PANIER</button>
        <a class="qv__more" id="im-qv-more" href="#">Voir la fiche produit →</a>
      </div>
    </div>

    <!-- Offre découverte -->
    <aside class="drawer drawer--left offre" id="im-offre" aria-hidden="true" aria-label="Offre découverte">
      <div class="drawer__head offre__head"><div><p class="offre__kicker">OFFRE DÉCOUVERTE</p><p class="offre__title" id="im-offre-title">Choisis 2 maillots pour 30,60€</p></div><button class="x-btn" data-close aria-label="Fermer">${I.close}</button></div>
      <div class="offre__body">
        <div class="offre__packs" id="im-offre-packs">
          <button type="button" class="is-on" data-pack="2" data-price="30.60"><b>2 maillots</b><span>30,60€</span></button>
          <button type="button" data-pack="4" data-price="42.60"><b>4 maillots</b><span>42,60€</span></button>
        </div>
        <p class="offre__lbl">TA TAILLE</p>
        <div class="offre__sizes" id="im-offre-sizes">${['S', 'M', 'L', 'XL', 'XXL'].map(s => `<button type="button" data-size="${s}">${s}</button>`).join('')}</div>
        <p class="offre__lbl"><span id="im-offre-sel">0 / 2</span> SÉLECTIONNÉS</p>
        <div class="offre__grid" id="im-offre-grid"></div>
      </div>
      <div class="offre__foot"><button type="button" class="offre__add" id="im-offre-add">AJOUTER AU PANIER — 30,60€</button></div>
    </aside>

    <div class="im-backdrop" id="im-backdrop"></div>
    <div class="toast" id="im-toast" role="status" aria-live="polite"></div>`;
  }

  function bottomHTML() {
    const col = (t, body) => `<details class="ft__col" open><summary>${t}${I.chev}</summary><div class="ft__body">${body}</div></details>`;
    return `
    <section class="trust" aria-label="Nos garanties">
      <div class="trust__card">${I.shield}<b>PAIEMENT SÉCURISÉ</b><span>Données bancaires chiffrées, jamais stockées.</span></div>
      <div class="trust__card">${I.chat}<b>SERVICE CLIENT</b><span>Une question ? On répond vite, 7j/7.</span></div>
      <div class="trust__card">${I.pin}<b>COLIS SUIVI</b><span>Suivi en temps réel à chaque étape.</span></div>
    </section>
    <footer class="ft">
      <div class="ft__grid">
        ${col('À PROPOS DE NOUS', '<p class="ft__about">Instant Maillot, c’est la boutique en ligne des fans de foot : maillots de clubs et de sélections, actuels, rétro et concept, en tailles adulte et enfant. Le flocage est offert, le paiement est sécurisé et tu peux suivre ton colis en ligne. Merci de faire confiance à Instant Maillot !</p>')}
        ${col('AUTRES', `<a href="${PAGE('guide-des-tailles')}">Guide des Tailles Adultes</a><a href="${PAGE('guide-des-tailles-enfant')}">Guide des Tailles Enfant</a><a href="${PAGE('collaborations')}">🤝 Collaborations avec InstantMaillot</a>`)}
        ${col('POLITIQUES', `<a href="${PAGE('remboursement')}">Politique de retour et de remboursement</a><a href="${PAGE('confidentialite')}">Politique de confidentialité</a><a href="${PAGE('expedition')}">Politique d'expédition</a><a href="${PAGE('conditions')}">Conditions d'utilisation</a>`)}
        ${col('VIENS NOUS SUIVRE !', `<div class="ft__social"><a href="https://www.instagram.com/instantmaillot/" target="_blank" rel="noopener" aria-label="Instagram">${I.insta}</a><a href="https://www.snapchat.com/" target="_blank" rel="noopener" aria-label="Snapchat">${I.snap}</a><a href="https://www.tiktok.com/@instantmaillotfr" target="_blank" rel="noopener" aria-label="TikTok">${I.tiktok}</a></div>`)}
      </div>
      <div class="ft__bottom">
        <div class="ft__sel">
          <label class="ft__select"><span class="ft__flag" aria-hidden="true"></span><select aria-label="Pays / devise"><option>France (EUR €)</option><option>Belgique (EUR €)</option><option>Suisse (EUR €)</option><option>Luxembourg (EUR €)</option><option>Canada (EUR €)</option></select>${I.chev}</label>
          <label class="ft__select"><select aria-label="Langue"><option>Français</option><option>English</option></select>${I.chev}</label>
          <p class="ft__copy">© 2026, <b>InstantMaillot</b>. Tous droits réservés.</p>
        </div>
        <ul class="ft__pay" aria-label="Moyens de paiement">
          <li class="pay pay--amex">AMEX</li><li class="pay"> Pay</li><li class="pay pay--bc">Bancontact</li><li class="pay">G Pay</li><li class="pay pay--klarna">Klarna</li><li class="pay pay--mc"><i></i><i></i></li><li class="pay">MB WAY</li><li class="pay pay--pp">PayPal</li><li class="pay pay--shop">shop</li><li class="pay pay--visa">VISA</li>
        </ul>
      </div>
    </footer>

    <!-- Barre flottante -->
    <div class="fbar" id="im-fbar">
      <span class="fbar__count" data-cart-count>0</span>
      <p class="fbar__txt" id="im-fbar-txt">Ajoute 2 pour débloquer<br><b>-30 % 🔥</b></p>
      <button type="button" class="fbar__btn" data-open="im-offre">Ajouter</button>
    </div>

    <!-- Cookies -->
    <div class="cookie" id="im-cookie" role="dialog" aria-label="Cookies" hidden>
      <span class="cookie__grip"></span>
      <div class="cookie__imgs"><img src="assets/img/im-cookie-veste-blanche.png" alt=""><img src="assets/img/im-cookie-veste-noire.png" alt=""><img src="assets/img/im-cookie-veste-vert-eau.png" alt=""></div>
      <p class="cookie__title">Ton style, rien que pour toi ?</p>
      <p class="cookie__txt">Les cookies servent à ça, et à améliorer le site. <a href="${PAGE('confidentialite')}">En savoir plus</a></p>
      <button type="button" class="cookie__ok" data-cookie="1">Oui, j'accepte</button>
      <div class="cookie__row"><span class="cookie__pill">${I.shield} Zéro revente</span><button type="button" class="cookie__pill" data-cookie="0">Continuer sans accepter →</button></div>
    </div>

    <!-- Popup maillot gratuit -->
    <div class="modal gift" id="im-gift" aria-hidden="true" data-backdrop="blur" role="dialog" aria-label="Un maillot gratuit">
      <div class="gift__card">
        <button class="x-btn x-btn--glass gift__x" data-close aria-label="Fermer">${I.close}</button>
        <img src="assets/img/im-popup-mannequin.jpg" alt="" class="gift__img">
        <div class="gift__content">
          <p class="gift__kicker">● OFFRE DE BIENVENUE</p>
          <p class="gift__title">Un maillot<br>gratuit</p>
          <p class="gift__txt">Laisse ton numéro et débloque ton code promo dans la seconde.</p>
          <form class="gift__form" id="im-gift-form">
            <span class="gift__cc">🇫🇷 FR +33</span>
            <input type="tel" placeholder="6 12 34 56 78" aria-label="Numéro de téléphone" required pattern="[0-9 ]{9,14}">
            <button type="submit">DÉBLOQUER MON MAILLOT GRATUIT</button>
          </form>
          <p class="gift__small">MAILLOT OFFERT = LE 3E, DÈS 2 ACHETÉS</p>
          <button type="button" class="gift__no" data-close>Non merci, je regarde sans</button>
        </div>
      </div>
    </div>`;
  }

  /* ---------- Rendu panier ---------- */
  function updateCartUI() {
    const n = cart.count();
    $$('[data-cart-count]').forEach(e => (e.textContent = n));
    const t = cart.totals();
    const totalEl = $('#im-cart-total'); if (!totalEl) return;
    totalEl.textContent = '€' + t.total.toFixed(2);
    const disc = $('#im-cart-disc');
    if (t.disc > 0) { disc.hidden = false; disc.innerHTML = `<span>Sous-total</span><s>${fmt(t.sub)}</s><span class="ok">🎁 3ᵉ offert</span><b>-${fmt(t.disc)}</b>`; } else disc.hidden = true;
    const rest = 3 - (n % 3 || (n ? 3 : 0));
    const stepN = n % 3 === 0 && n ? 3 : n % 3;
    $('#im-cart-steps').innerHTML = [0, 1, 2].map(k => `<span class="${k < stepN ? 'is-on' : ''}">${k < 2 ? I.jersey : I.gift}</span>`).join('<i></i>');
    $('#im-cart-promo-txt').innerHTML = !n ? '<b>2 maillots achetés,</b><br>le 3ᵉ ajouté est offert' :
      (stepN === 3 ? '<b>Bravo ! 🎉</b><br>ton 3ᵉ maillot est offert' : `<b>Encore ${rest} maillot${rest > 1 ? 's' : ''}</b><br>pour débloquer le maillot offert`);
    const list = $('#im-cart-items');
    list.innerHTML = cart.items.map(i => {
      const p = BY_ID[i.id]; if (!p) return '';
      const flock = [i.name, i.number, i.below].filter(Boolean).join(' · ');
      return `<div class="citem"><img src="${p.img}" alt=""><div class="citem__info"><a href="${PROD(p.id)}">${esc(productName(p))}</a>
        <small>${i.size ? 'Taille ' + esc(i.size) : ''}${flock ? ' · Flocage : ' + esc(flock) : ''}</small>
        <div class="citem__row"><div class="qty"><button type="button" data-qty="-1" data-key="${esc(i.key)}" aria-label="Moins">−</button><span>${i.qty}</span><button type="button" data-qty="1" data-key="${esc(i.key)}" aria-label="Plus">+</button></div><b>${fmt(p.price * i.qty)}</b>
        <button type="button" class="citem__rm" data-rm="${esc(i.key)}" aria-label="Retirer">${I.trash}</button></div></div></div>`;
    }).join('');
    $('#im-cart-sug-label').textContent = n ? 'COMPLÈTE TA COLLECTION' : 'COMMENCE TA COLLECTION';
    const sugIds = (DATA.sections.bestsellers || []).filter(id => !cart.items.some(i => i.id === id)).slice(0, 6);
    $('#im-cart-sug').innerHTML = sugIds.map((id, k) => { const p = BY_ID[id]; return `<div class="sug">${k === 0 ? '<span class="sug__tag">TOP DES VENTES</span>' : ''}<a href="${PROD(id)}"><img src="${p.img}" alt="${esc(productName(p))}" loading="lazy"></a><button type="button" data-qv="${id}" aria-label="Ajouter">${I.plus}</button><p><b>${fmtAfter(p.price)}</b> <s>${fmtAfter(p.compare)}</s></p></div>`; }).join('');
    const fb = $('#im-fbar-txt');
    if (fb) fb.innerHTML = n >= 2 ? (n % 3 === 2 ? 'Ajoute 1 maillot,<br><b>il est offert 🎁</b>' : 'Offre débloquée<br><b>3ᵉ offert ✓</b>') : `Ajoute ${2 - n} pour débloquer<br><b>-30 % 🔥</b>`;
  }

  /* ---------- Quick view ---------- */
  let qvId = null, qvSize = null;
  function openQV(id) {
    const p = BY_ID[id]; if (!p) return;
    qvId = id; qvSize = null;
    $('#im-qv-img').src = p.img;
    $('#im-qv-name').textContent = productName(p).toUpperCase();
    $('#im-qv-price').textContent = fmtAfter(p.price);
    $('#im-qv-size-lbl').textContent = 'À CHOISIR';
    $('#im-qv-more').href = PROD(id);
    $$('#im-qv-sizes button').forEach(b => b.classList.remove('is-on'));
    ['#im-qv-nom', '#im-qv-num', '#im-qv-below'].forEach(s => ($(s).value = ''));
    open('im-qv');
  }

  /* ---------- Offre ---------- */
  const offre = { pack: 2, price: 30.6, size: null, sel: [] };
  function renderOffre() {
    $('#im-offre-title').textContent = `Choisis ${offre.pack} maillots pour ${offre.price.toFixed(2).replace('.', ',')}€`;
    $('#im-offre-sel').textContent = `${offre.sel.length} / ${offre.pack}`;
    $('#im-offre-add').textContent = `AJOUTER AU PANIER — ${offre.price.toFixed(2).replace('.', ',')}€`;
    $('#im-offre-add').classList.toggle('is-ready', offre.sel.length === offre.pack && !!offre.size);
    const ids = (DATA.sections.bestsellers || []).concat((DATA.sections.conceptDefault || []), (DATA.sections.nouveautes || []).slice(0, 8));
    const uniq = [...new Set(ids)].slice(0, 16);
    $('#im-offre-grid').innerHTML = uniq.map(id => { const p = BY_ID[id]; const on = offre.sel.includes(id);
      return `<button type="button" class="ocard${on ? ' is-on' : ''}" data-pick="${id}"><img src="${p.img}" alt="" loading="lazy"><span class="ocard__chk">${I.check}</span><b>${esc(p.team)}</b><small>${esc(p.sub)}</small></button>`; }).join('');
  }

  /* ---------- Recherche ---------- */
  function renderSearch(q) {
    const grid = $('#im-search-grid');
    let res;
    if (!q) {
      res = ['france-maillot-exterieur-cdm-2026-27-vert-menthe', 'paris-fc-paris-x-ninho-orange-noir', 'real-madrid-maillot-concept-24-25-rose-noir', 'bresil-maillot-pre-match-25-26-blanc-rose', 'maillot-psg-2-etoiles-back-to-back-champions-deurope-25-26-bleu-domicile', 'chelsea-maillot-third-2425-noir'].map(id => BY_ID[id]);
      $('#im-search-label').textContent = 'PRODUITS POPULAIRES';
    } else {
      res = searchProducts(q).slice(0, 9);
      $('#im-search-label').textContent = res.length ? `RÉSULTATS POUR « ${q.toUpperCase()} »` : `AUCUN RÉSULTAT POUR « ${q.toUpperCase()} »`;
    }
    grid.innerHTML = res.filter(Boolean).map(p => `<a href="${PROD(p.id)}" class="sres"><span class="sres__img"><img src="${p.img}" alt="" loading="lazy"></span><span class="sres__name">${esc(productName(p))}</span><span class="sres__price">${fmt(p.price)} <s>${fmt(p.compare)}</s></span></a>`).join('');
  }
  const norm = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  function searchProducts(q) {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return DATA.products.filter(p => { const h = norm(p.team + ' ' + p.sub + ' ' + p.id); return words.every(w => h.includes(w)); });
  }

  /* ---------- Carrousels génériques (drag + barre de progression) ---------- */
  function scroller(track, bar, prev, next) {
    if (!track) return;
    const upd = () => {
      if (!bar) return;
      const max = track.scrollWidth - track.clientWidth;
      const ratio = track.clientWidth / track.scrollWidth;
      bar.style.width = Math.max(ratio * 100, 8) + '%';
      bar.style.transform = `translateX(${max > 0 ? (track.scrollLeft / max) * ((1 - ratio) / ratio) * 100 : 0}%)`;
    };
    track.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    upd();
    const step = () => (track.querySelector(':scope > *') || track).getBoundingClientRect().width + 14;
    prev && prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next && next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    // drag à la souris
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-drag'); });
    window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; track.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; track.classList.remove('is-drag'); });
    track.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    track.addEventListener('dragstart', e => e.preventDefault());
  }

  /* ---------- Init ---------- */
  function init() {
    const top = $('#im-top'); if (top) top.outerHTML = topHTML();
    const bot = $('#im-bottom'); if (bot) bot.outerHTML = bottomHTML();

    // Délégation globale
    document.addEventListener('click', e => {
      const t = e.target;
      const o = t.closest('[data-open]');
      if (o) { e.preventDefault(); const id = o.dataset.open; if (id === 'im-search') renderSearch(''); if (id === 'im-offre') renderOffre(); if (id === 'im-cart') updateCartUI(); open(id); return; }
      if (t.closest('[data-close]') || t.id === 'im-backdrop') { close(); return; }
      const qv = t.closest('[data-qv]'); if (qv) { e.preventDefault(); openQV(qv.dataset.qv); return; }
      const q = t.closest('[data-qty]'); if (q) { const it = cart.items.find(i => i.key === q.dataset.key); if (it) cart.setQty(it.key, it.qty + +q.dataset.qty); return; }
      const rm = t.closest('[data-rm]'); if (rm) { cart.setQty(rm.dataset.rm, 0); return; }
      const sz = t.closest('#im-qv-sizes button'); if (sz) { qvSize = sz.dataset.size; $$('#im-qv-sizes button').forEach(b => b.classList.toggle('is-on', b === sz)); $('#im-qv-size-lbl').textContent = qvSize; $('#im-qv-sizes').classList.remove('is-err'); return; }
      const pk = t.closest('#im-offre-packs button'); if (pk) { offre.pack = +pk.dataset.pack; offre.price = +pk.dataset.price; offre.sel = offre.sel.slice(0, offre.pack); $$('#im-offre-packs button').forEach(b => b.classList.toggle('is-on', b === pk)); renderOffre(); return; }
      const os = t.closest('#im-offre-sizes button'); if (os) { offre.size = os.dataset.size; $$('#im-offre-sizes button').forEach(b => b.classList.toggle('is-on', b === os)); $('#im-offre-sizes').classList.remove('is-err'); renderOffre(); return; }
      const pick = t.closest('[data-pick]'); if (pick) { const id = pick.dataset.pick; if (offre.sel.includes(id)) offre.sel = offre.sel.filter(x => x !== id); else if (offre.sel.length < offre.pack) offre.sel.push(id); else toast(`Tu as déjà choisi ${offre.pack} maillots`); renderOffre(); return; }
      const ck = t.closest('[data-cookie]'); if (ck) { store.set('im_cookie', ck.dataset.cookie); $('#im-cookie').classList.remove('is-on'); setTimeout(() => ($('#im-cookie').hidden = true), 300); return; }
      // dropdown au clic (tactile)
      const ddLink = t.closest('.hdr__dd > .hdr__link');
      if (ddLink && matchMedia('(hover: none)').matches) { const dd = ddLink.parentElement; if (!dd.classList.contains('is-open')) { e.preventDefault(); $$('.hdr__dd').forEach(d => d.classList.remove('is-open')); dd.classList.add('is-open'); return; } }
      if (!t.closest('.hdr__dd')) $$('.hdr__dd').forEach(d => d.classList.remove('is-open'));
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') { close(); $$('.hdr__dd').forEach(d => d.classList.remove('is-open')); } });

    $('#im-qv-add').addEventListener('click', () => {
      if (!qvSize) { $('#im-qv-sizes').classList.add('is-err'); toast('Choisis ta taille 👕'); return; }
      cart.add(qvId, { size: qvSize, name: $('#im-qv-nom').value.trim(), number: $('#im-qv-num').value.trim(), below: $('#im-qv-below').value.trim() });
      close(); updateCartUI(); open('im-cart');
    });
    $('#im-qv-num').addEventListener('input', e => (e.target.value = e.target.value.replace(/\D/g, '')));

    $('#im-offre-add').addEventListener('click', () => {
      if (!offre.size) { $('#im-offre-sizes').classList.add('is-err'); toast('Choisis ta taille 👕'); return; }
      if (offre.sel.length < offre.pack) { toast(`Sélectionne encore ${offre.pack - offre.sel.length} maillot(s)`); return; }
      offre.sel.forEach(id => cart.add(id, { size: offre.size }));
      offre.sel = []; close(); updateCartUI(); open('im-cart');
    });

    $('#im-search-input').addEventListener('input', e => renderSearch(e.target.value.trim()));
    $('#im-search-form').addEventListener('submit', e => { e.preventDefault(); const q = $('#im-search-input').value.trim(); if (q) location.href = 'collection.html?q=' + encodeURIComponent(q); });

    $('#im-cart-pay').addEventListener('click', () => {
      if (!cart.count()) { toast('Ton panier est vide'); return; }
      location.href = PAGE('checkout');
    });
    $('#im-promo-form').addEventListener('submit', e => { e.preventDefault(); const v = e.target.querySelector('input').value.trim(); toast(v ? `Le code « ${esc(v)} » n'est pas valide` : 'Saisis un code promo'); });

    $('#im-gift-form').addEventListener('submit', e => {
      e.preventDefault(); store.set('im_gift', 'done');
      e.target.outerHTML = '<div class="gift__code">Ton code : <b>IM3OFFERT</b><small>Le 3ᵉ maillot est offert automatiquement 🎁</small></div>';
    });

    // Cookies + popup
    if (store.get('im_cookie', null) == null) { const c = $('#im-cookie'); c.hidden = false; requestAnimationFrame(() => c.classList.add('is-on')); }
    if (!store.get('im_gift', null) && !sessionStorageGet('im_gift_seen')) {
      setTimeout(() => { if (!openLayer) { sessionStorageSet('im_gift_seen', '1'); open('im-gift'); } }, 25000);
    }

    // Header : ombre au scroll + masquer barre flottante près du footer
    const hdr = $('#im-header');
    const onScroll = () => {
      hdr.classList.toggle('is-scrolled', scrollY > 40);
      const fb = $('#im-fbar'); const ft = $('.trust');
      if (fb && ft) fb.classList.toggle('is-hidden', ft.getBoundingClientRect().top < innerHeight - 40);
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    // Footer : accordéons fermés sur mobile
    const mq = matchMedia('(max-width: 749px)');
    const syncFt = () => $$('.ft__col').forEach(d => (d.open = !mq.matches));
    syncFt(); mq.addEventListener('change', syncFt);

    updateCartUI();
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  window.IM = { DATA, BY_ID, $, $$, fmt, fmtAfter, esc, cap, cardHTML, cart, toast, open, close, openQV, scroller, searchProducts, productName, I, COL, PAGE, PROD, norm, updateCartUI };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
