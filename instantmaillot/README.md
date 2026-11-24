# Instant Maillot — reproduction statique

Reproduction de la page d'accueil de **instantmaillot.fr** (design, mise en page,
couleurs, typos, espacements et interactions), responsive mobile + desktop.
Site **sans build** : HTML + CSS + JavaScript vanilla.

## Lancer

```bash
cd instantmaillot
python3 -m http.server 8000
# puis http://localhost:8000
```

## Pages

| Fichier | Rôle |
|---|---|
| `index.html` | Accueil (vidéos clients, vestes, catégories, best sellers, Back 2 Back, suivi atelier, nouveautés, championnats, concept, manches longues) |
| `collection.html?c=…` / `?q=…` | Collections (filtres + tri) et résultats de recherche |
| `product.html?id=…` | Fiche produit (taille, flocage offert, quantité) |
| `page.html?p=…` | FAQ, suivi de colis, compte, contact, guides des tailles, pack mystère, paiement, politiques |

## Fonctionnel

- Header sticky, méga-menu « Collections », menu « Aide », menu mobile
- Recherche instantanée (modale) sur tout le catalogue
- Tiroir « Offre découverte » (2 ou 4 maillots, taille, sélection)
- Quick-view « + » sur chaque carte (taille obligatoire, flocage)
- Panier (localStorage) avec **3ᵉ maillot offert** calculé automatiquement
- Carrousel vidéo en coverflow, sélecteur de coloris des vestes,
  onglets Concept / Pink / Black Edition, carrousels avec barre de progression
- Bannière cookies, popup « maillot gratuit » (après 25 s), barre flottante

## Structure

```
assets/css/style.css   # thème (variables en haut du fichier) + responsive
assets/js/data.js      # catalogue (81 produits) et sections de l'accueil
assets/js/layout.js    # header, footer, panier, recherche, quick-view, overlays
assets/js/home.js      # scripts de l'accueil
assets/js/pages.js     # collections, fiche produit, pages de contenu
assets/img|products|video
```

Paiement, suivi de colis et connexion sont des **démos** côté navigateur :
à brancher sur un vrai back-office (Shopify, etc.). Les textes de politiques
sont indicatifs. Les images et les vidéos viennent du site d'origine : vérifiez
que vous avez le droit de les réutiliser.
