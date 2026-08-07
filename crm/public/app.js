'use strict';

// ---------------------------------------------------------------------------
//  Utilitaires
// ---------------------------------------------------------------------------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let ME = null;

async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: opts.body && !(opts.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {},
    ...opts,
  });
  if (res.status === 401 || res.status === 403) {
    const data = await res.json().catch(() => ({}));
    if (url !== '/api/auth/login') { showAuth(); throw new Error(data.error || 'Accès refusé'); }
    throw new Error(data.error || 'Accès refusé');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Erreur serveur');
  return data;
}

function toast(msg, isErr = false) {
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show' + (isErr ? ' err' : '');
  setTimeout(() => (t.className = 'toast'), 2600);
}

const STATUT_LABELS = {
  en_attente: 'En attente',
  accepte: 'Accepté',
  refuse: 'Refusé',
  documents_manquants: 'Documents manquants',
};
const fmtDate = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || '');
  return m ? `${m[3]}/${m[2]}/${m[1]}` : (s || '');
};
const initials = (a) => `${(a.prenom || '')[0] || ''}${(a.nom || '')[0] || ''}`.toUpperCase() || '?';

// ---------------------------------------------------------------------------
//  Authentification
// ---------------------------------------------------------------------------
function showAuth() {
  ME = null;
  $('#appView').classList.add('hidden');
  $('#authView').classList.remove('hidden');
}
function showApp() {
  $('#authView').classList.add('hidden');
  $('#appView').classList.remove('hidden');
  $('#meNom').textContent = ME.nom || ME.email;
  $('#meRole').textContent = ME.role === 'admin' ? 'Administrateur' : 'Collaborateur';
  $$('.adminOnly').forEach((el) => el.classList.toggle('hidden', ME.role !== 'admin'));
}

$('#loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('#loginError').textContent = '';
  try {
    ME = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: $('#loginEmail').value, password: $('#loginPassword').value }),
    });
    showApp();
    switchView('apprentis');
  } catch (err) {
    $('#loginError').textContent = err.message;
  }
});

$('#logoutBtn').addEventListener('click', async () => {
  await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
  showAuth();
});

// ---------------------------------------------------------------------------
//  Navigation
// ---------------------------------------------------------------------------
function switchView(view) {
  $$('#nav button').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  ['apprentis', 'collaborateurs', 'parametres'].forEach((v) =>
    $(`#view-${v}`).classList.toggle('hidden', v !== view));
  if (view === 'apprentis') { loadStats(); loadApprentis(); }
  if (view === 'collaborateurs') loadUsers();
  if (view === 'parametres') loadSettings();
}
$('#nav').addEventListener('click', (e) => {
  const b = e.target.closest('button[data-view]');
  if (b) switchView(b.dataset.view);
});

// ---------------------------------------------------------------------------
//  Apprentis — liste, stats
// ---------------------------------------------------------------------------
async function loadStats() {
  const s = await api('/api/apprentis/stats');
  $('#stats').innerHTML = `
    <div class="stat"><div class="n">${s.total}</div><div class="l">Total apprentis</div></div>
    <div class="stat ok"><div class="n">${s.accepte}</div><div class="l">Acceptés</div></div>
    <div class="stat warn"><div class="n">${s.documents_manquants}</div><div class="l">Documents manquants</div></div>
    <div class="stat info"><div class="n">${s.en_attente}</div><div class="l">En attente</div></div>
    <div class="stat danger"><div class="n">${s.refuse}</div><div class="l">Refusés</div></div>`;
}

let searchTimer;
$('#searchInput').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(loadApprentis, 250);
});
$('#statutFilter').addEventListener('change', loadApprentis);

async function loadApprentis() {
  const q = encodeURIComponent($('#searchInput').value.trim());
  const statut = $('#statutFilter').value;
  const list = await api(`/api/apprentis?q=${q}&statut=${statut}`);
  const el = $('#apprentisTable');
  if (!list.length) {
    el.innerHTML = `<div class="empty">Aucun apprenti. Cliquez sur « ＋ Nouvel apprenti » pour commencer.</div>`;
    return;
  }
  el.innerHTML = `
    <table>
      <thead><tr><th>Apprenti</th><th>Société</th><th>Formation</th><th>État du dossier</th><th></th></tr></thead>
      <tbody>${list.map(rowHTML).join('')}</tbody>
    </table>`;
  $$('#apprentisTable tr[data-id]').forEach((tr) =>
    tr.addEventListener('click', () => openApprenti(Number(tr.dataset.id))));
}

