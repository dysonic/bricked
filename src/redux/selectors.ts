import { Brick } from '../types/brick';

interface RootState {
  brick: Brick
}

export const getBrick = (store:RootState) => store.brick;
