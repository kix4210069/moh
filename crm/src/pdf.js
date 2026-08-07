'use strict';

const PDFDocument = require('pdfkit');

// Palette sobre "administrative"
const INK = '#1a1a1a';
const MUTED = '#555';
const LINE = '#999';
const BOX = '#e8eef5';
const ACCENT = '#0b3d91';

function fmtDate(s) {
  if (!s) return '';
  // accepte YYYY-MM-DD
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return s;
}

function statutLabel(s) {
  return {
    en_attente: 'En attente',
    accepte: 'Accepté',
    refuse: 'Refusé',
    documents_manquants: 'Documents manquants',
  }[s] || s;
}

// --- Primitives de mise en page ---
function sectionTitle(doc, text) {
  const y = doc.y;
  doc.save();
  doc.rect(doc.page.margins.left, y, contentWidth(doc), 18).fill(ACCENT);
  doc
    .fillColor('#fff')
    .font('Helvetica-Bold')
    .fontSize(9.5)
    .text(text.toUpperCase(), doc.page.margins.left + 6, y + 5);
  doc.restore();
  doc.y = y + 24;
  doc.fillColor(INK);
}

function contentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

// Rangée de champs "label / valeur" façon formulaire
function fieldRow(doc, fields) {
  const left = doc.page.margins.left;
  const totalW = contentWidth(doc);
  const gap = 6;
  const n = fields.length;
  const w = (totalW - gap * (n - 1)) / n;
  const rowH = 30;
  let x = left;
  const y = doc.y;
  for (const f of fields) {
    doc.save();
    doc.roundedRect(x, y, w, rowH, 2).lineWidth(0.6).stroke(LINE);
    doc
      .fillColor(MUTED)
      .font('Helvetica')
      .fontSize(6.5)
      .text(f.label.toUpperCase(), x + 5, y + 4, { width: w - 10 });
    doc
      .fillColor(INK)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(f.value || '—', x + 5, y + 14, { width: w - 10, ellipsis: true, lineBreak: false });
    doc.restore();
    x += w + gap;
  }
  doc.y = y + rowH + 6;
}

