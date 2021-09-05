import React, { FC, useState }  from 'react';
import { Wall } from '../../common/types/wall';

type ExportWallFormProps = {
  className?: string,
  wall: Wall,
  onSubmit: Function,
};

const exportFormats = [
  { id: 'obj', label: 'Wavefront .obj file'}
];

export const ExportWallForm: FC<ExportWallFormProps> = ({ wall, onSubmit }) => {
  const [exportFormatId, setExportFormatId] = useState<string>(exportFormats[0].id);

  const exportOptions = [...exportFormats].map((f) =>
    <option key={f.id} value={f.id}>{f.label}</option>
  );

  const handleExportClick = (): void => {
    onSubmit(wall, exportFormatId);
  };

  return (
    <div className="wall-form col-sm-4">
      <form>
        <fieldset>
          <legend>Wall:</legend>
          <div className="row">
            <div className="col-md-6">
              <label id="length-label">Length (mm)</label>
            </div>
            <div className="col-md">
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label id="height-label">Height (mm)</label>
            </div>
            <div className="col-md">
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <label id="export-format-label">Export File Format</label>
            </div>
            <div className="col-md-12">
              <select
                id="export-format"
                aria-labelledby="export-format-label"
                value={exportFormatId}
                onChange={(
                  e: React.ChangeEvent<HTMLSelectElement>,
              ): void => setExportFormatId(e.target.value)}
              >
                {exportOptions}
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-md">
              <button type="button" onClick={handleExportClick}>Export</button>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
