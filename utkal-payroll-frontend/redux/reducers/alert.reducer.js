import { alertConstants } from "../constants/alert.constants";

export function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        ...state,
        type: "success",
        message: action.message,
      };
    case alertConstants.ERROR:
      return {
        ...state,
        type: "error",
        message: action.message,
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state;
  }
}
