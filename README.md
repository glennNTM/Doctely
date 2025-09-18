# Doctely Backend - API de Téléconsultation Médicale

API REST pour la gestion de consultations médicales en ligne avec système de notifications temps réel.

## Fonctionnalités

### Gestion des utilisateurs

- Authentification multi-rôles (Patients, Médecins, Administrateurs)
- Inscription et gestion des profils
- Validation des certificats médicaux

### Système de rendez-vous

- Création et gestion des rendez-vous
- Consultations en personne et téléconsultations
- Intégration vidéo pour les consultations à distance
- Gestion des statuts et annulations

### Notifications temps réel

- Notifications instantanées via Socket.IO
- Notifications automatiques pour les demandes de consultation
- Rappels de rendez-vous
- Système de planification automatique

### Gestion médicale

- Demandes de consultation par spécialité
- Génération d'ordonnances
- Historique médical des patients

## Installation

### Prérequis

- Node.js 18+
- PostgreSQL
- pnpm

### Configuration

```bash
# Cloner le projet
git clone <repository-url>
cd doctely-backend

# Installer les dépendances
pnpm install

# Configurer la base de données
pnpx prisma generate
pnpx prisma db push

# Démarrer le serveur
pnpm run dev
```

### Variables d'environnement

Créez un fichier `.env` avec les variables suivantes :

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
PORT=10000
```

## Documentation

### API Documentation

- Interface Swagger disponible sur `/api-docs`
- Documentation interactive avec authentification
- Tests d'endpoints intégrés

### Endpoints principaux

- `/api/auth/*` - Authentification
- `/api/demande-consultation/*` - Demandes de consultation
- `/api/rendez-vous/*` - Gestion des rendez-vous
- `/api/notifications/*` - Système de notifications
- `/api/patients/*` - Gestion des patients
- `/api/medecins/*` - Gestion des médecins

## Architecture

### Technologies utilisées

- **Express.js** - Framework Backend
- **Prisma** - ORM pour PostgreSQL
- **Socket.IO** - Notifications temps réel
- **JWT** - Authentification
- **bcrypt** - Chiffrement des mots de passe

### Structure

```
├── app.js                 # Point d'entrée
├── config/                # Configuration
├── controllers/           # Logique métier
├── middlewares/          # Middlewares Express
├── routes/               # Définition des routes
├── utils/                # Utilitaires
├── docs/                 # Documentation Swagger
└── prisma/               # Schema et migrations
```

### Sécurité

- Authentification JWT
- Validation des permissions par rôle
- Protection CORS
- Validation des données d'entrée
- Protection XSS

## Développement

### Scripts disponibles

```bash
pnpm run dev     # Développement avec hot reload
pnpm start       # Production
```

### Tests

- Documentation interactive via Swagger UI
- Tests d'endpoints avec authentification
- Validation des notifications temps réel

## Contribution

1. Fork le projet
2. Créez une branche feature
3. Committez vos changements
4. Ouvrez une Pull Request

## Licence

MIT
