'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');
const db = require('./db');
const { requireAuth } = require('./auth');

const router = express.Router();

// Les photos sont stockées sous data/uploads pour être couvertes par le
// disque persistant en production (un seul volume monté sur data/).
const UPLOAD_DIR = path.join(__dirname, '..', 'data', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    const name = crypto.randomBytes(12).toString('hex') + ext;
    cb(null, name);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 Mo
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Format image non supporté (jpg, png, webp, gif)'));
  },
});

// Champs autorisés en écriture
const FIELDS = [
  'nom', 'prenom', 'date_naissance', 'sexe', 'nationalite', 'adresse',
  'code_postal', 'ville', 'telephone', 'email',
  'societe', 'societe_siret', 'societe_adresse', 'societe_cp', 'societe_ville',
  'societe_representant', 'societe_effectif', 'societe_naf',
  'formation', 'formation_diplome', 'formation_niveau', 'formation_rncp',
  'date_debut', 'date_fin', 'date_debut_formation', 'date_fin_formation',
  'duree_heures', 'rythme', 'remuneration', 'cout_formation',
  'statut', 'documents_manquants', 'notes',
];

const STATUTS = ['en_attente', 'accepte', 'refuse', 'documents_manquants'];

function sanitize(body) {
  const out = {};
  for (const f of FIELDS) {
    if (body[f] !== undefined) out[f] = String(body[f]);
  }
  if (out.statut && !STATUTS.includes(out.statut)) out.statut = 'en_attente';
  return out;
}

// Liste + recherche/filtre
router.get('/', requireAuth, (req, res) => {
  const q = String(req.query.q || '').trim();
  const statut = String(req.query.statut || '').trim();
  let sql = 'SELECT * FROM apprentis WHERE 1=1';
  const params = [];
  if (q) {
    sql += ' AND (nom LIKE ? OR prenom LIKE ? OR societe LIKE ? OR formation LIKE ?)';
    const like = `%${q}%`;
    params.push(like, like, like, like);
  }
  if (statut && STATUTS.includes(statut)) {
    sql += ' AND statut = ?';
    params.push(statut);
  }
  sql += ' ORDER BY updated_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/stats', requireAuth, (req, res) => {
  const rows = db
    .prepare('SELECT statut, COUNT(*) AS n FROM apprentis GROUP BY statut')
    .all();
  const stats = { total: 0, en_attente: 0, accepte: 0, refuse: 0, documents_manquants: 0 };
  for (const r of rows) {
    stats[r.statut] = r.n;
    stats.total += r.n;
  }
  res.json(stats);
});

router.get('/:id', requireAuth, (req, res) => {
  const row = db.prepare('SELECT * FROM apprentis WHERE id = ?').get(Number(req.params.id));
  if (!row) return res.status(404).json({ error: 'Introuvable' });
  res.json(row);
});

router.post('/', requireAuth, (req, res) => {
  const data = sanitize(req.body);
  if (!data.nom || !data.prenom) {
    return res.status(400).json({ error: 'Nom et prénom requis' });
  }
  const cols = Object.keys(data);
  const info = db
    .prepare(
      `INSERT INTO apprentis (${cols.concat('created_by').join(',')})
       VALUES (${cols.map(() => '?').concat('?').join(',')})`
    )
    .run(...cols.map((c) => data[c]), req.user.id);
  res.status(201).json(db.prepare('SELECT * FROM apprentis WHERE id = ?').get(info.lastInsertRowid));
});

router.put('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT id FROM apprentis WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Introuvable' });
  const data = sanitize(req.body);
  const cols = Object.keys(data);
  if (cols.length) {
    db.prepare(
      `UPDATE apprentis SET ${cols.map((c) => `${c} = ?`).join(', ')}, updated_at = datetime('now') WHERE id = ?`
    ).run(...cols.map((c) => data[c]), id);
  }
  res.json(db.prepare('SELECT * FROM apprentis WHERE id = ?').get(id));
});

// Upload / remplacement de la photo
router.post('/:id/photo', requireAuth, upload.single('photo'), (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT id, photo FROM apprentis WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Introuvable' });
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier' });
  // Supprime l'ancienne photo
  if (row.photo) {
    const old = path.join(UPLOAD_DIR, row.photo);
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }
  db.prepare('UPDATE apprentis SET photo = ?, updated_at = datetime(\'now\') WHERE id = ?').run(
    req.file.filename,
    id
  );
  res.json({ photo: req.file.filename });
});

router.delete('/:id', requireAuth, (req, res) => {
  const id = Number(req.params.id);
  const row = db.prepare('SELECT photo FROM apprentis WHERE id = ?').get(id);
  if (!row) return res.status(404).json({ error: 'Introuvable' });
  if (row.photo) {
    const p = path.join(UPLOAD_DIR, row.photo);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  db.prepare('DELETE FROM apprentis WHERE id = ?').run(id);
  res.json({ ok: true });
});

module.exports = router;
