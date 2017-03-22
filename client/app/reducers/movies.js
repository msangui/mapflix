import {
  GET_MOVIES,
  GET_MOVIES_SUCCESS,
  GET_MOVIES_FAIL,
  GET_MOVIES_OPTIONS,
  GET_MOVIES_OPTIONS_SUCCESS,
  GET_MOVIES_OPTIONS_FAIL,
  SCROLLED_BOTTOM
} from '../constants/ActionTypes';

const initialState = {
  list: [],
  loadingMovies: false,
  loadingOptions: false,
  loadingMore: false,
  filters: {},
  options: {},
  params: {
    page: 1,
    limit: 50
  }
};

export default function movies(state = initialState, action) {
  switch (action.type) {
    case GET_MOVIES:
      return ((action, state) => {
        return {
          ...state,
          loadingMovies: true,
          loadingMore: false,
          filters: action.filters || {},
          hasMore: true
        }
      })(action, state);
    case GET_MOVIES_SUCCESS:
      return ((action, state) => {
        const list = state.params.page === action.params.page ? action.data : state.list.concat(action.data);
        return {
          ...state,
          list,
          loadingMovies: false,
          params: action.params,
          hasMore: action.data.length === state.params.limit
        }
      })(action, state);
    case GET_MOVIES_FAIL:
      return ((action, state) => {
        return {
          ...state,
          loadingMovies: false

        }
      })(action, state);
    case GET_MOVIES_OPTIONS:
      return ((action, state) => {
        return {
          ...state,
          loadingOptions: true
        }
      })(action, state);
    case GET_MOVIES_OPTIONS_SUCCESS:
      return ((action, state) => {
        return {
          ...state,
          loadingOptions: false,
          options: action.data
        }
      })(action, state);
    case GET_MOVIES_OPTIONS_FAIL:
      return ((action, state) => {
        return {
          ...state,
          loadingOptions: false
        }
      })(action, state);
    case SCROLLED_BOTTOM:
      return ((action, state) => {
        if (state.loadingMore || state.loadingMovies) {
          return state;
        }

        return {
          ...state,
          loadingMore: true
        }
      })(action, state);
    default:
      return state;
  }
};
