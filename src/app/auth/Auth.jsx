import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { setUserData } from "../redux/actions/UserActions";
import jwtAuthService from "../services/jwtAuthService";
import localStorageService from "../services/localStorageService";
import firebaseAuthService from "../services/firebase/firebaseAuthService";
import history from "history.js";
import ConstantList from "../appConfig";
import routes from "../RootRoutes";
import axios from "axios";
import JwtAuthService from "../services/jwtAuthService";
class Auth extends Component {
  state = {};

  constructor(props) {
    super(props);
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (error.response == null) {
          alert("Không connect được tới server");
          return Promise.reject(error);
        } else {
          if (401 === error.response.status) {
            JwtAuthService.setSession(null);
            JwtAuthService.removeUser();
            history.push({
              pathname: ConstantList.LOGIN_PAGE,
              // state: { returnUrl: window.location.pathname },
            });
            return Promise.reject(error);
          } else {
            return Promise.reject(error);
          }
        }
      }
    );
    var isAccess = routes.findIndex(function (route, index) {
      if (
        ((route.path === "//" && window.location.pathname === "/") ||
          route.path == window.location.pathname) &&
        route.isPublic == true
      )
        return true;

      if (route.isPublic === true) {
        return true;
      }
    });
    let user = localStorageService.getItem("auth_user");
    let token = localStorageService.getItem("jwt_token");
    let expire_time = localStorageService.getSessionItem("token_expire_time");
    let dateObj = new Date(expire_time);
    if (token) {
      jwtAuthService.setSession(token);
    }
    var isExpired = false;
    if (dateObj != null) {
      if (dateObj < Date.now()) {
        isExpired = true;
      }
    }
    if (user != null && isExpired == false) {
      this.props.setUserData(user);
    } else if (isAccess === -1) {
      console.log(isAccess);
      history.push({
        pathname: ConstantList.LOGIN_PAGE,
        state: { returnUrl: window.location.pathname },
      });
    }

    // this.checkJwtAuth();
    // this.checkFirebaseAuth();
  }

  checkJwtAuth = () => {
    jwtAuthService.loginWithToken().then((user) => {
      this.props.setUserData(user);
    });
  };

  checkFirebaseAuth = () => {
    firebaseAuthService.checkAuthStatus((user) => {
      if (user) {
        console.log(user.uid);
        console.log(user.email);
        console.log(user.emailVerified);
        console.log(user.getItem);
      } else {
        console.log("not logged in");
      }
    });
  };

  render() {
    const { children } = this.props;
    return <Fragment>{children}</Fragment>;
  }
}

const mapStateToProps = (state) => ({
  setUserData: PropTypes.func.isRequired,
  login: state.login,
});

export default connect(mapStateToProps, { setUserData })(Auth);
