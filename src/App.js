import * as React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css';
import { MainMenu } from './components/MainMenu';
import { Home } from './components/Home';
import BrickContainer from './containers/BrickContainer';
import CoursingChartContainer from './containers/CoursingChartContainer';
import BrickworkContainer from './containers/BrickworkContainer';
import BuildWallContainer from './containers/BuildWallContainer';

function App() {
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
                <Route path="/buildwall">
                  <BuildWallContainer />
                </Route>
            </Switch>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
