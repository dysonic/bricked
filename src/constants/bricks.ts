import { BrickDimension } from  '../types/brick-dimension';

// https://www.midlandbrick.com.au/MidlandBrick/media/Documents/BricksBrochures/Midland-Brick-Coursing-Chart.pdf
export const STANDARD: BrickDimension = {
  id: 'standard',
  label: 'Standard 230x110x76mm',
  width: 110,
  length: 230,
  height: 76,
};

export const MODULAR: BrickDimension = {
  id: 'modular',
  label: 'Modular 290x90x90mm',
  width: 290,
  length: 90,
  height: 90,
};

export const bricks: Array<BrickDimension> = [
  STANDARD,
  MODULAR,
];
