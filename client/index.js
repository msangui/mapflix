import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import Movies from './app/containers/Movies';
import configureStore from './app/store/configureStore';
import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'react-router-redux';
import createHistory from 'history/createBrowserHistory'

const history = createHistory();
const store = configureStore({}, history);
import './index.scss';

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <Route name="movies" path="/" component={Movies}/>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
