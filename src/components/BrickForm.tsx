import React, { FC, useState }  from 'react';
import { Brick } from '../interfaces/brick';
import getNumeric from '../utils/get-numeric';

type BrickFormProps = {
  className?: string,
  brick: Brick
  updateBrickLength: Function,
  updateBrickWidth: Function,
  updateBrickHeight: Function,
};
export const BrickForm: FC<BrickFormProps> = ({ brick,  updateBrickLength, updateBrickWidth, updateBrickHeight}) => {
  const [length, setLength] = useState(brick.length);
  const [width, setWidth] = useState(brick.width);
  const [height, setHeight] = useState(brick.height);

  const handleLengthChange = (e:any) => {
    setLength(e.target.value);
    const value = getNumeric(e.target.value);
    if (value !== null) {
      updateBrickLength(value);
    }
  };

  const handleWidthChange = (e:any) => {
    setWidth(e.target.value);
    const value = getNumeric(e.target.value);
    if (value !== null) {
      updateBrickWidth(value);
    }
  };

  const handleHeightChange = (e:any) => {
    setHeight(e.target.value);
    const value = getNumeric(e.target.value);
    if (value !== null) {
      updateBrickHeight(value);
    }
  };

  return (
    <div className="brick-form col-sm-4">
      <form>
        <fieldset>
          <legend>Brick manufacturing size:</legend>
          <div className="row">
            <div className="col-md-6">
              <label id="length-label">Length (Stretcher)</label>
            </div>
            <div className="col-md">
              <input
                aria-labelledby="length-label"
                value={length}
                onChange={handleLengthChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label id="width-label">Width (Header)</label>
            </div>
            <div className="col-md">
              <input
                aria-labelledby="width-label"
                value={width}
                onChange={handleWidthChange}/>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label id="height-label">Height</label>
            </div>
            <div className="col-md">
              <input
                aria-labelledby="height-label"
                value={height}
                onChange={handleHeightChange}/>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default BrickForm;
