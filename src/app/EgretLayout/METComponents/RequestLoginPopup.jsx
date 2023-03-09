import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import ConstantList from "../../appConfig";
import history from "history.js";

class RequestLoginPopup extends Component {
  componentDidMount() {}

  redirectLinkLogin = () => {
    history.push({
      pathname: ConstantList.ROOT_PATH + "login",
      state: { returnUrl: window.location.pathname },
    });
  };

  redirectLinkSignUp = () => {
    history.push({
      pathname: ConstantList.ROOT_PATH + "register",
    });
  };

  render() {
    const {
      isPopup,
      handleClose,
      startTimeContent,
      textContent,
      t,
      i18n,
    } = this.props;
    return (
      <Modal
        className="modal"
        size="lg"
        show={isPopup}
        onHide={() => handleClose()}
        backdrop="static"
      >
        {/* <Modal.Header closeButton>
          <Modal.Title className="modal-header">{title}</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <button className="modal-button-close" onClick={() => handleClose()}>
            X
          </button>
          <br />
          <br />
          {textContent != null ? (
            <h2 className="modal-content-center">
              {t("general.signInToSaveThisEvent")}
            </h2>
          ) : (
            <h2 className="modal-content-center">
              {t("general.please_login_to_continue")}
            </h2>
          )}

          <hr className="modal-hr"></hr>
          <br />
          {textContent != null && (
            <h3 className="modal-content-center">
              {textContent.toUpperCase()}
            </h3>
          )}

          <br />
          {textContent != null && (
            <h4 className="modal-content-center">
              {new Intl.DateTimeFormat("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(startTimeContent)}
            </h4>
          )}

          <br />
          <br />
          <div
          // className="modal-button-center"
          // style={{
          //   margin: "auto",
          //   display: "flex",
          //   width: "80%",
          //   flexDirection: "row",
          //   justifyContent: "space-between",
          // }}
          >
            {/* <Button
              className="modal-button"
              onClick={() => this.redirectLinkSignUp()}
            >
              {t("Home.login.registration")}
            </Button> */}
            <br />
            <Button
              style={{
                textAlign: "center",
                margin: "0 auto",
                display: "list-item",
              }}
              onClick={() => this.redirectLinkLogin()}
            >
              {t("general.continue")}
            </Button>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button
            style={{ color: "#000", backgroundColor: "#00e9a0" }}
            onClick={() => handleClose()}
          >
            {t("general.close")}
          </Button>
        </Modal.Footer> */}
      </Modal>
    );
  }
}

RequestLoginPopup.propTypes = {};

export default RequestLoginPopup;
