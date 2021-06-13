import { nanoid } from '@reduxjs/toolkit'
import { Course } from '../types/course';
import { Brick } from '../types/brick';

export const createCourse = (courseHeight: number, courseNumber: number): Course => ({
  id: nanoid(),
  n: courseNumber,
  height: courseHeight,
  bricks: [],
});

export const createBrick = (brickLetter: string): Brick => ({
  id: nanoid(),
  letter: brickLetter,
});
