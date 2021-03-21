import React, { FC } from 'react';
import './MainMenu.css';
import { Link } from 'react-router-dom';

type MainMenuProps = {}

export const MainMenu: FC<MainMenuProps> = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/brick">Brick Dimension</Link>
      <Link to="/coursing-chart">Coursing Chart</Link>
      <Link to="/brickwork">Brickwork</Link>
      <Link to="/buildwall">Build Wall</Link>
    </nav>
  );
};

