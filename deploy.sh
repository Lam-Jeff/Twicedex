#!/bin/bash
set -e  # arrête le script si une commande échoue

SERVER="root@192.168.1.65"
REMOTE_PATH="/opt/pocketbase/pb_public"

echo "Build de l'app..."
cd client
npm run build

echo "Envoi vers le serveur..."
cd ..
rsync -avz --delete pb_public/ "$SERVER:$REMOTE_PATH/"

echo "Déploiement terminé."
