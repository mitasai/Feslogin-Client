import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import ConstantList from "../../appConfig";
import history from "history.js";

class ConfirmDelete extends Component {
  componentDidMount() {}

  render() {
    const {
      isConfirm,
      handleClose,
      startTimeContent,
      textContent,
      t,
      i18n,
      handleDelete,
      yes,
      no,
    } = this.props;
    return (
      <Modal
        className="modal"
        size="lg"
        show={isConfirm}
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

          <h2 className="modal-content-center">
            {t("general.deleteQuestion")}
          </h2>

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
          <br />
          <br />
          <br />

          <div className="modal-button-center">
            <Button className="modal-button-no" onClick={no}>
              {t("general.cancel")}
            </Button>
            <Button className="btn-orange" onClick={yes}>
              {t("general.confirm")}
            </Button>
          </div>
        </Modal.Body>
        
      </Modal>
    );
  }
}

ConfirmDelete.propTypes = {};

export default ConfirmDelete;
