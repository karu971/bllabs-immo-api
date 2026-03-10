# Déployer le backend sur Railway

## 1. Créer le projet sur Railway

1. Va sur [railway.app](https://railway.app) et connecte-toi.
2. **New Project** → **Deploy from GitHub repo**.
3. Choisis le repo **bllabs-immo-api** (backend).
4. **Root Directory** : `backend` (si monorepo) ou racine si dépôt dédié.
5. Railway utilise le **Dockerfile** (défini dans `railway.toml`).

## 2. Ajouter PostgreSQL

1. Dans le projet Railway : **+ New** → **Database** → **PostgreSQL**.
2. Railway crée un service Postgres et expose **`DATABASE_URL`**.

## 3. Lier Postgres au service API

1. Clique sur le **service API** (ton backend), onglet **Variables**.
2. **+ New Variable** → **Add a variable reference**.
3. Choisis le service **PostgreSQL** → variable **`DATABASE_URL`**.

## 4. CORS (pour le frontend Vercel)

1. Toujours dans **Variables** du service API :
2. **+ New Variable** : **`CORS_ORIGIN`** = l’URL de ton frontend, ex.  
   `https://bllabs-immo.vercel.app`  
   (ou plusieurs origines séparées par des virgules, sans slash final).

## 5. JWT (obligatoire)

1. **+ New Variable** : **`JWT_SECRET`** = chaîne secrète (ex. `openssl rand -base64 32`).

## 6. Déployer

1. **Deploy** se lance automatiquement au push sur la branche suivie (souvent `main`).
2. Ou : onglet **Deployments** → **Redeploy** pour relancer un build.

## 7. Récupérer l’URL de l’API

1. Service API → onglet **Settings** → **Networking** → **Generate Domain** (si pas déjà fait).
2. Note l’URL publique, ex. `https://bllabs-immo-api-production.up.railway.app`.
3. L’API répond sous le préfixe `/api`, donc l’URL à utiliser côté frontend est :  
   `https://TON-DOMAINE.up.railway.app/api`

## 8. Configurer le frontend (Vercel)

Dans le repo frontend, édite **`src/environments/environment.prod.ts`** :

- Remplace la valeur de **`apiBase`** par ton domaine Railway (sans `/api`), ex. :  
  `https://bllabs-immo-api-production.up.railway.app`
- Commit et push : le prochain déploiement Vercel utilisera cette URL.

---

## Variables utiles (récap)

| Variable        | Où la définir      | Exemple / remarque                    |
|-----------------|--------------------|----------------------------------------|
| `DATABASE_URL`  | Référence Postgres | Référence au service PostgreSQL        |
| `CORS_ORIGIN`   | Service API        | URL du front Vercel (sans slash final) |
| `JWT_SECRET`    | Service API        | Chaîne secrète (ex. openssl rand)      |
| `PORT`          | Auto par Railway   | Pas besoin de la définir                |

## Tester que le backend fonctionne

Une fois le domaine Railway généré :

```bash
# Santé de l’API
curl https://TON-DOMAINE.up.railway.app/api/health
```

Si la réponse est OK, le backend Railway fonctionne. En cas de 502/503, consulter les **Logs** du déploiement (connexion DB, variable manquante, etc.).
