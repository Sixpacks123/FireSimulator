import { Simulation } from './simulation';

const displayGrid = (grid: Simulation['grid']): void => {
  console.clear();
  grid.cells.forEach(row => {
    console.log(
      row
        .map(cell => {
          switch (cell.state) {
            case 'intact': return '🌲';
            case 'burning': return '🔥';
            case 'burned_hot': return '⚫';
            case 'burned_cold': return '⬛';
            case 'inert': return '⬜';
          }
        })
        .join(' ')
    );
  });
};

const displayStatistics = (stats: { burned: number; burning: number; intact: number; inert: number }) => {
  console.log(`Statistiques : 
    🔥 En feu : ${stats.burning}
    ⚫ Brûlé : ${stats.burned}
    🌲 Intact : ${stats.intact}
    ⬜ Inerte : ${stats.inert}
  `);
};

const runSimulation = () => {
  const simulation = new Simulation(20, 'continuous', 'very_dry', 3, 'north');
  let iteration = 0;
  const interval = setInterval(() => {
    console.log(`--- Itération ${iteration++} ---`);
    displayGrid(simulation.grid);

    const stats = simulation.getStatistics();
    displayStatistics(stats);

    if (!simulation.step() || iteration > 50) { // Limite à 50 itérations
      clearInterval(interval);
      simulation.exportGridToFile('final_simulation.json');
      console.log('Simulation terminée.');
    }
  }, 1000);
};

runSimulation();
