import { CellState } from './Cell';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cellSize: number;

  constructor(canvas: HTMLCanvasElement, cellSize: number = 10) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.cellSize = cellSize;
  }

  public render(cells: CellState[][]): void {
    const height = cells.length;
    const width = cells[0].length;

    this.canvas.width = width * this.cellSize;
    this.canvas.height = height * this.cellSize;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.drawCell(x, y, cells[y][x]);
      }
    }
  }

  public getCellSize(): number {
    return this.cellSize;
  }

  private drawCell(x: number, y: number, state: CellState): void {
    const colors = {
      [CellState.Empty]: '#808080',
      [CellState.Vegetation]: '#228B22',
      [CellState.Burning]: '#FF4500',
      [CellState.BurnedHot]: '#8B4513',
      [CellState.BurnedCold]: '#2F4F4F'
    };

    this.ctx.fillStyle = colors[state];
    this.ctx.fillRect(
      x * this.cellSize,
      y * this.cellSize,
      this.cellSize,
      this.cellSize
    );
  }
}
