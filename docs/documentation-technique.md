# Documentation Technique

## 1. Architecture

### 1.1 Structure du Projet
```
src/
├── main/
│   ├── simulation/    # Moteur de simulation
│   └── services/      # Services IPC
├── renderer/
│   ├── components/    # Composants UI
│   └── views/         # Pages
└── shared/           # Types et constantes
```

### 1.2 Modèles de Données

```typescript
interface Cell {
  state: CellState;
  humidity: number;
  burningTime: number;
}

enum CellState {
  EMPTY,
  VEGETATION,
  BURNING,
  BURNT_HOT,
  BURNT_COLD
}

interface SimulationConfig {
  width: number;
  height: number;
  windForce: number;
  humidity: number;
  terrainType: TerrainType;
}
```

## 2. Algorithmes Clés

### 2.1 Propagation du Feu
```typescript
function calculatePropagation(cell: Cell, neighbors: Cell[], wind: Wind): Cell {
  // Calcul probabilité de propagation basé sur:
  // - État de la cellule
  // - Force et direction du vent
  // - Humidité
  // - États des voisins
}
```

### 2.2 Matrice de Probabilités du Vent
```
Vent Force 0:  Vent Force 1:  Vent Force 2:
[0.1 0.1 0.1]  [0.2 0.3 0.2]  [0.1 0.4 0.1]
[0.1 --- 0.1]  [0.1 --- 0.1]  [0.1 --- 0.1]
[0.1 0.1 0.1]  [0.0 0.0 0.0]  [0.0 0.0 0.0]
```

## 3. Communication IPC

### 3.1 Canaux IPC
```typescript
// Simulation events
'simulation:start'
'simulation:pause'
'simulation:step'
'simulation:reset'

// Data events
'data:save'
'data:load'
'data:export-image'
```

## 4. Performance

### 4.1 Optimisations
- Utilisation de buffers pour le rendu
- Calculs matriciels optimisés
- Mémoire limitée par grille