function rowHTML(a) {
  const av = a.photo
    ? `<img class="avatar" src="/uploads/${esc(a.photo)}" alt="">`
    : `<div class="avatar">${esc(initials(a))}</div>`;
  return `<tr data-id="${a.id}" style="cursor:pointer">
    <td><div class="row-main">${av}<div class="who"><b>${esc(a.prenom)} ${esc(a.nom)}</b><small>${esc(a.email || '')}</small></div></div></td>
    <td>${esc(a.societe || '—')}</td>
    <td>${esc(a.formation || '—')}</td>
    <td><span class="badge ${a.statut}">${STATUT_LABELS[a.statut] || a.statut}</span></td>
    <td style="text-align:right"><span class="btn-link">Ouvrir ›</span></td>
  </tr>`;
}

// ---------------------------------------------------------------------------
//  Drawer fiche apprenti
// ---------------------------------------------------------------------------
const overlay = $('#overlay'), drawer = $('#drawer');
function openDrawer() { overlay.classList.add('open'); drawer.classList.add('open'); }
function closeDrawer() { overlay.classList.remove('open'); drawer.classList.remove('open'); }
$('#drawerClose').addEventListener('click', closeDrawer);
overlay.addEventListener('click', closeDrawer);

$('#newApprentiBtn').addEventListener('click', () => openApprenti(null));

const FORM = [
  { section: 'Identité de l’apprenti' },
  { k: 'prenom', l: 'Prénom *' }, { k: 'nom', l: 'Nom *' },
  { k: 'date_naissance', l: 'Date de naissance', type: 'date' },
  { k: 'sexe', l: 'Sexe', type: 'select', opts: ['', 'M', 'F'] },
  { k: 'nationalite', l: 'Nationalité' }, { k: 'telephone', l: 'Téléphone' },
  { k: 'email', l: 'E-mail', type: 'email' },
  { k: 'adresse', l: 'Adresse', full: true },
  { k: 'code_postal', l: 'Code postal' }, { k: 'ville', l: 'Ville' },

  { section: 'Société d’appartenance' },
  { k: 'societe', l: 'Société *' }, { k: 'societe_siret', l: 'SIRET' },
  { k: 'societe_representant', l: 'Représentant légal' }, { k: 'societe_effectif', l: 'Effectif' },
  { k: 'societe_naf', l: 'Code NAF/APE' },
  { k: 'societe_adresse', l: 'Adresse société', full: true },
  { k: 'societe_cp', l: 'Code postal société' }, { k: 'societe_ville', l: 'Ville société' },

  { section: 'Formation suivie' },
  { k: 'formation', l: 'Intitulé de la formation *', full: true },
  { k: 'formation_diplome', l: 'Diplôme / titre préparé' }, { k: 'formation_niveau', l: 'Niveau (ex : 5, 6…)' },
  { k: 'formation_rncp', l: 'Code RNCP' },
  { k: 'date_debut', l: 'Début du contrat *', type: 'date' }, { k: 'date_fin', l: 'Fin du contrat *', type: 'date' },
  { k: 'date_debut_formation', l: 'Début de la formation', type: 'date' },
  { k: 'date_fin_formation', l: 'Fin de la formation', type: 'date' },
  { k: 'duree_heures', l: 'Durée (heures)' }, { k: 'rythme', l: 'Rythme (ex : 2j/sem)' },
  { k: 'remuneration', l: 'Rémunération' }, { k: 'cout_formation', l: 'Coût formation (€)' },

  { section: 'Suivi du dossier' },
  { k: 'statut', l: 'État du dossier', type: 'select',
    opts: [['en_attente', 'En attente'], ['accepte', 'Accepté'], ['documents_manquants', 'Documents manquants'], ['refuse', 'Refusé']] },
  { k: 'documents_manquants', l: 'Documents manquants (précisez)', full: true, type: 'textarea' },
  { k: 'notes', l: 'Notes internes', full: true, type: 'textarea' },
];

