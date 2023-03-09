import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/userEvent";

export const searchByDto = (searchObject) => {
  var url = API_PATH + "/searchEventByDto";
  return axios.post(url, searchObject);
};

export const searchUserEvent = (searchObject) => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};

export const getItemById = (id) => {
  let url = API_PATH + "/getOne" + "/" + id;
  return axios.get(url);
};

export const getItemByEvent = (id) => {
  let url = API_PATH + "/getUserEventByEvent" + "/" + id;
  return axios.get(url);
};

export const setIsJoinedEventForUser = (id) => {
  let url = API_PATH + "/setIsJoinedEventForUser" + "/" + id;
  return axios.get(url);
};

export const addMyEvent = (id, searchObject) => {
  let url = API_PATH + "/save/" + id;
  return axios.post(url, searchObject);
};

export const confirmEvent = (id) => {
  let url = API_PATH + "/save/" + id;
  return axios.post(url);
};
export const resendEmail = (searchDto) => {
  var url = API_PATH + "/resendEmailEvent";
  return axios.post(url, searchDto);
};
export const totalEventAttend = () => {
  let url = API_PATH + "/totalEventAttend";
  return axios.get(url);
};
export const totalLikeByUser = () => {
  let url = API_PATH + "/totalLike";
  return axios.get(url);
};

export const verifyEmail = (otpDto) => {
  let url = API_PATH + "/confirmEvent";
  return axios.post(url, otpDto);
};

export const assignAttendee = (eventDto, userDto) => {
  let url = API_PATH + "/assignAttendee";
  return axios.post(url,eventDto, userDto);
};


