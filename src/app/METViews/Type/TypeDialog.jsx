import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    DialogActions,
    FormControl,
    Paper,
    DialogTitle,
    DialogContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Draggable from "react-draggable";
import {
    searchByDto,
    deleteItem,
    saveItem,
    getItemById,
    checkCode,
    updateItem,
} from "./TypeService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

function PaperComponent(props) {
    return (
        <Draggable
            handle="#draggable-dialog-title"
            cancel={'[class*="MuiDialogContent-root"]'}
        >
            <Paper {...props} />
        </Draggable>
    );
}

class TypeDialog extends Component {
    state = {
        id: "",
        code: "",
        name: "",
        shouldOpenNotificationPopup: false,
        Notification: "",
    };

    handleDialogClose = () => {
        this.setState({ shouldOpenNotificationPopup: false });
    };

    handleChange = (event, source) => {
        event.persist();
        if (source === "switch") {
            this.setState({ isActive: event.target.checked });
            return;
        }
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleFormSubmit = () => {
        let { id } = this.state;
        let { code } = this.state;
        var { t } = this.props;
        // checkCode(id, code).then((result) => {
        //   //Nếu trả về true là code đã được sử dụng
        //   if (result.data) {
        //     toast.warning(t("general.dupli_code"));
        //     // alert("Code đã được sử dụng");
        //   } else {
        //     //Nếu trả về false là code chưa sử dụng có thể dùng
        if (id) {
            updateItem({
                ...this.state,
            }).then(() => {
                toast.success(t("Ypdate Success"));
                this.props.handleOKEditClose();
            });
        } else {
            saveItem({
                ...this.state,
            }).then(() => {
                toast.success(t("Add Success"));
                this.props.handleOKEditClose();
            });
        }
    };

    componentWillMount() {
        //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
        let { open, handleClose, item } = this.props;
        this.setState({ ...item });
    }

    render() {
        let {
            id,
            name,
            code,
        } = this.state;

        let { open, handleClose, handleOKEditClose, t, i18n } = this.props;

        return (
            <Dialog
                open={open}
                PaperComponent={PaperComponent}
                maxWidth="sm"
                fullWidth
            >

                <DialogTitle
                    style={{ cursor: "move", paddingBottom: "0px", color: "black" }}
                    id="draggable-dialog-title"
                >
                    <h4 className="" style={{ color: "black" }}>{id ? t("Update") : t("Add New")}</h4>
                </DialogTitle>

                <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>

                    <DialogContent>

                        <Grid className="" container spacing={2}>

                            <Grid item sm={12} xs={12}>

                                <TextValidator
                                    className="w-100 "
                                    label={
                                        <span style={{ color: "black" }}>
                                            <span style={{ color: "red" }}>*</span>
                                            {t("general.name")}
                                        </span>
                                    }
                                    onChange={this.handleChange}
                                    type="text"
                                    name="name"
                                    value={name}
                                    validators={["required"]}
                                    errorMessages={[t("general.required")]}
                                />

                            </Grid>

                            <Grid item sm={12} xs={12}>

                                <TextValidator
                                    className="w-100 "
                                    label={
                                        <span style={{ color: "black" }}>
                                            <span style={{ color: "red" }}>*</span>
                                            {t("general.code")}
                                        </span>
                                    }
                                    onChange={this.handleChange}
                                    type="text"
                                    name="code"
                                    value={code}
                                    validators={["required"]}
                                    errorMessages={[t("general.required")]}
                                />

                            </Grid>

                        </Grid>

                    </DialogContent>
                    <DialogActions>

                        <div className="flex flex-space-between flex-middle" style={{
                            width: "100%",
                            display:"flex",
                            justifyContent :"space-between"
                        }}>

                            <Button
                                variant="contained"
                                style={{marginLeft:"15px" }}
                                className=" flex-start mr-12"
                                color="succsess"
                                onClick={() => this.props.handleClose()}
                            >
                                {t("general.cancel")}
                            </Button>

                            <Button
                                variant="contained"
                                style={{ marginRight:"15px" }}
                                color="secondary"
                                type="submit"
                            >
                                {t("general.save")}
                            </Button>

                        </div>

                    </DialogActions>

                </ValidatorForm>

            </Dialog>
        );
    }
}


export default TypeDialog;