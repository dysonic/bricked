import React from 'react';
import './MainMenu.css';
import { Link } from "react-router-dom";

function MainMenu(props) {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/brick">Brick Dimension</Link>
      <Link to="/coursing-chart">Coursing Chart</Link>
      <Link to="/brickwork">Brickwork</Link>
    </nav>
  );
}

export default MainMenu;
