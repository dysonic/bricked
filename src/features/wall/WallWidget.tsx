import React, { FC, useRef, useState } from 'react';
import './WallWidget.scss';
import { Wall } from '../../common/types/wall';
import { getCourseHeight } from '../../common/utils/coursing-chart';
import { CoursingChart } from '../../common/types/coursing-chart';
import { UICourse, UIBrick } from './EditWallContainer';
import { isGap } from '../../common/utils/wall';

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

const findCourseWithBrick = (brick: UIBrick, courses: Array<UICourse>): UICourse | undefined => {
  return courses.find(c => c.bricks.find(b => b.id === brick.id));
};

const findSameBricksInCourse = (brick: UIBrick, course:UICourse, excludeEnds: boolean = true): Array<UIBrick> => {
  const lastIndex = course.bricks.length - 1;
  const isNotEndBrick = (i: number): boolean => {
    return !excludeEnds || (i !== 0 && i !== lastIndex);
  };
  return course.bricks.filter((b, i) => b.letter === brick.letter && isNotEndBrick(i));
}
interface BrickComponentProps {
  brick: UIBrick;
  handleBrickClick: Function;
  determineIfBrickIsSelected: Function;
}

export const BrickComponent: FC<BrickComponentProps> = ({ brick, handleBrickClick, determineIfBrickIsSelected }) => {
  const isSelected = determineIfBrickIsSelected(brick);
  return (
    <div
      className={`wall-widget__brick wall-widget__brick--${brick.letter.toLowerCase()} ${isSelected ? 'wall-widget__brick--active' : ''} ${isGap(brick) ? 'wall-widget__brick--gap' : ''}`}
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
  determineIfBrickIsSelected: Function;
}

export const CourseComponent: FC<CourseComponentProps> = (props) => {
  const { course, courseNumber, courseHeight, handleBrickClick, handleToggleGap, handleSelectSameBricks, determineIfBrickIsSelected } = props;
  const [isSelected, setSelected] = useState(false);

  const toggleSelected = () => setSelected(!isSelected);

  const brickItems = course.bricks.map((b: UIBrick) => {
    return (
      <BrickComponent key={b.id} brick={b} handleBrickClick={handleBrickClick} determineIfBrickIsSelected={determineIfBrickIsSelected} />
    );
  });

  const areAnyBricksSelected = course.bricks.some(b => determineIfBrickIsSelected(b));
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

interface RenderCourseOptions {
  courses: Array<UICourse>;
  coursingChart: CoursingChart;
  handleBrickClick: Function;
  handleToggleGap: Function;
  handleSelectSameBricks: Function;
  determineIfBrickIsSelected: Function;
}
const renderCourses = (options: RenderCourseOptions): JSX.Element => {
  const {
    courses,
    coursingChart,
    handleBrickClick,
    handleToggleGap,
    handleSelectSameBricks,
    determineIfBrickIsSelected,
  } = options;
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
          determineIfBrickIsSelected={determineIfBrickIsSelected}
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
  const [selectedBricks, setSelectedBricks] = useState<Array<UIBrick>>([]);
  const [previouslySelectedBricks, setPreviouslySelectedBricks] = useState<Array<UIBrick>>([]);
  const { coursingChart } = wall;

  let courseMap = courses.reduce((acc, course) => {
    acc[course.id] = course;
    return acc;
  }, {} as Record<string, UICourse>);

  const determineIfBrickIsSelected = (brick: UIBrick): boolean => {
    return !!selectedBricks.find(b => b.id === brick.id);
  };

  const handleBrickClick = (brick: UIBrick, e:any): void => {
    const isBrickSelected = determineIfBrickIsSelected(brick);
    console.log(`handleBrickClick: #${brick.id} isSelected: ${isBrickSelected}`);
    let newSelection: Array<UIBrick>;
    if (isBrickSelected) {
      // Deselect
      newSelection = selectedBricks.filter(b => b.id !== brick.id);
    } else {
      // Select, first deselect bricks that aren't in the same course
      newSelection = selectedBricks.filter(b => b.courseId === brick.courseId);
      newSelection.push(brick);
    }
    setSelectedBricks(newSelection);
  };

  const handleSelectSameBricks = (selectMatching: boolean) => {
    console.log(`handleSelectSameBricks: selectMatching: ${selectMatching}`);
    const selectedBrick: UIBrick = selectedBricks[0];
    const courseId = selectedBricks[0].courseId;
    const course = courseMap[courseId];
    if (!course) {
      return;
    }

    if (selectMatching) {
      const sameBricks = findSameBricksInCourse(selectedBrick, course);
      setPreviouslySelectedBricks(selectedBricks);
      setSelectedBricks(sameBricks);
      return;
    }

    setSelectedBricks(previouslySelectedBricks);
  };

  // const handleToggleGap = (): void => {
  //   const selectedBricks = getSelectedBricks(courses);
  //   if (!selectedBricks.length) {
  //     return;
  //   }
  //   const desiredVisibility = !selectedBricks[0].isGap;
  //   console.log(`handleToggleGap: desiredVisibilty: ${desiredVisibility}`);
  //   selectedBricks.forEach(b => b.isGap = desiredVisibility);
  //   setCourses(updateBrickStates(courses, selectedBricks));
  // };
  const handleToggleGap = (): void => {};

  return (
    <div className="wall-widget">
      <div className="wall-widget__controls">
        <div className="row">
          <div className="col-sm-4">
            <button className="" onClick={(e: any) => saveWall()}>Save</button>
          </div>
        </div>
      </div>
      {renderCourses({
        courses,
        coursingChart,
        handleBrickClick,
        handleToggleGap,
        handleSelectSameBricks,
        determineIfBrickIsSelected,
      })}
    </div>
  );
};

export default WallWidget;
