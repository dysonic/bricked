import React, { FC, useRef, useState } from 'react';
import './WallWidget.scss';
import { Wall } from '../types/wall';
import { Brick } from '../types/brick';
import { BrickRatio, getRatios } from '../utils/brick-palette';
import { getCourseHeight } from '../utils/coursing-chart';
import { CoursingChart } from '../types/coursing-chart';

type WallWidgetProps = {
  wall: Wall;
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
  isGap: boolean;
  isSelected: boolean;
}

interface CourseUIState {
  id: string,
  bricks:  Array<BrickUIState>;
}

interface WallUIState {
  courses:  Array<CourseUIState>;
}

const mapBricksToBrickUIStates = (wall: Wall): WallUIState => {
  return {
    courses: wall.courses.map((course): CourseUIState => {
      return {
        id: course.id,
        bricks: course.bricks.map((brick): BrickUIState => {
          return {
            ...brick,
            isSelected: false,
            isGap: false,
          };
        }),
      };
    }),
  };
};

const updateBrickStates = (wall: WallUIState, updatedBricks: Array<BrickUIState>): WallUIState => {
  const updatedBrickIds: Array<string> = updatedBricks.map(ub => ub.id) ;
  return {
    courses: wall.courses.map((course): CourseUIState => {
      return {
        id: course.id,
        bricks: course.bricks.map((brick): BrickUIState => {
          if (updatedBrickIds.includes(brick.id)) {
            const updatedBrick: BrickUIState | undefined = updatedBricks.find(b => b.id === brick.id);
            if (updatedBrick) {
              return {
                ...updatedBrick,
              };
            }
            return brick;
          }
          return brick;
        }),
      };
    }),
  };
};

const getSelectedBricks = (wall: WallUIState): Array<BrickUIState> => {
  const selectedBricks: Array<BrickUIState> = [];
  wall.courses.forEach(course => {
    const selectedCourseBricks = course.bricks.filter(b => b.isSelected);
    selectedBricks.push(...selectedCourseBricks);
  });
  return selectedBricks;
};

const updateBrickSelection = (wall: WallUIState, selectedBricks: Array<BrickUIState>): WallUIState => {
  const selectedBrickIds: Array<string> = selectedBricks.map(sb => sb.id) ;
  return {
    courses: wall.courses.map((course): CourseUIState => {
      return {
        id: course.id,
        bricks: course.bricks.map((brick): BrickUIState => {
          const isSelected = selectedBrickIds.includes(brick.id);
          return {
            ...brick,
            isSelected,
          };
        }),
      };
    }),
  };
};

const findCourseWithBrick = (brick: BrickUIState, wallUi: WallUIState): CourseUIState | undefined => {
  return wallUi.courses.find(c => c.bricks.find(b => b.id === brick.id));
};

const findSameBricksInCourse = (brick: BrickUIState, course:CourseUIState, excludeEnds: boolean = true): Array<BrickUIState> => {
  const lastIndex = course.bricks.length - 1;
  const isNotEndBrick = (i: number): boolean => {
    return !excludeEnds || (i !== 0 && i !== lastIndex);
  };
  return course.bricks.filter((b, i) => b.letter === brick.letter && b.id !== brick.id && isNotEndBrick(i));
}
interface BrickComponentProps {
  brick: BrickUIState;
  handleBrickClick: Function;
}

export const BrickComponent: FC<BrickComponentProps> = ({ brick, handleBrickClick }) => {
  const { isSelected, isGap } = brick;
  return (
    <div
      className={`wall-widget__brick wall-widget__brick--${brick.letter} ${isSelected ? 'wall-widget__brick--active' : ''} ${isGap ? 'wall-widget__brick--gap' : ''}`}
      onClick={(e:any) => handleBrickClick(brick, e)}
    />
  );
}

interface BrickToolsProps {
  course: CourseUIState;
  selectedBricks: Array<BrickUIState>;
  handleToggleGap: Function;
  handleSelectSameBricks: Function;
}

export const BrickTools: FC<BrickToolsProps> = ({ course, handleToggleGap, handleSelectSameBricks }) => {
  const [selectSame, setSelectSame] = useState(false);

  const toogleSelectSame = () => {
    const updatedSelectSame = !selectSame;
    setSelectSame(updatedSelectSame);
    handleSelectSameBricks(updatedSelectSame);
  };

  return (
    <div className="wall-widget__brick-tools">
      <div className="row">
        <input type="checkbox" autoComplete="off" id="select-same" checked={selectSame} onChange={toogleSelectSame} />
        <label htmlFor="select-other-bricks">Select matching bricks</label>
      </div>
      <div className="row">
        <button onClick={(e:any) => handleToggleGap()}>Toggle gap</button>
      </div>
    </div>
  );
}
interface CourseComponentProps {
  course: CourseUIState;
  courseNumber: number;
  courseHeight: number;
  handleBrickClick: Function;
  handleToggleGap: Function;
  handleSelectSameBricks: Function;
}

