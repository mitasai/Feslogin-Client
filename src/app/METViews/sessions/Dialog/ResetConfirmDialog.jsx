import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import { forgotPassword } from "../SessionService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
    autoClose: 3000,
    draggable: false,
    limit: 3,
});

class ResetConfirmDialog extends Component {

    handleGoToVerify = () => {
        window.open("http://gmail.com", "_blank")
    }

    handleResendEmail = (email) => {
        forgotPassword( email).then((data) => {
          if (data != null) {
            toast.success("Đã gửi lại mail")
          } else {
            toast.error("Gửi lại mail không thành công")
          }
        });
    }

    render() {
        let { show, handleClose, email } = this.props;
        return (
            <Modal show={show} onHide={handleClose} backdrop="static" size="lg" centered>
                <div>
                    <div className="container ">
                    <div className="text-center" style={{fontSize: '40px'}}>
                        <p className="text-gray font-size-2">
                            Please help us secure your account by verifying your email address.
                        </p>
                    </div>
                    <div className="row mb-4">
                        <div className="col-3" />
                        <div className="col ">
                        <button 
                            className="btn btn-light btn-confirm btn-lg btn-space"
                            onClick={this.handleGoToVerify}
                        >
                            <img className="img-fluid" src="/assets/confirm-email/email.png" alt="" />
                                Verify Your Email Address
                        </button>
                        </div>
                        <div className="col-3" />
                    </div>
                    <div className="text-center mb-5 z-10">
                        <p className="text-black font-size-2">
                            <button
                                className="btn btn-link"
                                onClick={()=>{
                                this.handleResendEmail(this.props.item)
                            }}>
                                Resend email. Haven’t received?
                            </button>
                        </p>
                    </div>
                    </div>
                </div>
                <div className="d-grid gap-2 col-6 mx-auto">
                    <button 
                        className="btn btn-outline-danger btn-space" 
                        onClick={handleClose}>
                            Close
                    </button>
                </div>
                
            </Modal>
        );
    }
}

export default ResetConfirmDialog;
