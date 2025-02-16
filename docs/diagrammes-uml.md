# Diagrammes UML - Simulateur de Feux de Forêt

## 1. Diagramme de Classes

```mermaid
classDiagram
    class Simulation {
        -grid: Grid
        -config: SimulationConfig
        -state: SimulationState
        +start()
        +pause()
        +step()
        +reset()
        +saveState()
        +loadState()
    }

    class Grid {
        -cells: Cell[][]
        -width: number
        -height: number
        +getCellAt(x,y)
        +setCellAt(x,y,cell)
        +updateAll()
    }

    class Cell {
        -state: CellState
        -humidity: number
        -burningTime: number
        +update(neighbors)
        +burn()
        +cool()
    }

    class WindManager {
        -force: number
        -direction: Direction
        +getPropagationMatrix()
        +updateWind(force, direction)
    }

    Simulation "1" --* "1" Grid
    Grid "1" --* "n" Cell
    Simulation "1" --* "1" WindManager
```

## 2. Diagramme d'États (Cellule)

```mermaid
stateDiagram-v2
    [*] --> VEGETATION
    VEGETATION --> BURNING: brandon+probabilité
    BURNING --> BURNT_HOT: 2 itérations
    BURNT_HOT --> BURNT_HOT: 0.6
    BURNT_HOT --> BURNT_COLD: 0.4
    BURNT_COLD --> [*]
```

## 3. Diagramme de Séquence (Propagation)

```mermaid
sequenceDiagram
    participant U as User
    participant S as Simulation
    participant G as Grid
    participant C as Cell
    participant W as WindManager

    U->>S: start()
    loop Each step
        S->>G: updateAll()
        G->>W: getPropagationMatrix()
        loop Each cell
            G->>C: update(neighbors)
            C-->>G: newState
        end
        G-->>S: gridUpdated
        S-->>U: render()
    end
```

## 4. Architecture IPC

```mermaid
flowchart TB
    subgraph Main Process
        M[Main]
        P[Preload]
        S[Simulation Engine]
    end
    
    subgraph Renderer Process
        R[Renderer]
        UI[UI Components]
    end
    
    M <--> P
    P <--> R
    R <--> UI
    S <--> M
```

## 5. Diagramme de Composants

```mermaid
component
    database "FileSystem" {
        [SavedStates]
        [Configurations]
    }
    
    [MainProcess] --> [SimulationEngine]
    [SimulationEngine] --> [Grid]
    [MainProcess] --> [IPC]
    [IPC] --> [RendererProcess]
    [RendererProcess] --> [UIComponents]
    [MainProcess] --> [FileSystem]
```

## Notes d'Implémentation

1. **Gestion des États**
   - Chaque cellule gère son propre état
   - Les transitions sont probabilistes
   - Le vent influence les probabilités

2. **Communication**
   - IPC pour UI/Simulation
   - Events pour mises à jour
   - Preload pour sécurité

3. **Performance**
   - Grid utilise un buffer double
   - Calculs matriciels optimisés
   - Mises à jour par lots
