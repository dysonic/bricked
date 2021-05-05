import { BrickDimension } from '../types/brick-dimension';
import { Bond } from '../constants/bonds';
import { StringNumber } from '../types/common';
import { MORTAR_THICKNESS } from '../constants';
import { Elevation } from '../types/elevation';

export interface BrickPalette extends StringNumber {
}

export const createBrickPalette = (brick: BrickDimension, bond: Bond): BrickPalette => {
  const example: string[] = [ bond.example.odd, bond.example.even ];
  const brickPalette: BrickPalette = {
    s: brick.length,
    h: brick.width,
  };

  const hasUnknownBrick: boolean = _doesExampleHaveUnknownBrick(example, brickPalette);
  if (hasUnknownBrick) {
    const courseKnown: string | undefined = _findExampleCourseWithKnownBricks(example);
    if (!courseKnown) {
      throw new Error('Bond does not have an example course where all brick dimensions are known');
    }

    const width: number = calculateWidthFromCourse(courseKnown, brickPalette);
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
  return example.find(c => /^[hs]+$/.test(c));
};

const _findExampleCourseWithSingleUnknownBrick = (example: string[], brickPalette: BrickPalette): string | undefined => {
  return example.find(c => {
    const unknown: Array<string> = _unknownDimensions(c, brickPalette);
    return unknown.length === 1;
  });
};

export const calculateWidthFromCourse = (course: string, brickPalette: BrickPalette): number => {
  const bricks: Array<string> = course.split('');
  const numberOfBricks: number = bricks.length;
  const brickWidths: Array<number> = bricks.map(b => {
    if (brickPalette[b]) {
      return brickPalette[b];
    }
    throw new Error(`Brick found (${b}) that does not exist is brickPalette`);
  });
  const brickTotal: number = brickWidths.reduce((acc, w) => acc + w);
  const mortarTotal: number = (numberOfBricks - 1) * MORTAR_THICKNESS;
  const width: number = brickTotal + mortarTotal;
  return width;
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

export const getRatios = (wall: Elevation): BrickRatio => {
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
