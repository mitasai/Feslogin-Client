import React from "react";
import { Dialog, DialogActions, Button } from "@material-ui/core";
const ConfirmationDialog = ({
  open,
  onConfirmDialogClose,
  text,
  title,
  agree,
  cancel,
  onYesClick
}) => {
  return (
    <Dialog
      style={{ border:" rgb(127 127 127)" }}
      maxWidth="xs"
      fullWidth={true}
      open={open}
      onClose={onConfirmDialogClose}
    >
      <div className="pt-24 px-20 pb-8" style={{ background: "black" , border:"1px solid white"}}>
        <h4 className="capitalize" style={{ color: "white", marginTop: "20px", marginBottom: "20px", marginLeft: "10px" }}>{title}</h4>
        <hr />
        <p style={{ color: "white", marginTop: "20px", marginBottom: "20px", marginLeft: "10px" }} >{text}</p>
        <DialogActions>
          <div className="flex flex-space-between flex-middle"
            style=
            {{
              width: "100%",
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Button
              variant="outline-light"
              color="inherty"
              className="btn btn-dark btn-sm-category mt-4"
              onClick={onConfirmDialogClose}
            >
              {cancel}
            </Button>
            <Button
              variant="outline-danger"
              color="secondary"
              className="btn btn-primary btn-sm-category mt-4"
              onClick={onYesClick}
            >
              {agree}
            </Button>
          </div>
        </DialogActions>

      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
