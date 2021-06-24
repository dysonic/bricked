import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { WallWidget } from './WallWidget';
import { WallSvg } from './WallSvg';
import { WallTextForm } from './WallTextForm';
import { selectWall, wallSlice, saveWallAsync, updateWallCoursesAndSaveWall, loadWallAsync } from './wallSlice';
import { Wall } from '../../common/types/wall';
import { BrickRatio, getRatios, addBrickPaletteClasses } from '../../common/utils/brick-palette';

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

const mapUIStatesToCourses = (courses: Array<UICourse>): Array<string> => {
  return courses.map(uiCourse => {
    return uiCourse.bricks.map(b => b.letter).join('');
  });
};

export const EditWallContainer: FC<{}> = () => {
  const wall: Wall | null = useSelector(selectWall).current;
  const [context, setContext] = useState(contextWidget);
  const dispatch = useDispatch();

  console.log(`render#${i++} - EditWallContainer`);
  if (!wall) {
    return (
      <p>You need to <Link to="/build-wall">build a wall</Link> before you can edit it.</p>
    );
  }
  const uiCourses: Array<UICourse> = mapWallToUIStates(wall);
  const setUICourses = () => {
    console.log('EditWallContainer setCourses');
  };

  const isWidgetContext = () => context === contextWidget;
  const isSourceContext = () => context === contextSource;
  const isPreviewContext = () => context === contextPreview;

  // Initial set up for <WallWidget />.
  // Style bricks to match dimensions.
  const brickRatio: BrickRatio = getRatios(wall);
  addBrickPaletteClasses(brickRatio);

  const handleSaveWall = () => {
    console.log('handleSaveWall');
    const courses = mapUIStatesToCourses(uiCourses);
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
        {isWidgetContext() && <WallWidget wall={wall} courses={uiCourses} setCourses={setUICourses} saveWall={handleSaveWall} />}
        {isSourceContext() && <WallTextForm wall={wall} />}
        {isPreviewContext() && <WallSvg wall={wall} />}
      </div>
    </div>
  );
}
