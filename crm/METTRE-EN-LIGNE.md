# 🌐 Mettre le CRM en ligne sur votre propre domaine

Objectif : votre CRM **privé** (invisible au public, protégé par mot de passe)
à une adresse à vous, par ex. `https://crm-votrecentre.fr`.

Budget : **~7 $/mois** (hébergement) **+ ~12 €/an** (nom de domaine).

Le CRM est déjà réglé pour être **invisible des moteurs de recherche**
(`noindex`) : seule la page de connexion protège l'accès.

---

## Étape 1 — Acheter le nom de domaine (~5 min)

1. Allez sur **OVH** (ovh.com) ou **Gandi** (gandi.net)
2. Cherchez le nom voulu (ex : `crm-votrecentre.fr`) et achetez-le
3. C'est tout pour l'instant — on le reliera à l'étape 4

## Étape 2 — Créer l'hébergement sur Render (~10 min)

1. Allez sur **https://render.com** → **Get Started** → connectez-vous avec **GitHub**
2. Cliquez **New +** → **Blueprint**
3. Choisissez le dépôt **`kix4210069/moh`** et la branche
   **`claude/crm-formation-apprentis-nzc0yg`**
4. Render détecte le fichier `render.yaml` et propose le service **crm-formation** → **Apply**

## Étape 3 — Régler votre compte administrateur

Dans Render, sur le service `crm-formation` → onglet **Environment**, renseignez :

| Variable         | Valeur                                   |
| ---------------- | ---------------------------------------- |
| `ADMIN_EMAIL`    | votre e-mail (ex : `vous@votrecentre.fr`)|
| `ADMIN_PASSWORD` | un mot de passe solide (à vous)          |

> `SESSION_SECRET` est généré automatiquement — ne touchez à rien d'autre.

Render construit et démarre le CRM, puis vous donne une adresse de test
`https://crm-formation-xxxx.onrender.com`. Ouvrez-la : vous devez voir l'écran
de connexion. Connectez-vous avec l'e-mail et le mot de passe ci-dessus. ✅

## Étape 4 — Brancher votre nom de domaine

1. Dans Render : service `crm-formation` → **Settings** → **Custom Domains** →
   **Add Custom Domain** → tapez `crm-votrecentre.fr`
2. Render affiche un enregistrement **DNS** à copier (un « CNAME » ou une « A »)
3. Allez chez OVH/Gandi → zone **DNS** de votre domaine → ajoutez
   l'enregistrement indiqué par Render
4. Attendez quelques minutes : Render active le **HTTPS (cadenas)** tout seul

🎉 **Votre CRM est en ligne à `https://crm-votrecentre.fr`** — privé, sécurisé,
et invisible sur Google.

---

## Utilisation au quotidien

- **Vous** vous connectez avec votre e-mail admin.
- **Collaborateurs** : menu **Collaborateurs** → invitez-les (ils reçoivent
  e-mail + mot de passe). Quand quelqu'un part → **« Retirer l'accès »** :
  il ne peut plus se connecter, aussitôt.
- **Paramètres** : renseignez les infos du centre (elles remplissent les documents).
- **Apprentis** : fiches, photos, états de dossier, et génération du **CERFA** +
  de la **convention** en PDF.

## Notes

- Le plan **Starter** (~7 $/mois) garde le CRM **toujours allumé** et **conserve
  les données** (base + photos sur le disque `crm-data`). L'offre gratuite de
  Render efface les données au redémarrage : ne l'utilisez que pour un test.
- Sauvegarde : vous pouvez exporter le disque depuis Render si besoin.
- Besoin d'aide sur une étape ? Dites-moi laquelle, je vous guide en détail.
