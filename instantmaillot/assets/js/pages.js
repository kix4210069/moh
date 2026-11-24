/* Instant Maillot — pages collection, fiche produit et pages de contenu */
(function () {
  'use strict';
  const { DATA, BY_ID, $, $$, cardHTML, fmt, esc, cap, cart, toast, open, productName, searchProducts, norm, COL, PAGE, PROD, updateCartUI } = window.IM;
  const main = $('#im-main');
  const qs = new URLSearchParams(location.search);
  const kind = document.body.dataset.page;
  const all = DATA.products;
  const S = DATA.sections;
  const has = (p, ...words) => { const h = norm(p.team + ' ' + p.sub); return words.some(w => h.includes(norm(w))); };
  const jerseys = all.filter(p => !S.vestes.includes(p.id));

  /* ====================== COLLECTIONS ====================== */
  const COLLECTIONS = {
    'tout-les-maillots': ['Tous les maillots', 'Clubs, sélections, rétro et concept : le 3e est offert.', () => jerseys],
    'all': ['Tous les produits', 'Toute la boutique Instant Maillot.', () => all],
    'best-sellers': ['Best Sellers', 'Top ventes • les plus aimés', () => S.bestsellers.map(id => BY_ID[id])],
    'nouveautes': ['Nouveau en stock', 'Les dernières arrivées.', () => S.nouveautes.map(id => BY_ID[id])],
    'vestes': ['Vestes', 'Un seul modèle, huit humeurs. Choisis ton coloris.', () => S.vestes.map(id => BY_ID[id])],
    'coupe-du-monde-2026': ['Coupe du Monde 2026', 'Les maillots des sélections pour la CDM 2026.', () => jerseys.filter(p => has(p, 'cdm', 'coupe du monde'))],
    'selections': ['Toutes les sélections', 'Maillots des équipes nationales.', () => jerseys.filter(p => has(p, 'france', 'portugal', 'bresil', 'japon', 'mexique', 'colombie', 'indonesie', 'algerie', 'espagne', 'belgique'))],
    'maillot-concept': ['Maillot Concept', 'Un design unique, une innovation qui bouscule les codes.', () => jerseys.filter(p => has(p, 'concept'))],
    'pink-edition': ['Pink Edition', 'La sélection rose.', () => jerseys.filter(p => has(p, 'rose'))],
    'black-edition': ['Black Edition', 'La sélection noire.', () => jerseys.filter(p => has(p, 'noir'))],
    'retro': ['Rétro', 'Les maillots qui ont marqué l’histoire.', () => jerseys.filter(p => has(p, 'retro', '1998', '2011'))],
    'manches-longues': ['Manches longues', 'Viens voir ça !', () => jerseys.filter(p => has(p, 'manches longues'))],
    'maillot-psg-2-etoiles-champions-back-2-back': ['France × B2B', 'Ici c’est Paris — Champions d’Europe 25/26, deux étoiles.', () => S.b2b.map(id => BY_ID[id])],
    'ensemble-enfant': ['Ensembles enfant', 'Tailles enfant : demande ta taille au service client ou consulte le guide des tailles enfant.', () => S.bestsellers.map(id => BY_ID[id])],
    'ensemble-adulte': ['Ensembles adulte', 'Maillot + short, en tailles adulte.', () => S.bestsellers.map(id => BY_ID[id])],
    'ligue-1': ['Ligue 1', 'Les maillots du championnat de France.', () => jerseys.filter(p => has(p, 'psg', 'paris'))],
    'premiere-ligue': ['Premier League', 'Les maillots du championnat anglais.', () => jerseys.filter(p => has(p, 'chelsea', 'manchester', 'arsenal', 'liverpool', 'newcastle', 'sunderland'))],
    'bundesliga': ['Bundesliga', 'Les maillots du championnat allemand.', () => jerseys.filter(p => has(p, 'bayern'))],
    'la-ligua': ['La Liga', 'Les maillots du championnat espagnol.', () => jerseys.filter(p => has(p, 'barcelone', 'real madrid', 'castellon'))],
    'serie-a': ['Série A', 'Les maillots du championnat italien.', () => jerseys.filter(p => has(p, 'inter', 'milan', 'venezia', 'ravenna'))],
    'autres-championnats': ['Autres championnats', 'MLS, Brasileirão, Liga MX…', () => jerseys.filter(p => has(p, 'montreal', 'palmeiras', 'flamengo', 'santos', 'america', 'red star', 'palestine'))]
  };
  const CHIPS = [['Tous', 'tout-les-maillots'], ['Best sellers', 'best-sellers'], ['CDM 2026', 'coupe-du-monde-2026'], ['Concept', 'maillot-concept'], ['Rétro', 'retro'], ['Manches longues', 'manches-longues'], ['Vestes', 'vestes']];

  function renderCollection() {
    const q = (qs.get('q') || '').trim();
    let handle = qs.get('c') || 'tout-les-maillots';
    let title, sub, list;
    if (q) { title = `Recherche : « ${q} »`; list = searchProducts(q); sub = `${list.length} résultat${list.length > 1 ? 's' : ''}`; handle = ''; }
    else {
      const c = COLLECTIONS[handle] || COLLECTIONS['tout-les-maillots'];
      [title, sub] = c; list = c[2]().filter(Boolean);
    }
    document.title = title + ' — Instant Maillot';
    main.innerHTML = `
      <p class="crumbs"><a href="index.html">Accueil</a> / ${esc(title)}</p>
      <div class="page-hero"><p class="k">COLLECTION</p><h1>${esc(title.toUpperCase())}</h1><p class="s">${esc(sub)}</p></div>
      <div class="toolbar">
        <div class="chips">${CHIPS.map(([n, h]) => `<a href="${COL(h)}" class="${h === handle ? 'is-on' : ''}">${n}</a>`).join('')}</div>
        <label><span class="sr-only">Trier</span><select id="im-sort"><option value="">Trier : en vedette</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option><option value="az">Alphabétique, A-Z</option></select></label>
      </div>
      <section class="sec" style="padding-bottom:70px">
        ${list.length ? '<div class="pgrid pgrid--5" id="im-col-grid"></div>' : `<div class="empty"><p>Aucun produit ne correspond.</p><a href="${COL('tout-les-maillots')}">Voir tous les maillots</a></div>`}
      </section>`;
    const grid = $('#im-col-grid'); if (!grid) return;
    const draw = sort => {
      const l = list.slice();
      if (sort === 'asc') l.sort((a, b) => a.price - b.price);
      if (sort === 'desc') l.sort((a, b) => b.price - a.price);
      if (sort === 'az') l.sort((a, b) => productName(a).localeCompare(productName(b)));
      grid.innerHTML = l.map(p => cardHTML(p)).join('');
    };
    draw('');
    $('#im-sort').addEventListener('change', e => draw(e.target.value));
  }

  /* ====================== FICHE PRODUIT ====================== */
  function renderProduct() {
    const p = BY_ID[qs.get('id')] || all[0];
    const isJacket = S.vestes.includes(p.id);
    document.title = productName(p) + ' — Instant Maillot';
    const pct = Math.round((1 - p.price / p.compare) * 100);
    const related = (isJacket ? S.vestes : S.bestsellers).filter(id => id !== p.id).slice(0, 5);
    main.innerHTML = `
      <p class="crumbs"><a href="index.html">Accueil</a> / <a href="${COL(isJacket ? 'vestes' : 'tout-les-maillots')}">${isJacket ? 'Vestes' : 'Maillots'}</a> / ${esc(productName(p))}</p>
      <div class="pdp">
        <div class="pdp__img"><img src="${p.img}" alt="${esc(productName(p))}"></div>
        <div>
          <p class="pdp__team">${esc(p.team)}</p>
          <h1>${esc(cap(p.sub))}</h1>
          <p class="pdp__price">${fmt(p.price)}<s>${fmt(p.compare)}</s><em>-${pct}%</em></p>
          <p class="pdp__offer">🎁 Achète 2 maillots, le 3ᵉ est offert automatiquement</p>
          <p class="pdp__lbl">TAILLE : <span id="pdp-size-lbl">À CHOISIR</span></p>
          <div class="pdp__sizes" id="pdp-sizes">${['S', 'M', 'L', 'XL', '2XL'].map(s => `<button type="button" data-s="${s}">${s}</button>`).join('')}</div>
          <p class="pdp__lbl"><a href="${PAGE('guide-des-tailles')}" style="text-decoration:underline;font-weight:500;letter-spacing:0">📏 Guide des tailles</a></p>
          ${isJacket ? '' : `<p class="pdp__lbl">FLOCAGE OFFERT</p>
          <div class="pdp__flock"><input id="pdp-nom" placeholder="Nom ( ex : Fan )" maxlength="14"><input id="pdp-num" placeholder="Numéro ( ex : 2 )" inputmode="numeric" maxlength="2"><input id="pdp-below" placeholder="Nom en dessous du numéro ( ex : toi )" maxlength="14"></div>`}
          <div class="pdp__qty"><div class="qty"><button type="button" id="pdp-minus" aria-label="Moins">−</button><span id="pdp-q">1</span><button type="button" id="pdp-plus" aria-label="Plus">+</button></div><button type="button" class="pdp__add" id="pdp-add">AJOUTER AU PANIER</button></div>
          <button type="button" class="pdp__buy" id="pdp-buy">ACHETER MAINTENANT</button>
          <ul class="pdp__ul"><li>🚚 Livraison en moyenne 15 jours, colis suivi</li><li>📸 Photo de ta commande avant envoi</li><li>🔒 Paiement sécurisé</li><li>✅ Triple contrôle qualité avant départ</li></ul>
        </div>
      </div>
      <section class="sec" style="padding-bottom:70px">
        <div class="ghost"><span class="ghost__bg" aria-hidden="true">TU AIMERAS</span><h2 class="ghost__title">TU AIMERAS AUSSI</h2></div>
        <div class="pgrid pgrid--5">${related.map(id => cardHTML(BY_ID[id])).join('')}</div>
      </section>`;
    let size = null, q = 1;
    $('#pdp-sizes').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; size = b.dataset.s; $$('#pdp-sizes button').forEach(x => x.classList.toggle('is-on', x === b)); $('#pdp-size-lbl').textContent = size; });
    $('#pdp-minus').addEventListener('click', () => { q = Math.max(1, q - 1); $('#pdp-q').textContent = q; });
    $('#pdp-plus').addEventListener('click', () => { q = Math.min(20, q + 1); $('#pdp-q').textContent = q; });
    const num = $('#pdp-num'); if (num) num.addEventListener('input', e => (e.target.value = e.target.value.replace(/\D/g, '')));
    const add = () => {
      if (!size) { $('#pdp-sizes').classList.remove('is-err'); void $('#pdp-sizes').offsetWidth; $('#pdp-sizes').classList.add('is-err'); toast('Choisis ta taille 👕'); return false; }
      const v = s => ($(s) ? $(s).value.trim() : '');
      cart.add(p.id, { size, qty: q, name: v('#pdp-nom'), number: v('#pdp-num'), below: v('#pdp-below') });
      return true;
    };
    $('#pdp-add').addEventListener('click', () => { if (add()) open('im-cart'); });
    $('#pdp-buy').addEventListener('click', () => { if (add()) location.href = PAGE('checkout'); });
  }

  /* ====================== PAGES DE CONTENU ====================== */
  const FAQ = [
    ['Comment fonctionne l’offre « 2 achetés, le 3e offert » ?', 'Ajoute 3 maillots à ton panier : le moins cher des trois est automatiquement offert. L’offre se cumule (6 maillots = 2 offerts, etc.).'],
    ['Quel est le délai de livraison ?', 'La livraison prend en moyenne 15 jours. Tu reçois ton numéro de suivi par mail dès l’expédition et tu suis ton colis en temps réel.'],
    ['Le flocage est-il payant ?', 'Non, le flocage (nom, numéro et texte sous le numéro) est offert sur tous les maillots.'],
    ['Comment choisir ma taille ?', 'Consulte notre guide des tailles adultes et enfant. En cas de doute entre deux tailles, prends la plus grande.'],
    ['Le paiement est-il sécurisé ?', 'Oui. Les données bancaires sont chiffrées et ne sont jamais stockées. Carte bancaire, PayPal, Apple Pay, Google Pay, Klarna et plus.'],
    ['Puis-je voir ma commande avant l’envoi ?', 'Oui : chaque commande passe un triple contrôle qualité et nous t’envoyons une photo de ta commande avant expédition.'],
    ['Comment contacter le service client ?', 'Via la page Contact. On répond vite, 7j/7.']
  ];
  const POLICY = (t, paras) => ({ t, k: 'POLITIQUES', body: `<div class="prose">${paras.map(([h, p]) => `<h2>${h}</h2><p>${p}</p>`).join('')}<p style="margin-top:30px;color:#999;font-size:13px">Texte indicatif à adapter avec vos conditions légales.</p></div>` });
  const sizeTable = (rows, head) => `<table><thead><tr>${head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;

  const PAGES = {
    'faq': { t: 'FAQ', k: 'AIDE', s: 'Les réponses à tes questions.', body: `<div class="prose faq">${FAQ.map(([q, a], i) => `<details${i ? '' : ' open'}><summary>${q}</summary><p>${a}</p></details>`).join('')}<p style="margin-top:24px">Une autre question ? <a href="${PAGE('contact')}" style="text-decoration:underline">Contacte-nous</a>.</p></div>` },
    'suivi-colis': { t: 'Suivre ma commande', k: 'EXCLUSIVITÉ INSTANT MAILLOT', s: 'De l’atelier à ta porte.', body: `<div class="prose"><form class="form" id="im-track"><input required placeholder="Numéro de commande (ex : #12345)" name="order"><input required type="email" placeholder="Adresse e-mail" name="email"><button type="submit">Suivre ma commande ›</button></form><div id="im-track-res"></div></div>`, init: initTrack },
    'compte': { t: 'Mon compte', k: 'CONNEXION', s: 'Accède à tes commandes et à ton suivi.', body: `<div class="prose"><form class="form" id="im-login"><input required type="email" placeholder="Adresse e-mail"><button type="submit">Recevoir mon code de connexion</button></form><p style="text-align:center;margin-top:18px"><a href="${PAGE('suivi-colis')}" style="text-decoration:underline">Suivre une commande sans compte</a></p></div>`, init: () => $('#im-login').addEventListener('submit', e => { e.preventDefault(); e.target.outerHTML = '<div class="result">📩 Un code de connexion vient d’être envoyé par e-mail.</div>'; }) },
    'contact': { t: 'Contact', k: 'SERVICE CLIENT', s: 'Une question ? On répond vite, 7j/7.', body: `<div class="prose"><form class="form" id="im-contact"><input required placeholder="Nom"><input required type="email" placeholder="E-mail"><input placeholder="Numéro de commande (facultatif)"><textarea required rows="5" placeholder="Ton message"></textarea><button type="submit">Envoyer</button></form></div>`, init: () => $('#im-contact').addEventListener('submit', e => { e.preventDefault(); e.target.outerHTML = '<div class="result">✅ Message envoyé ! On te répond très vite.</div>'; }) },
    'guide-des-tailles': { t: 'Guide des tailles adultes', k: 'AIDE', s: 'Mesures du maillot à plat, en cm.', body: `<div class="prose">${sizeTable([['S', '49', '69', '165-170'], ['M', '52', '71', '170-176'], ['L', '55', '73', '176-182'], ['XL', '58', '75', '182-188'], ['2XL', '61', '78', '188-195']], ['Taille', 'Largeur', 'Longueur', 'Hauteur'])}<p>Entre deux tailles ? Prends la plus grande. Les versions « Player » sont plus ajustées.</p></div>` },
    'guide-des-tailles-enfant': { t: 'Guide des tailles enfant', k: 'AIDE', s: 'Choisis selon la taille de l’enfant.', body: `<div class="prose">${sizeTable([['16', '3-4 ans', '95-105'], ['18', '4-5 ans', '105-115'], ['20', '5-6 ans', '115-125'], ['22', '6-7 ans', '125-135'], ['24', '8-9 ans', '135-145'], ['26', '10-11 ans', '145-155'], ['28', '12-13 ans', '155-165']], ['Taille', 'Âge', 'Hauteur (cm)'])}</div>` },
    'collaborations': { t: 'Collaborations', k: '🤝 INSTANT MAILLOT', s: 'Créateur·rice de contenu ? Travaillons ensemble.', body: `<div class="prose"><form class="form" id="im-collab"><input required placeholder="Nom / pseudo"><input required placeholder="Lien TikTok / Instagram"><input required type="email" placeholder="E-mail"><button type="submit">Proposer une collab</button></form></div>`, init: () => $('#im-collab').addEventListener('submit', e => { e.preventDefault(); e.target.outerHTML = '<div class="result">🙌 Merci ! On revient vers toi rapidement.</div>'; }) },
    'pack-mystere': { t: 'Compose ton pack mystère', k: 'SURPRISE GARANTIE', s: '4, 6 ou 12 maillots · à toi de jouer', body: `<div class="prose"><div class="offre__packs" id="pm-packs" style="grid-template-columns:repeat(3,1fr)"><button type="button" class="is-on" data-n="4"><b>4 maillots</b><span>dont 1 offert</span></button><button type="button" data-n="6"><b>6 maillots</b><span>dont 2 offerts</span></button><button type="button" data-n="12"><b>12 maillots</b><span>dont 4 offerts</span></button></div><p class="offre__lbl">TA TAILLE</p><div class="offre__sizes" id="pm-sizes">${['S', 'M', 'L', 'XL', 'XXL'].map(s => `<button type="button" data-size="${s}">${s}</button>`).join('')}</div><button class="pdp__buy" id="pm-add" style="margin-top:24px">AJOUTER MON PACK MYSTÈRE</button><p style="margin-top:12px;color:#777;font-size:13px">Les maillots sont tirés au hasard parmi le catalogue. Le 3ᵉ offert s’applique automatiquement au panier.</p></div>`, init: initPack },
    'checkout': { t: 'Paiement', k: 'COMMANDE', s: 'Paiement sécurisé — données bancaires chiffrées.', body: '<div class="prose" id="im-co"></div>', init: initCheckout },
    'remboursement': POLICY('Retour et remboursement', [['Délai', 'Tu disposes de 14 jours après réception pour nous signaler un problème avec ta commande.'], ['Conditions', 'Les articles doivent être non portés, non lavés et dans leur emballage d’origine. Les maillots floqués ne sont ni repris ni échangés, sauf défaut.'], ['Remboursement', 'Une fois le retour validé, le remboursement est effectué sur le moyen de paiement d’origine.']]),
    'confidentialite': POLICY('Politique de confidentialité', [['Données collectées', 'Nous collectons uniquement les données nécessaires au traitement de ta commande (nom, adresse, e-mail, téléphone).'], ['Zéro revente', 'Tes données ne sont jamais revendues. Les cookies servent à personnaliser ton expérience et à améliorer le site.'], ['Tes droits', 'Tu peux demander l’accès, la rectification ou la suppression de tes données via la page Contact.']]),
    'expedition': POLICY('Politique d’expédition', [['Délais', 'Livraison en moyenne 15 jours. Chaque commande passe un triple contrôle qualité avant départ.'], ['Suivi', 'Tracking envoyé par mail dès l’expédition. Tu suis ton colis en temps réel à chaque étape.'], ['Livraison express', 'Une option express peut être proposée au moment du paiement.']]),
    'conditions': POLICY('Conditions d’utilisation', [['Objet', 'Les présentes conditions encadrent l’utilisation du site et les achats effectués sur la boutique.'], ['Prix', 'Les prix sont indiqués en euros TTC. L’offre « 3e offert » s’applique automatiquement au panier.'], ['Responsabilité', 'Les visuels sont non contractuels.']])
  };

  function initTrack() {
    $('#im-track').addEventListener('submit', e => {
      e.preventDefault();
      const order = esc(e.target.order.value.trim());
      $('#im-track-res').innerHTML = `<div class="result"><b>Commande ${order}</b><ul class="steps"><li class="done">Commande reçue</li><li class="done">Triple contrôle qualité</li><li class="done">Photo de ta commande envoyée</li><li>Expédiée</li><li>En cours de livraison</li><li>Livrée</li></ul><small style="color:#888">Aperçu de démonstration — branchez ici votre outil de suivi.</small></div>`;
    });
  }
  function initPack() {
    let n = 4, size = null;
    $('#pm-packs').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; n = +b.dataset.n; $$('#pm-packs button').forEach(x => x.classList.toggle('is-on', x === b)); });
    $('#pm-sizes').addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; size = b.dataset.size; $$('#pm-sizes button').forEach(x => x.classList.toggle('is-on', x === b)); });
    $('#pm-add').addEventListener('click', () => {
      if (!size) { toast('Choisis ta taille 👕'); return; }
      const pool = jerseys.slice().sort(() => Math.random() - .5).slice(0, n);
      pool.forEach(p => cart.add(p.id, { size }));
      open('im-cart');
    });
  }
  function initCheckout() {
    const box = $('#im-co');
    const draw = () => {
      const t = cart.totals();
      if (!t.count) { box.innerHTML = `<div class="empty"><p>Ton panier est vide.</p><a href="${COL('best-sellers')}">Voir les best sellers</a></div>`; return; }
      box.innerHTML = `<div class="result" style="margin-bottom:20px">${cart.items.map(i => { const p = BY_ID[i.id]; return p ? `<div style="display:flex;justify-content:space-between;gap:10px;padding:4px 0"><span>${i.qty} × ${esc(productName(p))}${i.size ? ' — ' + esc(i.size) : ''}</span><b>${fmt(p.price * i.qty)}</b></div>` : ''; }).join('')}
        <hr style="border:0;border-top:1px solid #e5dcff;margin:10px 0">${t.disc ? `<div style="display:flex;justify-content:space-between;color:#1a9c5a"><span>🎁 3ᵉ offert</span><b>-${fmt(t.disc)}</b></div>` : ''}<div style="display:flex;justify-content:space-between;font-size:18px"><b>Total</b><b>${fmt(t.total)}</b></div></div>
        <form class="form" id="im-pay"><input required type="email" placeholder="E-mail"><input required placeholder="Nom complet"><input required placeholder="Adresse"><div style="display:grid;grid-template-columns:1fr 2fr;gap:10px"><input required placeholder="Code postal" inputmode="numeric"><input required placeholder="Ville"></div><input required placeholder="Téléphone" type="tel"><button type="submit">Payer ${fmt(t.total)}</button></form>`;
      $('#im-pay').addEventListener('submit', e => {
        e.preventDefault();
        cart.items = []; cart.save();
        box.innerHTML = `<div class="result" style="text-align:center"><p style="font-size:40px">🎉</p><p style="font-size:20px;font-weight:800">Merci pour ta commande !</p><p>Démo : aucun paiement réel n’a été effectué. Connectez ici votre solution de paiement.</p><a class="track__btn" style="margin-top:16px" href="index.html">Retour à l’accueil</a></div>`;
      });
    };
    draw();
  }

  function renderPage() {
    const key = qs.get('p') || 'faq';
    const pg = PAGES[key] || PAGES.faq;
    document.title = pg.t + ' — Instant Maillot';
    main.innerHTML = `<p class="crumbs"><a href="index.html">Accueil</a> / ${esc(pg.t)}</p><div class="page-hero"><p class="k">${pg.k}</p><h1>${esc(pg.t.toUpperCase())}</h1>${pg.s ? `<p class="s">${pg.s}</p>` : ''}</div>${pg.body}`;
    if (pg.init) pg.init();
  }

  if (kind === 'collection') renderCollection();
  else if (kind === 'product') renderProduct();
  else renderPage();
  updateCartUI();
})();
