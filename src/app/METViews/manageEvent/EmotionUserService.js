import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/emtionUser"; 
 
export const addNew = (eventObj) => {
  let url = API_PATH;
  return axios.post(url, eventObj);
};
 

export const getListEmotionUser = (id) => {
  var url = API_PATH + "/getListEmotionUser/"+id;
  return axios.get(url);
};


export const deleteEmotion = (id) => {
  var url = API_PATH + "/deleteEmotion/"+id;
  return axios.delete(url);
};