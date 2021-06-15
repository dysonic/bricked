import React, { FC, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { WallWidget } from './WallWidget';
import { WallSvg } from './WallSvg';
import { WallTextForm } from './WallTextForm';
import { selectWall, wallSlice, saveWallAsync, updateWallCoursesAndSaveWall } from './wallSlice';
import { Wall } from '../../common/types/wall';
import { BrickRatio, getRatios, addBrickPaletteClasses } from '../../common/utils/brick-palette';

const contextWidget = 'widget';
const contextSource = 'source';
const contextPreview = 'preview';

const getActiveClass = (context: string, buttonContext: string): string  => context === buttonContext ? 'primary' : '';

export interface UIBrick {
  id: string;
  letter: string;
  isGap: boolean;
  isSelected: boolean;
}

export interface UICourse {
  id: string,
  bricks:  Array<UIBrick>;
}

const mapWallToUIStates = (wall: Wall | null): Array<UICourse> => {
  if (!wall) {
    return [];
  }
  const { courses } = wall;
  return courses.map((course): UICourse => {
    return {
      id: nanoid(),
      bricks: course.split('').map((letter): UIBrick => ({
        id: nanoid(),
        letter,
        isSelected: false,
        isGap: /[a-z]/.test(letter),
      })),
    };
  });
};

const mapUIStatesToCourses = (courses: Array<UICourse>): Array<string> => {
  return courses.map(uiCourse => {
    return uiCourse.bricks.map(b => b.isGap ? b.letter.toLowerCase() : b.letter).join('');
  });
};

export const EditWallContainer: FC<{}> = () => {
  const wall: Wall | null = useSelector(selectWall).current;
  const [context, setContext] = useState(contextWidget);
  const [uiCourses, setUICourses] = useState<Array<UICourse>>(mapWallToUIStates(wall));
  const dispatch = useDispatch();

  console.log('EditWallContainer render');
  if (!wall) {
    return (
      <p>You need to <Link to="/build-wall">build a wall</Link> before you can edit it.</p>
    );
  }

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
