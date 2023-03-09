import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import ConstantList from "../../appConfig";
import history from "history.js";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import localStorageService from "../../services/localStorageService";
import { signUpAccount, checkuserName, checkEmail, resendEmail, checkReEmail, resendActiveAccountWithAnotherEmail, checkEmailByEmailAndWithOutUsername } from "../../METViews/sessions/SessionService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});
class RequestLoginPopup extends Component {


  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    reEmail: "",
    rePassword: "",
    messagePass: '',
    messageRePass: '',
    messageReMail: '',
    message: true,
    isResendEmail: false,
  };

  componentDidMount() {
    this.setState({
      hostSite: window.location.origin + ConstantList.ROOT_PATH,
    });
    let timeOut = localStorageService.getItem("timeout");
    if (timeOut > 0) {
      this.setState({ seconds: timeOut })
      this.countToResendEmail();
      this.setState({ isResendEmail: true })
    }
  }

  redirectLinkLogin = () => {
    history.push({
      pathname: ConstantList.ROOT_PATH + "login",
    });
  };

  redirectLinkSignUp = () => {
    history.push({
      pathname: ConstantList.ROOT_PATH + "session/signup-register-account",
    });
  };
  handleChange = (event, source) => {
    event.persist()
    if (source === 'switch') {
      this.setState({ isActive: event.target.checked })
      return
    }
    if (source === 'active') {
      this.setState({ active: event.target.checked })
      return
    }
    if (source === 'displayName') {
      let displayName = this.state;
      displayName = event.target.value;
      this.setState({ displayName: displayName })
      return
    }
    if (source === 'gender') {
      let gender = this.state;
      gender = event.target.value;
      this.setState({ gender: gender })
      return
    }
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleClickActive = event => {
    let check = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    let { t } = this.props;
    let that = this;
    let registerDto = {};
    registerDto.email = this.state.email;
    registerDto.username = this.props.username;
    registerDto.rePassword = this.state.rePassword;
    registerDto.hostSite = this.state.hostSite
    if (!check.test(this.state.email)) {
      this.setState({
        messageEmail: t("sign_up.messageEmail"),
      })
    } else {
      checkEmail(registerDto).then((result) => {
        if (result && result.data && result.data != '') {
          toast.error(t("sign_up.email_exists"));
          this.setState({
            isLoading: false
          })
        } else {
          checkEmailByEmailAndWithOutUsername(registerDto).then((result) => {
            if (result && result.data && result.data != '') {
              toast.error(t("Email này đã được sử dụng"));
              //alert('Email này đã được sử dụng.');
            }
            else {
              resendActiveAccountWithAnotherEmail(registerDto).then((result) => {
                that.setState({
                  isLoading: false
                })
                if (result != null && result.data != null && result.data != '') {
                  that.setState({
                    isLoading: false,
                    message: false,
                  })
                  // alert('Đăng ký thành công.');
                  // this.props.history.push('/session/signin');  
                  // let path = ConstantList.ROOT_PATH + `session/signup-noti-so/`;
                  // this.props.history.push({
                  //   pathname: path,
                  //   id: result.data.email,
                  //   hostSite: this.state.hostSite,
                  //   state: this.state
                  // });
                }
                else {
                  toast.error(t("Có lỗi xảy ra"));
                  //alert('Có lỗi xảy ra khi đăng ký.');
                }
              });
            }
          })
        }
      }, (error) => {
        toast.error(t("sign_up.error"));
      });
    }
  };

  handleResendEmail = (item) => {
    if (this.state.isResendEmail) {
      toast.error("Vui lòng chờ sau 1 phút để gửi lại email")
      return;
    }
    resendEmail(item).then((data) => {
      if (data != null) {
        toast.success("Đã gửi lại mail")
        this.countToResendEmail()
        localStorageService.setItem("timeout", 60)
        this.setState({ isResendEmail: true, seconds: 60 })
      } else {
        toast.error("Gửi lại mail không thành công")
      }
    });
  }

  countToResendEmail = () => {
    setInterval(() => {
      const { seconds } = this.state
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }))

        localStorageService.setItem("timeout", seconds - 1)
      }
      if (seconds === 0) {
        clearInterval(this.myInterval)
        this.setState({ isResendEmail: false })
      }
    }, 1000)
  }

  render() {
    const {
      isPopup,
      handleClose,
      startTimeContent,
      textContent,
      t,
      i18n,
    } = this.props;
    let {
      email,
      messageEmail,
      message,
    } = this.state
    return (
      <Modal
        className="modal"
        size="lg"
        show={isPopup}
        onHide={() => handleClose()}
        backdrop="static"
      >
        {/* <Modal.Header closeButton>
          <Modal.Title className="modal-header">{title}</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <button className="modal-button-close" onClick={() => handleClose()}>
            X
          </button>
          <br />
          <br />

          {message ?
            <div>
              <h2 className="modal-content-center">
                <img
                  className="img-fluid"
                  src="/assets/confirm-email/email.png"
                  alt=""
                />
                    &nbsp;{t("sign_up.go_to_verify_not_active")}{" "}
              </h2>


              <hr className="modal-hr"></hr>
              <br />




              <br />
              <h4 className="modal-content-center box">
                <br />
                <h3 className="modal-content-center">
                  &nbsp;{t("sign_up.use_another_email_to_verify")}{" "}
                </h3>
                <br />
                <div>
                  {/* <form > */}
                  <div className="container">
                    <div className="row  ">
                      <div className="col-lg-2" />
                      <div className="col">
                        <Form.Group controlId="email" className="mb-4">
                          <Form.Label>{t("sign_up.email")}</Form.Label><br />
                          <Form.Control
                            style={{ background: 'black', color: 'white' }}
                            onChange={this.handleChange}
                            type="email"
                            name="email"
                            value={email}
                          />
                          {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                          <p><h6 className="validated-error">&nbsp;{messageEmail}</h6></p>
                        </Form.Group>
                      </div>
                      <div className="col-lg-2" />
                    </div>
                    <button onClick={this.handleClickActive} className="btn btn-primary btn-lg mb-4">{t("user.active")}</button>
                    <br />
                  </div>
                  {/* </form> */}
                </div>
              </h4>
              <br />
              <br />
            </div>
            :
            <div>
              <div className="container ">

                <div className="text-center font-size-2 mb-5 z-10">
                  <p>
                    <span className="text-gray">
                      <p><span className="text-gray">{t("sign_up.for_account")}<span style={{ color: 'white' }}>&nbsp;{this.state.email}</span>&nbsp;</span></p>
                    </span>{" "}
                  </p>
                </div>
                <div className="row mb-3">
                  <div className="col-3" />
                  <div className="col font-size-2">
                    <div style={{ textAlign: 'center' }}>
                      {" "}
                      <img
                        className="img-fluid"
                        src="/assets/confirm-email/email.png"
                        alt=""
                      />
                  &nbsp;{t("sign_up.go_to_verify")}{" "}
                    </div>
                  </div>
                  <div className="col-3" />
                </div>
                <div className="text-center font-size-2 mb-5 z-10">
                  <p>
                    <span className="text-gray">
                      {t("sign_up.check_in_spam")}
                    </span>
                  </p>
                  <p>
                  </p>
                </div>
                <div className="text-center mb-5 z-10">
                  <p className="text-white font-size-2">
                    <button
                      style={{ minWidth: '300px' }}
                      className="btn btn-dark btn-sm btn-space"
                      onClick={() => {
                        this.handleResendEmail(this.state)
                      }} >
                      <img className="img-fluid" src="/assets/confirm-email/reset.png" alt="" />
                &nbsp;
                {t("sign_up.haven’t_received")} - {t("sign_up.resend_email")}</button>
                  </p>
                  <p style={{ display: 'inline-flex', fontSize: '15px' }} >{this.state.seconds > 0 && this.state.isResendEmail ? <p style={{ fontSize: '15px' }}>{t('sign_up.resend')}</p> : ``} {this.state.seconds > 0 && this.state.isResendEmail ? ` ${this.state.seconds}s` : ''}</p>
                </div>
              </div>
            </div>
          }
        </Modal.Body>
        {/* <Modal.Footer>
          <Button
            style={{ color: "#000", backgroundColor: "#00e9a0" }}
            onClick={() => handleClose()}
          >
            {t("general.close")}
          </Button>
        </Modal.Footer> */}
      </Modal>
    );
  }
}

RequestLoginPopup.propTypes = {};

export default RequestLoginPopup;
