import React, { FC, useState } from 'react';
import { nanoid } from 'nanoid';
import { WallWidget } from '../components/WallWidget';
import { WallSvg } from '../components/WallSvg';
import { WallTextForm } from '../components/WallTextForm';
import { connect, ConnectedProps } from 'react-redux';
import { getWall } from '../redux/selectors';
import { RootState } from '../redux/types/root-state';
import { Wall } from '../types/wall';
import { BrickRatio, getRatios, addBrickPaletteClasses } from '../utils/brick-palette';

const CONTEXT_WIDGET = 'widget';
const CONTEXT_SOURCE = 'source';
const CONTEXT_PREVIEW = 'preview';

const mapState = (state: RootState) => {
  const wall = getWall(state);
  return {
    wall,
  };
};

const connector = connect(mapState);

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

const mapWallToUIStates = (wall: Wall): Array<UICourse> => {
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

type PropsFromRedux = ConnectedProps<typeof connector>
const EditWallContainer: FC<PropsFromRedux> = ({ wall }) => {
  const [context, setContext] = useState(CONTEXT_WIDGET);
  const [uiCourses, setUICourses] = useState(mapWallToUIStates(wall));

  const isWidgetContext = () => context === CONTEXT_WIDGET;
  const isSourceContext = () => context === CONTEXT_SOURCE;
  const isPreviewContext = () => context === CONTEXT_PREVIEW;

  // Initial set up for <WallWidget />.
  // Style bricks to match dimensions.
  const brickRatio: BrickRatio = getRatios(wall);
  addBrickPaletteClasses(brickRatio);

  return (
    <div>
      <div className="row">
        <div className="col-sm-4"></div>
          <div className="button-group">
            <button className={getActiveClass(context, CONTEXT_WIDGET)} onClick={(e: any) => setContext(CONTEXT_WIDGET)}>Widget</button>
            <button className={getActiveClass(context, CONTEXT_SOURCE)} onClick={(e: any) => setContext(CONTEXT_SOURCE)}>Source</button>
            <button className={getActiveClass(context, CONTEXT_PREVIEW)} onClick={(e: any) => setContext(CONTEXT_PREVIEW)}>Preview</button>
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

export default connector(EditWallContainer);
