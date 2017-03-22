import {
  GET_PEOPLE,
  GET_PEOPLE_SUCCESS,
  GET_PEOPLE_FAIL,
  GET_PEOPLE_NAMES,
  GET_PEOPLE_NAMES_SUCCESS,
  GET_PEOPLE_NAMES_FAIL,
  GET_MOVIES
} from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  list: [],
  names: [],
  loadingList: false,
  loadingNames: false
};

export default function people(state = initialState, action) {
  switch (action.type) {
    case GET_PEOPLE:
      return ((action, state) => {
        return {
          ...state,
          loadingList: true
        }
      })(action, state);
    case GET_PEOPLE_SUCCESS:
      return ((action, state) => {
        return {
          ...state,
          list: action.data,
          names: _.uniq(state.names.concat(action.data)),
          loadingList: false
        }
      })(action, state);
    case GET_PEOPLE_FAIL:
      return ((action, state) => {
        return {
          ...state,
          loadingList: false
        }
      })(action, state);
    case GET_PEOPLE_NAMES:
      return ((action, state) => {
        return {
          ...state,
          loadingNames: true
        }
      })(action, state);
    case GET_PEOPLE_NAMES_SUCCESS:
      return ((action, state) => {
        return {
          ...state,
          names: state.names.concat(action.data),
          loadingNames: false
        }
      })(action, state);
    case GET_PEOPLE_NAMES_FAIL:
      return ((action, state) => {
        return {
          ...state,
          loadingNames: false
        }
      })(action, state);
    case GET_MOVIES:
      return ((action, state) => {
        const cast = action.filters.cast || [];
        return {
          ...state,
          names: state.names.filter(person => _.includes(cast, person._id))
        }
      })(action, state);
    default:
      return state;
  }
};
