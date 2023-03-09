import axios from "axios";
import localStorageService from "../../services/localStorageService";
import ConstantList from "../../appConfig";
// import { findUserByUserName } from "../User/UserService";
const API_PATH = ConstantList.API_ENPOINT;
const API_PATH_Partner = ConstantList.API_ENPOINT + "/api/partner/";
const API_PATH_apiKey = ConstantList.API_ENPOINT + "/api/userPartner/";

export const getCurrentUser = ()=> {
  axios.defaults.headers.common['Authorization'] = `Bearer ` + localStorageService.getItem('jwt_fes');
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  var url = API_PATH + "/auth/info";
  return axios.get(url);
};

export const updateAccount = (item) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ` + localStorageService.getItem('jwt_fes');
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  var url =  ConstantList.API_ENPOINT + "/auth/update";
  return axios.put(url, item);
};

export const signUpAccount = item => {
  var url = API_PATH + "register";
  return axios.post(url, item);
};

export const getListPartner = (searchObject) => {
  return axios.post(API_PATH_Partner + "searchByDto", searchObject);
};

export const listApiKey = (searchObject) => {
  return axios.post(API_PATH_apiKey + "userKey", searchObject);
};
