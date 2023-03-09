import axios from "axios";
import ConstantList from "../../appConfig";

const API_PATH = ConstantList.API_ENPOINT + "/api/category/";
const API_PATH_PUBLIC = ConstantList.API_ENPOINT + "/public/event/category/";


export const searchByDto = (searchObject) => {
    return axios.post(API_PATH + "searchByDto", searchObject);
};

export const searchPublicByDto = (searchObject) => {
    return axios.post(API_PATH_PUBLIC + "searchByDto", searchObject);
};

export const deleteItem = id => {
    return axios.delete(API_PATH + id);
};

export const saveItem = item => {
    return axios.post(API_PATH, item);
};
export const updateItem = item => {
    return axios.put(API_PATH + item.id, item);
};

export const getItemById = id => {
    return axios.get(API_PATH + id);
};

export const checkCode = (id, code) => {
    const config = { params: { id: id, code: code } };
    return axios.get(API_PATH + "checkCode", config);
};