import { combineReducers } from 'redux';
import brick from './brick';
import wall from './wall';

export default combineReducers({
  brick,
  wall,
});
