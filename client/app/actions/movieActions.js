import * as types from '../constants/ActionTypes';
import movieApi from '../api/movieApi';
import _ from 'lodash';

export function getMovies(filters = {}, params = {}) {
  return {
    types: [types.GET_MOVIES, types.GET_MOVIES_SUCCESS, types.GET_MOVIES_FAIL],
    filters,
    params,
    promise: movieApi.get(Object.assign({}, filters, params))
  };
}

export function getOptions() {
  return {
    types: [types.GET_MOVIES_OPTIONS, types.GET_MOVIES_OPTIONS_SUCCESS, types.GET_MOVIES_OPTIONS_FAIL],
    promise: movieApi.options()
  }
}
