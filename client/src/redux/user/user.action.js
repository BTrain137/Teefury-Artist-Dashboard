import UserActionTypes from "./user.types";

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

export const setUserJWTToken = (JWTToken) => ({
  type: UserActionTypes.SET_USER_JWT_TOKEN,
  payload: JWTToken,
});

export const clearUserAndToken = () => ({
  type: UserActionTypes.USER_LOG_OUT,
});

export const signInStart = (contactEmailAndPassword) => ({
  type: UserActionTypes.SIGN_IN_START,
  payload: contactEmailAndPassword,
});

export const signInSuccess = (authenticatedUser) => ({
  type: UserActionTypes.SIGN_IN_SUCCESS,
  payload: authenticatedUser,
});

export const signInFailure = (error) => ({
  type: UserActionTypes.SIGN_IN_FAILURE,
  payload: error,
});

export const clearUserError = () => ({
  type: UserActionTypes.ClEAR_USER_ERROR,
});
