import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/tag";
const API_PATH_PUBLIC = ConstantList.API_ENPOINT + "/public/event/tag";

export const searchByDto = (searchObject) => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};

export const searchPublicByDto = (searchObject) => {
  var url = API_PATH_PUBLIC + "/searchByDto";
  return axios.post(url, searchObject);
};

export const deleteItem = (id) => {
  let url = API_PATH + "/" + id;
  return axios.delete(url);
};

export const getItemById = (id) => {
  let url = API_PATH + "/" + id;
  return axios.get(url);
};
export const checkCode = (id, code) => {
  let url = API_PATH + "/checkCode";
  const config = { params: { id: id, code: code } };
  return axios.get(url, config);
};

export const addNew = (obj) => {
  let url = API_PATH;
  return axios.post(url, obj);
};

export const update = (obj) => {
  let url = API_PATH + "/" + obj.id;
  return axios.put(url, obj);
};
