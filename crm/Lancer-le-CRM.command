#!/bin/bash
# Double-cliquez sur ce fichier pour lancer le CRM (Mac / Linux).
cd "$(dirname "$0")"

clear
echo "==============================================="
echo "        CRM Formation - demarrage"
echo "==============================================="
echo

# Verifie que Node.js est installe
if ! command -v npm >/dev/null 2>&1; then
  echo "  Node.js n'est pas installe."
  echo "  1) Allez sur https://nodejs.org"
  echo "  2) Telechargez la version 'LTS' et installez-la"
  echo "  3) Relancez ce fichier"
  echo
  read -p "Appuyez sur Entree pour fermer..."
  exit 1
fi

# Installe les composants la premiere fois
if [ ! -d node_modules ]; then
  echo "  Premiere installation (1 a 2 minutes)..."
  npm install || { echo "Echec de l'installation."; read -p "Entree pour fermer..."; exit 1; }
fi

echo "  Le CRM va s'ouvrir dans votre navigateur."
echo "  Adresse : http://localhost:3000"
echo "  Connexion : admin@centre.fr  /  admin1234"
echo
echo "  >> Laissez cette fenetre OUVERTE tant que vous utilisez le CRM."
echo "  >> Pour arreter : fermez cette fenetre."
echo

# Ouvre le navigateur automatiquement apres 3s
( sleep 3; (open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null) ) &

npm start
