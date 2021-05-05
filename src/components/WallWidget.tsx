import React, { FC, useRef } from 'react';
import './WallWidget.scss';
import { Elevation } from '../types/elevation';
import { Course } from '../types/course';
import { Brick } from '../types/brick';
import { BrickRatio, getRatios } from '../utils/brick-palette';
import { StringString } from '../types/common';

type WallWidgetProps = {
  wall: Elevation,
}

// https://www.color-hex.com/color-palette/5361
const PASTEL_RED: string = '#ffb3ba';
const PASTEL_ORANGE: string = '#ffdfba';
const PASTEL_YELLOW: string = '#ffffba';
const PASTEL_GREEN: string = '#baffc9';
const PASTEL_BLUE: string = '#bae1ff';

// https://en.wikipedia.org/wiki/Brickwork
const WIKI_STRETCHER: string = '#dc905c';
const WIKI_STRETCHER_BORDER: string = '#f6c2a7';
const WIKI_HEADER: string = '#a87d5d';
const WIKI_HEADER_BORDER: string = 'cba390';
const WIKI_QUEEN_CLOSER: string = '#bd9da2';
const WIKI_QUEEN_CLOSER_BORDER: string = '#efd9dd';

interface ColorPalette extends StringString {
}

const colorPalette: ColorPalette = {
  s: PASTEL_YELLOW,
  h: PASTEL_ORANGE,
  q: PASTEL_RED,
};

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

const renderCourse = (course: Course): JSX.Element => {
  const brickItems = course.bricks.map((b: Brick) => {
    return (
      <div key={b.id} className={`wall-widget__brick wall-widget__brick--${b.letter}`} />
    );
  });

  return (
    <div>
      <p className="wall-widget__course-stats"><small>#{course.n} {course.height}mm</small></p>
      <div className="wall-widget__course">{brickItems}</div>
    </div>
  );
};

const renderCourses = (wall: Elevation): JSX.Element => {
  const courses: Array<Course> = [...wall.courses].reverse();
  const listItems = courses.map((c: Course) => {
    return (
      <li key={c.id} className="wall-widget__row">{renderCourse(c)}</li>
    );
  });
  return (
    <ul>{listItems}</ul>
  );
};

export const WallWidget: FC<WallWidgetProps> = ({ wall }) => {
  const divEl = useRef(null);

  const brickRatio: BrickRatio = getRatios(wall);
  addBrickPaletteClasses(brickRatio);

  return (
    <div ref={divEl} className="wall-widget">
      {renderCourses(wall)}
    </div>
  );
};

export default WallWidget;
