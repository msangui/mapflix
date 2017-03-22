import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from './middlewares/promiseMiddleware';
import loggerMiddleware from './middlewares/loggerMiddleware';
import rootReducer from '../reducers/index';
import {routerMiddleware} from 'react-router-redux'

export default function configureStore(initialState, history) {
  const store = createStore(rootReducer, initialState, applyMiddleware(
    loggerMiddleware,
    promiseMiddleware,
    routerMiddleware(history)
  ));
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = rootReducer;
      store.replaceReducer(nextReducer);
    });
  }
  return store;
}
