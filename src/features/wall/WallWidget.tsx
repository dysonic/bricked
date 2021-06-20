import React, { FC, useRef, useState } from 'react';
import './WallWidget.scss';
import { Wall } from '../../common/types/wall';
import { getCourseHeight } from '../../common/utils/coursing-chart';
import { CoursingChart } from '../../common/types/coursing-chart';
import { UICourse, UIBrick } from './EditWallContainer';

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

const updateBrickStates = (courses: Array<UICourse>, updatedBricks: Array<UIBrick>): Array<UICourse> => {
  const updatedBrickIds: Array<string> = updatedBricks.map(ub => ub.id) ;
  return courses.map((course): UICourse => {
    return {
      id: course.id,
      bricks: course.bricks.map((brick): UIBrick => {
        if (updatedBrickIds.includes(brick.id)) {
          const updatedBrick: UIBrick | undefined = updatedBricks.find(b => b.id === brick.id);
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
  });
};

const getSelectedBricks = (courses: Array<UICourse>): Array<UIBrick> => {
  const selectedBricks: Array<UIBrick> = [];
  courses.forEach(course => {
    const selectedCourseBricks = course.bricks.filter(b => b.isSelected);
    selectedBricks.push(...selectedCourseBricks);
  });
  return selectedBricks;
};

const updateBrickSelection = (courses: Array<UICourse>, selectedBricks: Array<UIBrick>): Array<UICourse> => {
  const selectedBrickIds: Array<string> = selectedBricks.map(sb => sb.id) ;
  return courses.map((course): UICourse => {
    return {
      id: course.id,
      bricks: course.bricks.map((brick): UIBrick => {
        const isSelected = selectedBrickIds.includes(brick.id);
        return {
          ...brick,
          isSelected,
        };
      }),
    };
  });
};

const findCourseWithBrick = (brick: UIBrick, courses: Array<UICourse>): UICourse | undefined => {
  return courses.find(c => c.bricks.find(b => b.id === brick.id));
};

const findSameBricksInCourse = (brick: UIBrick, course:UICourse, excludeEnds: boolean = true): Array<UIBrick> => {
  const lastIndex = course.bricks.length - 1;
  const isNotEndBrick = (i: number): boolean => {
    return !excludeEnds || (i !== 0 && i !== lastIndex);
  };
  return course.bricks.filter((b, i) => b.letter === brick.letter && b.id !== brick.id && isNotEndBrick(i));
}
interface BrickComponentProps {
  brick: UIBrick;
  handleBrickClick: Function;
}

export const BrickComponent: FC<BrickComponentProps> = ({ brick, handleBrickClick }) => {
  const { isSelected, isGap } = brick;
  return (
    <div
      className={`wall-widget__brick wall-widget__brick--${brick.letter.toLowerCase()} ${isSelected ? 'wall-widget__brick--active' : ''} ${isGap ? 'wall-widget__brick--gap' : ''}`}
      onClick={(e:any) => handleBrickClick(brick, e)}
    />
  );
}

interface BrickToolsProps {
  course: UICourse;
  selectedBricks: Array<UIBrick>;
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
        <label htmlFor="select-other-bricks">Select matching interior bricks</label>
      </div>
      <div className="row">
        <button onClick={(e:any) => handleToggleGap()}>Toggle gap</button>
      </div>
    </div>
  );
}
interface CourseComponentProps {
  course: UICourse;
  courseNumber: number;
  courseHeight: number;
  handleBrickClick: Function;
  handleToggleGap: Function;
  handleSelectSameBricks: Function;
}

export const CourseComponent: FC<CourseComponentProps> = (props) => {
  const { course, courseNumber, courseHeight, handleBrickClick, handleToggleGap, handleSelectSameBricks } = props;
  const [isSelected, setSelected] = useState(false);

  const toggleSelected = () => setSelected(!isSelected);

  const brickItems = course.bricks.map((b: UIBrick) => {
    return (
      <BrickComponent key={b.id} brick={b} handleBrickClick={handleBrickClick} />
    );
  });

  const areAnyBricksSelected = course.bricks.some((b => b.isSelected));
  return (
    <div className="">
      <input type="checkbox" id={`select-course-${course.id}`} checked={isSelected} onChange={toggleSelected} />
      <label htmlFor={`collapse-section-${course.id}`} aria-hidden="true"><small>C{courseNumber} {courseHeight}mm</small></label>
      <div>
        <div className="wall-widget__course">{brickItems}</div>
        {areAnyBricksSelected &&
        <BrickTools
          course={course}
          selectedBricks={[]}
          handleToggleGap={handleToggleGap}
          handleSelectSameBricks={handleSelectSameBricks}
        />}
      </div>
    </div>
  );
}

const renderCourses = (courses: Array<UICourse>, coursingChart: CoursingChart, handleBrickClick: Function, handleToggleGap: Function, handleSelectSameBricks: Function): JSX.Element => {
  const reversedCourses = [...courses].reverse();
  const numberOfCourses = courses.length;
  let n: number;
  let height: number;
  const listItems = reversedCourses.map((c: UICourse, i: number) => {
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

// type BrickUIStateOrNull = UIBrick | null;

type WallWidgetProps = {
  wall: Wall;
  courses: Array<UICourse>;
  setCourses: Function;
  saveWall: Function;
}
export const WallWidget: FC<WallWidgetProps> = ({ wall, courses, setCourses, saveWall }) => {
  const divEl = useRef(null);
  const [selectedBrick, setSelectedBrick] = useState<UIBrick | null>(null);
  const { coursingChart } = wall;

  const handleBrickClick = (brick: UIBrick, e:any): void => {
    console.log(`handleBrickClick: #${brick.id} isSelected: ${brick.isSelected}`);
    const isSelected = !brick.isSelected;
    setSelectedBrick(isSelected ? { ...brick, isSelected } : null);
    setCourses(updateBrickSelection(courses, [brick]));
  };

  const handleSelectSameBricks = (selectMatching: boolean) => {
    console.log(`handleSelectSameBricks: selectMatching: ${selectMatching}`);
    if (!selectedBrick) {
      return;
    }
    const course: UICourse | undefined = findCourseWithBrick(selectedBrick, courses);
    if (!course) {
      return;
    }

    const sameBricks = findSameBricksInCourse(selectedBrick, course);
    const selectedBricks = sameBricks.concat(selectedBrick);
    setCourses(updateBrickSelection(courses, selectedBricks));
  };

  const handleToggleGap = (): void => {
    const selectedBricks = getSelectedBricks(courses);
    if (!selectedBricks.length) {
      return;
    }
    const desiredVisibility = !selectedBricks[0].isGap;
    console.log(`handleToggleGap: desiredVisibilty: ${desiredVisibility}`);
    selectedBricks.forEach(b => b.isGap = desiredVisibility);
    setCourses(updateBrickStates(courses, selectedBricks));
  };

  return (
    <div ref={divEl} className="wall-widget">
      <div className="wall-widget__controls">
        <div className="row">
          <div className="col-sm-4">
            <button className="" onClick={(e: any) => saveWall()}>Save</button>
          </div>
        </div>
      </div>
      {renderCourses(courses, coursingChart, handleBrickClick, handleToggleGap, handleSelectSameBricks)}
    </div>
  );
};

export default WallWidget;
