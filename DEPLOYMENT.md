# Déploiement BRIBECO

Ce guide décrit la procédure de déploiement de l'API (backend) et du frontend BRIBECO sur des plateformes managées (Render/Heroku pour l'API, Vercel/Netlify pour le frontend) ainsi que les variables d'environnement à définir.

---

## 1. Pré-requis

- Node.js 18+
- MongoDB Atlas (ou autre cluster MongoDB accessible depuis Internet)
- Comptes Render/Heroku et Vercel/Netlify

---

## 2. Variables d'environnement backend

Créez les variables suivantes sur votre plateforme (Render, Heroku, etc.) :

| Variable         | Description                                                             | Exemple                         |
|------------------|-------------------------------------------------------------------------|---------------------------------|
| `PORT`           | Port HTTP exposé                                                        | `10000`                         |
| `MONGO_URI`      | URI MongoDB complète                                                    | `mongodb+srv://...`             |
| `JWT_SECRET`     | Secret JWT                                                              | `super-secret`                  |
| `JWT_EXPIRES_IN` | Durée de vie du token                                                   | `7d`                            |
| `STRIPE_SECRET`  | Clé Stripe (placeholder tant que l’intégration réelle n’existe pas)     | `sk_live_...`                   |
| `CLIENT_URL`     | URL(s) autorisées par CORS (séparées par des virgules)                  | `https://bribeco.com`           |
| `SERVER_URL`     | URL publique de l’API                                                   | `https://api.bribeco.com`       |
| `SITE_URL`       | URL publique du frontend (utilisée pour SEO/sitemap)                    | `https://bribeco.com`           |
| `SENTRY_DSN`     | DSN Sentry (laisser vide pour désactiver)                               | `https://...ingest.sentry.io`   |
| `SENTRY_ENVIRONMENT` | Nom d’environnement à remonter dans Sentry                         | `production`                    |

> Grâce à `dotenv-safe`, ces variables sont validées localement: copiez `.env.example` vers `.env` puis complétez les valeurs avant de lancer `npm run dev`.

---

## 3. Déploiement backend (Render / Heroku)

1. **Build & Start scripts**  
   - Dans `backend/package.json` :  
     - `start`: `node server.js`
     - `dev`: `nodemon server.js`
2. **Créez un service Web** (Render) ou une app (Heroku) pointant vers le dossier `backend`.
3. **Commandes de build & start**  
   - Build command : `npm install`  
   - Start command : `npm start`
4. **Variables d'environnement** : renseignez la table ci-dessus.
5. **Uploads statiques** : le dossier `backend/uploads` est servi en lecture seule via `/uploads`. Montez un volume persistant si vous prévoyez d’accepter des fichiers.

---

## 4. Déploiement frontend (Vercel / Netlify)

1. Dans `frontend/.env.production`, configurez `VITE_API_URL` vers l’URL publique de l’API (ex : `https://api.bribeco.com/api`).
2. Configurez le projet Vercel/Netlify en ciblant le dossier `frontend`.
3. **Commandes**  
   - Build command : `npm run build`
   - Output directory : `dist`
4. **Variables d'environnement**  
   - `VITE_API_URL`: URL de l’API BRIBECO.  
   - `VITE_SITE_URL`: URL publique (utilisée pour les balises canoniques).  
   - `VITE_SENTRY_DSN`: DSN Sentry frontend (laisser vide pour désactiver).
5. **PWA** : le `manifest.json`, `apple-touch-icon.png` et `sw.js` sont déjà prêts pour fournir un mode hors-ligne minimal.

---

## 5. Déploiement monorepo (optionnel)

Un `package.json` racine simplifie l’installation :

```json
{
  "scripts": {
    "start": "node backend/server.js",
    "build": "cd frontend && npm install && npm run build",
    "postinstall": "npm run build"
  }
}
```

- `npm install` à la racine installe uniquement les dépendances backend.
- `npm run build` installe les dépendances frontend puis génère le bundle Vite.

Sur Render/Heroku, pointez directement vers `backend` (voir section 3) pour éviter de lancer le frontend côté serveur.

---

## 6. Tests locaux

```bash
# Backend
cd backend
cp .env.example .env          # puis éditez les valeurs
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev                   # accessible sur http://localhost:5173
```

---

## 7. Check-list finale

- [ ] Toutes les variables d’environnement sont définies sur vos plateformes.
- [ ] MongoDB Atlas autorise les IP Render/Heroku (ou utilisez un VPC/Peering).
- [ ] `frontend/.env.production` pointe vers l’API publique.
- [ ] `npm run build` (frontend) et `npm start` (backend) passent sans erreur.
- [ ] Les routes `/uploads/*` retournent bien les fichiers attendus.
- [ ] Les pages `/404`, `/500` et le service worker répondent correctement en production.

BRIBECO est maintenant prêt pour un déploiement full-stack. Bonne mise en production !

---

## 8. Observabilité, santé & sécurité

- **Sentry**  
  - Backend : renseignez `SENTRY_DSN`/`SENTRY_ENVIRONMENT` puis vérifiez qu’un événement de test remonte lors du démarrage.  
  - Frontend : ajoutez `VITE_SENTRY_DSN` sur Vercel/Netlify (le bundle lira automatiquement la variable).
- **Health check**  
  - L’API expose `GET /healthz` → `{ status, uptime, db }`. Pointez un monitor (UptimeRobot, Render Health Check, etc.) dessus.
- **HTTPS obligatoire**  
  - Utilisez les certificats managés par Render/Heroku/Vercel/Netlify et forcez la redirection HTTP → HTTPS côté plateforme.
- **Rate limiting & sécurité**  
  - Les routes publiques sont limitées (100 req / 15 min) et `/api/auth/login` possède un limiteur dédié (10 req / 10 min).  
  - Helmet est actif avec CSP report-only, CORS ne laisse passer que les URLs déclarées via `CLIENT_URL`.  
  - Les uploads restent plafonnés à 5 Mo et filtrés par MIME type, et `/uploads` refuse toute traversée de répertoire.
- **Cache-Control recommandés**  
  - Fichiers `dist/assets/*` (hashés) : `Cache-Control: public, max-age=31536000, immutable`.  
  - HTML / `index.html` : `Cache-Control: public, max-age=600`.  
  - `sw.js` & `manifest.json` : `Cache-Control: public, max-age=3600`.

---

## 9. SEO, sitemap et assets

- Générer/mettre à jour le sitemap : `SITE_URL=https://votredomaine.com SERVER_URL=https://api.votredomaine.com node scripts/generate-sitemap.js`.
- Le fichier est écrit dans `frontend/public/sitemap.xml` et référencé par `robots.txt`.
- Script d’optimisation images (optionnel) : `node scripts/optimize-images.js` (placez vos originaux dans `frontend/src/assets/raw`).

