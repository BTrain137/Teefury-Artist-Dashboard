import { UserActionTypes } from "./user.types";

export const setCurrentUser = user => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user
});

export const setUserJWTToken = JWTToken => ({
  type: UserActionTypes.SET_USER_JWT_TOKEN,
  payload: JWTToken
});
