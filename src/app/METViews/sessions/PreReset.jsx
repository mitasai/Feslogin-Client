import React, { Component } from "react";
import ConstantList from "../../appConfig";
import {
  withStyles,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { confirmForgotPassword } from "./SessionService";
import { resetPassword } from "../sessions/SessionService";
import { toast } from "react-toastify";
import { Col, Form } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  autoClose: 6000,
  draggable: false,
  limit: 3,
});

const styles = (theme) => ({
  wrapper: {
    position: "relative",
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
});

const REQUEST_REJECT = 1;
const REQUEST_EXPIRED = 2;
const REQUEST_APPROVED = 3;

class ResetPassword extends Component {
  state = {
    messagePass: '',
    messageRePass: '',
    password: '',
  };

  componentDidMount = () => {

    const token = new URLSearchParams(this.props.location.search).get("token");
    const id = new URLSearchParams(this.props.location.search).get("id");

    confirmForgotPassword(token, id).then((response) => {
      this.setState({
        token: token,
        id: id,
      });

      if (response.data === REQUEST_APPROVED) {
      } else {
        alert("Token is invaild");
        toast.error("Token is invaild");
        this.toSignInPage();
      }
    });
  };

  constructor(props) {
    super(props);
  }

  handleChange = (event, source) => {
    event.persist();
    let { t } = this.props;
    var inValid = new RegExp("[\\s]");
    this.setState({
      messagePass: '',
      [event.target.name]: event.target.value,
    }, function () {
      if (this.state.password.length < 6) {
        this.setState({
          messagePass: t("reset_password.messagePass")
        })
      }
      else if (inValid.test(this.state.password)){
        console.log("EOOEEE");
        this.setState({
          messagePass: "không được có khoảng trắng"
        })
      }
    });
  };

  handleChangeRepass = (event, source) => {
    event.persist();
    let { t } = this.props;
    this.setState({
      messageRePass: '',
      [event.target.name]: event.target.value,
    }, function () {
      if (this.state.confirmPassword != this.state.password) {
        this.setState({
          messageRePass: t("reset_password.messageRePass")
        })
      }
    });
  };

  handleFormSubmit = (event) => {
    event.preventDefault();
    let { t } = this.props;
      if (this.validatedPassword()) {
        this.setState({ loading: true });
        // Post user object include id, password to compare
        let user = {};
        user.id = this.state.id;
        user.password = this.state.password;
        resetPassword(user, this.state.token)
          .then(() =>
            this.setState({ loading: false }),
            this.props.history.push(ConstantList.ROOT_PATH + "session/change-pass-noti")
          )
          .catch(() => this.setState({ loading: false }));
      }
  };

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule("isPasswordMatch");
  }

  toSignInPage = () => {
    this.props.history.push(ConstantList.ROOT_PATH + "login");
    // window.open("http://gmail.com", "_self");
  };

  handleDialogClose = () => {
    this.setState(
      {
        showResetSuccessDialog: false,
      },
      function () {
        this.toSignInPage();
      }
    );
  };

  validatedPassword = () => {
    let { t } = this.props;
    if (this.state.password == this.state.confirmPassword) {
      return true
    }
    if (this.state.password == '') {
      this.setState({messagePass: t("reset_password.require_password") })
      return false
    }
    if (this.state.confirmPassword == '') {
      this.setState({messagePass: t("reset_password.require_rePassword") })
      return false
    }
    this.setState({messageRePass: t("reset_password.messageRePass") })
    return false
  }

  render() {
    const { t, i18n } = this.props;

    let {
      confirmPassword,
      password,
      messagePass,
      messageRePass
    } = this.state;

    let { classes } = this.props;

    return (
      <div>
        <div className="container">
          <h1 className="text-center title">{t("reset_password.newPass")}</h1>
          <div className="text-center m-5"><img className="img-fluid" src="/assets/login/title-foot.png" alt="" /></div>
          <form onSubmit={this.handleFormSubmit}>
            <div className="row mb-5">
              <div className="col-lg-2" />
              <div className="col">
                <Form.Group controlId="validationPassword">
                  <Form.Label>
                    {t("sign_in.password")}
                  </Form.Label>
                  <Form.Control
                    // required
                    className="form-control"
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={this.handleChange}
                  />
                  <span className="validated-error">{messagePass}&nbsp;</span>
                </Form.Group>
              </div>
              <div className="col">
                <Form.Group controlId="validationPasswordConfirm">
                  <Form.Label>
                    {t("reset_password.retypePass")}
                  </Form.Label>
                  <Form.Control
                    // required
                    className="form-control"
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={this.handleChangeRepass}
                  />
                  <span className="validated-error">{messageRePass}&nbsp;</span>
                </Form.Group>
              </div>
              <div className="col-lg-2" />
            </div>
            <div className="text-center mb-5 z-10">
              <button type="submit" 
                className={(messagePass || messageRePass) ? 
                  "btn btn-primary btn-lg mb-4 disabled" : "btn btn-primary btn-lg mb-4"
                }>
                {t("general.confirm")}
              </button>
            </div>
          </form>
        </div>
        <div>
          <div className="decor d-flex justify-content-between">
            <img className src="/assets/login/decor-left.png" alt="" />
            <img className src="/assets/login/decor-right.png" alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResetPassword);
