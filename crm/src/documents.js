'use strict';

const express = require('express');
const db = require('./db');
const { requireAuth } = require('./auth');
const { getSettings } = require('./settings');
const { buildCerfa, buildConvention } = require('./pdf');

const router = express.Router();

// Champs indispensables avant de pouvoir générer les documents
const REQUIRED = [
  ['nom', 'Nom de l’apprenti'],
  ['prenom', 'Prénom de l’apprenti'],
  ['societe', 'Société'],
  ['formation', 'Formation suivie'],
  ['date_debut', 'Date de début'],
  ['date_fin', 'Date de fin'],
];

function missingFields(a) {
  return REQUIRED.filter(([k]) => !String(a[k] || '').trim()).map(([, label]) => label);
}

// Indique si le dossier est prêt (utilisé par le front pour activer les boutons)
router.get('/:id/check', requireAuth, (req, res) => {
  const a = db.prepare('SELECT * FROM apprentis WHERE id = ?').get(Number(req.params.id));
  if (!a) return res.status(404).json({ error: 'Introuvable' });
  const missing = missingFields(a);
  res.json({ ready: missing.length === 0, missing });
});

function slug(a) {
  return `${a.nom}_${a.prenom}`.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') || 'apprenti';
}

router.get('/:id/cerfa.pdf', requireAuth, (req, res) => {
  const a = db.prepare('SELECT * FROM apprentis WHERE id = ?').get(Number(req.params.id));
  if (!a) return res.status(404).json({ error: 'Introuvable' });
  const missing = missingFields(a);
  if (missing.length) {
    return res.status(422).json({ error: 'Informations manquantes', missing });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="CERFA-apprentissage-${slug(a)}.pdf"`);
  buildCerfa(res, { apprenti: a, org: getSettings() });
});

router.get('/:id/convention.pdf', requireAuth, (req, res) => {
  const a = db.prepare('SELECT * FROM apprentis WHERE id = ?').get(Number(req.params.id));
  if (!a) return res.status(404).json({ error: 'Introuvable' });
  const missing = missingFields(a);
  if (missing.length) {
    return res.status(422).json({ error: 'Informations manquantes', missing });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="Convention-formation-${slug(a)}.pdf"`);
  buildConvention(res, { apprenti: a, org: getSettings() });
});

module.exports = router;
