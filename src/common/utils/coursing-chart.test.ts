import { getCourseHeight } from './coursing-chart';
import { STANDARD_BRICK_76 } from '../constants/coursing-charts';


interface TestCase {
  courseNumber: number,
  expectedHeight:number,
}

test('getCourseHeight function', () => {
  const expected: Array<number> = [
    86, 172, 257, 343, 429, 514, 600,
    686, 772, 857, 943, 1029, 1114, 1200,
  ];

  expected.forEach((expectedHeight: number, index: number) => {
    const courseNumber = index + 1;
    const height = getCourseHeight(courseNumber, STANDARD_BRICK_76);
    expect(height).toBe(expected[index]);
  });
});
