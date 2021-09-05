import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { saveAs} from 'file-saver';
import { ExportWallForm } from './ExportWallForm';
import { selectWall } from './wallSlice';
import { Wall } from '../../common/types/wall';

export const ExportWallContainer: FC<{}> = () => {
  const wall: Wall | null = useSelector(selectWall).current;

  // No wall
  if (!wall) {
    return (
      <p>You need to <Link to="/build-wall">build a wall</Link> before you can export it.</p>
    );
  }

  // FileSaver feature detection
  let isFileSaverSupported = false;
  try {
    isFileSaverSupported = !!new Blob;
  } catch (e) {
  }
  console.log('isFileSaverSupported:', isFileSaverSupported);

  const handleSubmit = (wallParam: Wall, exportFormat: string) => {
    console.log('ExportWallContainer - handle submit - export format:', exportFormat);

    // Create wall geometry

    // Getter exporter for file format

    // Create file
    const blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "hello world.txt");
  };

  return (
    <div className="export-wall-form-container row">
      <ExportWallForm className="col-md-4" wall={wall} onSubmit={handleSubmit} />
    </div>
  );
}
