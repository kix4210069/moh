# 📄 Générer le CERFA + la convention dans Wix (code Velo prêt à coller)

Ce guide ajoute une page **« Documents »** à votre site Wix « monsite » : vous
choisissez un apprenti dans une liste, et vous générez le **CERFA d'apprentissage**
ou la **convention de formation** en PDF (via l'impression du navigateur), à partir
des données déjà saisies dans la collection **Apprentis**.

> Aucune connaissance en code requise : vous **copiez-collez** les blocs ci-dessous.

---

## Étape 1 — Activer le mode développeur (Velo)

Dans l'éditeur Wix : menu du haut → **Dev Mode** (ou « Velo by Wix ») → **Activer**.
Un panneau de code apparaît en bas de l'éditeur.

## Étape 2 — Créer la page et poser les éléments

1. Ajoutez une page nommée **Documents** (idéalement une page privée/membres).
2. Sur la page, ajoutez et **renommez les identifiants** (panneau Propriétés, champ « ID ») :
   - une **Liste déroulante (Dropdown)** → ID : `selectApprenti`
   - un **Bouton** « Générer le CERFA » → ID : `btnCerfa`
   - un **Bouton** « Générer la convention » → ID : `btnConvention`
   - un **élément HTML (Embed → Intégrer du code HTML)** → ID : `docFrame`
     (agrandissez-le, il affichera le document).

## Étape 3 — Coller le code de la page

Dans le panneau de code, onglet de la page **Documents**, collez ceci
(remplacez les infos du centre dans `CENTRE`) :

```javascript
import wixData from 'wix-data';

// ⬇️ Renseignez ici les informations de VOTRE centre de formation
const CENTRE = {
  nom: "Mon Centre de Formation",
  nda: "",            // n° de déclaration d'activité
  siret: "",
  representant: "",
  adresse: "",
  cp: "",
  ville: ""
};

$w.onReady(async () => {
  // Remplit la liste déroulante avec les apprentis
  const res = await wixData.query('Apprentis').ascending('nom').limit(1000).find();
  $w('#selectApprenti').options = res.items.map((a) => ({
    label: `${a.prenom || ''} ${a.nom || ''} — ${a.societe || ''}`.trim(),
    value: a._id
  }));

  $w('#btnCerfa').onClick(() => genererDocument('cerfa'));
  $w('#btnConvention').onClick(() => genererDocument('convention'));
});

async function genererDocument(type) {
  const id = $w('#selectApprenti').value;
  if (!id) { return; }
  const a = await wixData.get('Apprentis', id);
  // Envoie les données + le centre à l'aperçu HTML
  $w('#docFrame').postMessage({ type, apprenti: normalise(a), centre: CENTRE });
}

// Convertit les dates Wix en JJ/MM/AAAA et garantit des chaînes
function normalise(a) {
  const d = (v) => {
    if (!v) return '';
    const dt = new Date(v);
    if (isNaN(dt)) return String(v);
    const p = (n) => String(n).padStart(2, '0');
    return `${p(dt.getDate())}/${p(dt.getMonth() + 1)}/${dt.getFullYear()}`;
  };
  return {
    prenom: a.prenom || '', nom: a.nom || '',
    societe: a.societe || '', societeSiret: a.societeSiret || '',
    societeAdresse: a.societeAdresse || '', societeCp: a.societeCp || '',
    societeVille: a.societeVille || '', societeRepresentant: a.societeRepresentant || '',
    formation: a.formation || '', niveau: a.niveau || '', rncp: a.rncp || '',
    email: a.email || '', telephone: a.telephone || '',
    dateNaissance: d(a.dateNaissance), adresse: a.adresse || '',
    dateDebut: d(a.dateDebut), dateFin: d(a.dateFin),
    dateDebutFormation: d(a.dateDebutFormation), dateFinFormation: d(a.dateFinFormation),
    duree: a.duree != null ? String(a.duree) : '', cout: a.cout != null ? String(a.cout) : '',
    rythme: a.rythme || '', remuneration: a.remuneration || ''
  };
}
```

## Étape 4 — Coller le contenu de l'élément HTML `docFrame`

Sélectionnez l'élément HTML → **Entrez le code** → collez **tout** ce bloc
(c'est lui qui met en forme le document et fournit le bouton d'impression) :

```html
<!doctype html><html lang="fr"><head><meta charset="utf-8">
<style>
  body{font-family:system-ui,Arial,sans-serif;margin:0;background:#eef}
  .bar{position:sticky;top:0;background:#fff;border-bottom:1px solid #ccc;padding:8px;text-align:right}
  .bar button{background:#1e2e8f;color:#fff;border:0;border-radius:6px;padding:8px 14px;font-weight:600;cursor:pointer}
  .sheet{max-width:800px;margin:14px auto;background:#fff;padding:34px 40px}
  h1{color:#1e2e8f;text-align:center;font-size:19px;margin:0 0 2px}
  .ref{text-align:center;color:#667;font-size:11px;margin:0 0 18px}
  .sh{background:#1e2e8f;color:#fff;font-size:11px;text-transform:uppercase;letter-spacing:.06em;padding:4px 9px;border-radius:4px;margin:16px 0 10px}
  .row{display:grid;gap:7px;margin-bottom:7px}
  .fb{border:1px solid #b9c0d0;border-radius:4px;padding:5px 8px;min-height:34px}
  .k{font-size:8.5px;text-transform:uppercase;letter-spacing:.05em;color:#78829a}
  .v{font-weight:650;font-size:12.5px}
  p.b{font-size:12px;line-height:1.55;text-align:justify;margin:7px 0}
  .art{color:#1e2e8f;font-weight:700;font-size:12px;margin:10px 0 2px}
  .signs{display:grid;gap:12px;margin-top:22px}
  .sign{border:1px solid #b9c0d0;border-radius:5px;height:82px;padding:6px 9px}
  .sign .k{font-size:9px}
  @media print{.bar{display:none}body{background:#fff}.sheet{margin:0;max-width:none;padding:0}}
</style></head><body>
<div class="bar"><button onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button></div>
<div class="sheet" id="out"><p style="text-align:center;color:#889;margin-top:60px">Choisissez un apprenti puis cliquez sur « Générer ».</p></div>
<script>
  function fb(k,v){return '<div class="fb"><div class="k">'+k+'</div><div class="v">'+(v||'&nbsp;')+'</div></div>';}
  function row(cols){return '<div class="row" style="grid-template-columns:repeat('+cols.length+',1fr)">'+cols.join('')+'</div>';}
  function cerfa(a,c){
    return '<h1>CONTRAT D’APPRENTISSAGE</h1><p class="ref">CERFA n° 10103*13 (FA13)</p>'
    +'<div class="sh">Employeur</div>'+row([fb('Dénomination',a.societe),fb('SIRET',a.societeSiret)])
    +row([fb('Adresse',a.societeAdresse),fb('CP',a.societeCp),fb('Commune',a.societeVille)])
    +row([fb('Représentant',a.societeRepresentant)])
    +'<div class="sh">Apprenti(e)</div>'+row([fb('Nom',a.nom),fb('Prénom',a.prenom),fb('Né(e) le',a.dateNaissance)])
    +row([fb('Adresse',a.adresse),fb('Tél',a.telephone),fb('Courriel',a.email)])
    +'<div class="sh">Contrat</div>'+row([fb('Début',a.dateDebut),fb('Fin',a.dateFin),fb('Rémunération',a.remuneration)])
    +'<div class="sh">Formation</div>'+row([fb('Organisme',c.nom),fb('N° DA',c.nda)])
    +row([fb('Intitulé',a.formation),fb('Niveau',a.niveau),fb('RNCP',a.rncp)])
    +row([fb('Début form.',a.dateDebutFormation),fb('Fin form.',a.dateFinFormation),fb('Durée (h)',a.duree)])
    +'<div class="signs" style="grid-template-columns:1fr 1fr 1fr"><div class="sign"><div class="k">Employeur</div></div><div class="sign"><div class="k">Apprenti(e)</div></div><div class="sign"><div class="k">Organisme</div></div></div>';
  }
  function convention(a,c){
    var org=c.nom+', '+[c.adresse,c.cp,c.ville].filter(Boolean).join(' ')+(c.siret?', SIRET '+c.siret:'')+(c.nda?', DA n° '+c.nda:'');
    var ent=a.societe+', '+[a.societeAdresse,a.societeCp,a.societeVille].filter(Boolean).join(' ')+(a.societeRepresentant?', représentée par '+a.societeRepresentant:'');
    function art(t,b){return '<div class="art">'+t+'</div><p class="b">'+b+'</p>';}
    return '<h1>CONVENTION DE FORMATION PROFESSIONNELLE</h1><p class="ref">Art. L.6353-1 du Code du travail</p>'
    +'<p class="b"><b>Entre :</b> l’organisme '+org+' (« l’organisme »), et l’entreprise '+ent+' (« le bénéficiaire »).</p>'
    +art('Article 1 — Objet','Action de formation : « '+a.formation+' »'+(a.niveau?', niveau '+a.niveau:'')+(a.rncp?', RNCP '+a.rncp:'')+'.')
    +art('Article 2 — Bénéficiaire',a.prenom+' '+a.nom+(a.dateNaissance?', né(e) le '+a.dateNaissance:'')+'.')
    +art('Article 3 — Dates et durée','Du '+(a.dateDebutFormation||a.dateDebut||'…')+' au '+(a.dateFinFormation||a.dateFin||'…')+', durée '+(a.duree||'…')+' heures'+(a.rythme?' (rythme : '+a.rythme+')':'')+'.')
    +art('Article 4 — Dispositions financières','Frais de formation : '+(a.cout||'…')+' €, couvrant l’ensemble des frais pédagogiques.')
    +art('Article 5 — Suivi','Feuilles de présence émargées et attestation de fin de formation remise au bénéficiaire.')
    +'<div class="signs" style="grid-template-columns:1fr 1fr"><div class="sign"><div class="k">Pour l’organisme</div></div><div class="sign"><div class="k">Pour le bénéficiaire</div></div></div>';
  }
  window.onmessage = function(e){
    var d = e.data || {}; if(!d.type) return;
    var html = d.type==='cerfa' ? cerfa(d.apprenti,d.centre) : convention(d.apprenti,d.centre);
    document.getElementById('out').innerHTML = html;
  };
</script></body></html>
```

## Étape 5 — Publier et utiliser

1. Cliquez **Publier** (en haut à droite).
2. Ouvrez la page **Documents**, choisissez un apprenti, cliquez **CERFA** ou
   **Convention** → l'aperçu s'affiche → bouton **« Imprimer / Enregistrer en PDF »**.

> Astuce confidentialité : réglez la page **Documents** en **page réservée aux
> membres** (Paramètres de la page → Permissions) pour qu'elle reste privée.

---

**Besoin d'aide pour poser les éléments dans l'éditeur ?** Dites-le moi, je vous
guide écran par écran.