function fieldHTML(f, val) {
  if (f.section) return `<div class="section-label">${esc(f.section)}</div>`;
  const cls = 'field' + (f.full || f.type === 'textarea' ? ' full' : '');
  let input;
  if (f.type === 'select') {
    const opts = f.opts.map((o) => {
      const [v, label] = Array.isArray(o) ? o : [o, o || '—'];
      return `<option value="${esc(v)}" ${String(val) === String(v) ? 'selected' : ''}>${esc(label)}</option>`;
    }).join('');
    input = `<select data-k="${f.k}">${opts}</select>`;
  } else if (f.type === 'textarea') {
    input = `<textarea data-k="${f.k}">${esc(val)}</textarea>`;
  } else {
    input = `<input type="${f.type || 'text'}" data-k="${f.k}" value="${esc(val)}" />`;
  }
  return `<div class="${cls}"><label>${esc(f.l)}</label>${input}</div>`;
}

let CURRENT = null;

async function openApprenti(id) {
  CURRENT = id ? await api(`/api/apprentis/${id}`) : { statut: 'en_attente' };
  $('#drawerTitle').textContent = id ? `${CURRENT.prenom} ${CURRENT.nom}` : 'Nouvel apprenti';

  const photoBlock = `
    <div class="photo-block">
      ${CURRENT.photo
        ? `<img class="photo-preview" id="photoPreview" src="/uploads/${esc(CURRENT.photo)}" alt="">`
        : `<div class="photo-preview" id="photoPreview">Photo</div>`}
      <div>
        <input type="file" id="photoInput" accept="image/*" class="hidden">
        <button class="btn ghost sm" id="photoBtn" ${id ? '' : 'disabled title="Enregistrez d’abord la fiche"'}>📷 ${CURRENT.photo ? 'Changer la photo' : 'Ajouter une photo'}</button>
        <div class="sub" style="color:var(--muted);font-size:12px;margin-top:6px">JPG, PNG ou WebP · 8 Mo max</div>
      </div>
    </div>`;

  $('#drawerBody').innerHTML = photoBlock +
    `<form id="apprentiForm" class="form-grid">${FORM.map((f) => fieldHTML(f, CURRENT[f.k] ?? '')).join('')}</form>` +
    (id ? `<div class="docs-box" id="docsBox"></div>` : '');

  $('#drawerFoot').innerHTML = `
    <div>${id ? `<button class="btn danger sm" id="deleteApprentiBtn">Supprimer</button>` : ''}</div>
    <div style="display:flex;gap:10px">
      <button class="btn ghost" id="cancelApprentiBtn">Annuler</button>
      <button class="btn" id="saveApprentiBtn">${id ? 'Enregistrer' : 'Créer la fiche'}</button>
    </div>`;

  $('#cancelApprentiBtn').addEventListener('click', closeDrawer);
  $('#saveApprentiBtn').addEventListener('click', () => saveApprenti(id));
  if (id) {
    $('#deleteApprentiBtn').addEventListener('click', () => deleteApprenti(id));
    $('#photoBtn').addEventListener('click', () => $('#photoInput').click());
    $('#photoInput').addEventListener('change', (e) => uploadPhoto(id, e.target.files[0]));
    refreshDocs(id);
  }
  openDrawer();
}

function collectForm() {
  const data = {};
  $$('#apprentiForm [data-k]').forEach((el) => (data[el.dataset.k] = el.value));
  return data;
}

async function saveApprenti(id) {
  const data = collectForm();
  if (!data.nom || !data.prenom || !data.societe) {
    return toast('Nom, prénom et société sont requis', true);
  }
  try {
    if (id) {
      await api(`/api/apprentis/${id}`, { method: 'PUT', body: JSON.stringify(data) });
      toast('Fiche enregistrée');
      refreshDocs(id);
      const a = await api(`/api/apprentis/${id}`);
      $('#drawerTitle').textContent = `${a.prenom} ${a.nom}`;
    } else {
      const a = await api('/api/apprentis', { method: 'POST', body: JSON.stringify(data) });
      toast('Apprenti créé — vous pouvez maintenant ajouter la photo');
      openApprenti(a.id); // rouvre en mode édition (active photo + documents)
    }
    loadApprentis(); loadStats();
  } catch (err) { toast(err.message, true); }
}

