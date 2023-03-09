import React, { Component } from "react";
import Form from 'react-bootstrap/Form'
import ConstantList from "../../appConfig";
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
import localStorageService from "../../services/localStorageService";
import { connect } from "react-redux";
import { resendEmail } from "./SessionService"
import { data } from "jquery";
import { toast } from "react-toastify";

class SignUpNoti extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    email: "",
    seconds: 60,
    isResendEmail: false,
  };

  componentDidMount() {
    let timeOut = localStorageService.getItem("timeout");
    if (timeOut > 0) {
      this.setState({ seconds: timeOut })
      this.countToResendEmail();
      this.setState({ isResendEmail: true })
    }
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

  componentWillUnmount() {
  }

  handleGoToVerify = () => {
    window.open("http://gmail.com", "_blank")
    //this.props.handleClose()
  }

  render() {
    let { t, i18n } = this.props;
    let {
    } = this.state;
    let TitlePage = t("sign_up.title_form");
    return (
      <div>
        <div className="container ">
          {/* <div className="text-center font-size-2 mb-5 z-10">
            <p><span className="text-gray">{t("sign_up.secure_account")}<span style={{color:'white'}}>&nbsp;{this.props.location.state.email}</span></span> </p>
          </div> */}
          <div className="row mb-3 not-event-title">
            {/* <div className="col-3" /> */}
            <div style={{ textAlign: 'center' }} className="col font-size-2">
              <div
                style={{ textAlign:'center' }}
              >
                  {" "}
                  <img
                    className="img-fluid"
                    src="/assets/confirm-email/email.png"
                    alt=""
                  />
                    &nbsp;{t("sign_up.go_to_verify")}{" "}
                </div>
              </div>        
            {/* <div className="col-3" /> */}
          </div>
          <div className="text-center font-size-2 mb-200 z-10">
            <p><span className="text-gray">{t("sign_up.check_in_spam")}</span> </p>
          </div>
          
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  // setUser: PropTypes.func.isRequired
});

export default connect(
  mapStateToProps,
  {}
)(SignUpNoti);
