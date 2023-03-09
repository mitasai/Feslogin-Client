import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import {
    Dialog,
    Button,
    Paper,
    DialogTitle,
    DialogContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Draggable from "react-draggable";
import {
    saveItem,
    checkCode,
    updateItem,
} from "./PartnerService";
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

class PartnerDialog extends Component {
    state = {
        id: "",
        code: "",
        name: "",
        partnerId: '',
        partnerClientId: '',
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
        if (this.state.name.length == 0 && this.state.code.length == 0) {
            this.setState({
                messageName: t("Partner.not_null"),
                messageCode: t("Partner.not_null")
            })
        } else if (this.state.name.length  == 0){
            this.setState({
                messageName: t("Partner.not_null"),
            })
        } else if(this.state.code.length == 0) {
            this.setState({
                messageCode: t("Partner.not_null")
            })
        } else {
            checkCode(id, code).then((result) => {
                //Nếu trả về true là code đã được sử dụng
                if (result.data) {
                    toast.warning(t("Category.code_exist"));
                    // alert("Code đã được sử dụng");
                } else {
                    //Nếu trả về false là code chưa sử dụng có thể dùng
                    if (id) {
                        updateItem({
                            ...this.state,
                        }).then(() => {
                            toast.success(t("Category.update"));
                            this.props.handleOKEditClose();
                        });
                    } else {
                        saveItem({
                            ...this.state,
                        }).then(() => {
                            toast.success(t("Category.add"));
                            this.props.handleOKEditClose();
                        });
                    }
                }
            })
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
            partnerId,
            partnerClientId,
            messageName,
            messageCode,
        } = this.state;

        let { open, handleClose, handleOKEditClose, t, i18n } = this.props;

        return (
            <Dialog
                open={open}
                PaperComponent={PaperComponent}
                maxWidth="sm"
                fullWidth
            >
                <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} style={{ border: "1px solid rgb(127 127 127)" }}>
                    <DialogTitle
                        style={{ backgroundColor: "black", cursor: "move", color: "#fff", borderTopRightRadius: "3px", borderTopLeftRadius: "3px" }}
                        id="draggable-dialog-title"
                    >
                        <h4 className="" style={{ color: "#fff" }}>{id ? t("general.update") : t("general.addnew")}</h4>
                    </DialogTitle>
                    <DialogContent style={{ backgroundColor: "black" }}>
                        <Form.Label>{t("general.name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            onChange={this.handleChange}
                            name="name"
                            value={name}
                        />
                        <p className="validated-error">{messageName}</p>
                        <Form.Label>{t("general.code")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder=""
                            onChange={this.handleChange}
                            name="code"
                            value={code}
                        />
                        <p className="validated-error">{messageCode}</p>
                        <div className="flex flex-space-between flex-middle" style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "space-between", borderBotomRightRadius: "3px", borderBotomLeftRadius: "3px"
                        }}>
                            <Button className="btn btn-dark btn-sm-category mt-4" onClick={() => this.props.handleClose()}>
                                {t("general.cancel")}
                            </Button>
                            <Button className="btn btn-primary btn-sm-category mt-4" type="submit">
                                {t("general.save")}
                            </Button>
                        </div>
                    </DialogContent>
                </ValidatorForm>
            </Dialog>
        );
    }
}
export default PartnerDialog;