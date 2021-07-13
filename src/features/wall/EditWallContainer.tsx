import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import md5 from 'md5';
import { WallWidget } from './WallWidget';
import { WallSvg } from './WallSvg';
import { WallTextForm } from './WallTextForm';
import { selectWall, wallSlice, saveWallAsync, updateWallCoursesAndSaveWall, loadWallAsync } from './wallSlice';
import { Wall } from '../../common/types/wall';
import { BrickRatio, getRatios, addBrickPaletteClasses } from '../../common/utils/brick-palette';
import { coursesToString, isGap } from '../../common/utils/wall';

const contextWidget = 'widget';
const contextSource = 'source';
const contextPreview = 'preview';

let i = 1;

const getActiveClass = (context: string, buttonContext: string): string  => context === buttonContext ? 'primary' : '';

export interface UIBrick {
  id: string;
  courseId: string;
  letter: string;
}
export interface UICourse {
  id: string,
  bricks:  Array<UIBrick>;
}

const mapWallToUIStates = (wall: Wall): Array<UICourse> => {
  const { courses } = wall;
  return courses.map((course): UICourse => {
    const courseId = nanoid();
    return {
      id: courseId,
      bricks: course.split('').map((letter): UIBrick => ({
        id: nanoid(),
        courseId: courseId,
        letter,
      })),
    };
  });
};

const mapUICoursesToCourses = (courses: Array<UICourse>): Array<string> => {
  return courses.map(uiCourse => mapUICourseToCourse(uiCourse));
};

const mapUICourseToCourse = (uiCourse: UICourse): string => {
  return uiCourse.bricks.map(b => b.letter).join('');
};

export const EditWallContainer: FC<{}> = () => {
  const wall: Wall | null = useSelector(selectWall).current;
  const [context, setContext] = useState(contextWidget);
  const [uiCourses, setUICourses] = useState<Array<UICourse>>([]);
  const [prevKey, setPrevKey] = useState('');
  const dispatch = useDispatch();

  console.log(`render#${i++} - EditWallContainer`);
  if (!wall) {
    return (
      <p>You need to <Link to="/build-wall">build a wall</Link> before you can edit it.</p>
    );
  }

  // Initialise UI state
  const key = md5(coursesToString(wall));
  if (key !== prevKey) {
    setUICourses(mapWallToUIStates(wall));
    setPrevKey(key);
  }

  // const uiCourses: Array<UICourse> = mapWallToUIStates(wall);
  // const setUICourses = () => {
  //   console.log('EditWallContainer setCourses');
  // };

  const isWidgetContext = () => context === contextWidget;
  const isSourceContext = () => context === contextSource;
  const isPreviewContext = () => context === contextPreview;

  // Initial set up for <WallWidget />.
  // Style bricks to match dimensions.
  const brickRatio: BrickRatio = getRatios(wall);
  addBrickPaletteClasses(brickRatio);

  const handleToggleGap = (bricks: Array<UIBrick>): void => {
    const brickLetter = bricks[0].letter;
    const newIsGap = !isGap(brickLetter);
    const newLetter = newIsGap ? brickLetter.toLowerCase() : brickLetter.toUpperCase();
    const brickIds = bricks.map(b => b.id);

    console.log(`handleToggleGap: newIsGap: ${newIsGap}`);
    const newUiCourses = uiCourses.map(uiCourse => {
      return {
        ...uiCourse,
        bricks: uiCourse.bricks.map(b => {
          const letter = brickIds.includes(b.id) ? newLetter : b.letter;
          return {
            ...b,
            letter,
          };
        }),
      };
    });
    setUICourses(newUiCourses);
  };

  const handleFillToTop = (selectedCourses: Array<UICourse>): void => {
    console.log(`handleFillToTop: selectedCourses: #${selectedCourses.length}`);
    if (selectedCourses.length === 0) {
      return;
    }

    // Courses can be selected in a random order. Match the wall order.
    const selectedCourseIds = selectedCourses.map(c => c.id);
    const sortedSelectedCourses = uiCourses.filter(c => selectedCourseIds.includes(c.id));
    const lastSelectedCourse = sortedSelectedCourses[sortedSelectedCourses.length-1];
    const lastIndex = uiCourses.findIndex(c => c.id === lastSelectedCourse.id);
    if (lastIndex === -1) {
      return;
    }
    const replaceFromIndex = lastIndex+1;
    console.log(`handleFillToTop: replaceFromIndex: ${replaceFromIndex}`);

    let newCourses: Array<string> = [];
    if (replaceFromIndex > 0) {
      newCourses = wall.courses.slice(0, replaceFromIndex);
    }
    const selectedCourseStrings = mapUICoursesToCourses(sortedSelectedCourses);
    let j: number = 0;
    const numberOfCourses = wall.courses.length;
    for (let i: number = replaceFromIndex; i < numberOfCourses; i++) {
      newCourses.push(selectedCourseStrings[j]);
      j++;
      if (j === selectedCourseStrings.length) {
        j = 0;
      }
    }

    // console.log('newCourses:', newCourses);
    dispatch(wallSlice.actions.updateWallCourses(newCourses));
  };

  const handleSaveWall = () => {
    console.log('handleSaveWall');
    const courses = mapUICoursesToCourses(uiCourses);
    // dispatch(wallSlice.actions.updateWallCourses(courses));
    // dispatch(saveWallAsync(wall));

    dispatch(updateWallCoursesAndSaveWall(courses));
  }

  return (
    <div>
      <div className="row">
        <div className="col-sm-4"></div>
          <div className="button-group">
            <button className={getActiveClass(context, contextWidget)} onClick={(e: any) => setContext(contextWidget)}>Widget</button>
            <button className={getActiveClass(context, contextSource)} onClick={(e: any) => setContext(contextSource)}>Source</button>
            <button className={getActiveClass(context, contextPreview)} onClick={(e: any) => setContext(contextPreview)}>Preview</button>
          </div>
      </div>
      <div>
        {isWidgetContext() && <WallWidget
          key={key}
          wall={wall}
          courses={uiCourses}
          setCourses={setUICourses}
          handleToggleGap={handleToggleGap}
          saveWall={handleSaveWall}
          handleFillToTop={handleFillToTop}
        />}
        {isSourceContext() && <WallTextForm key={key} wall={wall} />}
        {isPreviewContext() && <WallSvg key={key} wall={wall} />}
      </div>
    </div>
  );
}
