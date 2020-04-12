import UserActionTypes from "./user.types";

export const setCurrentUser = (user) => ({
  type: UserActionTypes.SET_CURRENT_USER,
  payload: user,
});

export const setUserJWTToken = (JWTToken) => ({
  type: UserActionTypes.SET_USER_JWT_TOKEN,
  payload: JWTToken,
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

export const deleteUserStart = (JWTToken) => ({
  type: UserActionTypes.DELETE_USER_START,
  payload: JWTToken,
});

export const deleteUserSuccess = () => ({
  type: UserActionTypes.DELETE_USER_SUCCESS,
});

export const clearUserError = () => ({
  type: UserActionTypes.ClEAR_USER_ERROR,
});

export const logoutStart = () => ({
  type: UserActionTypes.LOGOUT_START,
});

export const clearAllUserDetails = () => ({
  type: UserActionTypes.CLEAR_ALL_USER_DETAILS,
});
