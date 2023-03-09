import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/users/";
const API_PATH_ROLE = ConstantList.API_ENPOINT + "/api/roles/";
const API_PATH_USERACCOUNT = ConstantList.API_ENPOINT + "/api/userAccount/";

export const searchByPage = (page, pageSize) => {
  var params = page + "/" + pageSize;
  var url = API_PATH + params;
  return axios.get(url);
};

export const searchByDto = (searchByDto) => {
  var url = API_PATH_USERACCOUNT + "searchByDto";
  return axios.post(url, searchByDto);
};


export const findUserByUserName = (username, page, pageSize) => {
  var params = "username/" + username + "/" + page + "/" + pageSize;
  var url = API_PATH + params;
  return axios.get(url);
};

export const SearchUserByUserName = (username, page, pageSize) => {
  var params = page + "/" + pageSize +"/"+ username;
  var url = API_PATH + params;
  return axios.get(url);
};

export const getAllRoles = () => {
  var url = API_PATH_ROLE + 'all';
  return axios.get(url);
};

export const getItemById = id => {
  var url = API_PATH + id;
  return axios.get(url);
};


export const getUserByUsername = (username) => {
  const config = { params: { username: username} };
  var url = API_PATH;
  return axios.get(url, config);
};

export const getUserByEmail = (email) =>{
 // const config = { params: { email: email} };
  var url = ConstantList.API_ENPOINT 
  return axios.post(url, email);
};

export const checkEmail = item => {
  var url =  ConstantList.API_ENPOINT + "/api/userAccount/checkEmail";
  return axios.post(url, item);
};



export const saveUser = user => {
  if(user.id){
    return axios.put(API_PATH, user);
  }else{
    return axios.post(API_PATH, user);
  }
  
};
export const getCurrentUser = () => {
  var url = API_PATH + "getCurrentUser";
  return axios.get(url);  
};
export const getAllByRoles = (searchObject) => {
  var url = API_PATH_USERACCOUNT + "getAllByRoles";
  return axios.post(url, searchObject);
};
