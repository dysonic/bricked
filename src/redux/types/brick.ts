export const UPDATE_BRICK_LENGTH = 'UPDATE_BRICK_LENGTH';
export const UPDATE_BRICK_WIDTH = 'UPDATE_BRICK_WIDTH';
export const UPDATE_BRICK_HEIGHT = 'UPDATE_BRICK_HEIGHT';

interface UpdateBrickLengthAction {
  type: typeof UPDATE_BRICK_LENGTH,
  value: number,
}

interface UpdateBrickWidthAction {
  type: typeof UPDATE_BRICK_WIDTH,
  value: number,
}

interface UpdateBrickHeightAction {
  type: typeof UPDATE_BRICK_HEIGHT,
  value: number,
}

export type BrickActionTypes = UpdateBrickLengthAction | UpdateBrickWidthAction | UpdateBrickHeightAction;
