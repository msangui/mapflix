import * as types from '../constants/ActionTypes';

export function changeSize(size) {
  return {
    type: types.CHANGE_SIZE,
    ...size
  };
}

export function scrolledBottom() {
  return {
    type: types.SCROLLED_BOTTOM
  };
}

