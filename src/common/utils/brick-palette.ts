import { BrickDimension } from '../types/brick-dimension';
import { Bond } from '../constants/bonds';
import { StringNumber } from '../types/common';
import { MORTAR_THICKNESS } from '../constants';
import { Wall } from '../types/wall';
import { HEADER, STRETCHER } from '../constants/brick-letters';
export interface BrickPalette extends StringNumber {
}

export const createBrickPalette = (brick: BrickDimension, bond: Bond): BrickPalette => {
  const example: string[] = [ bond.example.odd, bond.example.even ];
  const brickPalette: BrickPalette = {
    [HEADER]: brick.width,
    [STRETCHER]: brick.length,
  };

  const hasUnknownBrick: boolean = _doesExampleHaveUnknownBrick(example, brickPalette);
  if (hasUnknownBrick) {
    const courseKnown: string | undefined = _findExampleCourseWithKnownBricks(example);
    if (!courseKnown) {
      throw new Error('Bond does not have an example course where all brick dimensions are known');
    }

    const width: number = getCourseWidth(courseKnown, brickPalette);
    // console.log('width:', width);

    let loop: boolean = _doesExampleHaveUnknownBrick(example, brickPalette)
    while(loop) {

      const courseUnknownSingle: string | undefined = _findExampleCourseWithSingleUnknownBrick(example, brickPalette);
      if (!courseUnknownSingle) {
        throw new Error('Bond does not have a example with a single unknown brick dimension. Dimensions can not be solved.');
      }
      _solveUnknownDimension(courseUnknownSingle, brickPalette, width);

      loop = false;
    }
  }
  return brickPalette;
};

const _hasUnknownDimensions = (course: string, brickPalette: BrickPalette): boolean => {
  const known: string = Object.keys(brickPalette).join('');
  const regex: RegExp = new RegExp('[^' + known + ']+');
  return regex.test(course);
}

const _unknownDimensions = (course: string, brickPalette: BrickPalette): Array<string> => {
  const known: Array<string> = Object.keys(brickPalette);
  const unknown: Array<string> = [];
  course.split('').forEach(b => {
    if (!known.includes(b) && !unknown.includes(b)) {
      unknown.push(b);
    }
  });
  return unknown;
}

const _doesExampleHaveUnknownBrick = (example: string[], brickPalette: BrickPalette): boolean => {
  return example.some(c => _hasUnknownDimensions(c, brickPalette));
}

const _findExampleCourseWithKnownBricks = (example: string[]): string | undefined => {

  // The brick course that only contains stretchers (S) and headers (H)
  return example.find(c => /^[HS]+$/i.test(c));
};

const _findExampleCourseWithSingleUnknownBrick = (example: string[], brickPalette: BrickPalette): string | undefined => {
  return example.find(c => {
    const unknown: Array<string> = _unknownDimensions(c, brickPalette);
    return unknown.length === 1;
  });
};

export const getCourseWidth = (course: string, brickPalette: BrickPalette): number => {
  const brickLetters = course.split('');
  const brickTotal = brickLetters.reduce((w, brickLetter) =>
    w + brickPalette[brickLetter.toUpperCase()], 0);
  const mortarTotal: number = (brickLetters.length - 1) * MORTAR_THICKNESS;
  return brickTotal + mortarTotal;
}

const _solveUnknownDimension = (course: string, brickPalette: BrickPalette, width: number) => {

  // Check that we only have one unsolved dimension.
  const unknown: Array<string> = _unknownDimensions(course, brickPalette);
  if (unknown.length > 1) {
    throw new Error('There is more than one unsolved dimension: ' + unknown.join(''));
  }

  const solveBrick: string = unknown[0];
  // console.log('solve brick:', solveBrick);

  // Get the number of times each brick is used in the example.
  interface BrickCount {
    [index: string]: number;
  }
  const brickCount: BrickCount = {};
  const bricks: Array<string> = course.split('');
  const numberOfBricks: number = bricks.length;
  bricks.reduce((acc, b) => {
    if (!acc[b]) {
      acc[b] = 0;
    }
    acc[b]++;
    return acc;
  }, brickCount);
  // console.log('brick count:', brickCount);

  // Subtract mortar thickness.
  const mortarTotal: number = (numberOfBricks - 1) * MORTAR_THICKNESS;
  width = width - mortarTotal;

  // Subtract known bricks
  Object.keys(brickCount).forEach(b => {
    if (b !== solveBrick) {
      width = width - (brickCount[b] * brickPalette[b]);
    }
  });

  const brickWidth: number = width / brickCount[solveBrick];
  // console.log(`brick width (${solveBrick}):`, brickWidth);
  brickPalette[solveBrick] = brickWidth;
};

export interface BrickRatio {
  height: number;
  brickPalette: BrickPalette;
}

export const getRatios = (wall: Wall): BrickRatio => {
  const brickRatio: BrickRatio = {
    height: 0,
    brickPalette: {},
  };
  const d = _getShortestDimension(wall.brickPalette, wall.brickDimension.height);
  brickRatio.height = wall.brickDimension.height / d;
  Object.entries(wall.brickPalette).forEach(([brickLetter, width]) => {
    brickRatio.brickPalette[brickLetter] = width / d;
  });
  return brickRatio;
};

export const _getShortestDimension = (brickPalette: BrickPalette, brickHeight: number): number => {
  const dimensions = Object.values(brickPalette).concat([brickHeight]);
  return dimensions.reduce((acc: number, d: number): number => {
    return Math.min(acc, d);
  }, 999);
};

export const addBrickPaletteClasses = (brickRatio: BrickRatio): void => {
  const STYLE_ID: string = 'brick-style';
  let innerHTML: string = '';
  innerHTML += `.wall-widget .wall-widget__brick { height: ${brickRatio.height}em; }\n`;
  Object.entries(brickRatio.brickPalette).forEach(([brickLetter, width]) => {
    innerHTML += `.wall-widget .wall-widget__brick--${brickLetter.toLowerCase()} { width: ${width}em; }\n`;
  });


  let style: HTMLElement | null = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    // style.type = 'text/css';
    style.innerHTML = innerHTML;
    document.getElementsByTagName('head')[0].appendChild(style);
    return;
  }

  style.innerHTML = innerHTML;
};
