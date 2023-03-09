import React, { Component } from "react";
import { toast } from "react-toastify";
import { forgotPassword } from "./SessionService";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import localStorageService from "../../services/localStorageService";

toast.configure({
    autoClose: 3000,
    draggable: false,
    limit: 3,
});

class ChangePassVerify extends Component {
    constructor(props) {
        super(props);
      }
    
      state = {
        seconds: 60,
        isResendEmail: false,
      };

    handleGoToVerify = () => {
        window.open("http://gmail.com", "_blank")
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

    handleResendEmail = (data) => {
        if (this.state.isResendEmail) {
            toast.error("sign_up.resend_error")
            return;
        }
        forgotPassword(data).then((result) => {
          if (result != null) {
            toast.success("sign_up.resend_success")
            this.countToResendEmail()
            localStorageService.setItem("timeout", 60)
            this.setState({ isResendEmail: true, seconds: 60 })
          } else {
            toast.error("sign_up.send_error")
          }
        });
    }

    render() {
        let { t } = this.props;
        return (
            <div>
                <div className="container ">
                <div className="text-center font-size-2 mb-5 z-10">
                    <p><span className="text-gray">
                        {t("reset_password.resetPassVerify")}<span style={{ color: 'white' }}>&nbsp;{this.props.location.state.email}</span>
                    </span></p>
                </div>
                <div className="row mb-3">
                    <div className="col-3" />
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
                    <div className="col-3" />
                </div>
                <div className="text-center mb-5 z-10">
                    <p className="text-white font-size-2">
                        <button
                            className="btn btn-dark btn-sm btn-space" 
                            onClick={()=>{
                            this.handleResendEmail(this.props.location.state)}} 
                        >
                            <img className="img-fluid" src="/assets/confirm-email/reset.png" alt="" />      
                            {t("sign_up.haven’t_received")} - {t("sign_up.resend_email")}
                        </button>
                    </p>
                    <p style={{display:'inline-flex', fontSize:'15px'}} >
                        {this.state.seconds > 0 && this.state.isResendEmail ? 
                        <p style={{fontSize:'15px'}}>{t('sign_up.resend')}</p> : ` `} 
                        {this.state.seconds > 0 && this.state.isResendEmail ? 
                        ` ${this.state.seconds}s` : ' '}
                    </p>
                </div> 
                </div>
                <div className>
                <div className="decor d-flex justify-content-between">
                </div>
                </div>
            </div>
        )
    }
}
export default ChangePassVerify;
