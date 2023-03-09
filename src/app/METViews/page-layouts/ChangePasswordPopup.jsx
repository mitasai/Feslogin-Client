import { Fab, Icon, Card, Grid, Divider, Button, DialogActions, Dialog, TextField } from "@material-ui/core";
import Form from 'react-bootstrap/Form';
import React, { Component } from "react";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Draggable from 'react-draggable';
import Paper from '@material-ui/core/Paper';
import axios from "axios";
import ConstantList from "../../appConfig";
import 'react-image-crop/dist/ReactCrop.css';
import JwtAuthService from "../../services/jwtAuthService";
import { toast } from "react-toastify";
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
class ChangePasswordPopup extends React.Component {

  // handleChange = (prop) => (event) => {
  //   this.setState()
  // };
  state = {
    old_password: '',
    password: '',
    conf_password: '',
    messagePass: '',
    messageconfirmPassword: '',
    messageOldPass: '',
  }

  handleChangePass = name => event => {
    let { t, i18n } = this.props;
    this.setState({
      [name]: event.target.value,
    })
    this.setState({
      messagePass: '',
    }, function () {
      if (this.state.password.length < 1) {
        this.setState({
          messagePass: t("reset_password.require_password")
        })
      }
    });
  }

  handleChangeRePass = name => event => {
    let { t, i18n } = this.props;
    this.setState({
      [name]: event.target.value,
    })
    this.setState({
      messageconfirmPassword: '',
    }, function () {
      if (this.state.conf_password != this.state.password) {
        this.setState({
          messageconfirmPassword: t("reset_password.conf_password")
        })
      }
    });
  }

  componentDidMount() {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== this.state.password) {
        return false
      }
      return true
    })
  }
  async handleChangePassword(user, handleClose) {
    let { t, i18n } = this.props;
    user.password = this.state.password;
    user.old_password = this.state.old_password;
    user.conf_password = this.state.conf_password;
    const url = ConstantList.API_ENPOINT + "/auth/change-password";
    let isChangedOK = false;

    if ((this.state.old_password == null || this.state.old_password == '') && (this.state.password == null || this.state.password == '') && (this.state.conf_password == null || this.state.conf_password == '')) {
      this.setState({
        messageOldPass: t("reset_password.require_password"),
        messagePass: t("reset_password.require_password"),
        messageconfirmPassword: t("reset_password.require_password")
      })
    } else if ((this.state.old_password == null || this.state.old_password == '') && (this.state.password == null || this.state.password == '')) {
      this.setState({
        messageOldPass: t("reset_password.require_password"),
        messagePass: t("reset_password.require_password"),
      })
    } else if ((this.state.password == null || this.state.password == '') && (this.state.conf_password == null || this.state.conf_password == '')) {
      this.setState({
        messagePass: t("reset_password.require_password"),
        messageconfirmPassword: t("reset_password.require_password")
      })
    } else if ((this.state.old_password == null || this.state.old_password == '') && (this.state.conf_password == null || this.state.conf_password == '')) {
      this.setState({
        messageOldPass: t("reset_password.require_password"),
        messageconfirmPassword: t("reset_password.require_password")
      })
    }
    if (this.state.old_password == null || this.state.old_password == '') {
      this.setState({
        messageOldPass: t("reset_password.require_password")
      })
    } else if (this.state.password == null || this.state.password == '') {
      this.setState({
        messagePass: t("reset_password.require_password")
      })
    } else if (this.state.conf_password == null || this.state.conf_password == '') {
      this.setState({
        messageconfirmPassword: t("reset_password.require_password")
      })
    } else {

      await axios.put(url, user).then(response => {
        console.log(response);
        isChangedOK = true;
        toast.success(t("reset_password.title_succes"))
      }).catch(err => {
        toast.error(t("sign_up.error"))
        this.setState({ errorMessage: err.message });
      })
      if (isChangedOK) {
        await JwtAuthService.logout();
      }
    }
  }
  handleChange = name => event => {
    this.setState({
      messageOldPass: '',
      [name]: event.target.value,
    });
  };
  render() {
    const { t, i18n, handleClose, handleSelect, selectedItem, open, user } = this.props;
    let { messageOldPass, messagePass, messageconfirmPassword } = this.state;
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth >
        <ValidatorForm ref="form" style={{ border: "1px solid rgb(127 127 127)" }}>
          <DialogTitle style={{ backgroundColor: "black", cursor: "move", color: "#fff", borderTopRightRadius: "3px", borderTopLeftRadius: "3px" }}
            id="draggable-dialog-title">
            <h4 className="" style={{ color: "#fff" }}>{t("Profile.change_password")}</h4>
          </DialogTitle>
          <DialogContent style={{ backgroundColor: "black" }}>
            <Form.Label>{
              <span className="font">
                <span style={{ color: "red" }}> * </span>
                {t("Profile.old_password")}
              </span>
            }</Form.Label>
            <Form.Control
              id="password-current"
              placeholder=""
              onChange={this.handleChange('old_password')}
              type="password"
              name="old_password"
              value={this.state.old_password}
            />
            <p><h6 className="validated-error">{messageOldPass}</h6></p>
            <Form.Label>{
              <span className="font">
                <span style={{ color: "red" }}> * </span>
                {t("Profile.new_password")}
              </span>
            }</Form.Label>
            <Form.Control
              type="password"
              placeholder=""
              onChange={this.handleChangePass('password')}
              name="password"
              value={this.state.password}
            />
            <p><h6 className="validated-error">{messagePass}</h6></p>
            <Form.Label>{
              <span className="font">
                <span style={{ color: "red" }}> * </span>
                {t("Profile.enter_password")}
              </span>
            }</Form.Label>
            <Form.Control
              type="password"
              placeholder=""
              onChange={this.handleChangeRePass('conf_password')}
              name="conf_password"
              value={this.state.conf_password}
            />
            <p><h6 className="validated-error">{messageconfirmPassword}</h6></p>
            <div className="flex flex-space-between flex-middle" style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between", borderBotomRightRadius: "3px", borderBotomLeftRadius: "3px"
            }}>
              <button className="btn btn-dark btn-sm-category mt-4" onClick={() => this.props.handleClose()}>
                {t("general.cancel")}
              </button>
              <button className="btn btn-primary btn-sm-category mt-4" onClick={() => this.handleChangePassword(user, handleClose)}>
                {t("general.save")}
              </button>
            </div>
          </DialogContent>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default ChangePasswordPopup;