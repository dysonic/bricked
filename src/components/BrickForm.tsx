import React, { FC }  from 'react';
import { BrickDimension } from '../types/brick-dimension';
interface BrickFormProps {
  brick: BrickDimension;
  bricks: Array<BrickDimension>;
  setBrick: Function;
};
export const BrickForm: FC<BrickFormProps> = ({ brick, bricks, setBrick }) => {
  const brickOptions = bricks.map(b =>
    <option key={b.id} value={b.id}>{b.label}</option>
  );

  const handleBrickChange = (brickId: string) => {
    console.log(`handleBrickChange - brickId: ${brickId}`);
    const selectedBrick = bricks.find(b => b.id === brickId);
    if (!selectedBrick) {
      return;
    }
    setBrick(selectedBrick);
  };

  return (
    <form>
      <fieldset>
        <legend>Brick manufacturing size:</legend>
        <div className="row">
          <div className="col-sm-8">
            <label id="brick-label">Brick Dimension</label>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-8">
            <select
              id="wall-brick"
              aria-labelledby="brick-label"
              value={brick.id}
              onChange={(
                e: React.ChangeEvent<HTMLSelectElement>,
            ): void => handleBrickChange(e.target.value)}
            >
              {brickOptions}
            </select>
          </div>
        </div>
      </fieldset>
    </form>
  );
}

export default BrickForm;
