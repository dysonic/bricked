import React, { FC, useState } from 'react';
import { WallWidget } from '../components/WallWidget';
import { ElevationSvg } from '../components/ElevationSvg';
import { WallTextForm } from '../components/WallTextForm';
import { connect, ConnectedProps } from 'react-redux';
import { getBrick, getWall } from '../redux/selectors';
import { RootState } from '../redux/types/root-state';

const CONTEXT_WIDGET = 'widget';
const CONTEXT_SOURCE = 'source';
const CONTEXT_PREVIEW = 'preview';

const mapState = (state: RootState) => {
  const brick = getBrick(state);
  const wall = getWall(state);
  return {
    brick,
    wall,
  };
};

const connector = connect(mapState);

const getActiveClass = (context: string, buttonContext: string): string  => context === buttonContext ? 'primary' : '';

type PropsFromRedux = ConnectedProps<typeof connector>
const EditWallContainer: FC<PropsFromRedux> = ({ brick, wall }) => {
  const [context, setContext] = useState(CONTEXT_WIDGET);

  const isWidgetContext = () => context === CONTEXT_WIDGET;
  const isSourceContext = () => context === CONTEXT_SOURCE;
  const isPreviewContext = () => context === CONTEXT_PREVIEW;

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
        {isWidgetContext() && <WallWidget wall={wall} />}
        {isSourceContext() && <WallTextForm wall={wall} />}
        {isPreviewContext() && <ElevationSvg elevation={wall} />}
      </div>
    </div>
  );
}

export default connector(EditWallContainer);
