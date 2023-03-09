import React, { Component, Fragment } from "react";
import Button from 'react-bootstrap/Button';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import ConstantList from "../../appConfig";
import localStorageService from "../../services/localStorageService";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { getCurrentUser, updateAccount, getListPartner, listApiKey } from './UserProfileService';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import UploadCropImagePopup from "./UploadCropImagePopup";
import ChangePasswordDiaglog from "./ChangePasswordPopup";
import authService from "../../services/jwtAuthService";
import axios from "axios";
import Select from "react-select";
import { roleSystem } from "../../role";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import { isAdmin, isHost, isUser } from "app/auth/authRoles";

toast.configure({
  autoClose: 3000,
  draggable: false,
  limit: 3
});

const API_PATH = ConstantList.API_ENPOINT + "/api/fileUpload/";
class UserProfile extends Component {

  state = {
    open: true,
    user: {},
    shouldOpenPasswordDialog: false,
    messegePhoneNumber: '',
    messageDisplayname: ''
  }

  componentDidMount() {
    getCurrentUser().then(({ data }) => {
      this.setState({ user: data });
    });
  }

  // componentWillUnmount() {
  //   let user = localStorageService.getLoginUser();
  //   getCurrentUser();
  //   this.setState({ user: user });
  // }

  handleChangeDisplayname = (event, source) => {
    event.persist()
    if (source === 'displayName') {
      let { user } = this.state;
      user = user ? user : {};
      user.name = event.target.value;
      this.setState({ user: user });
      // return;
    }
    this.setState({
      [event.target.name]: event.target.value,
      messageDisplayname: '',
    }, function () {
      if (this.state.user.person.displayName.trim().length < 1 || this.state.user.person.displayName < 1) {
        this.setState({
          messageDisplayname: 'Họ tên không hợp lệ'
        })
      }
    })
  }

  handleChange = (event, source) => {
    event.persist();
    if (source === "phone") {
      let { user } = this.state;
      user = user ? user : {};
      user.person.phoneNumber = event.target.value;
      this.setState({ user: user });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleChangeSelect = (value, source) => {
    this.setState({
      [source]: value,
    });
  };

  handleFormSubmit = event => {
    // event.persist();
    const { t } = this.props;
    let updateDto = {};
    updateDto.id = this.state.user.id
    updateDto.name = this.state.user.name.trim();
    updateDto.phone = this.state.user.person.phoneNumber;

    if (this.state.user.name.trim().length < 1) {
      this.setState({
        messageDisplayname: t("sign_up.message_display_name")
      })
    } else {
      updateAccount(updateDto).then(({ result }) => {
        toast.success(t("Profile.update"))
        // window.location.reload()
      })
    }
  };

  openPasswordDialog = () => {
    this.setState({
      shouldOpenPasswordDialog: true
    })
  }

  handleOpenPasswordDialog = () => {
    this.setState({
      shouldOpenPasswordDialog: true
    });
  }

  handleDialogPasswordClose = () => {
    this.setState({
      shouldOpenPasswordDialog: false
    })
  }

  handleOpenUploadDialog = () => {
    this.setState({
      shouldOpenImageDialog: true
    });
  }

  handleDialogClose = () => {
    this.setState({
      shouldOpenImageDialog: false
    })
  }

  handleUpdate = (blobValue) => {
    const url = ConstantList.API_ENPOINT + "/api/userAccount/updateavatar";
    let formData = new FormData();
    formData.set('uploadfile', blobValue)
    //formData.append('uploadfile',file);//Lưu ý tên 'uploadfile' phải trùng với tham số bên Server side
    const config = {
      headers: {
        'Content-Type': 'image/jpg'
      }
    }
    return axios.post(url, formData, config).then(response => {
      let user = response.data;
      this.setState({ user: user });
      authService.setLoginUser(user);
      this.handleDialogClose();
    });
  }

  render() {
    let user = this.state.user;
    let { t, i18n } = this.props;
    let { messegePhoneNumber, messageDisplayname, partnerApikey, listPartner, userPartner, } = this.state;
    let roles = localStorageService.getLoginUser()?.roles;

    return (
      <div id="userinfo">
        <Helmet>
          <title>{t('web_site.title_page')} | {t('web_site.profile')}</title>
        </Helmet>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              {this.state.shouldOpenPasswordDialog && (
                <ChangePasswordDiaglog t={t} i18n={i18n}
                  handleClose={this.handleDialogPasswordClose}
                  handleUpdate={this.handleUpdate}
                  open={this.state.shouldOpenPasswordDialog}
                  user={user}
                />
              )}
            </div>
              
              <h1 className="text-center fw-bold text-teal mb-5">{user.name}</h1>
              {/* <h2 className="text-center title-foott">1990</h2> */}
              <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12">
                    <Form.Group controlId="displayName" className="mb-2">
                      <Form.Label>
                        <span className="font">
                          <span style={{ color: "red" }}> * </span>
                          {t("Register.form.fullname")}
                        </span>
                      </Form.Label>
                      <Form.Control
                        onChange={displayName => this.handleChangeDisplayname(displayName, "displayName")}
                        required
                        type="name"
                        name="name"
                        value={user.name}
                      />
                      <p><h6 className="validated-error">{messageDisplayname}&nbsp;</h6></p>
                    </Form.Group>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12">
                    <Form.Group controlId="email" className="mb-2">
                      <Form.Label>{
                        <span className="font">
                          <span style={{ color: "red" }}> * </span>
                          {t("Profile.email")}
                        </span>
                      }
                      </Form.Label><br />
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        disabled
                        value={user.email}
                      />
                      <p><h6 className="validated-error">&nbsp;</h6></p>
                    </Form.Group>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12">
                    <Form.Group controlId="phone" className="mb-3">
                      <Form.Label>{t("Profile.phone")}</Form.Label>
                      <Form.Control
                        onChange={(phone) => this.handleChange(phone, 'phone')}
                        type="text"
                        name="phone"
                        value={user.phone}
                      />
                      <p><h6 className="validated-error">{messegePhoneNumber}&nbsp;</h6></p>
                    </Form.Group>
                  </div>
                </div>
                
                <div className="row justify-content-center">
                  <div className="col-md-6 col-sm-12">
                    <div className="text-center mb-5 z-10 row px-2">
                      <button id="change-pass-bt.n" className="btn btn-lg mb-2 col btn-primary w100" type="button" onClick={() => this.openPasswordDialog()} >{t("Profile.change_password")}</button>
                      <div className="col-md-1"></div>
                      <button className="btn btn-primary btn-lg mb-2 col w100" type="submit">{t("Profile.save")}</button>
                    </div>
                  </div>
                </div>
                

                {/* <div className="container flex flex-space-between flex-middle"
              style={{
                width: "68%",
                display: "flex",
                marginBottom: '30px',
                justifyContent: 'space-between',
                borderBotomRightRadius: "3px", borderBotomLeftRadius: "3px"
              }}>
              <Button
                className="capitalize"
                component="span"
                size="lg"
                type="button"
                variant="outline-light"
                onClick={() => this.openPasswordDialog()}>Đổi mật khẩu</Button><br />
              <Button
                className="capitalize"
                component="span"
                size="lg"
                type="button"
                variant="outline-danger" type="submit" >Cập nhật</Button>
            </div> */}
              </ValidatorForm>
            <div className="col"></div>
          </div>
        </div>
      </div>
    )
  }

}
export default (UserProfile);