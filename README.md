# MAISON KM — Haute Horlogerie

Reproduction fidèle de la page d'accueil type **Maison Signa** pour la marque
**MAISON KM** : thème sombre, monochrome et minimaliste, typographies serif
élégantes. *« Créer l'exception. Porter la différence. »*

## Structure de la page

- Bandeau défilant « 100% AUTHENTIQUE · GARANTIE 2 ANS »
- Header : Collections · Montres · Accessoires · 🔥 Précommande / logo centré / recherche, compte, panier
- Hero plein écran (macro montre) — **MAISON KM**
- **Notre approche** — « Entre l'ordinaire et le remarquable, il n'y a qu'un poignet. »
- **Nos collections / Trouvez la vôtre** — carrousel (Signature, S-Limited, Velatura)
- **Notre sélection / Les Montres** — grille de 8 montres, bouton *Ajouter*
- Bandeau réassurance (sélection rigoureuse · livraison soignée · conseil direct)
- **Au détail près / Accessoires** — 4 coffrets horlogers
- Footer minimal + boutons flottants WhatsApp / recherche + bandeau cookies

## Technique

Site statique **sans build** : HTML + CSS + JavaScript vanilla.

```
index.html            # structure de la page
assets/css/style.css  # thème sombre monochrome + responsive
assets/js/main.js     # montres/coffrets SVG, carrousel, panier, cookies
```

Les visuels (montres à lunette octogonale, coffrets à berceaux) sont des
**placeholders SVG** générés en JavaScript, prêts à être remplacés par de
vraies photos produit.

## Lancer en local

```bash
python3 -m http.server 8000     # puis http://localhost:8000
```

## Personnalisation

- **Marque** : rechercher `MAISON KM` / `Maison KM` dans `index.html`.
- **Couleurs** : variables CSS en haut de `assets/css/style.css`.
- **Catalogue** : objets `COLLECTIONS`, `MONTRES`, `ACCESSOIRES` dans `main.js`.
- **Photos réelles** : remplacer les appels `watch(...)` / `box(...)` par des
  balises `<img>` dans `productCard()`.
