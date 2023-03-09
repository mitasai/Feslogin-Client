import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import ReactPlayer from "react-player";

class PlayRecordVideoModal extends Component {
  componentDidMount() {}

  render() {
    const { isPopup, handleClose, playUrl, t, i18n } = this.props;
    return (
      <Modal
        className="modal"
        size="lg"
        show={isPopup}
        onHide={() => handleClose()}
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-header">
            {" "}
            {t("Event.record.play_record")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="player-wrapper">
            <ReactPlayer
              className="react-player"
              url={playUrl}
              width="100%"
              height="100%"
              controls={true}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ color: "#000", backgroundColor: "#00e9a0" }}
            onClick={() => handleClose()}
          >
            {t("general.close")}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

PlayRecordVideoModal.propTypes = {};

export default PlayRecordVideoModal;
