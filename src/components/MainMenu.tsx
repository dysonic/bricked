import React, { FC } from 'react';
import './MainMenu.scss';
import { Link } from 'react-router-dom';

type MainMenuProps = {}

export const MainMenu: FC<MainMenuProps> = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/brick">Brick Dimension</Link>
      <Link to="/coursing-chart">Coursing Chart</Link>
      <Link to="/brickwork">Brickwork</Link>
      <Link to="/build-wall">Build Wall</Link>
      <Link to="/edit-wall">Edit Wall</Link>
    </nav>
  );
};

