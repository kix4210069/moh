'use strict';

const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const { router: authRouter, requireAuth } = require('./src/auth');
const apprentisRouter = require('./src/apprentis');
const documentsRouter = require('./src/documents');
const { router: settingsRouter } = require('./src/settings');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Outil interne privé : on demande aux moteurs de recherche de ne jamais
// l'indexer, quelle que soit l'URL sur laquelle il est déployé.
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  next();
});

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: new SQLiteStore({ db: 'sessions.db', dir: path.join(__dirname, 'data') }),
    secret: process.env.SESSION_SECRET || 'change-me-en-production-crm-formation',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 12, // 12 h
    },
  })
);

// API
app.use('/api/auth', authRouter);
app.use('/api/apprentis', apprentisRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/settings', settingsRouter);

// Photos (protégées par authentification)
app.use('/uploads', requireAuth, express.static(path.join(__dirname, 'data', 'uploads')));

// Front statique
app.use(express.static(path.join(__dirname, 'public')));

// Gestion d'erreurs (multer, etc.)
app.use((err, req, res, next) => {
  if (err) return res.status(400).json({ error: err.message || 'Erreur' });
  next();
});

app.listen(PORT, () => {
  console.log(`CRM Formation démarré sur http://localhost:${PORT}`);
});