function paragraph(doc, text, opts = {}) {
  doc
    .fillColor(INK)
    .font(opts.bold ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(opts.size || 9)
    .text(text, { align: opts.align || 'left', lineGap: 2 });
  doc.moveDown(opts.gap != null ? opts.gap : 0.5);
}

function ensureSpace(doc, needed) {
  const bottom = doc.page.height - doc.page.margins.bottom;
  if (doc.y + needed > bottom) doc.addPage();
}

// ============================================================
//  CERFA — Contrat d'apprentissage (modèle FA13 / n° 10103*13)
// ============================================================
function buildCerfa(res, { apprenti: a, org }) {
  const doc = new PDFDocument({ size: 'A4', margins: { top: 40, bottom: 40, left: 40, right: 40 } });
  doc.pipe(res);

  // En-tête
  doc.font('Helvetica-Bold').fontSize(14).fillColor(ACCENT)
    .text('CONTRAT D’APPRENTISSAGE', { align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor(MUTED)
    .text('Formulaire type CERFA n° 10103*13 (FA13) — Code du travail, art. L. 6222-1 et suivants', { align: 'center' });
  doc.moveDown(0.8);
  doc.fillColor(INK);

  // L'employeur
  sectionTitle(doc, 'L’employeur');
  fieldRow(doc, [
    { label: 'Dénomination', value: a.societe },
    { label: 'N° SIRET', value: a.societe_siret },
  ]);
  fieldRow(doc, [
    { label: 'Adresse', value: a.societe_adresse },
    { label: 'Code postal', value: a.societe_cp },
    { label: 'Commune', value: a.societe_ville },
  ]);
  fieldRow(doc, [
    { label: 'Représenté par', value: a.societe_representant },
    { label: 'Effectif', value: a.societe_effectif },
    { label: 'Code NAF', value: a.societe_naf },
  ]);

  // L'apprenti
  sectionTitle(doc, 'L’apprenti(e)');
  fieldRow(doc, [
    { label: 'Nom', value: a.nom },
    { label: 'Prénom', value: a.prenom },
    { label: 'Sexe', value: a.sexe },
  ]);
  fieldRow(doc, [
    { label: 'Né(e) le', value: fmtDate(a.date_naissance) },
    { label: 'Nationalité', value: a.nationalite },
    { label: 'Téléphone', value: a.telephone },
  ]);
  fieldRow(doc, [
    { label: 'Adresse', value: a.adresse },
    { label: 'Code postal', value: a.code_postal },
    { label: 'Commune', value: a.ville },
  ]);
  fieldRow(doc, [{ label: 'Courriel', value: a.email }]);

  // Le contrat
  sectionTitle(doc, 'Le contrat');
  fieldRow(doc, [
    { label: 'Date de début', value: fmtDate(a.date_debut) },
    { label: 'Date de fin', value: fmtDate(a.date_fin) },
    { label: 'Rémunération', value: a.remuneration },
  ]);

  // La formation
  sectionTitle(doc, 'La formation — CFA / organisme de formation');
  fieldRow(doc, [
    { label: 'Organisme', value: org.org_nom },
    { label: 'N° déclaration d’activité', value: org.org_nda },
  ]);
  fieldRow(doc, [
    { label: 'Adresse', value: org.org_adresse },
    { label: 'Code postal', value: org.org_cp },
    { label: 'Commune', value: org.org_ville },
  ]);
  fieldRow(doc, [
    { label: 'Diplôme / titre préparé', value: a.formation_diplome || a.formation },
    { label: 'Niveau', value: a.formation_niveau },
  ]);
  fieldRow(doc, [
    { label: 'Intitulé de la formation', value: a.formation },
    { label: 'Code RNCP', value: a.formation_rncp },
  ]);
  fieldRow(doc, [
    { label: 'Début formation', value: fmtDate(a.date_debut_formation) },
    { label: 'Fin formation', value: fmtDate(a.date_fin_formation) },
    { label: 'Durée (heures)', value: a.duree_heures },
  ]);

  // Signatures
  ensureSpace(doc, 120);
  doc.moveDown(1);
  signatureBlocks(doc, [
    'L’employeur',
    'L’apprenti(e)\n(et représentant légal si mineur)',
    'L’organisme de formation',
  ]);

  footer(doc, org, 'Contrat d’apprentissage');
  doc.end();
}

// ============================================================
//  Convention de formation professionnelle (art. L.6353-1 CT)
// ============================================================
function buildConvention(res, { apprenti: a, org }) {
  const doc = new PDFDocument({ size: 'A4', margins: { top: 40, bottom: 40, left: 40, right: 40 } });
  doc.pipe(res);

  doc.font('Helvetica-Bold').fontSize(14).fillColor(ACCENT)
    .text('CONVENTION DE FORMATION PROFESSIONNELLE', { align: 'center' });
  doc.font('Helvetica').fontSize(8).fillColor(MUTED)
    .text('(Articles L. 6353-1 et L. 6353-2 du Code du travail)', { align: 'center' });
  doc.moveDown(0.8);
  doc.fillColor(INK);

  paragraph(doc, 'Entre les soussignés :', { bold: true });
  paragraph(
    doc,
    `L’organisme de formation : ${org.org_nom || '—'}, ` +
      `${[org.org_adresse, org.org_cp, org.org_ville].filter(Boolean).join(' ') || 'adresse à compléter'}` +
      (org.org_siret ? `, SIRET ${org.org_siret}` : '') +
      (org.org_nda ? `, déclaration d’activité enregistrée sous le n° ${org.org_nda}` : '') +
      (org.org_representant ? `, représenté par ${org.org_representant}` : '') +
      '. Ci-après dénommé « l’organisme de formation ».'
  );
  paragraph(
    doc,
    `Et l’entreprise bénéficiaire : ${a.societe || '—'}, ` +
      `${[a.societe_adresse, a.societe_cp, a.societe_ville].filter(Boolean).join(' ') || 'adresse à compléter'}` +
      (a.societe_siret ? `, SIRET ${a.societe_siret}` : '') +
      (a.societe_representant ? `, représentée par ${a.societe_representant}` : '') +
      '. Ci-après dénommée « le bénéficiaire ».'
  );
  doc.moveDown(0.3);

  article(doc, 'Article 1 — Objet et nature de la formation',
    `En exécution de la présente convention, l’organisme de formation organise l’action de formation suivante : ` +
    `« ${a.formation || 'à compléter'} »` +
    (a.formation_diplome ? ` (préparation à : ${a.formation_diplome})` : '') +
    (a.formation_niveau ? `, niveau ${a.formation_niveau}` : '') +
    (a.formation_rncp ? `, fiche RNCP ${a.formation_rncp}` : '') +
    '. La formation relève de la catégorie prévue à l’article L. 6313-1 du Code du travail.');

  article(doc, 'Article 2 — Bénéficiaire de la formation',
    `La présente action bénéficie à : ${a.prenom} ${a.nom}` +
    (a.date_naissance ? `, né(e) le ${fmtDate(a.date_naissance)}` : '') +
    (a.email ? `, courriel ${a.email}` : '') + '.');

  article(doc, 'Article 3 — Dates, durée et lieu',
    `L’action se déroulera du ${fmtDate(a.date_debut_formation) || fmtDate(a.date_debut) || '…'} ` +
    `au ${fmtDate(a.date_fin_formation) || fmtDate(a.date_fin) || '…'}, ` +
    `pour une durée totale de ${a.duree_heures || '…'} heures` +
    (a.rythme ? ` (rythme : ${a.rythme})` : '') +
    `. Elle se tient dans les locaux de l’organisme de formation, sauf modalités à distance convenues entre les parties.`);

  article(doc, 'Article 4 — Dispositions financières',
    `En contrepartie de cette action, le bénéficiaire s’acquitte des frais de formation d’un montant de ` +
    `${a.cout_formation || '…'} €. ` +
    `Ce montant couvre l’ensemble des frais pédagogiques de l’action décrite à l’article 1.`);

  article(doc, 'Article 5 — Moyens pédagogiques et suivi',
    `L’organisme met en œuvre les moyens pédagogiques et techniques nécessaires. ` +
    `Le suivi de l’exécution et l’appréciation des résultats sont assurés par des feuilles de présence émargées ` +
    `et une évaluation des acquis en fin de formation, ainsi qu’une attestation de fin de formation remise au bénéficiaire.`);

  article(doc, 'Article 6 — Interruption et dédit',
    `En cas de cessation anticipée ou d’inexécution totale ou partielle du fait de l’une des parties, ` +
    `l’article L. 6354-1 du Code du travail s’applique. Les sommes correspondant à la formation effectivement dispensée restent dues.`);

  article(doc, 'Article 7 — Litiges',
    `Si une contestation ne peut être réglée à l’amiable, le tribunal compétent du siège de l’organisme de formation sera seul compétent.`);

  ensureSpace(doc, 130);
  doc.moveDown(0.5);
  paragraph(doc, `Fait à ${org.org_ville || '………'}, le ${new Date().toLocaleDateString('fr-FR')}, en deux exemplaires.`);
  doc.moveDown(0.5);
  signatureBlocks(doc, ['Pour l’organisme de formation', 'Pour l’entreprise bénéficiaire']);

  footer(doc, org, 'Convention de formation professionnelle');
  doc.end();
}

function article(doc, title, body) {
  ensureSpace(doc, 60);
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(ACCENT).text(title);
  doc.moveDown(0.15);
  doc.font('Helvetica').fontSize(9).fillColor(INK).text(body, { align: 'justify', lineGap: 1.5 });
  doc.moveDown(0.6);
}

function signatureBlocks(doc, labels) {
  const left = doc.page.margins.left;
  const totalW = contentWidth(doc);
  const gap = 12;
  const n = labels.length;
  const w = (totalW - gap * (n - 1)) / n;
  const h = 80;
  const y = doc.y;
  let x = left;
  for (const label of labels) {
    doc.roundedRect(x, y, w, h, 3).lineWidth(0.6).stroke(LINE);
    doc.font('Helvetica').fontSize(7.5).fillColor(MUTED)
      .text(label, x + 6, y + 5, { width: w - 12 });
    doc.font('Helvetica-Oblique').fontSize(6.5).fillColor('#aaa')
      .text('Signature et cachet', x + 6, y + h - 14, { width: w - 12 });
    x += w + gap;
  }
  doc.y = y + h + 8;
  doc.fillColor(INK);
}

function footer(doc, org, docName) {
  const range = doc.bufferedPageRange ? null : null;
  const y = doc.page.height - 28;
  doc.font('Helvetica').fontSize(6.5).fillColor(MUTED).text(
    `${docName} — ${org.org_nom || ''} — Document généré par le CRM Formation le ${new Date().toLocaleDateString('fr-FR')}`,
    doc.page.margins.left,
    y,
    { width: contentWidth(doc), align: 'center' }
  );
  doc.fillColor(INK);
}

module.exports = { buildCerfa, buildConvention, statutLabel, fmtDate };
