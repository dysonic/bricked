import React, { FC, useRef, useState } from 'react';
import './WallWidget.scss';
import { Elevation } from '../types/elevation';
import { Brick } from '../types/brick';
import { BrickRatio, getRatios } from '../utils/brick-palette';
import { getCourseHeight } from '../utils/coursing-chart';
import { CoursingChart } from '../types/coursing-chart';

type WallWidgetProps = {
  wall: Elevation;
}

// // https://www.color-hex.com/color-palette/5361
// const PASTEL_RED: string = '#ffb3ba';
// const PASTEL_ORANGE: string = '#ffdfba';
// const PASTEL_YELLOW: string = '#ffffba';
// const PASTEL_GREEN: string = '#baffc9';
// const PASTEL_BLUE: string = '#bae1ff';

// // https://en.wikipedia.org/wiki/Brickwork
// const WIKI_STRETCHER: string = '#dc905c';
// const WIKI_STRETCHER_BORDER: string = '#f6c2a7';
// const WIKI_HEADER: string = '#a87d5d';
// const WIKI_HEADER_BORDER: string = 'cba390';
// const WIKI_QUEEN_CLOSER: string = '#bd9da2';
// const WIKI_QUEEN_CLOSER_BORDER: string = '#efd9dd';

// interface ColorPalette extends StringString {
// }

// const colorPalette: ColorPalette = {
//   s: PASTEL_YELLOW,
//   h: PASTEL_ORANGE,
//   q: PASTEL_RED,
// };

const addBrickPaletteClasses = (brickRatio: BrickRatio): void => {
  const STYLE_ID: string = 'brick-style';
  let innerHTML: string = '';
  innerHTML += `.wall-widget .wall-widget__brick { height: ${brickRatio.height}em; }\n`;
  Object.entries(brickRatio.brickPalette).forEach(([brickLetter, width]) => {
    innerHTML += `.wall-widget .wall-widget__brick--${brickLetter} { width: ${width}em; }\n`;
  });


  let style: HTMLElement | null = document.getElementById(STYLE_ID);
  if (!style) {
    style = document.createElement('style');
    style.id = STYLE_ID;
    // style.type = 'text/css';
    style.innerHTML = innerHTML;
    document.getElementsByTagName('head')[0].appendChild(style);
    return;
  }

  style.innerHTML = innerHTML;
};

interface BrickUIState extends Brick {
  isVisible: boolean;
  isSelected: boolean;
}

interface CourseUIState {
  id: string,
  bricks:  Array<BrickUIState>;
}

interface WallUIState {
  courses:  Array<CourseUIState>;
}

interface BrickComponentProps {
  brick: BrickUIState;
  handleBrickClick: Function;
}

const mapBricksToBrickUIStates = (wall: Elevation): WallUIState => {
  return {
    courses: wall.courses.map((course): CourseUIState => {
      return {
        id: course.id,
        bricks: course.bricks.map((brick): BrickUIState => {
          return {
            ...brick,
            isSelected: false,
            isVisible: true,
          };
        }),
      };
    }),
  };
};

const updateBrickState = (wall: WallUIState, updatedBrick: BrickUIState): WallUIState => {
  return {
    courses: wall.courses.map((course): CourseUIState => {
      return {
        id: course.id,
        bricks: course.bricks.map((brick): BrickUIState => {
          if (brick.id === updatedBrick.id) {
            return {
              ...updatedBrick,
            };
          }
          return brick;
        }),
      };
    }),
  };
};

const updateBrickSelection = (wall: WallUIState, updatedBrick: BrickUIState): WallUIState => {
  const resetSelection: boolean = true;
  return {
    courses: wall.courses.map((course): CourseUIState => {
      return {
        id: course.id,
        bricks: course.bricks.map((brick): BrickUIState => {
          if (brick.id === updatedBrick.id) {
            return {
              ...updatedBrick,
            };
          }
          if (resetSelection) {
            return {
              ...brick,
              isSelected: false,
            };
          }
          return brick;
        }),
      };
    }),
  };
};

export const BrickComponent: FC<BrickComponentProps> = ({ brick, handleBrickClick }) => {
  const { isSelected } = brick;
  return (
    <div
      className={`wall-widget__brick wall-widget__brick--${brick.letter} ${isSelected ? 'wall-widget__brick--active' : ''}`}
      onClick={(e:any) => handleBrickClick(brick, e)}
    />
  );
}

const renderCourse = (course: CourseUIState, courseNumber: number, courseHeight: number, handleBrickClick: Function): JSX.Element => {
  const brickItems = course.bricks.map((b: BrickUIState) => {
    return (
      <BrickComponent key={b.id} brick={b} handleBrickClick={handleBrickClick} />
    );
  });

  return (
    <div>
      <p className="wall-widget__course-stats"><small>#{courseNumber} {courseHeight}mm</small></p>
      <div className="wall-widget__course">{brickItems}</div>
    </div>
  );
};

const renderCourses = (wall: WallUIState, coursingChart: CoursingChart, handleBrickClick: Function): JSX.Element => {
  const courses = [...wall.courses].reverse();
  const numberOfCourses = courses.length;
  let n;
  let height;
  const listItems = courses.map((c: CourseUIState, i: number) => {
    n = numberOfCourses - i;
    height = getCourseHeight(n, coursingChart);
    return (
      <li key={c.id} className="wall-widget__row">{renderCourse(c, n, height, handleBrickClick)}</li>
    );
  });
  return (
    <ul>{listItems}</ul>
  );
};

export const WallWidget: FC<WallWidgetProps> = ({ wall }) => {
  const divEl = useRef(null);
  const [collapseRows, setCollapseRows] = useState(false);
  const [wallUi, setWallUi] = useState(mapBricksToBrickUIStates(wall));
  const { coursingChart } = wall;

  // Style bricks to match dimensions
  const brickRatio: BrickRatio = getRatios(wall);
  addBrickPaletteClasses(brickRatio);

  // Collapse rows functionality
  const handleCollapseRowsChange = () => setCollapseRows(!collapseRows);
  const collapseRowsClass = () => collapseRows ? 'wall-widget--collapse-rows' : '';

  const handleBrickClick = (brick: BrickUIState, e:any) => {
    console.log(`handleBrickClick: #${brick.id} isSelected: ${brick.isSelected}`);
    brick.isSelected = !brick.isSelected;

    const updatedWallUi = updateBrickSelection(wallUi, brick);
    setWallUi(updatedWallUi);
    // if (e.ctrlKey)
  };

  return (
    <div ref={divEl} className={`wall-widget ${collapseRowsClass()}`}>
      <div className="wall-widget__controls">
        <div className="row">
          <div className="col-sm-4">
            <input
              type="checkbox"
              autoComplete="off"
              id="collapse-rows"
              onChange={(e: any) => handleCollapseRowsChange()}
              checked={collapseRows}
            /><label htmlFor="collapse-rows">Collapse rows</label>
          </div>
        </div>
      </div>
      {renderCourses(wallUi, coursingChart, handleBrickClick)}
    </div>
  );
};

export default WallWidget;