async function deleteApprenti(id) {
  if (!confirm('Supprimer définitivement cette fiche apprenti ?')) return;
  await api(`/api/apprentis/${id}`, { method: 'DELETE' });
  toast('Fiche supprimée');
  closeDrawer(); loadApprentis(); loadStats();
}

async function uploadPhoto(id, file) {
  if (!file) return;
  const fd = new FormData();
  fd.append('photo', file);
  try {
    const r = await api(`/api/apprentis/${id}/photo`, { method: 'POST', body: fd });
    const prev = $('#photoPreview');
    prev.outerHTML = `<img class="photo-preview" id="photoPreview" src="/uploads/${r.photo}?t=${Date.now()}" alt="">`;
    $('#photoBtn').textContent = '📷 Changer la photo';
    toast('Photo enregistrée');
    loadApprentis();
  } catch (err) { toast(err.message, true); }
}

// ---------------------------------------------------------------------------
//  Génération des documents (CERFA + convention)
// ---------------------------------------------------------------------------
async function refreshDocs(id) {
  const box = $('#docsBox');
  if (!box) return;
  const check = await api(`/api/documents/${id}/check`);
  if (check.ready) {
    box.innerHTML = `
      <h4>📄 Documents à générer</h4>
      <p class="sub" style="color:var(--muted);font-size:13px">Toutes les informations obligatoires sont renseignées.</p>
      <div class="doc-actions">
        <a class="btn ok" href="/api/documents/${id}/cerfa.pdf" target="_blank">Générer le CERFA d’apprentissage</a>
        <a class="btn" href="/api/documents/${id}/convention.pdf" target="_blank">Générer la convention de formation</a>
      </div>`;
  } else {
    box.innerHTML = `
      <h4>📄 Documents à générer</h4>
      <p class="doc-missing">Complétez ces champs pour débloquer la génération :</p>
      <ul class="doc-missing" style="margin:4px 0 0 18px">${check.missing.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
      <div class="doc-actions"><button class="btn ghost" disabled>CERFA</button><button class="btn ghost" disabled>Convention</button></div>`;
  }
}

// ---------------------------------------------------------------------------
//  Collaborateurs (admin)
// ---------------------------------------------------------------------------
async function loadUsers() {
  const users = await api('/api/auth/users');
  $('#usersTable').innerHTML = `
    <table>
      <thead><tr><th>Collaborateur</th><th>E-mail</th><th>Rôle</th><th>Accès</th><th>Dernière connexion</th><th></th></tr></thead>
      <tbody>${users.map(userRow).join('')}</tbody>
    </table>`;
  $$('#usersTable [data-toggle]').forEach((b) =>
    b.addEventListener('click', () => toggleAccess(Number(b.dataset.toggle), b.dataset.active === '1' ? 0 : 1)));
  $$('#usersTable [data-pwd]').forEach((b) =>
    b.addEventListener('click', () => resetPassword(Number(b.dataset.pwd))));
  $$('#usersTable [data-del]').forEach((b) =>
    b.addEventListener('click', () => deleteUser(Number(b.dataset.del))));
}

function userRow(u) {
  const isAdmin = u.role === 'admin';
  const access = u.active
    ? `<span class="badge accepte">Actif</span>`
    : `<span class="badge refuse">Désactivé</span>`;
  const actions = isAdmin ? '<em style="color:var(--muted);font-size:12px">—</em>' : `
    <button class="btn ${u.active ? 'ghost' : 'ok'} sm" data-toggle="${u.id}" data-active="${u.active}">
      ${u.active ? 'Retirer l’accès' : 'Réactiver'}</button>
    <button class="btn ghost sm" data-pwd="${u.id}">Mot de passe</button>
    <button class="btn danger sm" data-del="${u.id}">Suppr.</button>`;
  return `<tr>
    <td><b>${esc(u.nom || '—')}</b></td>
    <td>${esc(u.email)}</td>
    <td>${isAdmin ? 'Administrateur' : 'Collaborateur'}</td>
    <td>${access}</td>
    <td>${u.last_login ? esc(u.last_login) : '<span style="color:var(--muted)">jamais</span>'}</td>
    <td style="text-align:right;white-space:nowrap">${actions}</td>
  </tr>`;
}

