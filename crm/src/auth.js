'use strict';

const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');

const router = express.Router();

// --- Middlewares ---
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  // Vérifie à chaque requête que le compte est toujours actif
  const user = db
    .prepare('SELECT id, email, nom, role, active FROM users WHERE id = ?')
    .get(req.session.userId);
  if (!user || !user.active) {
    req.session.destroy(() => {});
    return res.status(403).json({ error: 'Accès révoqué' });
  }
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Réservé à l\'administrateur' });
  }
  next();
}

// --- Routes d'authentification ---
router.post('/login', (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const password = String(req.body.password || '');
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Identifiants incorrects' });
  }
  if (!user.active) {
    return res.status(403).json({ error: 'Ce compte a été désactivé' });
  }
  req.session.userId = user.id;
  db.prepare('UPDATE users SET last_login = datetime(\'now\') WHERE id = ?').run(user.id);
  res.json({ id: user.id, email: user.email, nom: user.nom, role: user.role });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', requireAuth, (req, res) => {
  res.json(req.user);
});

// --- Gestion des collaborateurs (admin uniquement) ---
router.get('/users', requireAuth, requireAdmin, (req, res) => {
  const users = db
    .prepare(
      'SELECT id, email, nom, role, active, created_at, last_login FROM users ORDER BY created_at DESC'
    )
    .all();
  res.json(users);
});

router.post('/users', requireAuth, requireAdmin, (req, res) => {
  const email = String(req.body.email || '').toLowerCase().trim();
  const nom = String(req.body.nom || '').trim();
  const password = String(req.body.password || '');
  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe : 6 caractères minimum' });
  }
  const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (exists) return res.status(409).json({ error: 'Cet email existe déjà' });
  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (email, nom, password_hash, role, active) VALUES (?, ?, ?, \'collaborateur\', 1)')
    .run(email, nom, hash);
  res.status(201).json({ id: info.lastInsertRowid, email, nom, role: 'collaborateur', active: 1 });
});

// Activer / désactiver un accès (le cœur du "retirer l'accès")
router.patch('/users/:id/access', requireAuth, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const active = req.body.active ? 1 : 0;
  const target = db.prepare('SELECT id, role FROM users WHERE id = ?').get(id);
  if (!target) return res.status(404).json({ error: 'Introuvable' });
  if (target.role === 'admin') {
    return res.status(400).json({ error: 'Impossible de désactiver un administrateur' });
  }
  db.prepare('UPDATE users SET active = ? WHERE id = ?').run(active, id);
  res.json({ id, active });
});

// Réinitialiser le mot de passe d'un collaborateur
router.patch('/users/:id/password', requireAuth, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const password = String(req.body.password || '');
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe : 6 caractères minimum' });
  }
  const target = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!target) return res.status(404).json({ error: 'Introuvable' });
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(
    bcrypt.hashSync(password, 10),
    id
  );
  res.json({ ok: true });
});

router.delete('/users/:id', requireAuth, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const target = db.prepare('SELECT id, role FROM users WHERE id = ?').get(id);
  if (!target) return res.status(404).json({ error: 'Introuvable' });
  if (target.role === 'admin') {
    return res.status(400).json({ error: 'Impossible de supprimer un administrateur' });
  }
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
  res.json({ ok: true });
});

module.exports = { router, requireAuth, requireAdmin };
