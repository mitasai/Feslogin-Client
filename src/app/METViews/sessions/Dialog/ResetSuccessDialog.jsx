import React, { Component } from "react";
import { Modal } from "react-bootstrap";

class ResetSuccesDialog extends Component {
  
  render() {
    let { open, handleClose } = this.props;

    return (
      <Modal show={open} onHide={handleClose} backdrop="static" size="lg" centered>
        <div>
          <div className="container ">
            <h3 className="text-center title-dialog">Reset Password Successful</h3>
            <div className="text-center m-5">
              <img className="img-fluid" src="/assets/confirm-email/title-foot.png" alt="" /></div>
            <div className="row mb-4">
              <div className="col-3" />
              <div 
                className="col"
                style={{display: "flex",
                justifyContent: "center"}}
                onClick={handleClose}
              >
                <button className="btn btn-light btn-confirm btn-lg btn-space" >
                  Go to login
                </button>
              </div>
              <div className="col-3" />
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ResetSuccesDialog;
