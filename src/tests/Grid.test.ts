import { Grid, TerrainType } from '../matrice/Grid';
import { CellState } from '../matrice/Cell';
import { WindDirection } from '../matrice/Wind';

describe('Grid', () => {
  let grid: Grid;

  beforeEach(() => {
    // Créer une nouvelle grille avant chaque test
    grid = new Grid(10, 10, TerrainType.Continuous);
  });

  test('devrait initialiser la grille avec la bonne taille', () => {
    const { cells } = grid.getState();
    expect(cells.length).toBe(10); // hauteur
    expect(cells[0].length).toBe(10); // largeur
  });

  test('devrait correctement placer les foyers initiaux', () => {
    const fireSpots: [number, number][] = [[2, 2], [3, 3]];
    grid.initializeFireSpots(fireSpots);
    
    const { cells } = grid.getState();
    expect(cells[2][2]).toBe(CellState.Burning);
    expect(cells[3][3]).toBe(CellState.Burning);
  });

  test('devrait propager le feu selon la force du vent', () => {
    // Créer une grille plus petite pour un test plus contrôlé
    grid = new Grid(5, 5, TerrainType.Continuous);
    
    // Initialise un feu au centre
    grid.initializeFireSpots([[2, 2]]);
    const wind = grid.getWind();
    wind.setForce(3); // Force maximale
    wind.setDirection(WindDirection.North);
    
    // Effectue plusieurs mises à jour pour permettre la propagation
    for(let i = 0; i < 5; i++) {
      grid.update();
    }
    
    const { cells } = grid.getState();
    // Compte les cellules en feu dans les zones nord et sud
    let northCellsBurning = 0;
    let southCellsBurning = 0;
    
    // Vérifie la zone au-dessus et en-dessous du point initial
    for(let x = 1; x <= 3; x++) {
      // Zone nord (y=0,1)
      for(let y = 0; y <= 1; y++) {
        if(cells[y][x] === CellState.Burning || cells[y][x] === CellState.BurnedHot) {
          northCellsBurning++;
        }
      }
      // Zone sud (y=3,4)
      for(let y = 3; y <= 4; y++) {
        if(cells[y][x] === CellState.Burning || cells[y][x] === CellState.BurnedHot) {
          southCellsBurning++;
        }
      }
    }
    
    expect(northCellsBurning).toBeGreaterThan(southCellsBurning);
  });

  test('devrait créer une route inerte', () => {
    // Crée une route horizontale
    for(let x = 0; x < 10; x++) {
      grid.setRoadCell(x, 5);
    }
    
    const { cells } = grid.getState();
    // Vérifie que toutes les cellules de la route sont vides
    for(let x = 0; x < 10; x++) {
      expect(cells[5][x]).toBe(CellState.Empty);
    }
  });

  test('devrait calculer correctement les statistiques', () => {
    // Crée un état connu
    grid = new Grid(2, 2, TerrainType.Continuous);
    grid.initializeFireSpots([[0, 0]]); // 1 cellule en feu
    grid.setRoadCell(1, 1); // 1 cellule vide
    
    const { stats } = grid.getState();
    
    expect(stats.burning).toBe(25); // 1/4 = 25%
    expect(stats.empty).toBe(25); // 1/4 = 25%
    expect(stats.vegetation).toBe(50); // 2/4 = 50%
  });
});
