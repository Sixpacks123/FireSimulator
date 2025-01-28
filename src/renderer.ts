/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.ts` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { Grid, TerrainType } from './matrice/Grid';
import { Renderer } from './matrice/Renderer';
import { SoilMoisture } from './matrice/Cell';
import { WindDirection } from './matrice/Wind';

let grid: Grid;
let renderer: Renderer;
let animationId: number | null = null;
let isRunning = false;
let isDrawingRoad = false;
let lastFrameTime = 0;
let frameInterval = 1000 / 60; // 60 FPS par défaut

function initializeSimulation() {
  const canvas = document.getElementById('simulationCanvas') as HTMLCanvasElement;
  
  // Set initial canvas size
  canvas.width = 800;
  canvas.height = 600;
  
  grid = new Grid(80, 60, TerrainType.Continuous); // Adjusted grid size
  renderer = new Renderer(canvas, 10); // Cell size = 10px
  
  // Initialize with two burning spots
  grid.initializeFireSpots([[40, 30], [41, 30]]); // Adjusted initial fire spots
  
  // Initial render
  const { cells, stats } = grid.getState();
  renderer.render(cells);
  updateStats(stats);
}

function updateSimulation(timestamp: number) {
  if (!isRunning) return;

  // Calcule le temps écoulé depuis la dernière frame
  const elapsed = timestamp - lastFrameTime;

  // Si suffisamment de temps s'est écoulé, met à jour la simulation
  if (elapsed >= frameInterval) {
    lastFrameTime = timestamp;
    
    grid.update();
    const { cells, stats } = grid.getState();
    renderer.render(cells);
    updateStats(stats);
  }
  
  animationId = requestAnimationFrame(updateSimulation);
}

function resetSimulation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  isRunning = false;
  isDrawingRoad = false;
  initializeSimulation();
}

function updateStats(stats: any) {
  document.getElementById('burningPercent')!.textContent = `${stats.burning.toFixed(1)}%`;
  document.getElementById('vegetationPercent')!.textContent = `${stats.vegetation.toFixed(1)}%`;
  document.getElementById('burnedPercent')!.textContent = `${stats.burned.toFixed(1)}%`;
  document.getElementById('emptyPercent')!.textContent = `${stats.empty.toFixed(1)}%`;
}

// Event Listeners
function setupEventListeners() {
  const startButton = document.getElementById('startSimulation');
  const pauseButton = document.getElementById('pauseSimulation');
  const resetButton = document.getElementById('resetSimulation');
  const drawRoadButton = document.getElementById('drawRoad');
  const clearRoadButton = document.getElementById('clearRoad');
  const windForceSelect = document.getElementById('windForce');
  const soilMoistureSelect = document.getElementById('soilMoisture');
  const terrainTypeSelect = document.getElementById('terrainType');
  const canvas = document.getElementById('simulationCanvas');
  const windDirectionSelect = document.getElementById('windDirection');
  const speedControl = document.getElementById('simulationSpeed');
  const speedValue = document.getElementById('speedValue');

  if (startButton) {
    startButton.addEventListener('click', () => {
      isRunning = true;
      updateSimulation(0);
    });
  }

  if (pauseButton) {
    pauseButton.addEventListener('click', () => {
      isRunning = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  }

  if (resetButton) {
    resetButton.addEventListener('click', resetSimulation);
  }

  if (drawRoadButton) {
    drawRoadButton.addEventListener('click', () => {
      isDrawingRoad = true;
      canvas?.classList.add('drawing-mode');
    });
  }

  if (clearRoadButton) {
    clearRoadButton.addEventListener('click', () => {
      isDrawingRoad = false;
      canvas?.classList.remove('drawing-mode');
      grid.clearRoads();
      const { cells } = grid.getState();
      renderer.render(cells);
    });
  }

  if (windForceSelect) {
    windForceSelect.addEventListener('change', (e) => {
      const force = parseInt((e.target as HTMLSelectElement).value);
      grid.getWind().setForce(force);
    });
  }

  if (soilMoistureSelect) {
    soilMoistureSelect.addEventListener('change', (e) => {
      const moisture = parseFloat((e.target as HTMLSelectElement).value) as SoilMoisture;
      grid.setMoisture(moisture);
    });
  }

  if (terrainTypeSelect) {
    terrainTypeSelect.addEventListener('change', (e) => {
      const terrainValue = parseFloat((e.target as HTMLSelectElement).value) as TerrainType;
      resetSimulation();
      grid = new Grid(80, 60, terrainValue);
      grid.initializeFireSpots([[40, 30], [41, 30]]);
      const { cells } = grid.getState();
      renderer.render(cells);
    });
  }

  if (windDirectionSelect) {
    windDirectionSelect.addEventListener('change', (e) => {
      const direction = parseInt((e.target as HTMLSelectElement).value) as WindDirection;
      grid.getWind().setDirection(direction);
    });
  }

  if (speedControl && speedValue) {
    speedControl.addEventListener('input', (e) => {
      const fps = parseInt((e.target as HTMLInputElement).value);
      frameInterval = 1000 / fps;
      speedValue.textContent = `${fps} FPS`;
    });
  }

  if (canvas) {
    canvas.addEventListener('mousedown', (e) => {
      if (!isDrawingRoad) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / renderer.getCellSize());
      const y = Math.floor((e.clientY - rect.top) / renderer.getCellSize());
      
      grid.setRoadCell(x, y);
      const { cells } = grid.getState();
      renderer.render(cells);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDrawingRoad || !(e.buttons & 1)) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = Math.floor((e.clientX - rect.left) / renderer.getCellSize());
      const y = Math.floor((e.clientY - rect.top) / renderer.getCellSize());
      
      grid.setRoadCell(x, y);
      const { cells } = grid.getState();
      renderer.render(cells);
    });
  }
}

// Initialize simulation and setup events when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeSimulation();
  setupEventListeners();
});

// Handle save/load
window.electronAPI.onSaveSimulation(async () => {
  const state = grid.getState();
  await window.electronAPI.saveSimulation(state);
});

window.electronAPI.onLoadSimulation(async () => {
  const state = await window.electronAPI.loadSimulation();
  if (state) {
    // Implement loading state
  }
});

window.electronAPI.onShowAbout(() => {
  // Show about dialog
});

console.log('👋 This message is being logged by "renderer.ts", included via Vite');
