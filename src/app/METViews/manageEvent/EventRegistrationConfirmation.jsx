import React, { Component } from "react";
import { VERIFY_EVENT } from "../../appConfig";

class EventRegistrationConfirmation extends Component {
  componentDidMount = () => {
    console.log(VERIFY_EVENT);
  };
  render() {
    const { t } = this.props;
    return (
      <div className="container">
        <h1 className="text-center title">
          {this.props.confirmationResult !== null
            ? this.props.confirmationResult === VERIFY_EVENT.INVALID_TOKEN
              ? t("general.Something went wrong")
              : this.props.confirmationResult === VERIFY_EVENT.TOKEN_EXPIRED
                ? t("general.Something went wrong")
                : this.props.confirmationResult === VERIFY_EVENT.ACCOUNT_NOT_MATCH
                  ? t("general.Something went wrong")
                  : this.props.confirmationResult === VERIFY_EVENT.TOKEN_APPROVED
                    ? t("general.Succesfully")
                    : ''
            : ""}
        </h1>
        <div className="text-center m-5">
          {
            this.props.confirmationResult === VERIFY_EVENT.TOKEN_APPROVED ? (
              <img
                className="img-fluid"
                style={{ maxHeight: "250px" }}
                src="/assets/images/title-foot.png"
                alt=""
              />
            ) : this.props.confirmationResult == VERIFY_EVENT.TOKEN_EXPIRED || this.props.confirmationResult === VERIFY_EVENT.INVALID_TOKEN ||
              this.props.confirmationResult == VERIFY_EVENT.ACCOUNT_NOT_MATCH || this.props.confirmationResult == VERIFY_EVENT.TOKEN_APPROVED ? (
              <img
                className="img-fluid"
                style={{ maxHeight: "250px" }}
                src="/assets/images/title-cross.png"
                alt=""
              />
            ) : <img
              className="img-fluid"
              style={{ height: "380px" }} 
              alt=""
            />}
        </div>
        <div className="text-center" style={{ fontSize: "40px" }}>
          <p className="text-gray font-size-2">
            {this.props.confirmationResult != null
              ? this.props.confirmationResult === VERIFY_EVENT.INVALID_TOKEN
                ? t("general.invalid token")
                : this.props.confirmationResult === VERIFY_EVENT.TOKEN_EXPIRED
                  ? t("general.time expired")
                  : this.props.confirmationResult === VERIFY_EVENT.ACCOUNT_NOT_MATCH
                    ? t("general.Logged user not match")
                    : this.props.confirmationResult === VERIFY_EVENT.TOKEN_APPROVED
                      ? t("general.Succesfully")
                      : ''
              : ""}
          </p>
        </div>
        <div className="col " style={{textAlign:'-webkit-center'}}>
          <button
            style={{maxWidth:'400px'}}
            className="btn btn-light btn-confirm btn-lg btn-space"
            onClick={
              this.props.confirmationResult === VERIFY_EVENT.TOKEN_APPROVED
                ? () => this.props.handleButtonClick(0) // Link to manage event page
                : () => this.props.handleButtonClick(1) // Link to home page
            }
          >
            Back to Event page
          </button>
        </div>
      </div>
    );
  }
}

export default EventRegistrationConfirmation;
