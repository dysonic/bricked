const hasUnknownDimensions = (pattern, palette) => {
  const known = Object.keys(palette).join('');
  const regex = new RegExp('[^' + known + ']+');
  return regex.test(pattern);
}

const unknownDimensions = (pattern, palette) => {
  const known = Object.keys(palette);
  const unknown = [];
  pattern.split('').forEach(b => {
    if (!known.includes(b) && !unknown.includes(b)) {
      unknown.push(b);
    }
  });
  return unknown;
}


export const areThereAnyPatternsWithUnknownBrickDimensions = (patterns, palette) => {
  return patterns.some(p => hasUnknownDimensions(p, palette));
}


export const findPatternWhereAllBrickDimensionsAreKnown = patterns => {

  // The brick pattern only contains stretchers (S) and headers (H)
  return patterns.find(p => /^[hs]+$/.test(p));
};

export const findPatternWhereOnlyOneBrickDimensionIsUnknown = (patterns, palette) => {
  return patterns.find(p => {
    const unknown = unknownDimensions(p, palette);
    return unknown.length === 1;
  });
};

export const calculateWidthFromPattern = (pattern, palette) => {
  const bricks = pattern.split('');
  const numberOfBricks = bricks.length;
  const brickWidths = bricks.map(b => {
    if (palette[b]) {
      return palette[b];
    }
    throw new Error(`Brick found (${b}) that does not exist is palette`);
  });
  const brickTotal = brickWidths.reduce((acc, w) => acc + w);
  const mortarTotal = (numberOfBricks - 1) * 10;
  const width = brickTotal + mortarTotal;
  return width;
}

export const solveUnknownDimension = (pattern, palette, width) => {

  // Check that we only have one unsolved dimension.
  const unknown = unknownDimensions(pattern, palette);
  if (unknown.length > 1) {
    throw new Error('There is more than one unsolved dimension: ' + unknown.join(''));
  }

  const solveBrick = unknown[0];
  console.log('solve brick:', solveBrick);

  // Get the number of times each brick is used in the pattern.
  const brickCount = {};
  const bricks = pattern.split('');
  const numberOfBricks = bricks.length;
  bricks.reduce((acc, b) => {
    if (!acc[b]) {
      acc[b] = 0;
    }
    acc[b]++;
    return acc;
  }, brickCount);
  console.log('brick count:', brickCount);

  // Subtract mortar thickness.
  const mortarTotal = (numberOfBricks - 1) * 10;
  width = width - mortarTotal;

  // Subtract known bricks
  Object.keys(brickCount).forEach(b => {
    if (b !== solveBrick) {
      width = width - (brickCount[b] * palette[b]);
    }
  });

  const brickWidth = width / brickCount[solveBrick];
  console.log(`brick width (${solveBrick}):`, brickWidth);
  palette[solveBrick] = brickWidth;
};
