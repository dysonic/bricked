import React from 'react';
import { Brickwork } from '../components/Brickwork';
import { connect } from 'react-redux';
import { getBrick } from '../redux/selectors';
import BRICKWORK from '../constants/brickwork';
import { generate } from '../utils/elevation';
import {
  areThereAnyPatternsWithUnknownBrickDimensions,
  findPatternWhereAllBrickDimensionsAreKnown,
  calculateWidthFromPattern,
  findPatternWhereOnlyOneBrickDimensionIsUnknown,
  solveUnknownDimension,
} from '../utils/brickwork';

function BrickworkContainer(props) {
  const { brickDimension } = props;
  const elevations = generateElevations(BRICKWORK, brickDimension);
  console.log('elevations:', elevations.length);
  console.log(elevations);
  const items = elevations.map(elevation => <Brickwork key={elevation.bond.id} elevation={elevation} />)
  return (
    <>{items}</>
  );
}

const generateElevations = (brickwork, brickDimension) => {
  return brickwork.map(bond => {
    const options = {};
    options.brickDimension = brickDimension;
    options.bond = bond;
    options.numberOfCourses = 4;
    createBrickPalette(options);
    return generate(options);
  });
};

const createBrickPalette = options => {
  const patterns = [ options.bond.pattern.odd, options.bond.pattern.even ];
  const palette = {
    s: options.brickDimension.length,
    h: options.brickDimension.width,
  };

  let unknownDimensions = areThereAnyPatternsWithUnknownBrickDimensions(patterns, palette);
  if (unknownDimensions) {
    const knownPattern = findPatternWhereAllBrickDimensionsAreKnown(patterns);
    if (!knownPattern) {
      throw new Error('Bond does not have a pattern where all dimensions are known');
    }

    const knownWidth = calculateWidthFromPattern(knownPattern, palette);
    console.log('known width:', knownWidth);

    let loop = areThereAnyPatternsWithUnknownBrickDimensions(patterns, palette)

    while(loop) {

      const singleUnknownPattern = findPatternWhereOnlyOneBrickDimensionIsUnknown(patterns, palette);
      if (!singleUnknownPattern) {
        throw new Error('Bond does not have a pattern with a single unknown dimension. Dimensions can not be solved.');
      }
      solveUnknownDimension(singleUnknownPattern, palette, knownWidth);

      loop = false;
    }

  }
};

const mapStateToProps = state => {
  const brickDimension = getBrick(state);
  return { brickDimension };
};

export default connect(mapStateToProps)(BrickworkContainer);
