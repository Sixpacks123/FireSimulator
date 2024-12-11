# Simulation de Feux de Forêt

Ce projet implémente une simulation de la propagation des feux de forêt en tenant compte de facteurs tels que l'humidité, le vent, le type de terrain et les étincelles.

---

## Fonctionnalités

### Simulation
- **Grille Dynamique** : La forêt est représentée par une grille de cellules carrées.
- **Type de Terrain** :
  - `continuous` : 100 % de couverture végétale.
  - `sparse` : 95 % de couverture végétale.
  - `scattered` : 80 % de couverture végétale.
  - `very_sparse` : 50 % de couverture végétale.
- **Propagation du Feu** :
  - Les étincelles se propagent selon des probabilités influencées par la direction et la force du vent.
  - Une cellule en feu reste dans cet état pendant 2 itérations avant de devenir "brûlée".
- **Humidité** :
  - `wet` : 0.1 de probabilité d'ignition.
  - `normal` : 0.3 de probabilité d'ignition.
  - `dry` : 0.6 de probabilité d'ignition.
  - `very_dry` : 0.9 de probabilité d'ignition.
- **Routes (Pare-feux)** : Une ligne inerte empêche la propagation du feu.

### Vent
- **Force** :
  - `0` : Vent nul.
  - `1` : Vent faible.
  - `2` : Vent fort.
  - `3` : Vent très fort.
- **Direction** : `north`, `east`, `south`, `west`.

### Statistiques
- Pourcentage de cases brûlées, intactes et inertes.
- Moyenne des distances des cases brûlées par rapport au foyer initial.

### Exportation
- L'état final de la simulation peut être exporté au format JSON.
- Possibilité de recharger une simulation précédemment sauvegardée.

---

## Prérequis

- Node.js à partir de la version 16.
- TypeScript.

---

## Installation

1.  Installez les dépendances :
   ```bash
   npm install
   ```

---

## Utilisation

### Lancer la Simulation

Exécutez la simulation avec le CLI :
```bash
npx ts-node CLI.ts
```

### Paramètres
Les paramètres par défaut peuvent être modifiés dans le fichier `CLI.ts`.

Exemple :
```typescript
const simulation = new Simulation(
  20,          // Taille de la grille
  'scattered', // Type de terrain
  'normal',    // Humidité
  2,           // Force du vent
  'north'      // Direction du vent
);
```

### Sauvegarde et Chargement

#### Sauvegarder une Simulation
L'état final est automatiquement exporté dans un fichier `final_simulation.json`.

#### Charger une Simulation
Rechargez une simulation sauvegardée avec :
```typescript
simulation.loadGridFromFile('final_simulation.json');
simulation.runSimulation(20); // Reprendre pendant 20 itérations
```

---

## Structure du Projet

```plaintext
.
├── src
│   ├── Cell.ts          # Classe Cell (unité de base)
│   ├── Grid.ts          # Classe Grid (grille)
│   ├── Wind.ts          # Classe Wind (vent)
│   ├── Simulation.ts    # Classe Simulation (logique principale)
│   ├── CLI.ts           # Interface de simulation CLI
├── package.json         # Configuration npm
├── tsconfig.json        # Configuration TypeScript
```

---

## Fonctionnalités Futures
- Interface graphique (Electron).
- Simulation multi-feux.
- Analyse statistique avancée.



