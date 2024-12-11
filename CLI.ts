import { Simulation } from './simulation';

/**
 * Affiche la grille de la simulation dans la console.
 * @param grid La grille actuelle de la simulation.
 */
const displayGrid = (grid: Simulation['grid']): void => {
  console.clear();
  grid.cells.forEach(row => {
    console.log(
      row
        .map(cell => {
          switch (cell.state) {
            case 'intact': return '🌲'; // Cellule intacte (végétation)
            case 'burning': return '🔥'; // Cellule en feu
            case 'burned_hot': return 'H'; // Cellule brûlée chaude
            case 'burned_cold': return '⬛'; // Cellule brûlée froide
            case 'inert': return '⬜'; // Cellule inerte (sol)
          }
        })
        .join(' ')
    );
  });
};

/**
 * Affiche les statistiques de la simulation.
 * @param stats Les statistiques actuelles de la simulation.
 */
const displayStatistics = (stats: { burned: number; burning: number; intact: number; inert: number }) => {
  console.log(`Statistiques : 
    🔥 En feu : ${stats.burning}
    ⚫ Brûlé : ${stats.burned}
    🌲 Intact : ${stats.intact}
    ⬜ Inerte : ${stats.inert}
  `);
};

/**
 * Lance la simulation avec des paramètres prédéfinis.
 */
const runSimulation = () => {
    const gridSize = 10000;
    const terrainType = 'scattered';
    const humidity = 'normal';
    const windForce = 2; // Vent très fort
    const windDirection = 'north';

  
    const simulation = new Simulation(gridSize, terrainType, humidity, windForce, windDirection);
  
    let iteration = 0;
    const interval = setInterval(() => {
      console.log(`\n--- Itération ${iteration++} ---`);
      displayGrid(simulation.grid);
  
      const stats = simulation.getStatistics();
      displayStatistics(stats);
  
      if (!simulation.step()) {
        clearInterval(interval);
        console.log('Simulation terminée.');
      }
    }, 1000);
  };
  
  runSimulation();
  