async function toggleAccess(id, active) {
  await api(`/api/auth/users/${id}/access`, { method: 'PATCH', body: JSON.stringify({ active }) });
  toast(active ? 'Accès réactivé' : 'Accès retiré — le collaborateur est déconnecté');
  loadUsers();
}
async function resetPassword(id) {
  const pwd = prompt('Nouveau mot de passe (6 caractères minimum) :');
  if (!pwd) return;
  try {
    await api(`/api/auth/users/${id}/password`, { method: 'PATCH', body: JSON.stringify({ password: pwd }) });
    toast('Mot de passe réinitialisé');
  } catch (err) { toast(err.message, true); }
}
async function deleteUser(id) {
  if (!confirm('Supprimer ce collaborateur ?')) return;
  await api(`/api/auth/users/${id}`, { method: 'DELETE' });
  toast('Collaborateur supprimé');
  loadUsers();
}

// Drawer d'invitation
const overlay2 = $('#overlay2'), drawer2 = $('#drawer2');
$('#newUserBtn').addEventListener('click', () => {
  $('#drawer2Body').innerHTML = `
    <form id="userForm" class="form-grid">
      <div class="field full"><label>Nom du collaborateur</label><input data-k="nom" /></div>
      <div class="field full"><label>Adresse e-mail *</label><input type="email" data-k="email" required /></div>
      <div class="field full"><label>Mot de passe provisoire * (6 car. min)</label><input data-k="password" required /></div>
      <p class="sub full" style="color:var(--muted);font-size:13px">Transmettez ces identifiants au collaborateur. Vous pourrez retirer son accès à tout moment.</p>
    </form>`;
  $('#drawer2Foot').innerHTML = `
    <div></div>
    <div style="display:flex;gap:10px">
      <button class="btn ghost" id="cancelUserBtn">Annuler</button>
      <button class="btn" id="saveUserBtn">Créer l’accès</button>
    </div>`;
  $('#cancelUserBtn').addEventListener('click', closeDrawer2);
  $('#saveUserBtn').addEventListener('click', saveUser);
  overlay2.classList.add('open'); drawer2.classList.add('open');
});
function closeDrawer2() { overlay2.classList.remove('open'); drawer2.classList.remove('open'); }
$('#drawer2Close').addEventListener('click', closeDrawer2);
overlay2.addEventListener('click', closeDrawer2);

async function saveUser() {
  const data = {};
  $$('#userForm [data-k]').forEach((el) => (data[el.dataset.k] = el.value));
  try {
    await api('/api/auth/users', { method: 'POST', body: JSON.stringify(data) });
    toast('Accès créé');
    closeDrawer2(); loadUsers();
  } catch (err) { toast(err.message, true); }
}

// ---------------------------------------------------------------------------
//  Paramètres du centre
// ---------------------------------------------------------------------------
const SETTINGS_FIELDS = [
  { k: 'org_nom', l: 'Nom du centre de formation', full: true },
  { k: 'org_representant', l: 'Représentant / responsable' },
  { k: 'org_siret', l: 'SIRET' },
  { k: 'org_nda', l: 'N° de déclaration d’activité' },
  { k: 'org_telephone', l: 'Téléphone' },
  { k: 'org_email', l: 'E-mail' },
  { k: 'org_adresse', l: 'Adresse', full: true },
  { k: 'org_cp', l: 'Code postal' },
  { k: 'org_ville', l: 'Ville' },
];
async function loadSettings() {
  const s = await api('/api/settings');
  $('#settingsForm').innerHTML = SETTINGS_FIELDS.map((f) =>
    `<div class="field ${f.full ? 'full' : ''}"><label>${esc(f.l)}</label><input data-k="${f.k}" value="${esc(s[f.k] || '')}" /></div>`
  ).join('');
}
$('#saveSettingsBtn').addEventListener('click', async () => {
  const data = {};
  $$('#settingsForm [data-k]').forEach((el) => (data[el.dataset.k] = el.value));
  await api('/api/settings', { method: 'PUT', body: JSON.stringify(data) });
  toast('Paramètres enregistrés');
});

// ---------------------------------------------------------------------------
//  Démarrage
// ---------------------------------------------------------------------------
(async function init() {
  try {
    ME = await api('/api/auth/me');
    showApp();
    switchView('apprentis');
  } catch {
    showAuth();
  }
})();
