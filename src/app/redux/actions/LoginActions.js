import jwtAuthService from "../../services/jwtAuthService";
import FirebaseAuthService from "../../services/firebase/firebaseAuthService";
import { setUserData } from "./UserActions";
import history from "history.js";
import ConstantList from "../../appConfig";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_LOADING = "LOGIN_LOADING";
export const RESET_PASSWORD = "RESET_PASSWORD";
export const CONFIRM_REGISTRATION = "CONFIRM_REGISTRATION";

toast.configure({
  position: "top-center",
  autoClose: 3000,
  draggable: false,
  limit: 3
});

export function loginWithEmailAndPassword({ email, password, returnUrl }) {
  return async dispatch => {
    dispatch({
      type: LOGIN_LOADING
    });

    return await jwtAuthService
      .loginWithUserNameAndPassword(email, password)
      .then(user => {
        dispatch(setUserData(user));
        //Lưu lại thông tin liên quan đến token tại đây

        //Nhảy đến trang HomePage dự kiến
        history.push({
          pathname: returnUrl??ConstantList.ROOT_PATH
        });
        window.location.reload();
        return dispatch({
          type: LOGIN_SUCCESS
        });
      })
      .catch(error => {
        toast.error("Sai mật khẩu hoặc tên đăng nhập, Mời đăng nhập lại")//Cần xem cách đưa ra thông báo thông qua đa ngôn ngữ
        return dispatch({
          type: LOGIN_ERROR,
          payload: error
        });
      });
  };
}

export function loginWithEmailAndPasswordFB({ email, password, returnUrl }) {
  return async dispatch => {
    dispatch({
      type: LOGIN_LOADING
    });

    return await jwtAuthService
      .loginWithUserNameAndPassword(email,password)
      .then(user => {
        dispatch(setUserData(user));
        //Lưu lại thông tin liên quan đến token tại đây

        //Nhảy đến trang HomePage dự kiến
        history.push({
          pathname: returnUrl??ConstantList.ROOT_PATH
        });
        window.location.reload();
        return dispatch({
          type: LOGIN_SUCCESS
        });
      })
      .catch(error => {
        return dispatch({
          type: LOGIN_ERROR,
          payload: error
        });
      });
  };
}

export function resetPassword({ email }) {
  return dispatch => {
    dispatch({
      payload: email,
      type: RESET_PASSWORD
    });
  };
}

export function firebaseLoginEmailPassword({ email, password }) {
  return dispatch => {
    FirebaseAuthService.signInWithEmailAndPassword(email, password)
      .then(user => {
        if (user) {
          dispatch(
            setUserData({
              userId: "1",
              role: "ADMIN",
              displayName: "Watson Joyce",
              email: "watsonjoyce@gmail.com",
              photoURL: "./assets/images/face-7.jpg",
              age: 25,
              token: "faslkhfh423oiu4h4kj432rkj23h432u49ufjaklj423h4jkhkjh",
              ...user
            })
          );

          history.push({
            pathname: "/"
          });

          return dispatch({
            type: LOGIN_SUCCESS
          });
        } else {
          return dispatch({
            type: LOGIN_ERROR,
            payload: "Login Failed"
          });
        }
      })
      .catch(error => {
        return dispatch({
          type: LOGIN_ERROR,
          payload: error
        });
      });
  };
}
export const confirmRegistration = (token) => dispatch => {
  axios({
    method: 'get',
    url: ConstantList.API_ENPOINT + "/public/user/confirmRegistration",
    params: {
      token
    }
  }).then(res => {
    dispatch({
      type: CONFIRM_REGISTRATION,
      payload: res.data
    })
  })
}
