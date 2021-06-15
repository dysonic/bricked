import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import './App.scss';
import { loadBrick } from '../features/brick/brickSlice';
import { loadWallAsync } from '../features/wall/wallSlice';
import { MainMenu } from '../components/MainMenu';
import { Home } from '../components/Home';
import { BrickContainer } from '../features/brick/BrickContainer';
import { CoursingChartContainer } from '../features/brick/CoursingChartContainer';
import { BrickworkContainer } from '../features/brick/BrickworkContainer';
import { BuildWallContainer } from '../features/wall/BuildWallContainer';
import { EditWallContainer } from '../features/wall/EditWallContainer';

export const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(loadBrick());
    dispatch(loadWallAsync());
  });
  return (
    <Router>
      <div className="container App">
        <div className="row">
          <div className="col-sm-12">
            <header className="">
                  <h1>Bricked</h1>
            </header>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-2">
            <MainMenu />
          </div>
          <main className="main-content col-sm-12 col-md-10">
            <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/brick">
                  <BrickContainer />
                </Route>
                <Route path="/coursing-chart">
                  <CoursingChartContainer />
                </Route>
                <Route path="/brickwork">
                  <BrickworkContainer />
                </Route>
                <Route path="/build-wall">
                  <BuildWallContainer />
                </Route>
                <Route path="/edit-wall">
                  <EditWallContainer />
                </Route>
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
};
