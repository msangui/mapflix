import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from './middlewares/promiseMiddleware';
import loggerMiddleware from './middlewares/loggerMiddleware';
import rootReducer from '../reducers/index';
import {routerMiddleware} from 'react-router-redux'

export default function configureStore(initialState, history) {
  let store;
  if (module.hot) {
    store = createStore(rootReducer, initialState, applyMiddleware(
      loggerMiddleware,
      promiseMiddleware,
      routerMiddleware(history)
    ));
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = rootReducer;
      store.replaceReducer(nextReducer);
    });
  } else {
    store = createStore(rootReducer, initialState, applyMiddleware(
      promiseMiddleware,
      routerMiddleware(history)
    ));
  }
  return store;
}
