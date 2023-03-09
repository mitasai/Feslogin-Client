import React, { Component } from "react";
import { connect } from "react-redux";
import { resendEmail } from "./MyEventService";
import { toast } from "react-toastify";
import ConstantList from "../../appConfig";
import LoadingOverlay from 'react-loading-overlay';
import localStorageService from "../../services/localStorageService";
import { getCurrentUser, } from '../page-layouts/UserProfileService';

class EventVerifyNoti extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    seconds: 60,
    isResendEmail: false,
    user:{},
  };

  componentDidMount() {
    let { enableDisableAllLoading } = this.props;
    getCurrentUser().then(({ data }) => {
      this.setState({ user: data });
    });
    let user = localStorageService.getLoginUser();
    enableDisableAllLoading(false);
    // this.setState({
    //   hostSite: window.location.origin + ConstantList.ROOT_PATH,
    // });
    let timeOut = localStorageService.getItem("timeout");
    if (timeOut > 0) {
      this.setState({ seconds: timeOut })
      this.countToResendEmail();
      this.setState({ isResendEmail: true })
    }
  }

  componentWillUnmount() {
    let user = localStorageService.getLoginUser();
    getCurrentUser();
    this.setState({ user: user });
  }

  handleGoToVerify = () => {
    window.open("http://gmail.com", "_blank");
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
  handleResendEmail = (searchDto) => {
    if (this.state.isResendEmail) {
      toast.error("Vui lòng chờ sau 1 phút để gửi lại email")
      return;
    }
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    resendEmail(searchDto).then((data) => {
      if (data != null) {
        toast.success("Đã gửi lại mail");
        enableDisableAllLoading(false);
        this.countToResendEmail()
        localStorageService.setItem("timeout", 60)
        this.setState({ isResendEmail: true, seconds: 60 })
      } else {
        enableDisableAllLoading(false);
        toast.error("Gửi lại mail không thành công");
      }
    });
  };

  render() {
    let { t, i18n } = this.props;
    let user = this.state.user;
    return (
      <div>
        <div className="container ">
          <div className="text-center font-size-2 mb-5 z-10">
            <p>
              <span className="text-gray">
                <p><span className="text-gray">{t("sign_up.regis_event")}<span style={{ color: 'white' }}>&nbsp;{this.props.location.state.event.name}</span>&nbsp;</span></p>
              </span>{" "}
            </p>
            <p>
              <span className="text-gray">
                <p><span className="text-gray">&nbsp;{t("sign_up.for_account")}<span style={{ color: 'white' }}>&nbsp;{user.email}</span></span> </p>
              </span>{" "}
            </p>
          </div>
          <div className="row mb-3">
            {/* <div className="col-3" /> */}
            <div style={{ textAlign: 'center' }} className="col font-size-2">
              <div
                style={{ textAlign: 'center' }}
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
          <div className="text-center font-size-2 mb-5 z-10">
            <p>
              <span className="text-gray">
                {t("sign_up.check_in_spam")}
              </span>{" "}
            </p>
          </div>
          {/* <LoadingOverlay
            active={isLoading}
            spinner
            text='Please wait...'
          > */}
          <div className="text-center mb-5 z-10">
            <p className="text-white font-size-2" style={{display: 'flex', justifyContent: 'center'}}>
              <button
                style={{ minWidth: '300px' }}
                className="btn btn-dark btn-sm btn-space"
                onClick={() => {
                  this.handleResendEmail(
                    this.props.location.state,
                  );
                }}
              >
                <img
                  className="img-fluid"
                  src="/assets/confirm-email/reset.png"
                  alt=""
                />{" "}
                &nbsp;
                {t("sign_up.haven’t_received")} - {t("sign_up.resend_email")}</button>
            </p>
            <p style={{ display: 'inline-flex', fontSize: '15px' }} >{this.state.seconds > 0 && this.state.isResendEmail ? <p style={{ fontSize: '15px' }}>{t('sign_up.resend')}</p> : ``}{this.state.seconds > 0 && this.state.isResendEmail ? ` ${this.state.seconds}s` : ''}</p>
          </div>
          {/* </LoadingOverlay> */}
        </div>
        <div className>
          <div className="decor d-flex justify-content-between">
            <img className src="/assets/login/decor-left.png" alt="" />
            <img className src="/assets/login/decor-right.png" alt="" />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // setUser: PropTypes.func.isRequired
});

export default connect(mapStateToProps, {})(EventVerifyNoti);
