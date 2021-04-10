import { RootState } from './types/root-state';

export const getBrick = (store:RootState) => store.brick;
export const getWall = (store:RootState) => store.wall;
