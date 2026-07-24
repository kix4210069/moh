# MAISON KM — L'Excellence Horlogère

Vitrine d'accueil pour **MAISON KM**, maison d'horlogerie de luxe française
(chronographes, tourbillons, éditions limitées). Design inspiré des codes de la
haute horlogerie : noir profond, or, ivoire et typographies serif élégantes.

## Aperçu

Page d'accueil complète et responsive :

- Barre d'annonce défilante (livraison offerte, paiement sécurisé, éditions limitées)
- Header sombre : navigation, logo MAISON KM, recherche, compte, panier
- Hero « L'Excellence Horlogère » avec appels à l'action
- Bandeau de valeurs (assemblage main, édition limitée, garantie, écrin offert)
- Collections **S-Limited** et **Signature**
- Grilles de montres (cadrans SVG paramétrables), badges et notes
- Bannière « Limitée à 300 pièces » avec **compte à rebours** dynamique
- Section **Savoir-faire** en 4 étapes
- Bloc statistiques, avis clients (4.8/5) et FAQ en accordéon
- Newsletter « Cercle Maison KM »
- Footer complet + **panier latéral (drawer)** fonctionnel (localStorage)

## Technique

Site statique **sans build** : HTML + CSS + JavaScript vanilla.

```
index.html            # structure de la page
assets/css/style.css  # styles + responsive (thème horlogerie de luxe)
assets/js/main.js      # catalogue, montres SVG, panier, compte à rebours, FAQ
```

Les visuels des montres sont des **placeholders SVG** (cadran, index, aiguilles,
sous-cadrans) générés en JavaScript et prêts à être remplacés par de vraies
photos produit.

## Lancer en local

```bash
python3 -m http.server 8000
# puis http://localhost:8000
```

## Personnalisation

- **Nom de marque** : rechercher `MAISON KM` / `Maison KM` dans `index.html`
  (logo header, footer, titres) pour l'adapter.
- **Couleurs & thème** : variables CSS en haut de `assets/css/style.css`
  (`--gold`, `--ink`, `--cream`…).
- **Catalogue** : objet `CATALOG` dans `assets/js/main.js` (nom, référence,
  prix, couleur du cadran, note).
- **Photos réelles** : remplacer l'appel `watch(...)` dans `cardHTML()` par une
  balise `<img>` pointant vers vos visuels.
