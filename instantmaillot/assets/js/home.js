/* Instant Maillot — scripts de la page d'accueil */
(function () {
  'use strict';
  const { DATA, BY_ID, $, $$, cardHTML, scroller, fmt, productName, PROD } = window.IM;
  const S = DATA.sections;

  /* ---------- Grilles produits ---------- */
  $$('[data-section]').forEach(el => { el.innerHTML = (S[el.dataset.section] || []).map(id => cardHTML(BY_ID[id])).join(''); });

  /* ---------- Nouveau en stock (2 rangées défilantes) ---------- */
  const news = $('#im-news');
  news.innerHTML = (S.nouveautes || []).map(id => cardHTML(BY_ID[id])).join('');
  scroller(news, $('#im-news-bar'));

  /* ---------- Championnats ---------- */
  scroller($('#im-champ'), $('#im-champ-bar'), $('#im-champ-prev'), $('#im-champ-next'));

  /* ---------- Manches longues ---------- */
  const ml = $('#im-ml');
  ml.insertAdjacentHTML('beforeend', (S.manchesLongues || []).map(id => cardHTML(BY_ID[id], { small: true })).join(''));
  scroller(ml);

  /* ---------- Concept / Pink / Black ---------- */
  const CONCEPT = {
    conceptDefault: { pc: 'im-concept-pc.jpg', mob: 'im-concept-mob.jpg', link: 'maillot-concept' },
    conceptPink: { pc: 'im-pink-edition.jpg', mob: 'im-pink-edition-mob.jpg', link: 'pink-edition' },
    conceptBlack: { pc: 'im-black-edition.jpg', mob: 'im-black-edition-mob.jpg', link: 'black-edition' }
  };
  const cgrid = $('#im-concept-grid');
  function setConcept(key) {
    const c = CONCEPT[key];
    cgrid.classList.add('is-fading');
    setTimeout(() => {
      cgrid.innerHTML = (S[key] || []).map(id => cardHTML(BY_ID[id])).join('');
      cgrid.classList.remove('is-fading');
    }, 180);
    $('#im-concept-img').src = 'assets/img/' + c.pc;
    $('#im-concept-src').srcset = 'assets/img/' + c.mob;
    $('#im-concept-btn').href = 'collection.html?c=' + c.link;
    $$('[data-ctab]').forEach(b => { const on = b.dataset.ctab === key; b.classList.toggle('is-on', on); if (b.getAttribute('role') === 'tab') b.setAttribute('aria-selected', on); });
  }
  $$('[data-ctab]').forEach(b => b.addEventListener('click', () => setConcept(b.dataset.ctab)));
  cgrid.innerHTML = (S.conceptDefault || []).map(id => cardHTML(BY_ID[id])).join('');

  /* ---------- Vestes : sélecteur de coloris ---------- */
  const jk = $('#im-jk');
  const order = [1, 2, 3, 4, 0, 5, 6, 7]; // ordre des vignettes sur le site d'origine
  const vestes = (S.vestes || []).map(id => BY_ID[id]);
  jk.insertAdjacentHTML('beforeend', order.map((k, n) => {
    const p = vestes[k]; if (!p) return '';
    return `<button type="button" class="jk__th jk__th--${n}${k === 0 ? ' is-on' : ''}" data-jk="${k}" aria-label="${p.color}"><img src="${p.img}" alt="" loading="lazy"></button>`;
  }).join(''));
  function setJacket(k) {
    const p = vestes[k]; if (!p) return;
    const img = $('#im-jk-img');
    img.classList.add('is-swap');
    setTimeout(() => { img.src = p.img; img.alt = productName(p); img.classList.remove('is-swap'); }, 150);
    $('#im-jk-color').textContent = p.color.toUpperCase();
    $('#im-jk-main').href = PROD(p.id);
    $$('.jk__th').forEach(b => b.classList.toggle('is-on', +b.dataset.jk === k));
  }
  $$('.jk__th').forEach(b => b.addEventListener('click', () => setJacket(+b.dataset.jk)));
  setJacket(0);

  /* ---------- Coverflow vidéos ---------- */
  const VIDEOS = [
    { v: 1, p: 'fc-barcelone-maillot-concept-25-26-rose-bleu-ciel' },
    { v: 2, p: 'france-maillot-exterieur-cdm-2026-27-vert-menthe' },
    { v: 3, p: 'real-madrid-maillot-concept-24-25-rose-noir' },
    { v: 4, p: 'maillot-psg-2-etoiles-back-to-back-champions-deurope-25-26-bleu-domicile' },
    { v: 5, p: 'paris-fc-paris-x-ninho-orange-noir' },
    { v: 6, p: 'bresil-maillot-pre-match-25-26-blanc-rose' },
    { v: 7, p: 'chelsea-maillot-third-2425-noir' }
  ];
  const stage = $('#im-cflow-stage');
  stage.innerHTML = VIDEOS.map((x, i) => `<div class="cflow__item" data-i="${i}"><video src="assets/video/c${x.v}.mp4" poster="assets/video/c${x.v}.jpg" muted playsinline preload="none" loop></video></div>`).join('');
  const items = $$('.cflow__item', stage);
  let cur = 0, timer;
  const N = items.length;
  function layout() {
    const mob = innerWidth < 750;
    const first = mob ? 112 : 283, step = mob ? 96 : 224; // distances entre cartes (px)
    items.forEach((el, i) => {
      let d = i - cur;
      if (d > N / 2) d -= N; if (d < -N / 2) d += N;
      const abs = Math.abs(d);
      const isC = d === 0;
      const x = isC ? 0 : Math.sign(d) * (first + (abs - 1) * step);
      el.style.transform = `translate(-50%, -50%) translateX(${x}px) scale(${isC ? 1.55 : 1})`;
      el.style.zIndex = 10 - abs;
      el.style.opacity = abs > 3 ? 0 : 1;
      el.classList.toggle('is-center', isC);
      const v = el.querySelector('video');
      if (isC) { v.preload = 'auto'; const pr = v.play(); if (pr) pr.catch(() => {}); } else { v.pause(); }
    });
    const p = BY_ID[VIDEOS[cur].p];
    $('#im-vchip').href = PROD(p.id);
    $('#im-vchip-img').src = p.img;
    $('#im-vchip-name').textContent = productName(p);
    $('#im-vchip-price').textContent = fmt(p.price);
  }
  function go(i) { cur = (i + N) % N; layout(); restart(); }
  function restart() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 7000); }
  items.forEach((el, i) => el.addEventListener('click', () => { if (i !== cur) go(i); else { const v = el.querySelector('video'); v.paused ? v.play() : v.pause(); } }));
  $('.cflow__nav--prev').addEventListener('click', () => go(cur - 1));
  $('.cflow__nav--next').addEventListener('click', () => go(cur + 1));
  // swipe tactile
  let sx = null;
  stage.addEventListener('touchstart', e => (sx = e.touches[0].clientX), { passive: true });
  stage.addEventListener('touchend', e => { if (sx == null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1)); sx = null; });
  addEventListener('resize', layout);
  // pause quand hors écran
  new IntersectionObserver(es => es.forEach(e => {
    const v = items[cur].querySelector('video');
    if (e.isIntersecting) { v.play().catch(() => {}); restart(); } else { v.pause(); clearInterval(timer); }
  })).observe(stage);
  layout(); restart();

  /* ---------- Compteur de commandes ---------- */
  const oc = $('#im-orders');
  const target = 10283;
  let t0 = null;
  function tick(ts) {
    if (!t0) t0 = ts;
    const k = Math.min(1, (ts - t0) / 1600);
    const val = Math.round(target * (1 - Math.pow(1 - k, 3)));
    oc.textContent = val.toLocaleString('fr-FR').replace(/ | /g, ' ');
    if (k < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
