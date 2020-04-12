import UserActionTypes from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  JWTToken: null,
  error: null,
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UserActionTypes.SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
        error: null,
      };
    case UserActionTypes.SET_USER_JWT_TOKEN:
      return {
        ...state,
        JWTToken: action.payload,
        error: null,
      };
    case UserActionTypes.AUTHORIZED_FAILURE:
      return {
        ...state,
        currentUser: null,
        JWTToken: null,
        error: action.payload,
      };
    case UserActionTypes.ClEAR_USER_ERROR:
      return {
        ...state,
        error: null,
      };
    case UserActionTypes.CLEAR_ALL_USER_DETAILS:
      return {
        ...state,
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};

export default userReducer;
