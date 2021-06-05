import { BrickDimension } from '../../common/types/brick-dimension';

const localStorageKey = 'brick';

export const getBrick = (): BrickDimension | null => {
  const brickJsonString:string | null = localStorage.getItem(localStorageKey);
  return brickJsonString ? JSON.parse(brickJsonString) : null;
};

export const saveBrick = (brick: BrickDimension) => {
  localStorage.setItem(localStorageKey, JSON.stringify(brick));
};
