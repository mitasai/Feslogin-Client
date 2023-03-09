import axios from "axios";
import ConstantList from "../../appConfig";
const API_PATH = ConstantList.API_ENPOINT + "/api/event";
const API_PATH_PUBLIC = ConstantList.API_ENPOINT + "/public/event";
const API_PATH_USEREVENT = ConstantList.API_ENPOINT + "/api/userEvent";

export const searchByDto = (searchObject) => {
  var url = API_PATH_PUBLIC + "/searchByDto";
  return axios.post(url, searchObject);
};

export const searchByDtoPrivate = (searchObject) => {
  var url = API_PATH + "/searchByDto";
  return axios.post(url, searchObject);
};

export const deleteItem = (id) => {
  let url = API_PATH + "/" + id;
  return axios.delete(url);
};

export const getItemById = (id, isLoggedIn) => {
  if (isLoggedIn) {
    let url = API_PATH + "/" + id;
    return axios.get(url);
  } else {
    let url = API_PATH_PUBLIC + "/" + id;
    return axios.get(url);
  }

};
export const checkCode = (id, code) => {
  let url = API_PATH + "/checkCode";
  const config = { params: { id: id, code: code } };
  return axios.get(url, config);
};
export const toogleFavouriteEvent = (id) => {
  let url = API_PATH + "/toogleFavouriteEvent/" + id;
  return axios.post(url);
};
export const addNew = (eventObj) => {
  let url = API_PATH;
  return axios.post(url, eventObj);
};

export const update = (eventObj) => {
  let url = API_PATH + "/" + eventObj.id;
  return axios.put(url, eventObj);
};

export const totalUserAttend = () => {
  let url = API_PATH + "/totalUserAttend";
  return axios.get(url);
};

export const getExcel = (list) => {
  var urll = API_PATH + "/excel";
  return axios({
    url: urll,
    method: "POST",
    responseType: "blob", // important
    data: list,
  });
};

export const getListUserJoin = (searchObject, id) => {
  var url = API_PATH_PUBLIC + "/getListUserJoin/" + id;
  return axios.post(url, searchObject);
};

export const getListUserJoinNotYet = (searchObject, id) => {
  var url = API_PATH_PUBLIC + "/getListUserJoinNotYet/" + id;
  return axios.post(url, searchObject);
};

export const getPlayUrlByRecordId = (roomId, recordId) => {
  let url = API_PATH + "/getUrlPlayRecord/" + roomId + "/" + recordId;
  return axios.get(url);
};

export const listUserByEvent = (searchObject, id) => {
  var url = API_PATH_PUBLIC + "/userByEvent/" + id;
  return axios.post(url, searchObject);
};
export const listAttendeeByEvent = (searchObject, id) => {
  var url = API_PATH_PUBLIC + "/userByEvent/" + id;
  return axios.post(url, searchObject);
};
export const listUserEventFavourite = (searchObject, id) => {
  var url = API_PATH_PUBLIC + "/userEventFavourite/" + id;
  return axios.post(url, searchObject);
};
export const getlistEventStatusAndUserActionPrivate = (eventDtos) => {
  let url = API_PATH + "/getListEventStatusAndUserAction";
  return axios.post(url, eventDtos);
};

export const getlistEventStatusAndUserAction = (eventDtos) => {
  let url = API_PATH_PUBLIC + "/getListEventStatusAndUserAction";
  return axios.post(url, eventDtos);
};

export const getAllUserByRoles = (searchObject) => {
  var url = API_PATH_PUBLIC + "/getAllByRoles";
  return axios.post(url, searchObject);
};
export const updateEventStartStatus = (id) => {
  let url = API_PATH + "/updateEventStartStatus/"+id;
  return axios.put(url);
};

export const updateEventEndStatusByCode = (code) => {
  let url = API_PATH_PUBLIC + "/updateEventEndStatusByCode/"+code;
  return axios.put(url);
};
