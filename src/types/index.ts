export interface Word {
  w: string;
  d: string;
}

export type GradeKey = 'K' | '1st' | '2nd' | '3rd' | '4th' | '5th' | '6th' | '7th' | '8th' | '9th' | '10th' | '11th' | '12th' | 'finals' | 'all' | 'custom';

export type GameMode = 'bee' | 'quiz' | 'flash' | 'match';

export type GameScreen = 'menu' | GameMode | 'results';

export interface GameResult {
  score: number;
  total: number;
  mode: GameMode;
}

export interface MatchTile {
  id: string;
  text: string;
  pair: number;
  type: 'word' | 'def';
}
