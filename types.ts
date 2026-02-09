export type PageState = 'landing' | 'sudoku' | 'next_chapter';

export interface SudokuCell {
  value: number;
  isInitial: boolean; // If true, user cannot change it
  isValid: boolean; // For validation highlighting
  notes: number[];
}

export type GridType = SudokuCell[][];

export interface Difficulty {
  name: string;
  emptyCells: number;
}
