import { Wall } from '../../common/types/wall';

const localStorageKey = 'wall';

export const getWall = (): Wall | null => {
  const wallJsonString:string | null = localStorage.getItem(localStorageKey);
  return wallJsonString ? JSON.parse(wallJsonString) : null;
};

export const saveWall = (wall: Wall) => {
  localStorage.setItem(localStorageKey, JSON.stringify(wall));
};
