# SweTransfer - Service de Partage de Fichiers

Service de partage de fichiers inspiré de WeTransfer, permettant aux utilisateurs de stocker et partager des fichiers de manière sécurisée.

## 🚀 Fonctionnalités

- 👤 **Gestion des utilisateurs**
  - Inscription et connexion
  - Authentification JWT
  - Gestion du profil

- 📁 **Gestion des fichiers**
  - Upload de fichiers (jusqu'à 100MB par fichier)
  - Quota de 2GB par utilisateur
  - Liste et suppression des fichiers
  - Partage via liens temporaires (7 jours)

## 🛠️ Technologies

- Backend: Node.js avec Express
- Base de données: MariaDB
- ORM: Sequelize
- Conteneurisation: Docker & Docker Compose
- Authentification: JWT
- Upload: Multer

## 📋 Prérequis

- Docker et Docker Compose (pour la conteneurisation)
- Make (pour utiliser les commandes simplifiées du Makefile)
- Node.js 18+ (uniquement pour le développement local)

> 💡 Si vous n'avez pas Make installé, vous pouvez utiliser directement les commandes Docker Compose.

## 🚀 Installation

1. Cloner le repository :

bash
git clone https://github.com/votre-username/swetransfer.git
cd swetransfer


2. Configurer l'environnement :

bash
cp .env.example .env

3. Démarrer l'application :

bash
make up


## 🔧 Commandes disponibles

- `make up`: Démarre l'application et tous ses services
  > Équivalent à : docker-compose up -d

- `make down`: Arrête l'application et ses services
  > Équivalent à : docker-compose down

- `make restart`: Redémarre l'application
  > Utile après des modifications de configuration

- `make logs`: Affiche les logs en temps réel
  > Utilisez Ctrl+C pour quitter les logs

- `make clean`: Nettoie les conteneurs et volumes
  > ⚠️ Attention : Cette commande supprimera toutes les données !

## 🔍 Vérification de l'installation

1. Vérifiez que l'application fonctionne :

bash
curl http://localhost:3000/api/health


## 📚 API Documentation

### Authentification

#### Inscription

bash
POST /api/auth/register
Content-Type: application/json
{
"email": "user@example.com",
"password": "password123"
}


#### Connexion

bash
POST /api/auth/login
Content-Type: application/json
{
"email": "user@example.com",
"password": "password123"
}



### Gestion des fichiers

#### Upload

bash
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
file: <file>



#### Liste des fichiers

bash
GET /api/files/list
Authorization: Bearer <token>

#### Partage de fichier


bash
POST /api/files/{fileId}/share
Authorization: Bearer <token>

#### Suppression de fichier


bash
DELETE /api/files/{fileId}
Authorization: Bearer <token>


#### Téléchargement via lien de partage

bash
GET /api/files/shared/{shareLink}


## 🏗️ Structure du projet

.
├── docker-compose.yml # Configuration Docker
├── Dockerfile # Configuration de l'image Docker
├── Makefile # Commandes Make
├── package.json # Dépendances Node.js
└── src
├── app.js # Point d'entrée de l'application
├── config/ # Configuration
├── controllers/ # Contrôleurs
├── middleware/ # Middleware
├── models/ # Modèles Sequelize
└── routes/ # Routes API
)

## 🔐 Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| PORT | Port du serveur | 3000 |
| DB_HOST | Hôte DB | db |
| DB_USER | Utilisateur DB | user |
| DB_PASSWORD | Mot de passe DB | password |
| DB_NAME | Nom de la DB | swetransfer |
| JWT_SECRET | Clé secrète JWT | - |
| API_URL | URL de base de l'API | http://localhost:3000 |

## 🚨 Résolution des problèmes courants

1. **Les conteneurs ne démarrent pas**
   - Vérifiez que Docker est en cours d'exécution
   - Vérifiez que les ports 3000 et 3306 sont disponibles
   ```bash
   make logs  # Pour voir les erreurs détaillées
   ```

2. **Erreur de connexion à la base de données**
   - Attendez quelques secondes que MariaDB soit complètement initialisé
   - Vérifiez les variables d'environnement dans le fichier .env

3. **Problèmes d'upload de fichiers**
   - Vérifiez que le dossier `uploads` existe et a les bonnes permissions
   - Vérifiez que le fichier ne dépasse pas 100MB
   - Vérifiez votre quota d'espace disponible

> 💡 Pour tout autre problème, consultez les logs avec `make logs`

## 🧪 Tests

*À venir*

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'feat: Add amazing feature'`)
4. Push la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

MIT

## 👥 Auteurs

- WISSEM (@Wissem95)
- SAMY (@Samy951)
