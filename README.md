# 🎵 MMJ Helper - Cyberpunk Edition

Une plateforme moderne pour découvrir, partager et gérer des morceaux **Music Maker Jam** avec un design cyberpunk futuriste.

## ✨ Fonctionnalités

### 🎶 Gestion des Morceaux
- ✅ Ajouter, modifier et supprimer des morceaux
- ✅ Système de likes pour les morceaux
- ✅ Galerie publique avec tous les morceaux
- ✅ Recherche et filtres avancés (titre, auteur, tri)

### 👤 Authentification
- ✅ Système d'inscription et connexion sécurisé
- ✅ Authentification JWT
- ✅ Gestion des sessions utilisateur

### 💬 Commentaires
- ✅ Système de commentaires sur les morceaux
- ✅ Suppression des commentaires propres
- ✅ Affichage des commentaires en temps réel

### 🎨 Partage Social
- ✅ Générateur de cartes visuelles avec QR Code
- ✅ Export en image haute qualité
- ✅ Textes optimisés pour TikTok, Instagram et autres réseaux
- ✅ Copie facile pour le partage

### 🎯 Design
- ✅ Esthétique Cyberpunk (Magenta + Cyan)
- ✅ Interface responsive
- ✅ Animations fluides avec Framer Motion
- ✅ Composants UI modernes avec Radix UI

## 🚀 Installation

### Prérequis
- Node.js 18+
- pnpm (ou npm/yarn)
- MySQL/TiDB (optionnel, utilise la mémoire par défaut)

### Étapes d'installation

1. **Cloner le dépôt**
```bash
git clone https://github.com/Zayreedd4217/IA-HELP-MMJ-SOUND.git
cd IA-HELP-MMJ-SOUND
```

2. **Installer les dépendances**
```bash
pnpm install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres :
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=mmj_helper

# JWT Configuration
JWT_SECRET=your-secret-key-change-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
```

4. **Démarrer le serveur de développement**
```bash
pnpm dev
```

Le site sera accessible à `http://localhost:5173`

## 📦 Build et Déploiement

### Build pour la production
```bash
pnpm build
```

### Démarrer le serveur de production
```bash
pnpm start
```

## 🏗️ Architecture

### Frontend
- **Framework**: React 19 + TypeScript
- **Build**: Vite
- **Styling**: Tailwind CSS
- **Composants**: Radix UI + shadcn/ui
- **Routing**: Wouter
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: Drizzle ORM + MySQL2
- **Auth**: JWT + Bcrypt
- **Validation**: Zod

## 🗄️ Schéma de Base de Données

### Users
- `id`: UUID (Primary Key)
- `email`: String (Unique)
- `username`: String (Unique)
- `passwordHash`: String
- `avatar`: Text (Optional)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Tracks
- `id`: UUID (Primary Key)
- `title`: String
- `mmjUrl`: Text
- `author`: String
- `userId`: UUID (Foreign Key)
- `description`: Text (Optional)
- `likes`: Integer (Default: 0)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### Comments
- `id`: UUID (Primary Key)
- `trackId`: UUID (Foreign Key)
- `userId`: UUID (Foreign Key)
- `content`: Text
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

### TrackLikes
- `id`: UUID (Primary Key)
- `trackId`: UUID (Foreign Key)
- `userId`: UUID (Foreign Key)
- `createdAt`: Timestamp

## 🔐 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur (Authentifié)

### Morceaux
- `GET /api/tracks` - Lister tous les morceaux (avec filtres)
- `GET /api/tracks/:id` - Obtenir un morceau
- `POST /api/tracks` - Créer un morceau (Authentifié)
- `PUT /api/tracks/:id` - Modifier un morceau (Authentifié)
- `DELETE /api/tracks/:id` - Supprimer un morceau (Authentifié)

### Likes
- `POST /api/tracks/:id/like` - Aimer un morceau (Authentifié)
- `DELETE /api/tracks/:id/like` - Retirer le like (Authentifié)

### Commentaires
- `GET /api/tracks/:id/comments` - Lister les commentaires
- `POST /api/tracks/:id/comments` - Ajouter un commentaire (Authentifié)
- `DELETE /api/comments/:id` - Supprimer un commentaire (Authentifié)

## 📝 Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DB_HOST` | Hôte de la base de données | localhost |
| `DB_PORT` | Port de la base de données | 3306 |
| `DB_USER` | Utilisateur de la base de données | root |
| `DB_PASSWORD` | Mot de passe de la base de données | (vide) |
| `DB_NAME` | Nom de la base de données | mmj_helper |
| `JWT_SECRET` | Clé secrète JWT | (à définir) |
| `PORT` | Port du serveur | 3000 |
| `NODE_ENV` | Environnement | development |

## 🎨 Couleurs Cyberpunk

- **Magenta**: `#FF00FF` - Couleur primaire
- **Cyan**: `#00FFFF` - Couleur secondaire
- **Noir**: `#000000` - Fond

## 📱 Pages

- `/` - Page d'accueil avec formulaire d'ajout
- `/gallery` - Galerie avec recherche et filtres
- `/login` - Page de connexion/inscription
- `/404` - Page d'erreur

## 🚀 Déploiement sur Vercel

1. Connecter le dépôt GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

## 📄 Licence

MIT

## 👨‍💻 Auteur

MMJ Helper Team - Cyberpunk Edition

---

**Fait avec ♫ par MMJ Helper**
