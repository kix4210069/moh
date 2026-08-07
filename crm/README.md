# CRM Formation — Suivi des apprentis

CRM commercial pour centre de formation : suivi des apprentis, gestion des
accès collaborateurs (avec **retrait d'accès immédiat**), et **génération
automatique du CERFA d'apprentissage et de la convention de formation**.

## Fonctionnalités

- **Lien partageable + gestion des accès** : chaque collaborateur a son propre
  compte. En tant qu'administrateur, vous invitez un collaborateur et pouvez
  **retirer son accès en un clic** — sa session est coupée immédiatement et il
  ne peut plus se reconnecter (idéal quand quelqu'un quitte l'entreprise).
- **Fiche apprenti** : nom, prénom, société d'appartenance, formation suivie,
  et **état du dossier** (Accepté / Refusé / Documents manquants / En attente).
- **Photo de l'apprenti** : inscription avec upload de la photo (JPG/PNG/WebP).
- **Génération de documents** : dès que toutes les informations obligatoires
  sont saisies, l'outil génère en PDF :
  - le **CERFA d'apprentissage** (modèle FA13 / n° 10103\*13) ;
  - la **convention de formation professionnelle** (art. L. 6353-1 du Code du travail).
- **Tableau de bord** : compteurs par état de dossier, recherche et filtres.

## Démarrage en local

```bash
cd crm
npm install
npm start
# → http://localhost:3000
```

Au premier lancement, un compte administrateur est créé et affiché dans la
console. Par défaut : **admin@centre.fr / admin1234** (à changer, voir ci-dessous).

## Configuration (variables d'environnement)

| Variable         | Rôle                                   | Défaut                       |
| ---------------- | -------------------------------------- | ---------------------------- |
| `PORT`           | Port d'écoute                          | `3000`                       |
| `ADMIN_EMAIL`    | E-mail du compte admin initial         | `admin@centre.fr`            |
| `ADMIN_PASSWORD` | Mot de passe du compte admin initial   | `admin1234`                  |
| `SESSION_SECRET` | Clé de signature des sessions          | (valeur par défaut à changer)|
| `NODE_ENV`       | Mettre `production` derrière HTTPS      | —                            |

> ⚠️ En production, définissez impérativement `ADMIN_PASSWORD` et
> `SESSION_SECRET`, et servez le site en HTTPS (`NODE_ENV=production`).

## Déploiement (obtenir un lien partageable)

L'application est un simple serveur Node + SQLite, déployable sur n'importe quel
hébergeur Node. La base et les photos sont stockées sur disque (`data/`,
`uploads/`) — choisissez un hébergeur avec **disque persistant**.

**Exemple — Render.com (offre gratuite) :**
1. Poussez ce dossier sur un dépôt Git.
2. Créez un « Web Service », racine = `crm/`.
3. Build : `npm install` · Start : `npm start`.
4. Variables d'env : `ADMIN_PASSWORD`, `SESSION_SECRET`, `NODE_ENV=production`.
5. Ajoutez un **Persistent Disk** monté sur `crm/data` et `crm/uploads`.
6. Render vous fournit une URL `https://…` : c'est le lien à partager.

D'autres options équivalentes : Railway, Fly.io, un VPS avec `pm2`, etc.

## Utilisation

1. **Paramètres** (admin) : renseignez les informations du centre (nom, SIRET,
   n° de déclaration d'activité, adresse…). Elles alimentent les documents.
2. **Collaborateurs** (admin) : invitez vos collaborateurs, retirez l'accès
   quand ils partent.
3. **Apprentis** : créez une fiche, ajoutez la photo, renseignez société,
   formation et état du dossier.
4. **Documents** : une fois la fiche complète, cliquez sur « Générer le CERFA »
   ou « Générer la convention ».

## Documents générés — précision

Les PDF reprennent fidèlement les rubriques du CERFA FA13 et d'une convention de
formation type, pré-remplis avec vos données. Ils constituent un support de
travail : reportez-vous au portail officiel (`Cerfa`/OPCO) pour le dépôt légal.

## Architecture

```
crm/
├── server.js            # serveur Express (API + front + sessions)
├── src/
│   ├── db.js            # SQLite, schéma, seed admin
│   ├── auth.js          # connexion, comptes, retrait d'accès
│   ├── apprentis.js     # CRUD apprentis + upload photo
│   ├── settings.js      # paramètres du centre
│   ├── documents.js     # contrôle + endpoints PDF
│   └── pdf.js           # génération CERFA + convention (pdfkit)
└── public/              # interface (HTML/CSS/JS, sans build)
```

Stack : Node.js, Express, better-sqlite3, express-session, multer, pdfkit.
Aucune étape de build, aucune dépendance externe à un service tiers.
