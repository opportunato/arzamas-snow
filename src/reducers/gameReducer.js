import { TAKE_PHOTO, FAIL_PHOTO } from '../actions/gameActions';
import walkers from '../walkers.json';

const walkersLength = walkers.length;

export const getInitialState = () => ({
  walker: walkers[Math.floor(Math.random() * walkersLength)],
});

const gameReducer = (state = getInitialState(), { type }) => {
  switch (type) {
    case TAKE_PHOTO:
      return {
        ...state,
        photoTaken: true
      };
    case FAIL_PHOTO:
      return {
        ...state,
        photoFailed: true
      };
    default:
      return state;
  }
};

export default gameReducer;
