import React, { FC, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { WallWidget } from './WallWidget';
import { WallSvg } from './WallSvg';
import { WallTextForm } from './WallTextForm';
import { selectWall } from './wallSlice';
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
        isGap: false,
      })),
    };
  });
};

export const EditWallContainer: FC<{}> = () => {
  const wall: Wall | null = useSelector(selectWall).current;
  const [context, setContext] = useState(contextWidget);
  const [uiCourses, setUICourses] = useState<Array<UICourse>>(mapWallToUIStates(wall));

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
        {isWidgetContext() && <WallWidget wall={wall} courses={uiCourses} setCourses={setUICourses} />}
        {isSourceContext() && <WallTextForm wall={wall} />}
        {isPreviewContext() && <WallSvg wall={wall} />}
      </div>
    </div>
  );
}
