import { RootState } from '../redux/store';

export const getBrick = (store :RootState) => store.brick;
export const getWall = (store :RootState) => store.wall;
