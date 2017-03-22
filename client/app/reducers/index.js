import {combineReducers} from 'redux';
import movies from './movies';
import people from './people';
import window from './window';
import {routerReducer} from 'react-router-redux'

const rootReducer = combineReducers({
  movies,
  people,
  window,
  routing: routerReducer
});

export default rootReducer;
