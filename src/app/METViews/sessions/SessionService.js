import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/auth";

export const signUpAccount = item => {
  var url = API_PATH + "/register";
  return axios.post(url, item);
};
 

export const registerFaceBook = item => {
  var url = API_PATH + "registerFaceBook";
  return axios.post(url, item);
};

export const checkuserName = item => {
  var url = API_PATH + "checkUsername";
  return axios.post(url, item);
};

export const checkEmail = item => {
  var url = API_PATH + "checkEmail";
  return axios.post(url, item);
};

export const checkEmailByEmailAndWithOutUsername = item => {
  var url = API_PATH + "checkEmailByEmailAndWithOutUsername";
  return axios.post(url, item);
};

export const checkRePassword = item => {
  var url = API_PATH + "checkRePassword";
  return axios.post(url, item);
};

export const checkReEmail = item => {
  var url = API_PATH + "checkReEmail";
  return axios.post(url, item);
};

// Only need email to getToken
export const forgotPassword = (email) => {
  var url = API_PATH + "/forgot-password";
  return axios.post(url, email);
};

// Email and password to save user
export const confirmForgotPassword = (token, id) => {
  var url = API_PATH + `confirmResetPassword`;
  const params = {
    token: token,
    id: id,
  };
  return axios({ method: "get", url: url, params: params });
};

export const resetPassword = (user, token) => {
  let url = API_PATH + "saveNewPassword"
  return axios({
    method: "post",
    url: url,
    params: {
      token: token
    },
    data: user
  })
}

export const resendEmail = (user) => {
  var url = API_PATH + "resendEmail";

  return axios.post(url, user);
};


export const resendActiveAccountWithAnotherEmail = (user) => {
  var url = API_PATH + "resendActiveAccountWithAnotherEmail"; 
  return axios.post(url, user);
};