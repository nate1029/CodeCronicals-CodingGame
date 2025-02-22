export interface Position {
  x: number;
  y: number;
}

export interface GameObject extends Position {
  width: number;
  height: number;
  color: string;
}

export interface Bullet extends GameObject {
  direction: 'left' | 'right';
}

export interface Character extends GameObject {
  health: number;
}

export interface Explosion extends GameObject {
  duration: number;
  timestamp: number;
}