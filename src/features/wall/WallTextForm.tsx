import React, { FC }  from 'react';
import { Wall } from '../../common/types/wall';

const ROWS_BUFFER: number = 5;
const COLS_BUFFER: number = 10;

type WallTextFormProps = {
  wall: Wall,
};

export const WallTextForm: FC<WallTextFormProps> = ({ wall }) => {
  const { courses } = wall;
  const reversedCourses = [...courses].reverse();
  const rows = reversedCourses.length + ROWS_BUFFER;
  const maxCourseLength = reversedCourses.reduce((acc, c) => Math.max(acc, c.length), 0);
  const cols = maxCourseLength + COLS_BUFFER;

  const coursesText: string = reversedCourses.join('\n');

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
