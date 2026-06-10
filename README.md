# KetShop Maillot — Page d'accueil

Reproduction statique de la page d'accueil de la boutique **KetShop Maillot**
(maillots de football, crampons, training, rétro/vintage).

## Aperçu

Page d'accueil complète et responsive, fidèle à la maquette d'origine :

- Barre d'annonce défilante (2 achetés = 3ème offert…)
- Header noir avec logo, sélecteur pays/€, recherche, compte, panier
- Hero « Maillot Collector Champions d'Europe — BACK 2 BACK »
- Carrousel « Toutes les ligues »
- Sections produits : Nos maillots du moment, Saison 2025/2026, CDM 2026,
  Concept, Kits enfants, Rétro/Vintage, Crampons, Training été
- Bannière promo avec **compte à rebours** dynamique
- Bannières mises en avant (Real Madrid, BACK 2 BACK)
- Bloc statistiques « Passionnés de foot depuis 2018 »
- Top maillots du moment
- Avis clients (4.8/5) + FAQ en accordéon
- Footer complet : newsletter, moyens de paiement, mentions légales

## Technique

Site statique **sans build** : HTML + CSS + JavaScript vanilla.

```
index.html            # structure de la page
assets/css/style.css  # styles + responsive
assets/js/main.js     # produits, carrousels, compte à rebours, menu mobile
```

Les visuels produits sont des **placeholders SVG colorés** (maillots) prêts à
être remplacés par les vraies photos.

## Lancer en local

Ouvrir simplement `index.html` dans un navigateur, ou servir le dossier :

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Personnalisation

- Couleurs et thème : variables CSS en haut de `assets/css/style.css`
- Catalogue produits : objet `data` dans `assets/js/main.js`
- Remplacer les placeholders SVG par de vraies images dans `cardHTML()`
