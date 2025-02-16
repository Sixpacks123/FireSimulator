import { WindDirection, WindForce } from './Wind';

type SparkMatrices = {
  [key in WindForce]: number[][];
};

const BASE_MATRIX: SparkMatrices = {
  0: [ // No wind
    [0.1, 0.1, 0.1],
    [0.1, 0.0, 0.1],
    [0.1, 0.1, 0.1]
  ],
  1: [ // Moderate wind
    [0.2, 0.3, 0.2],
    [0.1, 0.0, 0.1],
    [0.0, 0.0, 0.0]
  ],
  2: [ // Strong wind
    [0.1, 0.4, 0.1],
    [0.1, 0.0, 0.1],
    [0.0, 0.0, 0.0]
  ],
  3: [ // Violent wind
    [0.0, 0.5, 0.0],
    [0.0, 0.0, 0.0],
    [0.0, 0.0, 0.0]
  ]
};

function rotateMatrix(matrix: number[][], angle: number): number[][] {
  const size = matrix.length;
  const rotated = Array(size).fill(0).map(() => Array(size).fill(0));
  
  const rotations = (angle / 90) % 4;
  
  for (let r = 0; r < rotations; r++) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        rotated[j][size - 1 - i] = matrix[i][j];
      }
    }
  }
  
  return rotated;
}

export function getSparkMatrix(force: WindForce, direction: WindDirection): number[][] {
  const baseMatrix = BASE_MATRIX[force];
  const angle = direction;
  return rotateMatrix(baseMatrix, angle);
}
