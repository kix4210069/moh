'use strict';

const express = require('express');
const db = require('./db');
const { requireAuth, requireAdmin } = require('./auth');

const router = express.Router();

function getSettings() {
  const rows = db.prepare('SELECT key, value FROM settings').all();
  const out = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

router.get('/', requireAuth, (req, res) => {
  res.json(getSettings());
});

router.put('/', requireAuth, requireAdmin, (req, res) => {
  const allowed = [
    'org_nom', 'org_adresse', 'org_cp', 'org_ville', 'org_siret',
    'org_nda', 'org_representant', 'org_telephone', 'org_email',
  ];
  const stmt = db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  );
  for (const k of allowed) {
    if (req.body[k] !== undefined) stmt.run(k, String(req.body[k]));
  }
  res.json(getSettings());
});

module.exports = { router, getSettings };
