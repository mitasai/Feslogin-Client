import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/eventComment";
const API_PATH_PUBLIC = ConstantList.API_ENPOINT + "/public/event/eventComment";
export const searchByDto = (searchObject) => {
  var url = API_PATH_PUBLIC + "/searchByDto";
  return axios.post(url, searchObject);
};

export const searchByParentComment = (searchObject) => {
  var url = API_PATH_PUBLIC + "/searchByParentComment";
  return axios.post(url, searchObject);
};

export const addNewComment = (commentObj) => {
  let url = API_PATH;
  return axios.post(url, commentObj);
};

export const deleteComment = (id) => {
  let url = API_PATH + "/" + id
  return axios.delete(url)
}
