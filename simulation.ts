import { Grid } from './Grid';
import { Cell } from './Cell';
import { Wind, WindDirection } from './Wind';
import fs from 'fs';
import { SPARK_PROBABILITIES } from './matrice/spark';

export class Simulation {
  grid: Grid;
  wind: Wind;

  constructor(
    size: number,
    terrainType: 'continuous' | 'sparse' | 'scattered' | 'very_sparse',
    humidity: 'wet' | 'normal' | 'dry' | 'very_dry',
    windForce: number,
    windDirection: WindDirection = 'north',
    initialFireCell?: { x: number; y: number }
  ) {
    const coverage = this.getCoverage(terrainType);
    this.grid = new Grid(size, coverage, humidity);
    this.wind = new Wind(windForce, windDirection);
    this.grid.igniteInitialCells(initialFireCell);
  }

  private getCoverage(terrainType: 'continuous' | 'sparse' | 'scattered' | 'very_sparse'): number {
    switch (terrainType) {
      case 'continuous': return 1;
      case 'sparse': return 0.95;
      case 'scattered': return 0.8;
      case 'very_sparse': return 0.5;
    }
  }

  propagateSparks(x: number, y: number): void {
    const probabilities = SPARK_PROBABILITIES[this.wind.force];
    const offset = Math.floor(probabilities.length / 2);
  
    for (let dx = -offset; dx <= offset; dx++) {
      for (let dy = -offset; dy <= offset; dy++) {
        if (dx + offset >= 0 && dx + offset < probabilities.length && 
            dy + offset >= 0 && dy + offset < probabilities[0].length) { // Vérification des limites
          const nx = x + dx;
          const ny = y + dy;
  
          if (nx >= 0 && nx < this.grid.size && ny >= 0 && ny < this.grid.size) {
            const cell = this.grid.cells[nx][ny];
            const probability = probabilities[dx + offset][dy + offset] * (1 + this.wind.force * 0.005);
            if (cell.type === 'vegetation' && cell.state === 'intact' && Math.random() < probability) {
              cell.ignite();
            }
          }
        }
      }
    }
  }
  

  step(): boolean {
    let fireStillBurning = false;

    this.grid.cells.forEach((row, x) => {
      row.forEach((cell, y) => {
        if (cell.state === 'burning') {
          this.propagateSparks(x, y);
        }
        cell.updateState();
        if (cell.state === 'burning') {
          fireStillBurning = true;
        }
      });
    });

    return fireStillBurning;
  }

  getStatistics(): { burned: number; burning: number; intact: number; inert: number } {
    const stats = { burned: 0, burning: 0, intact: 0, inert: 0 };

    this.grid.cells.forEach(row => {
      row.forEach(cell => {
        switch (cell.state) {
          case 'burning': stats.burning++; break;
          case 'burned_hot':
          case 'burned_cold': stats.burned++; break;
          case 'intact': stats.intact++; break;
          case 'inert': stats.inert++; break;
        }
      });
    });

    return stats;
  }

  exportGridToFile(fileName: string): void {
    const gridState = this.grid.cells.map(row =>
      row.map(cell => ({
        type: cell.type,
        state: cell.state,
        humidity: cell.humidity,
      }))
    );

    const stats = this.getStatistics();

    const data = {
      grid: gridState,
      statistics: stats,
    };

    fs.writeFileSync(fileName, JSON.stringify(data, null, 2), 'utf-8');
  }
}
