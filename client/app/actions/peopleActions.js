import * as types from '../constants/ActionTypes';
import peopleApi from '../api/peopleApi';
import isArray from 'lodash/isArray';
import Promise from 'promise';

export function getPeople(partial) {
  return {
    types: [types.GET_PEOPLE, types.GET_PEOPLE_SUCCESS, types.GET_PEOPLE_FAIL],
    promise: peopleApi.get(partial)
  };
}

export function getPeopleNames(cast) {
  const promise = (cast && isArray(cast) && (cast || []).length) ?
    peopleApi.getNames(cast) : Promise.resolve({data: []});

  return {
    types: [types.GET_PEOPLE_NAMES, types.GET_PEOPLE_NAMES_SUCCESS, types.GET_PEOPLE_NAMES_FAIL],
    promise: promise
  };
}
