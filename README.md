# 🖥️ Système Réparti – Projet DevOps / Application Web Distribuée

[![Licence](https://img.shields.io/badge/licence-MIT-green)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)]()
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Ready-blue)]()
[![Jenkins](https://img.shields.io/badge/Jenkins-Pipeline-orange)]()

---

## 📌 Description

**Système Réparti** est un projet pédagogique et professionnel visant à construire une **application web distribuée complète**, incluant :

* **Frontend** moderne avec React
* **Backend API REST** avec Flask et SQLAlchemy
* **Base de données PostgreSQL**
* **Déploiement conteneurisé** via Docker et Docker Compose
* **Déploiement orchestré** via Kubernetes
* **Automatisation et CI/CD** avec Ansible et Jenkins

L’objectif est de créer un workflow **DevOps complet** : de la conception locale au déploiement sur cluster.

---

## 📚 Objectifs pédagogiques

* Comprendre l’architecture microservices
* Maîtriser Docker, Docker Compose et Kubernetes
* Configurer un pipeline CI/CD avec Jenkins
* Automatiser l’installation d’infrastructures avec Ansible
* Développer des applications web robustes et sécurisées

---

## 🏗️ Structure du projet

```

systeme-reparti/
│
├── frontend/          # Code React (Vite, Tailwind, JWT)
├── backend/           # Code Flask (API REST, SQLAlchemy, JWT)
├── k8s/               # Manifests Kubernetes
├── ansible/           # Playbooks pour provisionnement
├── jenkins/           # Jenkinsfile et scripts pipeline
├── docker-compose.yml # Lancement local multi-services
└── README.md          # Documentation

````

---

## ⚡ Phase actuelle : PHASE 4 – Kubernetes

Nous avons terminé :

1. **Conception et architecture** (Phase 1)
2. **Développement local** (Phase 2)
3. **Dockerisation** (Phase 3)
4. **Déploiement sur Minikube et cluster Kubernetes**

---

## 🧩 Détails techniques

### 🔹 Backend

* **Flask** + SQLAlchemy
* JWT pour authentification
* Modèles principaux : `User`, `Room`, `Booking`, `Review`
* Routes principales :

  * `POST /api/auth/register` → Inscription
  * `POST /api/auth/login` → Connexion
  * `GET /api/ping` → Test API

### 🔹 Frontend

* **React 20 / Vite**
* Pages : Login, Register, Dashboard
* Gestion JWT côté client avec Axios et interceptors
* Animations avec Framer Motion

### 🔹 Base de données

* **PostgreSQL 15**
* Persistante avec **PersistentVolumeClaim** sur Kubernetes
* Connexion sécurisée via variable `DATABASE_URL`
* Commandes utiles PostgreSQL :

```bash
# Connexion à la DB
psql postgresql://postgres:postgres@postgres:5432/systeme_reparti

# Lister les tables
\dt

# Exécuter les migrations Flask
flask db upgrade
````

---

## 🐳 Docker & Docker Compose

**Lancer tous les services en local** :

```bash
docker-compose up --build
```

* Backend → [http://localhost:5001](http://localhost:5001)
* Frontend → [http://localhost:5173](http://localhost:5173)

**Volumes** : `postgres_data` pour la persistance des données PostgreSQL.

---

## ☸️ Kubernetes (Phase 4)

**Manifests inclus :**

* `backend-deployment.yaml`
* `frontend-deployment.yaml`
* `postgres-deployment.yaml`
* `backend-service.yaml`
* `frontend-service.yaml`
* `postgres-service.yaml`
* `pvc.yaml`

**Commandes utiles :**

```bash
# Appliquer tous les manifests
kubectl apply -f k8s/

# Vérifier les pods
kubectl get pods

# Vérifier les services
kubectl get svc

# Redémarrer un déploiement
kubectl rollout restart deployment backend

# Connexion à un pod pour debug
kubectl exec -it deployment/backend -- bash
```

**NodePorts par défaut (Minikube) :**

* Frontend → `http://192.168.49.2:30007`
* Backend → `http://192.168.49.2:30001/api`

---

## 🤖 Ansible (Phase 5 ✅)

Le playbook `site.yml` permet :

* Installation Docker
* Installation kubectl
* Installation Minikube
* Lancement Jenkins en container Docker
* Déploiement Kubernetes automatique

Exécution :

```bash
cd ansible
ansible-playbook -i inventory.ini site.yml --ask-become-pass
```

---

# 🔧 Jenkins (Dockerisé)

Jenkins est exécuté via Docker :

```bash
docker run -d -p 8080:8080 --name jenkins jenkins/jenkins:lts
```

Accès :

```
http://localhost:8080
```

Mot de passe initial :

```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

Pourquoi Docker ?

* Portable
* Version contrôlée
* Pas de problème GPG
* Standard DevOps moderne

---

## 🔄 CI/CD avec Jenkins (Phase 6)

La Phase 6 met en place une **chaîne d’intégration et de déploiement continu (CI/CD)** automatisée avec **Jenkins**.

L’objectif est d’automatiser :

* L’analyse du code
* Les tests
* La construction des images Docker
* Le push vers **Docker Hub**
* Le déploiement automatique sur le cluster **Kubernetes**

---

## 🏗️ Architecture du Pipeline

```
GitHub → Jenkins → Docker Build → Docker Hub → Kubernetes
```

À chaque `git push`, Jenkins :

1. Clone le repository
2. Exécute les tests et vérifications
3. Construit les images Docker
4. Push les images sur Docker Hub
5. Déploie automatiquement sur le cluster Minikube

---

# ⚙️ Jenkins Dockerisé

Jenkins est exécuté dans un conteneur Docker :

```bash
docker run -d \
  -p 8080:8080 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --name jenkins \
  jenkins/jenkins:lts
```

Accès :

```
http://localhost:8080
```

Le montage `/var/run/docker.sock` permet à Jenkins de lancer des builds Docker directement sur la machine hôte.

---

# 📄 Jenkinsfile (Pipeline Declarative)

Le pipeline est défini dans un fichier `Jenkinsfile` à la racine du projet :

---

# 🔍 Détail des Étapes

## 1️⃣ Lint & Tests

Vérifie la qualité du code :

* Backend → `pytest`
* Frontend → `npm run lint`

Objectif :

* Détecter les erreurs avant build
* Empêcher le déploiement si le code est cassé

---

## 2️⃣ Build des images Docker

Construction automatique :

```bash
docker build -t systeme-reparti-backend backend/
docker build -t systeme-reparti-frontend frontend/
```

Chaque push reconstruit une image propre.

---

## 3️⃣ Push vers Docker Hub

Les images sont envoyées vers :

```
adam01tiret8/systeme-reparti-backend
adam01tiret8/systeme-reparti-frontend
```

Cela permet :

* Versionnement
* Portabilité
* Déploiement sur n’importe quel cluster

---

## 4️⃣ Déploiement Kubernetes Automatique

Commande exécutée par Jenkins :

```bash
kubectl apply -f k8s/
```

Résultat :

* Mise à jour des deployments
* Rolling update automatique
* Redémarrage des pods si nouvelle image

Vérification :

```bash
kubectl get pods
kubectl rollout status deployment/backend
```

---

# 🔐 Sécurité

* Les credentials Docker Hub sont stockés dans Jenkins (Credential Manager)
* Les secrets ne sont jamais commit dans Git
* Les variables sensibles sont injectées via variables d’environnement

---

# 🚀 Résultat Final

Après un simple :

```bash
git push origin main
```

Le pipeline :

✅ Teste le code
✅ Construit les images
✅ Les publie
✅ Déploie automatiquement
✅ Met à jour Kubernetes

Sans intervention manuelle.

---

# 🎓 Impact pédagogique

Cette phase démontre :

* Maîtrise CI/CD
* Automatisation complète DevOps
* Intégration Docker + Kubernetes
* Gestion sécurisée des credentials
* Industrialisation du projet

---

## 🛠️ Configuration

### Backend `.env`

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/systeme_reparti
JWT_SECRET=supersecurelongsecretkeywithatleast32chars!
FLASK_APP=run.py
FLASK_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://192.168.49.2:30001/api
```

---

## 🚀 Démarrage rapide (local)

1. Clone le projet :

```bash
git clone <[repo_url](https://github.com/Adam01-i/SYSTEME-REPARTI)>
cd systeme-reparti
```

2. Lancer les conteneurs Docker :

```bash
docker-compose up --build
```

3. Vérifier le backend : `http://localhost:5001/api/ping`
4. Vérifier le frontend : `http://localhost:5173`

---

## 📅 Roadmap du projet

| Phase | Description               | Statut    |
| ----- | ------------------------- | --------- |
| 1     | Conception & architecture | ✅ Terminé |
| 2     | Développement local       | ✅ Terminé |
| 3     | Dockerisation             | ✅ Terminé |
| 4     | Kubernetes                | ✅ Terminé |
| 5     | Ansible                   | ✅ Terminé |
| 6     | CI/CD Jenkins             | ✅ Terminé |

---

## 📖 Notes & bonnes pratiques

* Utiliser des variables d’environnement pour tout ce qui est secrets ou configurations sensibles
* Versionner les conteneurs et images Docker
* Ne jamais commit les `.env` contenant les secrets
* Tester chaque service individuellement avant orchestration
* Toujours vérifier les logs avec `kubectl logs` et `docker logs` en cas de problème

---

## 📝 Contribution

1. Fork le projet
2. Crée une branche feature : `git checkout -b feature/ma-feature`
3. Commit & push : `git commit -m "feat: ma nouvelle feature"`
4. Merge via Pull Request

---

## 📌 Licence

MIT License – voir [LICENSE](LICENSE)

```

---