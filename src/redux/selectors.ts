import { Brick } from '../interfaces/brick';

interface RootState {
  brick: Brick
}

export const getBrick = (store:RootState) => store.brick;
