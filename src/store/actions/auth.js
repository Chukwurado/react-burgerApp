import * as actionTypes from "./actionTypes";
import axios from "axios";
import { key } from "../../apikey";

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (idToken, userId) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    idToken,
    userId
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("epirationDate");
  localStorage.removeItem("userId");
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeOut = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const auth = (email, password, isSignUp) => {
  return async dispatch => {
    dispatch(authStart());
    try {
      const authData = {
        email,
        password,
        returnSecureToken: true
      };
      let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${key}`;

      if (!isSignUp) {
        url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${key}`;
      }
      const res = await axios.post(url, authData);
      const expirationDate = new Date(
        new Date().getTime() + res.data.expiresIn * 1000
      );
      localStorage.setItem("token", res.data.idToken);
      localStorage.setItem("epirationDate", expirationDate);
      localStorage.setItem("userId", res.data.localId);

      dispatch(authSuccess(res.data.idToken, res.data.localId));
      dispatch(checkAuthTimeOut(res.data.expiresIn));
    } catch (err) {
      console.log(err.response.data.error.message);
      dispatch(authFail(err.response.data.error));
    }
  };
};

export const setAuthRedirectPath = path => {
  return {
    type: actionTypes.SET_AUTH_REDIRECT_PATH,
    path
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
    if (!token) {
      dispatch(logout()); //Not required. You can also just return
    } else {
      const expirationDate = new Date(localStorage.getItem("epirationDate"));
      if (expirationDate > new Date()) {
        const userId = localStorage.getItem("userId");
        dispatch(authSuccess(token, userId));
        dispatch(
          checkAuthTimeOut(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      } else {
        dispatch(logout());
      }
    }
  };
};
