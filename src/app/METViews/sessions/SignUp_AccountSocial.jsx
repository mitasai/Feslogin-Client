import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConstantList from "../../appConfig";
import LoadingOverlay from 'react-loading-overlay';
import {
  Card,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  Select,
  Input,
  InputLabel,
  FormControl,
  MenuItem,
  FormHelperText
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { signUpAccount, checkuserName, checkEmail, checkRePassword, checkReEmail,checkEmailByEmailAndWithOutUsername } from "./SessionService";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { result } from "lodash-es";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

class SignUp extends Component {
  constructor(props) {
    super(props);
  }

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
  };

  handleChangeDisplayname = (event, source) => {
    let { t } = this.props;
    event.persist()
    if (source === 'displayName') {
      return
    }
    this.setState({
      [event.target.name]: event.target.value,
    })
    this.setState({
      messageDisplyname: '',
      [event.target.name]: event.target.value,
    }, function () {
      if ((this.state.displayName.trim()).length < 1 || this.state.displayName.length < 1) {
        this.setState({
          messageDisplyname: t("sign_up.message_display_name")
        })
      }
    })
  }

  handleChangeUsername = (event, source) => {
    let { t } = this.props;
    var checkUsername = new RegExp(/^[a-zA-Z0-9_-]{3,16}$/);
    event.persist()
    if (source === 'username') {
      return
    }
    this.setState({
      [event.target.name]: event.target.value,
    })
    this.setState({
      messageUsername: '',
      [event.target.name]: event.target.value,
    }
      , function () {
        if (!checkUsername.test(this.state.username)) {
          this.setState({
            messageUsername: t("sign_up.message_username")
          })
        }
      }
    );
  }

  handleChangePass = (event, source) => {
    let { t } = this.props;
    event.persist()
    var checkPassword = new RegExp(/^[a-zA-Z0-9_-]{6,999}$/);
    if (source === 'password') {
      return
    }
    this.setState({
      [event.target.name]: event.target.value,
    })
    this.setState({
      messagePass: '',
      [event.target.name]: event.target.value,
    }
      , function () {
        if (!checkPassword.test(this.state.password)) {
          this.setState({
            messagePass: t("sign_up.message_pass_1")
          })
        }
        if (this.state.password.length < 6) {
          this.setState({
            messagePass: t("sign_up.message_pass_2")
          })
        }
      }
    );
  }

  handleChangeRePass = (event, source) => {
    let { t } = this.props;
    event.persist()
    if (source === 'rePassword') {
      return
    }
    this.setState({
      messageRePass: '',
      [event.target.name]: event.target.value,
    }, function () {
      if (this.state.rePassword != this.state.password) {
        this.setState({
          messageRePass: t("sign_up.message_rePass")
        })
      }
    });
  }
  handleChangeReMail = (event, source) => {
    event.persist()
    let { t } = this.props;
    if (source === 'reEmail') {
      return
    }
    this.setState({
      messageReMail: '',
      [event.target.name]: event.target.value,
    }, function () {
      if (this.state.reEmail != this.state.email) {
        this.setState({
          messageReMail: t("sign_up.message_reMail")
        })
      }
    });
  }

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
  openSelectDepartmentPopup = () => {
    this.setState({
      shouldOpenSelectDepartmentPopup: true,
    })
  }



  handleFormSubmit = event => {
    console.log("WWWWWWW");
    let { t } = this.props;
    let that = this;
    let registerDto = {};
    var checkUsername = new RegExp(/^[a-zA-Z0-9_-]{3,16}$/);
    var checkPassword = new RegExp(/^[a-zA-Z0-9_-]{6,999}$/);
    registerDto.email = this.state.email;
    registerDto.username = this.state.username;
    registerDto.reEmail = this.state.reEmail;
    registerDto.password = this.state.password;
    registerDto.rePassword = this.state.rePassword;
    this.setState({
      isLoading: true
    });
    if (!checkPassword.test(this.state.password)) {
      this.setState({
        messagePass: t("sign_up.message_pass_1"),
        isLoading: false
      });
    } else if (!checkUsername.test(this.state.username)) {
      this.setState({
        messageUsername: t("sign_up.message_username"),
        isLoading: false
      });
    }
    else if (this.state.password.length < 6) {
      this.setState({
        messagePass:  t("sign_up.message_pass_2"),
        isLoading: false
      })
    } else if ((this.state.displayName.trim()).length < 1 || this.state.displayName.length < 1) {
      this.setState({
        messageDisplyname: t("sign_up.message_display_name")
      })
    } else {
      // if (this.validatedEmail()) {
      //   if (this.validatedPassword()) {
      checkRePassword(registerDto).then((result) => {
        if (result && result.data && result.data != '') {
          console.log(result)
          toast.error(t("sign_up.message_rePass"));
          this.setState({
            isLoading: false
          })
        } else {
          checkReEmail(registerDto).then((result) => {
            if (result && result.data && result.data != '') {
              toast.error(t("sign_up.message_reMail"));
              this.setState({
                isLoading: false
              })
            } else {
              checkuserName(registerDto).then((result) => {
                that.setState({
                  isLoading: false
                })
                if (result && result.data && result.data != '') {
                  toast.error(t("sign_up.username_exists"))
                }
                else {
                  that.setState({
                    isLoading: false
                  })
                  checkEmail(registerDto).then((result) => {
                    if (result && result.data && result.data != '') {
                      toast.error(t("sign_up.email_exists"));
                      //alert('Email này đã được sử dụng.');
                    }
                    else {
                      signUpAccount(this.state).then((result) => {
                        that.setState({
                          isLoading: false
                        })
                        if (result != null && result.data != null && result.data != '') {
                          if (result.data.hasEmail) {
                            toast.error(t("sign_up.email_exists"));
                            //alert('Email này đã được sử dụng.');
                          }
                          else
                            if (result.data.sendEmailFailed) {
                              that.setState({
                                isLoading: false
                              })
                              toast.error(t("sign_up.send_mail_error"));
                              //alert('Có lỗi khi gửi email thông báo đến email của bạn. Vui lòng thử lại.');
                            }
                            else {
                              that.setState({
                                isLoading: false
                              })
                              // alert('Đăng ký thành công.');
                              // this.props.history.push('/session/signin'); 
                              console.log(result);
                              let path = ConstantList.ROOT_PATH + `session/signup-noti-so/`;
                              this.props.history.push({
                                pathname: path,
                                id: result.data.email,
                                hostSite: this.state.hostSite,
                                state: this.state,
                                nameEmail: this.state.email
                              });
                            }
                        }
                        else {
                          toast.error(t("sign_up.error"));
                          //alert('Có lỗi xảy ra khi đăng ký.');
                        }
                      });
                    }
                  }, (error) => {
                    toast.error(t("sign_up.error"));
                    //alert('Có lỗi xảy ra khi đăng ký.');
                  });
                }
              }, (error) => {
                toast.error(t("sign_up.error"));
                //alert('Có lỗi xảy ra khi đăng ký.');
              });
            }
          }, (error) => {
            toast.error(t("sign_up.error"));
            //alert('Có lỗi xảy ra khi đăng ký.');
          });
        }
      }
        , (error) => {
          toast.error(t("sign_up.error"));
          //alert('Có lỗi xảy ra khi đăng ký.');
        });
    }
    //   }
    // }
  };

  componentDidMount() { 
    if (this.props.location?.accounts != null ) {
      this.setState({
        displayName: this.props.location?.accounts?.name,
        username: this.props.location?.accounts?.facebookId,
        password: this.props.location?.accounts?.facebookId,
        rePassword: this.props.location?.accounts?.facebookId
      })
    }
    this.setState({
      hostSite: window.location.origin + ConstantList.ROOT_PATH,
    });
  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isPasswordMatch');
   
  }

  toSignInPage = () => {
    // this.props.history.push(ConstantList.ROOT_PATH + "session/signin");
    window.open("http://gmail.com", "_self")
  };


  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props
    let {
      displayName,
      email,
      person,
      username,
      birthDate,
      changePass,
      password,
      confirmPassword,
      gender,
      rePassword,
      reEmail,
      messagePass,
      messageRePass,
      messageReMail,
      isLoading,
      messageUsername,
      messageDisplyname,
    } = this.state
    let TitlePage = t("sign_up.title_form");
    return (
      <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
        <div>
          <div className="container">
            <h1 className="text-center title">{t("sign_up.title_fb")}</h1>
            <div className="text-center m-5"><img className="img-fluid" src="/assets/register/title-foot.png" alt="" /></div>
            <form action>
              <div className="row mb-5">
                <div className="col-lg-2" />
                <div className="col">
                  <Form.Group controlId="email" className="mb-4">
                    <Form.Label>{t("sign_up.email")}</Form.Label><br />
                    <Form.Control
                      onChange={this.handleChange}
                      type="email"
                      name="email"
                      value={email}
                      required
                    />
                    {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                    <p><h6 className="validated-error">&nbsp;</h6></p>
                  </Form.Group>


                </div>
                <div className="col">

                  <Form.Group controlId="reEmail" className="mb-4">
                    <Form.Label>{t("sign_up.email_confirm")}</Form.Label><br />
                    <Form.Control
                      onChange={this.handleChangeReMail}
                      required
                      type="email"
                      name="reEmail"
                      value={reEmail}
                    />
                    {/* <Form.Text className="text-muted">
                      We'll never share your email with anyone else.
                    </Form.Text> */}
                    <Form.Control.Feedback type='invalid'>
                    </Form.Control.Feedback>
                    <p><h6 className="validated-error">{messageReMail}&nbsp;</h6></p>
                  </Form.Group>


                </div>
                <div className="col-lg-2" />
              </div>
              <LoadingOverlay
                active={isLoading}
                spinner
                text='Please wait...'
              >
                <div className="text-center mb-5 z-10">
                  <button className="btn btn-primary btn-lg mb-4">{t("sign_up.title")}</button>
                  <p className="text-gray">
                    <a href={ConstantList.ROOT_PATH +"login"}>{t("sign_in.title")}</a>
                  </p>
                </div>
              </LoadingOverlay>
            </form>
          </div>
          <div className="box">
            <div className="decor d-flex justify-content-between">
              <img className src="/assets/register/decor-left.png" alt="" />
              <img className src="/assets/register/decor-right.png" alt="" />
            </div>
          </div>
        </div>
      </ValidatorForm>
    );
  }
}

const mapStateToProps = state => ({
  // setUser: PropTypes.func.isRequired
});

export default connect(
  mapStateToProps,
  {}
)(SignUp);
