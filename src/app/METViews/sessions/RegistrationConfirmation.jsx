import React, { Component } from "react";
import { VERIFY_REGISTRATION } from "../../appConfig";

class RegistrationConfirmation extends Component {
  componentDidMount = () => { };
  render() {
    const { t } = this.props;
    return (
      <div className="container">
        <h1 className="text-center title">
          {this.props.confirmationResult !== null
            ? this.props.confirmationResult === VERIFY_REGISTRATION.INVALID_TOKEN
              ? t("general.Something went wrong")
              : this.props.confirmationResult === VERIFY_REGISTRATION.TOKEN_EXPIRED
                ? t("general.Something went wrong")
                : this.props.confirmationResult === VERIFY_REGISTRATION.TOKEN_APPROVED
                  ? t("general.Succesfully")
                  : ''
            : ""}
        </h1>
        <div className="text-center m-5">
          {this.props.confirmationResult === 3 ? (
            <img
              className="img-fluid"
              style={{ maxHeight: "250px" }}
              src="/assets/images/title-foot.png"
              alt=""
            />
          ) : this.props.confirmationResult == 1 || this.props.confirmationResult === 2 ? (
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
            {this.props.confirmationResult !== null
              ? this.props.confirmationResult === VERIFY_REGISTRATION.INVALID_TOKEN
                ? t("general.invalid token")
                : this.props.confirmationResult === VERIFY_REGISTRATION.TOKEN_EXPIRED
                  ? t("general.time expired")
                  : this.props.confirmationResult === VERIFY_REGISTRATION.TOKEN_APPROVED
                    ? t("general.Succesfully")
                    : t("general.Try again")
              : ""}
          </p>
        </div>
        <div className="col " style={{ textAlign: 'center' }}>
          <button
            style={{ maxWidth: '500px' }}
            className="btn btn-light btn-confirm btn-lg btn-space"
            onClick={
              this.props.confirmationResult === 3
                ? () => this.props.handleButtonClick(0)
                : () => this.props.handleButtonClick(1)
            }
          >
            {t("general.backToHomePage")}
          </button>
        </div>
      </div>
    );
  }
}

export default RegistrationConfirmation;
