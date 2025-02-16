# Simulateur de Feu de Forêt 🔥

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](https://github.com/votre-repo)
[![Electron](https://img.shields.io/badge/electron-latest-brightgreen.svg)](https://www.electronjs.org/)

## 📋 À propos
Application de simulation de propagation de feux de forêt utilisant des automates cellulaires et une approche événementielle.

## 🚀 Démarrage Rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run start
```

### Tests
```bash
npm run test
```

## 📥 Téléchargement

Versions disponibles :
- [Version 1.1.0](lien-vers-v1.1.0) - Dernière version
- [Version 1.0.0](lien-vers-v1.0.0) - Version initiale

## 📚 Documentation

### Spécifications Techniques
- [Cahier des charges](lien-vers-cahier-des-charges)
- [Documentation technique](lien-vers-doc-technique)

### Ressources Utiles
- [Documentation Electron](https://www.electronjs.org/docs)
- [Simulation à événements discrets](lien-vers-ressource)
- [Automates cellulaires](lien-vers-ressource)

## 🔧 Aspects Techniques

### Points Clés
- Gestion de matrices rotatives pour la simulation du vent
- Optimisation des performances pour grandes grilles
- Système de sauvegarde/chargement de simulations

### Défis Techniques Relevés
- Optimisation des calculs matriciels
- Gestion efficace de la mémoire
- Interface utilisateur réactive

## 📝 Notes de Version
Consultez le [CHANGELOG](lien-vers-changelog) pour les détails des mises à jour.

## Build et Publication

### Build local

Pour créer un build local :

```bash
# Crée un package sans installeur
yarn package

# Crée un installeur pour votre plateforme
yarn make
```

### Publication

1. Mettez à jour la version dans `package.json`:
```json
{
  "version": "2.1.1"  // Incrémentez ce numéro
}
```

2. Créez un tag Git et committez :
```bash
git add .
git commit -m "Release v2.1.1"
git tag v2.1.1
git push && git push --tags
```

3. Publiez l'application sur GitHub :
```bash
yarn run publish
```

Note : Cette commande utilisera electron-forge pour publier sur GitHub. Assurez-vous d'avoir défini la variable d'environnement `GITHUB_TOKEN`.

## Configuration de la Publication

Pour configurer la publication automatique, ajoutez ces variables d'environnement :

- `GITHUB_TOKEN`: Token d'accès GitHub avec permissions `repo`
- Créez un fichier `.env` à la racine :
```
GITHUB_TOKEN=votre_token_github
```

## Structure du Projet

```
.
├── src/                # Code source
│   ├── main.ts        # Process principal
│   ├── preload.ts     # Script de preload
│   └── renderer.ts    # Process de rendu
├── assets/            # Resources statiques
├── forge.config.ts    # Configuration Electron Forge
└── vite.*.config.ts   # Configurations Vite
```