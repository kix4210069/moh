'use strict';

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new Database(path.join(DATA_DIR, 'crm.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  nom           TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'collaborateur', -- 'admin' | 'collaborateur'
  active        INTEGER NOT NULL DEFAULT 1,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_login    TEXT
);

CREATE TABLE IF NOT EXISTS apprentis (
  id                 INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Identité apprenti
  nom                TEXT NOT NULL DEFAULT '',
  prenom             TEXT NOT NULL DEFAULT '',
  date_naissance     TEXT DEFAULT '',
  sexe               TEXT DEFAULT '',
  nationalite        TEXT DEFAULT '',
  adresse            TEXT DEFAULT '',
  code_postal        TEXT DEFAULT '',
  ville              TEXT DEFAULT '',
  telephone          TEXT DEFAULT '',
  email              TEXT DEFAULT '',
  -- Entreprise / société d'appartenance
  societe            TEXT NOT NULL DEFAULT '',
  societe_siret      TEXT DEFAULT '',
  societe_adresse    TEXT DEFAULT '',
  societe_cp         TEXT DEFAULT '',
  societe_ville      TEXT DEFAULT '',
  societe_representant TEXT DEFAULT '',
  societe_effectif   TEXT DEFAULT '',
  societe_naf        TEXT DEFAULT '',
  -- Formation suivie
  formation          TEXT NOT NULL DEFAULT '',
  formation_diplome  TEXT DEFAULT '',
  formation_niveau   TEXT DEFAULT '',
  formation_rncp     TEXT DEFAULT '',
  date_debut         TEXT DEFAULT '',
  date_fin           TEXT DEFAULT '',
  date_debut_formation TEXT DEFAULT '',
  date_fin_formation TEXT DEFAULT '',
  duree_heures       TEXT DEFAULT '',
  rythme             TEXT DEFAULT '',
  remuneration       TEXT DEFAULT '',
  cout_formation     TEXT DEFAULT '',
  -- Suivi du dossier
  statut             TEXT NOT NULL DEFAULT 'en_attente', -- en_attente | accepte | refuse | documents_manquants
  documents_manquants TEXT DEFAULT '',
  notes              TEXT DEFAULT '',
  photo              TEXT DEFAULT '',
  -- Méta
  created_by         INTEGER,
  created_at         TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at         TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT ''
);
`);

// --- Paramètres par défaut du centre de formation (à compléter par l'admin) ---
const defaultSettings = {
  org_nom: 'Mon Centre de Formation',
  org_adresse: '',
  org_cp: '',
  org_ville: '',
  org_siret: '',
  org_nda: '', // numéro de déclaration d'activité
  org_representant: '',
  org_telephone: '',
  org_email: '',
};
const insertSetting = db.prepare(
  'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)'
);
for (const [k, v] of Object.entries(defaultSettings)) insertSetting.run(k, v);

// --- Compte admin initial ---
function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@centre.fr').toLowerCase().trim();
  const exists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (exists) return;
  const password = process.env.ADMIN_PASSWORD || 'admin1234';
  const hash = bcrypt.hashSync(password, 10);
  db.prepare(
    'INSERT INTO users (email, nom, password_hash, role, active) VALUES (?, ?, ?, ?, 1)'
  ).run(email, 'Administrateur', hash, 'admin');
  console.log('==================================================');
  console.log(' Compte administrateur créé :');
  console.log('   email    : ' + email);
  console.log('   mot de passe : ' + password);
  console.log(' (Modifiable via ADMIN_EMAIL / ADMIN_PASSWORD)');
  console.log('==================================================');
}
seedAdmin();

module.exports = db;
