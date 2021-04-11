import React, { FC }  from 'react';
import { Elevation } from '../utils/elevation';

const ROWS_BUFFER: number = 5;
const COLS_BUFFER: number = 10;

type WallTextFormProps = {
  wall: Elevation,
};

export const WallTextForm: FC<WallTextFormProps> = ({ wall }) => {
  console.log('wall:', wall);
  // const courses: Array<string> = [];
  const courses: Array<string> = [...wall.courses].reverse();
  const rows = courses.length + ROWS_BUFFER;
  const maxCourseLength = courses.reduce((acc: number, course:string) => Math.max(acc, course.length), 0);
  const cols = maxCourseLength + COLS_BUFFER;

  const coursesText: string = courses.join('\n');

  return (
    <div className="wall-text-form col-sm-4">
      <form>
        <fieldset>
          <legend>Courses:</legend>
          <div className="row">
            <div className="col-md-6">
              <label id="length-label">Length (mm)</label>
            </div>
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
            <div className="col-md">
              {/* <button type="button" onClick={validate}>Build</button> */}
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default WallTextForm;
