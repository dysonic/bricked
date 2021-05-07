import React, { FC }  from 'react';
import { Wall } from '../types/wall';
import { Course } from '../types/course';
import { Brick } from '../types/brick';

const ROWS_BUFFER: number = 5;
const COLS_BUFFER: number = 10;

type WallTextFormProps = {
  wall: Wall,
};

export const WallTextForm: FC<WallTextFormProps> = ({ wall }) => {
  // const courses: Array<string> = [];
  const courses: Array<Course> = [...wall.courses].reverse();
  const coursesAsStrings: Array<string> = courses.map((course: Course) => {
    return course.bricks.map((brick: Brick) => brick.letter).join('');
  });
  console.log('coursesAsStrings:', coursesAsStrings);
  const rows = coursesAsStrings.length + ROWS_BUFFER;
  const maxCourseLength = coursesAsStrings.reduce((acc: number, course: string): number => Math.max(acc, course.length), 0);
  const cols = maxCourseLength + COLS_BUFFER;

  const coursesText: string = coursesAsStrings.join('\n');

  return (
    <div className="wall-text-form col-sm">
      <form>
        <fieldset>
          <legend>Courses:</legend>
          <div className="row">
            <div className="col-md">
              <textarea
                id="wall-courses"
                aria-labelledby="length-label"
                rows={rows}
                cols={cols}
                autoComplete="off"
                value={coursesText}
              //   onChange={(
              //     e: React.ChangeEvent<HTMLInputElement>,
              // ): void => setWallLength(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm">
              {/* <button type="button" onClick={validate}>Build</button> */}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default WallTextForm;
