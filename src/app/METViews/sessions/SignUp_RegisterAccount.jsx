import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import 'react-datepicker/dist/react-datepicker.css';
import ConstantList from "../../appConfig";
import LoadingOverlay from 'react-loading-overlay';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { signUpAccount, checkuserName, checkEmail, checkRePassword, checkReEmail } from "./SessionService";
import { connect } from "react-redux";
import "bootstrap/dist/css/bootstrap.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

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
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    hostSite: "",
    rePassword: "",
    messagePass: '',
    messageRePass: '',
    messageReMail: '',
    isLoading: false,
    messageUsername: '',
    messageDisplyname: '',
    messageEmail: '',
    messagePhone: ''
  };

  handleChangeDisplayname = (event, source) => {
    let { t } = this.props;
    event.persist()
    if (source === 'name') {
      return
    }
    this.setState({
      [event.target.name]: event.target.value,
    })
    this.setState({
      messageDisplyname: '',
      [event.target.name]: event.target.value,
    }, function () {
      if ((this.state.name.trim()).length < 1 || this.state.name.length < 1) {
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
    var checkPassword = new RegExp(/^[a-zA-Z0-9_!@#$%^&*()+=-]{6,999}$/);
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

  handleChangePhone = (event) => {
    let { t } = this.props;
    event.persist()
    var phoneFormat = new RegExp(/^([0|\+[0-9]{1,5})?([7-9][0-9]{8,11})$/);
    this.setState({
      messagePhone: '',
      [event.target.name]: event.target.value,
    }, function () {
      if (!phoneFormat.test(this.state.phone)) {
        this.setState({
          messagePhone: t('sign_up.format_phone')
        })
      }
    })
  }

  handleChangeEmail = (event, source) => {
    let { t } = this.props;
    event.persist()
    var mailformat = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    if (source === 'email') {
      return
    }
    this.setState({
      [event.target.name]: event.target.value,
    })
    this.setState({
      messageEmail: '',
      [event.target.name]: event.target.value,
    }, function () {
      if (!mailformat.test(this.state.email)) {
        this.setState({
          messageEmail: t('sign_up.format_email')
        })
      }
    })
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
    if (source === 'name') {
      let name = this.state;
      name = event.target.value;
      this.setState({ name: name })
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
    let { t } = this.props;
    let that = this;
    let registerDto = {};
    var checkPassword = new RegExp(/^[a-zA-Z0-9_!@#$%^&*()+=-]{6,999}$/);
    registerDto.name = this.state.name;
    registerDto.phone = this.state.phone;
    registerDto.email = this.state.email;
    registerDto.password = this.state.password;
    registerDto.rePassword = this.state.rePassword;
    this.setState({
      isLoading: true
    });
    if(this.checkExitsField()){
      this.setState({
        isLoading: false
      });
    } else if (!checkPassword.test(this.state.password)) {
      this.setState({
        messagePass: t("sign_up.message_pass_1"),
        isLoading: false
      });
    } else if (this.state.password.length < 6) {
      this.setState({
        messagePass: t("sign_up.message_pass_2"),
        isLoading: false
      })
    } else if ((this.state.name.trim()).length < 1 || this.state.name.length < 1) {
      this.setState({
        messageDisplyname: t("sign_up.message_display_name")
      })
    } else {
      signUpAccount(registerDto).then(response => {
        if (response != null && response.data != null && response.data != '') {
          if (response.data.error) {
            toast.error(response.data.error)
            this.setState({isLoading: false})
          } else {
            toast.success(t("sign_up.success"))
            this.props.history.push('/signup-noti');
          }
        } else {
          alert(t("sign_up.error"))
        }
      }).catch(error => {
        toast.error(t("sign_up.error"))
        this.setState({isLoading: false})
      });
    }
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false;
      }
      return true;
    });

    this.setState({
      hostSite: window.location.origin + ConstantList.ROOT_PATH,
    });
  }
  componentWillUnmount() {
    ValidatorForm.removeValidationRule('isPasswordMatch');
  }

  toSignInPage = () => {
    window.open("http://gmail.com", "_self")
  };

  checkExitsField = () => {
    let { t } = this.props;
    if(this.state.name == '') {this.setState({messageDisplyname: t("sign_up.require_displayName")}); return true}
    if(this.state.phone == '') {this.setState({messagePhone: t("sign_up.require_phone")}); return true}
    if(this.state.email == '') {this.setState({messageEmail: t("sign_up.require_email")}); return true}
    if(this.state.password == '') {this.setState({messagePass: t("sign_up.require_password")}); return true}
    if(this.state.rePassword == '') {this.setState({messageRePass: t("sign_up.require_rePassword")}); return true}
    return false
  }


  render() {
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props
    let {
      name,
      email,
      phone,
      password,
      rePassword,
      messagePass,
      messageRePass,
      isLoading,
      messageDisplyname,
      messageEmail,
      messagePhone
    } = this.state
    let TitlePage = t("sign_up.title_form");
    return (
      <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
        <div>
          <div className="container">
            <Helmet>
              <title>{t('web_site.title_page')} | {t('web_site.sign_up')}</title>
            </Helmet>
            <h1 className="text-center title ">{t("sign_up.slogans")}</h1>
            <div className="text-center m-5"><img className="img-decor" src="" alt="" /></div>
            <form action>
              <div className="row mb-5">
                <div className="col" />
                <div className="col-md-6">
                  <div className="row">
                      <Form.Group controlId="name" className="col-md-12">
                        <Form.Label>{t("sign_up.full_name")}</Form.Label>
                        <Form.Control
                          onChange={this.handleChangeDisplayname}
                          type="name"
                          name="name"
                          value={name}
                          // required
                        />
                        <p><h6 className="validated-error">{messageDisplyname}&nbsp;</h6></p>
                      </Form.Group>
                  </div>
                  <div className="row">
                      <Form.Group controlId="phone" className="col-md-12">
                        <Form.Label>{t("sign_up.phone")}</Form.Label>
                        <Form.Control
                          onChange={this.handleChangePhone}
                          type="text"
                          name="phone"
                          value={phone}
                          // required
                        />
                        <p><h6 className="validated-error">{messagePhone}&nbsp;</h6></p>
                      </Form.Group>
                  </div>
                  <div className="row">
                    <Form.Group controlId="email" className="col-md-12">
                      <Form.Label>{t("sign_up.email")}</Form.Label><br />
                      <Form.Control
                        onChange={this.handleChangeEmail}
                        type="email"
                        name="email"
                        value={email}
                        // required
                      />
                      {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                      </Form.Text> */}
                      <p><h6 className="validated-error">{messageEmail}&nbsp;</h6></p>
                    </Form.Group>
                  </div>
                  <div className="row">
                    <Form.Group controlId="password" className="col-md-12">
                      <Form.Label>{t("sign_up.password")}</Form.Label>
                      <Form.Control
                        onChange={this.handleChangePass}
                        name="password"
                        type="password"
                        value={password}
                        // required
                      />
                      <p><h6 className="validated-error">{messagePass}&nbsp;</h6></p>
                    </Form.Group>
                    
                  </div>
                  <div className="row">
                    <Form.Group controlId="rePassword" className="col-md-12">
                        <Form.Label>{t("sign_up.confirm_password")}</Form.Label>
                        <Form.Control
                          onChange={this.handleChangeRePass}
                          // onChange={this.passwordConfirm}
                          // required
                          type="password"
                          name="rePassword"
                          value={rePassword}
                          validators={['required', 'isPasswordMatch']}
                          errorMessages={[
                            'This field is required',
                            'Password mismatch',
                          ]}
                        />
                        <p><h6 className="validated-error">{messageRePass}&nbsp;</h6></p>
                      </Form.Group>
                  </div>
                </div> 
                <div className="col" />
              </div>
              <LoadingOverlay
                active={isLoading}
                spinner
                text='Please wait...'
              >
                <div className="text-center mb-5 z-10">
                  <button className="btn btn-primary btn-lg mb-4 btn-submit">{t("sign_up.title")}</button>
                  <p className="text-gray">{t("sign_up.question")} <span>&nbsp;</span>
                    <a href={ConstantList.ROOT_PATH +"login"}>{t("sign_in.title")}</a>
                  </p>
                </div>
              </LoadingOverlay>
            </form>
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
