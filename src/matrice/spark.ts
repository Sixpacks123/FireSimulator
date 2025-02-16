// Matrices de propagation selon la force du vent (comme spécifié dans l'énoncé)
const BASE_MATRIX = {
  0: [ // Pas de vent
    [0, 0.01, 0.01, 0.01, 0],
    [0.01, 0.2, 0.3, 0.2, 0.01],
    [0.01, 0.3, 0, 0.3, 0.01],
    [0.01, 0.2, 0.3, 0.2, 0.01],
    [0, 0.01, 0.01, 0.01, 0],
  ],
  1: [ // Vent modéré
    [0.1, 0.2, 0.1],
    [0.3, 0, 0.3],
    [0.3, 0.4, 0.3],
    [0.02, 0.05, 0.02],
  ],
  2: [ // Vent fort
    [0.05, 0.1, 0.05],
    [0.25, 0, 0.25],
    [0.4, 0.5, 0.4],
    [0.05, 0.1, 0.05],
    [0, 0.01, 0],
  ],
  3: [ // Vent violent
    [0.005, 0.01, 0.005],
    [0.1, 0, 0.1],
    [0.5, 0.7, 0.5],
    [0.2, 0.3, 0.2],
    [0.01, 0.05, 0.01],
  ]
};

// Fonction pour faire pivoter la matrice selon la direction du vent
function rotateMatrix(matrix: number[][], direction: number): number[][] {
  const size = matrix.length;
  const rotated = Array(size).fill(0).map(() => Array(size).fill(0));
  
  const rotations = (direction / 90) % 4; // Nombre de rotations de 90 degrés
  
  for (let r = 0; r < rotations; r++) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        rotated[j][size - 1 - i] = matrix[i][j];
      }
    }
    // Copier la matrice pivotée pour la prochaine rotation si nécessaire
    if (r < rotations - 1) {
      matrix = rotated.map(row => [...row]);
    }
  }
  
  return rotated;
}

export function getSparkMatrix(force: number, direction: number): number[][] {
  const baseMatrix = BASE_MATRIX[force];
  if (direction === 0) return baseMatrix; // Direction nord, pas de rotation nécessaire
  return rotateMatrix(baseMatrix, direction);
}