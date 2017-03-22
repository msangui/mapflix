import {
  CHANGE_SIZE
} from '../constants/ActionTypes';

const initialState = {
  width: window ? window.innerWidth : 0
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SIZE:
      return ((action, state) => {
        return {
          ...state,
          width: action.width
        }
      })(action, state);
    default:
      return state;
  }
};
