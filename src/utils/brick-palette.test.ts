import {
  _getShortestBrick,
  getRatios,
  BrickPalette,
} from './brick-palette'

const brickPalette: BrickPalette = {
  h: 110,
  s: 230,
  q: 50,
};

test('_getShortestBrick function', () => {
  const shortestBrick: string = _getShortestBrick(brickPalette);

  expect(shortestBrick).toBe('q');
});

test('getRatios function', () => {
  const ratios: BrickPalette = getRatios(brickPalette);

  expect(ratios).toEqual({
    h: 2.2,
    s: 4.6,
    q: 1,
  });
});
