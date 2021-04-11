import React, { FC, useState, useRef }  from 'react';
import { Brick } from '../types/brick';
import getNumeric from '../utils/get-numeric';
import { bonds } from '../constants/bonds';

const validateNumber = (value:string | undefined, input:any):boolean => {
  if (value === null || value === '') {
    input.current.setCustomValidity('');
    return false;
  }
  if (value && !/^\d+$/.test(value)) {
    input.current.setCustomValidity('');
    return false;
  }

  input.current.setCustomValidity('');
  return true;
};

type BuildWallFormProps = {
  className?: string,
  brick: Brick,
  onSubmit: Function,
};
export const BuildWallForm: FC<BuildWallFormProps> = ({ brick, onSubmit }) => {
  const [wallLength, setWallLength] = useState<string>();
  const [wallHeight, setWallHeight] = useState<string>();
  const [wallBondId, setWallBondId] = useState<string>(bonds[0].id);

  const inputWallLWallLengthEl = useRef<HTMLInputElement>(null);
  const inputWallLWallHeightEl = useRef<HTMLInputElement>(null);

  const validate = (): void => {
    if (!validateNumber(wallLength, inputWallLWallLengthEl)) {
      return;
    }
    if (!validateNumber(wallHeight, inputWallLWallHeightEl)) {
      return;
    }

    const wl = getNumeric(wallLength);
    const wh = getNumeric(wallHeight);
    onSubmit(wl, wh, wallBondId);
  };

  const bondOptions = [...bonds].map((bond) =>
  <option key={bond.id} value={bond.id}>{bond.label}</option>
);

  return (
    <div className="brick-form col-sm-4">
      <form>
        <fieldset>
          <legend>Wall size:</legend>
          <div className="row">
            <div className="col-md-6">
              <label id="length-label">Length (mm)</label>
            </div>
            <div className="col-md">
              <input
                type="text"
                ref={inputWallLWallLengthEl}
                id="wall-length"
                aria-labelledby="length-label"
                pattern="[0-9]+"
                autoComplete="off"
                value={wallLength}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>,
              ): void => setWallLength(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label id="height-label">Height (mm)</label>
            </div>
            <div className="col-md">
              <input
                type="text"
                ref={inputWallLWallHeightEl}
                id="wall-height"
                aria-labelledby="height-label"
                pattern="[0-9]+"
                autoComplete="off"
                value={wallHeight}
                onChange={(
                  e: React.ChangeEvent<HTMLInputElement>,
              ): void => setWallHeight(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label id="bond-label">Bond</label>
            </div>
            <div className="col-md-12">
              <select
                id="wall-bond"
                aria-labelledby="bond-label"
                value={wallBondId}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>,
              ): void => setWallBondId(e.target.value)}
              >
                {bondOptions}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <button type="button" onClick={validate}>Build</button>
            </div>
          </div>


        </fieldset>
      </form>
    </div>
  );
}

export default BuildWallForm;
