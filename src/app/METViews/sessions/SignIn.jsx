import React, { Component } from "react";
import LoadingOverlay from 'react-loading-overlay';
import ConstantList from "../../appConfig";
import {
  withStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { withRouter } from "react-router-dom";
import { loginWithEmailAndPassword, loginWithEmailAndPasswordFB } from "../../redux/actions/LoginActions";
import { Col, Form } from "react-bootstrap";
import { accountService } from './AccountFacebookService';
import RequestConfirmAccountSocial from '../../EgretLayout/METComponents/RequestConfirmAccountSocial';
import { getAllEQARound, getAllHealthOrgType, registerFaceBook, checkuserName, checkEmail } from "./SessionService";
import env from './env';
import axios from 'axios';
import { Helmet } from "react-helmet";
import { history } from './_helpers';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button } from "react-bootstrap";
import JwtAuthService from "../../services/jwtAuthService";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});
const accountsKey = 'react-facebook-login-accounts';

const styles = theme => ({
  wrapper: {
    position: "relative"
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12
  }
});


class SignIn extends Component {
  state = {
    email: "",
    password: "",
    agreement: "",
    isLoading: false,
    canLoginGoogle: false,
  };
  handleChange = event => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value,
      messageError_1: "",
      messageError_2: ""
    });
  };

  componentDidMount() {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(false);
    this.setState({
      hostSite: window.location.origin + ConstantList.ROOT_PATH,
    });
    let accounts = JSON.parse(localStorage.getItem(accountsKey)) || null;
    if (accounts) {
      this.setState({ accounts })
    }

  }

  componentWillMount() {
    this.googleSDK();
    this.initFacebookSdk()
    JwtAuthService.setSession(null);
    JwtAuthService.removeUser();
    this.props.setForceUpdateHeader(true);
  }
  handleFormSubmit = event => {
    event.preventDefault();
    if(this.validateForm()) {
      this.setState({
        isLoading: true
      });
      let that = this;
      this.props.loginWithEmailAndPassword({ ...this.state, returnUrl: this.props.location.state?.returnUrl }).then(result => {
        that.setState({
          isLoading: false
        })
      });
    }
  };

  handleClose = () => {
    this.setState({ isRequireConfirmAccountSocial: false })
  }

  prepareLoginButton = () => {
    let { t } = this.props;
    this.auth2.attachClickHandler(this.refs.googleLoginBtn, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();


        let objectLogin = {
          email: profile.getId(),
          password: profile.getId()
        }
        this.props.loginWithEmailAndPasswordFB({ ...objectLogin, returnUrl: this.props.location.state?.returnUrl }).then(result => {

          if (result.type == env.LOGIN_ERROR_FAIL) {
            let register = {};
            register.displayName = profile.getName();
            register.username = profile.getId();
            register.email = profile.getEmail();
            register.password = profile.getId();
            register.hostSite = this.state.hostSite;
            checkEmail(register).then((result) => {
              if (result && result.data && result.data != '') {
                toast.error(t("general.duplicat_account"));
                return;
              }
            })
            registerFaceBook(register).then((result) => {
              if (result != null && result.data != null && result.data != '') {
                this.props.loginWithEmailAndPasswordFB({ ...objectLogin, returnUrl: this.props.location.state?.returnUrl }).then(result => {
                })
              }
              else {
                alert('Có lỗi xảy ra khi đăng ký.');
              }
            });
          }
          this.setState({
            isLoading: false
          })
        });

      }, (error) => {
        console.log(error);
      });

  }

  googleSDK = () => {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '776127955013-036pki1jin4efvdhv37heuf3gak9kokl.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          scope: 'profile email'
        });
        this.prepareLoginButton();
      });
    }
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = env.SDKL_GOOGLE;
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));

  }


  newAccountId() {
    const accountsKey = 'react-facebook-login-accounts';
    let accounts = JSON.parse(localStorage.getItem(accountsKey)) || [];
    return accounts.length ? Math.max(...accounts.map(x => x.id)) + 1 : 1;
  }
  async loginFB() {

    // redirect to home if already logged in
    const { authResponse } = await new Promise(window.FB.login);
    if (!authResponse) return;
    axios.get(env.ACCESS_TOKEN + `${authResponse.accessToken}`, { scope: 'email' })
      .then(response => {
        const { data } = response;

        // create new account if first time logging in
        let account = {
          id: this.newAccountId(),
          facebookId: data.id,
          name: data.name,
          extraInfo: `This is some extra info about ${data.name} that is saved in the API`
        }
        localStorage.setItem(accountsKey, JSON.stringify(account));

        let accessToken = account;
        let objectLogin = {
          email: accessToken.facebookId,
          password: accessToken.facebookId
        }
        this.props.loginWithEmailAndPasswordFB({ ...objectLogin, returnUrl: this.props.location.state?.returnUrl }).then(result => {
          if (result?.meta?.previousAction?.payload?.response?.data?.error_description == env.Bad_credentials) {
            this.props.history.push({
              pathname: ConstantList.ROOT_PATH + "session/signup-account-social",
              accounts: account
            });
          } else if (result.meta.previousAction.payload.response.data.error_description == env.User_is_disabled) {
            this.setState({username:accessToken.facebookId})
            this.setState({ isRequireConfirmAccountSocial: true  })

            // let path = ConstantList.ROOT_PATH + `session/signup-noti-so/`;
            // this.props.history.push({
            //   pathname: path,
            //   accounts: account
            // });
          }
          this.setState({
            isLoading: false
          })
        });
      });
  }



  initFacebookSdk() {
    return new Promise(resolve => {
      // wait for facebook sdk to initialize before starting the react app
      window.fbAsyncInit = function () {
        window.FB.init({
          appId: env.REACT_APP_FACEBOOK_APP_ID,
          cookie: true,
          xfbml: true,
          version: 'v8.0'
        });

        // auto authenticate with the api if already logged in with facebook
        window.FB.getLoginStatus(({ authResponse }) => {
          if (authResponse) {
            accountService.apiAuthenticate(authResponse.accessToken).then(resolve);
          } else {
            resolve();
          }
        });
      };

      // load facebook sdk script
      (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = env.SDK_FACEBOOK;
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    });


  }

  validateForm = () => {
    const { t } = this.props;
    if (this.state.email.trim() == "") {
      this.setState({messageError_1: t("sign_in.message_error_1")})
      return false
    } else if (this.state.password == "") {
      this.setState({messageError_2: t("sign_in.message_error_2")})
      return false
    } else {
      return true
    }
  }

  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter') {
      this.handleFormSubmit(e)
    }
  }

  render() {
    const { t, i18n } = this.props;
    let { email, password, isLoading,
      accounts, isRequireConfirmAccountSocial } = this.state;
    let { classes } = this.props;
    let isLoginedFb;
    if (accounts) {
      isLoginedFb = (
        <>Continue with {accounts.name}   <img src={`https://graph.facebook.com/` + accounts.facebookId + `/picture/?type=small`} />
        </>
      );
    } else {
      isLoginedFb = "";
    };

    return (
      <div>
        <div className="container ">
          <Helmet>
            <title>{t('web_site.title_page')} | {t('web_site.sign_in')}</title>
          </Helmet>
          <h1 className="text-center title ">{t("sign_in.title")}</h1>
          <div className="text-center m-3"><img className="img-decor" src="" alt="" /></div>
            <div className="row mb-4">
              <div className="col" />
              <div className="col-xl-4 col-md-6">
                <Form.Group controlId="validationUsername">
                  <Form.Label className="lable-control">
                    {t("sign_in.user_name_email")}
                  </Form.Label>
                  <Form.Control
                    required
                    className="form-control mb-3 input-control"
                    id="username"
                    name="email"
                    type="text"
                    value={email}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDownEnterSearch}
                  />
                </Form.Group>
                <div className="text-center validated-error mb-4">
                  {this.state.messageError_1}
                </div>
                {/* </div>
              <div className="col"> */}
                <Form.Group controlId="validationPassword">
                  <Form.Label className="lable-control">
                    {t("sign_in.password")}
                  </Form.Label>
                  <Form.Control
                    required
                    className="form-control input-control"
                    id="confirm-password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDownEnterSearch}
                  />
                </Form.Group>
                <div className="text-center validated-error mt-3">
                  {this.state.messageError_2}
                </div>
              </div>
              <div className="col" />
            </div>
            {isRequireConfirmAccountSocial && (
              <RequestConfirmAccountSocial
                t={t}
                isPopup={isRequireConfirmAccountSocial}
                handleClose={this.handleClose}
                // title={t("Event.content.require_login")}
                username={this.state.username}
                history={this.props.history}
                textContent={this.state.textContent}
                startTimeContent={this.state.startTimeContent}
              />
            )}
            <LoadingOverlay
              active={isLoading}
              spinner
              text='Please wait...'
            >
              <div className="row mb-4">
                <div className="col"></div>
                <div className="text-center z-10 col-xl-4 col-md-6">
                  <Button onClick={this.handleFormSubmit} className="btn btn-primary btn-lg mb-3 w100">
                    {t("sign_in.title")}
                  </Button>
                  <div className="text-gray" >
                    <p
                      style={{ cursor: "pointer", display: "inline", marginRight: "15px" }}
                      onClick={() =>
                        this.props.history.push(ConstantList.ROOT_PATH + "session/signup-register-account")}
                    >
                      {t("sign_up.title")}
                    </p>
                    <p
                      style={{ cursor: "pointer", display: "inline", marginLeft: "15px" }}
                      onClick={() =>
                        this.props.history.push(ConstantList.ROOT_PATH + "forgot-password")}
                    >
                      {t("sign_in.forgot_password")}
                    </p>
                  </div>

                </div>
                <div className="col"></div>
              </div>

            </LoadingOverlay>


          {/* <div className="text-center  row">
            <div className="col "></div>
            <div className="col-xl-4 col-md-6">
              <button className="btn btn-dark btn-lg w100 social-login-btn" onClick={() => {
                this.loginFB()
              }}><img className="" src="/assets/login/icon-fb.png" alt="" />{accounts != null ? isLoginedFb : t("sign_in.continue_facebook")}</button>

              <button className="mt-3 social-login-btn btn btn-dark w100 btn-lg loginBtn loginBtn--google" ref="googleLoginBtn"  >
                <img className=" loginBtn loginBtn--google" src="/assets/login/icon-gg.png" alt="" />
                {t("sign_in.continue_google")}
              </button></div>
            <div className="col"></div>

          </div> */}
        </div>
        <div className="ponly">
          <div className="decor d-flex justify-content-between ">
            <img className src="" alt="" />
            <img className src="" alt="" />
          </div>
        </div>
      </div>
    );
  }
}



const mapStateToProps = state => ({
  loginWithEmailAndPassword: PropTypes.func.isRequired,
  loginWithEmailAndPasswordFB: PropTypes.func.isRequired,
  login: state.login
});
export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(
      mapStateToProps,
      { loginWithEmailAndPassword, loginWithEmailAndPasswordFB }
    )(SignIn)
  )
);