export const CourseComponent: FC<CourseComponentProps> = (props) => {
  const { course, courseNumber, courseHeight, handleBrickClick, handleToggleGap, handleSelectSameBricks } = props;
  const [isOpen, setOpen] = useState(false);

  const toogleOpen = () => setOpen(!isOpen);

  const brickItems = course.bricks.map((b: BrickUIState) => {
    return (
      <BrickComponent key={b.id} brick={b} handleBrickClick={handleBrickClick} />
    );
  });

  const areAnyBricksSelected = course.bricks.some((b => b.isSelected));
  return (
    <div className="collapse">
      <input type="checkbox" id={`collapse-section-${course.id}`} aria-hidden="true" checked={isOpen} onChange={toogleOpen} />
      <label htmlFor={`collapse-section-${course.id}`} aria-hidden="true"><small>C{courseNumber} {courseHeight}mm</small></label>
      {isOpen && <div>
        <div className="wall-widget__course">{brickItems}</div>
        {areAnyBricksSelected &&
        <BrickTools
          course={course}
          selectedBricks={[]}
          handleToggleGap={handleToggleGap}
          handleSelectSameBricks={handleSelectSameBricks}
        />}
      </div>}
    </div>
  );
}

const renderCourses = (wall: WallUIState, coursingChart: CoursingChart, handleBrickClick: Function, handleToggleGap: Function, handleSelectSameBricks: Function): JSX.Element => {
  const courses = [...wall.courses].reverse();
  const numberOfCourses = courses.length;
  let n: number;
  let height: number;
  const listItems = courses.map((c: CourseUIState, i: number) => {
    n = numberOfCourses - i;
    height = getCourseHeight(n, coursingChart);
    return (
      <li key={c.id} className="wall-widget__row">
        <CourseComponent
          course={c}
          courseNumber={n}
          courseHeight={height}
          handleBrickClick={handleBrickClick}
          handleToggleGap={handleToggleGap}
          handleSelectSameBricks={handleSelectSameBricks}
        />
      </li>
    );
  });
  return (
    <ul>{listItems}</ul>
  );
};

// type BrickUIStateOrNull = BrickUIState | null;

export const WallWidget: FC<WallWidgetProps> = ({ wall }) => {
  const divEl = useRef(null);
  const [collapseRows, setCollapseRows] = useState(false);
  const [wallUi, setWallUi] = useState(mapBricksToBrickUIStates(wall));
  const [selectedBrick, setSelectedBrick] = useState<BrickUIState | null>(null);
  const { coursingChart } = wall;

  // Style bricks to match dimensions
  const brickRatio: BrickRatio = getRatios(wall);
  addBrickPaletteClasses(brickRatio);

  // Collapse rows functionality
  const handleCollapseRows = () => setCollapseRows(!collapseRows);
  const collapseRowsClass = () => collapseRows ? 'wall-widget--collapse-rows' : '';

  const handleBrickClick = (brick: BrickUIState, e:any): void => {
    console.log(`handleBrickClick: #${brick.id} isSelected: ${brick.isSelected}`);
    const isSelected = !brick.isSelected;
    setSelectedBrick(isSelected ? brick : null);
    setWallUi(updateBrickSelection(wallUi, [brick]));
  };

  const handleSelectSameBricks = (selectMatching: boolean) => {
    console.log(`handleSelectSameBricks: selectMatching: ${selectMatching}`);
    if (!selectedBrick) {
      return;
    }
    const course: CourseUIState | undefined = findCourseWithBrick(selectedBrick, wallUi);
    if (!course) {
      return;
    }

    const sameBricks = findSameBricksInCourse(selectedBrick, course);
    const selectedBricks = sameBricks.concat(selectedBrick);
    setWallUi(updateBrickSelection(wallUi, selectedBricks));
  };

  const handleToggleGap = (): void => {
    const selectedBricks = getSelectedBricks(wallUi);
    if (!selectedBricks.length) {
      return;
    }
    const desiredVisibility = !selectedBricks[0].isGap;
    console.log(`handleToggleGap: desiredVisibilty: ${desiredVisibility}`);
    selectedBricks.forEach(b => b.isGap = desiredVisibility);
    setWallUi(updateBrickStates(wallUi, selectedBricks));
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
              onChange={(e: any) => handleCollapseRows()}
              checked={collapseRows}
            /><label htmlFor="collapse-rows">Collapse rows</label>
          </div>
        </div>
      </div>
      {renderCourses(wallUi, coursingChart, handleBrickClick, handleToggleGap, handleSelectSameBricks)}
    </div>
  );
};

export default WallWidget;
