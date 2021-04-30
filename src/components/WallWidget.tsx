import React, { FC, useRef } from 'react';
import { nanoid } from 'nanoid';
import './WallWidget.scss';
import { Elevation } from '../types/elevation';
import { BrickPalette, getRatios } from '../utils/brick-palette';

type WallWidgetProps = {
  wall: Elevation,
}

const renderBrick = (brickLetterWithId: BrickLetterWithId): JSX.Element => {
  return (
    <span>{brickLetterWithId.text}</span>
  )
};

const renderCourse = (course: CourseWithId): JSX.Element => {
  const brickLetters = course.text.split('');
  const brickItems = brickLetters.map((brickLetter: string) => {
    const b: BrickLetterWithId = createBrickWithId(brickLetter);
    return (
      <span key={b.id} className={`brick brick--${b.text}`}>{renderBrick(b)}</span>
    );
  });

  return (
    <>{brickItems}</>
  );
};

interface CourseWithId {
  id: string,
  text: string,
}


const createCourseWithId = (course:string):CourseWithId => ({
  id: nanoid(),
  text: course,
});


interface BrickLetterWithId {
  id: string,
  text: string,
}

const createBrickWithId = (brickLetter:string):BrickLetterWithId => ({
  id: nanoid(),
  text: brickLetter,
});


const renderCourses = (wall: Elevation): JSX.Element => {
  const courses: Array<string> = [...wall.courses].reverse();
  const listItems = courses.map((course: string) => {
    const c: CourseWithId = createCourseWithId(course);
    return (
      <li key={c.id}>{renderCourse(c)}</li>
    );
  });
  return (
    <ul>{listItems}</ul>
  );
};

export const WallWidget: FC<WallWidgetProps> = ({ wall }) => {
  const divEl = useRef(null);

  const ratios: BrickPalette = getRatios(wall.brickPalette);

  return (
    <div ref={divEl} className="wall-widget">
      {renderCourses(wall)}
    </div>
  );
};

export default WallWidget;
