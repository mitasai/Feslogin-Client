import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import ConstantList from "../../appConfig";
import history from "history.js";

class PopupComfirmDelete extends Component {
  componentDidMount() {}

  render() {
    const {
      isPopup,
      handleClose,
      confirmDelete,
      deleteId,
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
        <Modal.Body>
          <button className="modal-button-close" onClick={() => handleClose()}>
            X
          </button>
          <br />
          <br />
            <h2 className="modal-content-center">
              {t("Event.content.confirm_delete")}
            </h2>
          <br />
          <br />
          <div>
            <br />
            <Button
              style={{
                textAlign: "center",
                margin: "0 auto",
                display: "list-item",
              }}
              onClick={() => confirmDelete(deleteId)}
            >
              {t('general.confirm')}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}

PopupComfirmDelete.propTypes = {};

export default PopupComfirmDelete;
