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

export const signUpStart = (contactEmailAndPassword) => ({
  type: UserActionTypes.SIGN_UP_START,
  payload: contactEmailAndPassword,
});

export const authorizedSuccess = (authenticatedUser) => ({
  type: UserActionTypes.AUTHORIZED_SUCCESS,
  payload: authenticatedUser,
});

export const authorizedFailure = (error) => ({
  type: UserActionTypes.AUTHORIZED_FAILURE,
  payload: error,
});

export const clearUserError = () => ({
  type: UserActionTypes.ClEAR_USER_ERROR,
});
