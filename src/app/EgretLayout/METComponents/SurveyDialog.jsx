import React, { Component } from "react";
import { Modal } from "react-bootstrap";

class RequestLoginPopup extends Component {
  componentDidMount() {}

  render() {
    const { isPopup, handleClose, survey, textContent, t, i18n } =
      this.props;
    return (
      <Modal
        className="modal"
        size="lg"
        show={isPopup}
        onHide={() => handleClose()}
        backdrop="static"
      >
        <Modal.Header closeButton className="survey-close-btn">
          <Modal.Title>{t("Event.content.survey")}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            height: "800px",
          }}
        >
          <object
            data={survey}
            className="window-event"
          />
        </Modal.Body>
      </Modal>
    );
  }
}

RequestLoginPopup.propTypes = {};

export default RequestLoginPopup;
