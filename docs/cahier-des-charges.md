# Cahier des Charges - Simulateur de Feux de Forêt

## 1. Contexte et Objectifs

### 1.1 Contexte
Application de recherche destinée à la simulation de propagation de feux de forêt et l'aide à la décision.

### 1.2 Objectifs
- Simuler la propagation des feux selon des paramètres environnementaux
- Visualiser l'évolution du feu en temps réel
- Analyser l'impact des pare-feux et routes
- Fournir des statistiques post-simulation

## 2. Exigences

### 2.1 Modèle de Simulation
- Grille rectangulaire représentant la forêt
- États des cellules : végétation, enflammée, brûlée chaude, brûlée froide
- Paramètres d'influence :
  - Humidité (0.1 à 0.9)
  - Force du vent (0 à 3)
  - Densité de végétation (50% à 100%)

### 2.2 Fonctionnalités Prioritaires
1. Configuration initiale
   - Sélection du type de terrain
   - Paramétrage du vent et de l'humidité
   - Placement des foyers initiaux

2. Simulation
   - Visualisation en temps réel
   - Contrôle de la vitesse
   - Pause/Reprise

3. Analyse
   - Statistiques en temps réel
   - Export des résultats
   - Sauvegarde/Chargement

## 3. Planning des Versions

### v1.0.0 - Core
- Implémentation du modèle de base
- Interface CLI
- Tests unitaires

### v2.0.0 - GUI
- Interface graphique Electron
- Visualisation de la grille
- Contrôles basiques

### v2.1.0 - Features
- Sauvegarde/Chargement
- Statistiques
- Export d'images

### v2.2.0 - Advanced
- Paramètres avancés
- Pare-feux personnalisables
- Analyses détaillées

## 4. Contraintes Techniques
- Framework : Electron
- Langage : TypeScript
- Performance : Simulation fluide jusqu'à 100x100 cellules
