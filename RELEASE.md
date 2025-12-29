# BRIBECO — Plan de mise en production

## 1. Séquence de lancement

1. **Geler le code**  
   - `git checkout main && git pull`.
2. **Préparer les builds**  
   ```bash
   # Backend
   cd backend && npm install && npm run build # optionnel si tests bundlés
   npm test # quand dispo

   # Frontend
   cd ../frontend && npm install --legacy-peer-deps
   npm run build && npm run preview
   ```
3. **Générer le sitemap & optimiser les images (facultatif)**  
   ```bash
   SITE_URL=https://bribeco.com SERVER_URL=https://api.bribeco.com node scripts/generate-sitemap.js
   node scripts/optimize-images.js
   ```
4. **Déployer l’API** (Render/Heroku)  
   - Mettre à jour les variables d’environnement (cf. `DEPLOYMENT.md`).  
   - `git push render main` ou `git push heroku main`.
5. **Déployer le frontend** (Vercel/Netlify)  
   - Vérifier `VITE_API_URL`, `VITE_SITE_URL`, `VITE_SENTRY_DSN`.  
   - Lancer un nouveau build.
6. **Exécuter un smoke test**  
   - Parcourir rapidement les flux critiques (authentification, réservation, paiement simulé).
7. **Activer la supervision**  
   - Vérifier que Sentry reçoit un événement (frontend + backend).  
   - Ajouter l’endpoint `https://api.bribeco.com/healthz` dans votre service de monitoring (UptimeRobot, BetterUptime, etc.).

## 2. Pre-launch QA checklist

### Fonctionnel
- [ ] Création de compte client, login, logout.
- [ ] Demande partenaire + acceptation via dashboard admin.
- [ ] Création de réservation + paiement simulé.
- [ ] Attribution admin → partenaire, acceptation/refus partenaire, suivi du statut.
- [ ] Dashboard admin affiche les statistiques.

### UX & accessibilité
- [ ] Layout revu sur 360 px / 768 px / ≥1280 px.
- [ ] Formulaires : validations client (code postal, dates futures, champs requis).
- [ ] États loading / erreur visibles (Services, ServiceDetail, Profil, Dashboards).
- [ ] Navigation clavier possible, contrastes validés (≥ 4.5:1).

### Performance
- [ ] `npm run build && npm run preview`.
- [ ] Lighthouse Mobile ≥ 90 (onglet Performance).  
  - cibler FCP < 1.5 s, LCP < 2.5 s si possible.  
  - vérifier qu’aucune ressource bloquante ne subsiste.
- [ ] Gzip/Brotli actifs (vite-plugin-compression).

### Sécurité & ops
- [ ] CORS restreint aux domaines déclarés (`CLIENT_URL`).  
- [ ] HTTPS obligatoire sur les plateformes (redirection HTTP → HTTPS).  
- [ ] `GET /healthz` retourne `{ status: 'ok' }`.  
- [ ] Sentry reçoit un event de test (frontend + backend).  
- [ ] Webhooks Stripe documentés (signature à ajouter quand le vrai Stripe sera branché).  
- [ ] Plan de sauvegarde MongoDB (snapshots Atlas / `mongodump`) disponible.

### Déploiement
- [ ] `.env.production` contient `VITE_API_URL`, `VITE_SITE_URL`, `VITE_SENTRY_DSN`.  
- [ ] CDN/Caching configuré (assets hashés = cache long, HTML = cache court).  
- [ ] `scripts/generate-sitemap.js` rejoué après ajout de contenu.  
- [ ] Plan de rollback disponible (voir ci-dessous).

## 3. Plan de rollback

1. **Backend**
   - Conserver au moins 1 build stable (Render: « previous deployment », Heroku: `heroku releases:rollback vXXX`).  
   - Restaurer le snapshot MongoDB si une migration destructive a été réalisée.
2. **Frontend**
   - Sur Vercel/Netlify, sélectionner la release précédente et cliquer sur « Promote to Production ».
3. **Communication**
   - Prévenir l’équipe que le rollback est en cours.  
   - Ouvrir un ticket pour documenter la cause et les actions correctives.

En suivant ces étapes et la checklist ci-dessus, vous minimisez les risques lors du lancement officiel de BRIBECO. Bon déploiement !

