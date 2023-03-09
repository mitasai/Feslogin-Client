import React, { Component, Fragment } from "react";
import {
    Grid,
    IconButton,
    Icon,
    TablePagination,
    Button,
    TextField,
    Card,
    FormControl,
    Input,
    InputAdornment,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";
import Pagination from "../../EgretLayout/METComponents/Pagination";
import ReactPlayer from "react-player";
import authService from "../../services/jwtAuthService";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { Form } from "react-bootstrap";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import {
    getPlayUrlByRecordId,
} from "../manageEvent/EventService";
import CommentComponent from "../../EgretLayout/METComponents/CommentComponent";

function MaterialButton(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;

    return <div style={{ textAlign: "center" }}>
        <IconButton
            onClick={() => props.onSelect(item, 0)}
        >
            <Icon fontSize="large" color="primary" title={t("")}>edit</Icon>
        </IconButton>
        <IconButton
            onClick={() => props.onSelect(item, 1)}
        >
            <Icon fontSize="large" color="error" title={t("")}>delete</Icon>
        </IconButton>
    </div >
}

class Category extends Component {
    state = {
        id: '',
        item: {},
        itemList: [],
        rowsPerPage: 10,
        keyword: "",
        page: 1,
        totalElements: 0,
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
        playUrl: 'https://recorder.stat-cdn.com/download/2021/5/11/rec-lw-us-25/2902517/15de1d3191f20206bd9b76b2c43dd5fe/recording.mp4?st=x7J1cA8ndqt_uUGk4-WOgg&e=1620980769'
    };
    constructor(props) {
        super(props);
        //this.state = {keyword: ''};
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleTextChange(event) {
        this.setState({ keyword: event.target.value });
    }

    updatePageData = async (roomId, recordId) => {
        await getPlayUrlByRecordId(roomId, recordId).then((data) => {
            if (data != null && data.status == 200) {
                this.setState({ playUrl: data.data })
            }
        });
    };

    setPage = page => {
        this.setState({ page }, function () {
            this.updatePageData();
        })
    };

    handleChangePage = (newPage) => {
        this.setPage(newPage);
    };

    handleKeyDownEnterSearch = (e) => {
        if (e.key === "Enter") {
            this.search();
        }
    };

    _handleKeyDownEnterSearch = (e) => {
        if (e.key === "Enter") {
            this.search();
        }
    };


    componentWillMount() {
        let roomId = this.props.match.params.roomId
        let recordId = this.props.match.params.recordId
        let eventId = this.props.match.params.eventId
        let event = { id: eventId }
        this.setState({ roomId, recordId, eventId,  event })
        this.updatePageData(roomId, recordId)
        this.setState({ name: this.props.location.name })
    }

    componentDidMount() {

    }

    handleDialogClose = () => {
        this.setState(
            {
                shouldOpenEditorDialog: false,
                shouldOpenConfirmationDialog: false,
                data: [],
            },
            () => {
                this.updatePageData();
            }
        );
    };

    handleOKEditClose = () => {
        this.setState({
            shouldOpenEditorDialog: false,
            shouldOpenConfirmationDialog: false,
            shouldOpenConfirmationDeleteAllDialog: false,
        });
        this.setPage(0);
    };

    handleEditItem = (item) => {
        this.setState({
            item: item,
            shouldOpenEditorDialog: true,
        });
    };

    handleDelete = id => {
        this.setState({
            id,
            shouldOpenConfirmationDialog: true
        });
    };

    handleConfirmationResponse = () => {
        const { t } = this.props;
        // deleteItem(this.state.id).then(() => {
        //     this.updatePageData();
        //     this.handleDialogClose();
        //     toast.success(t("Category.delete"))
        // }).catch((err) => {
        //     toast.warning(t("Category.category_exist"));
        // });
    };



    render() {
        const { t, i18n } = this.props;
        let user = authService.getLoginUser();
        let { enableDisableAllLoading } = this.props;
        let isLoggedIn = user != null;
        let { keyword, shouldOpenNotificationPopup } = this.state;
        let {
            id,
            itemList,
            rowsPerPage, recordId, roomId, eventId,event,
            page,
            totalElements,
            shouldOpenEditorDialog,
            shouldOpenConfirmationDialog, playUrl, name
        } = this.state;

        return (

            <div className="container">
                <h4 className="text-center title title-mb mb-5">
                    {name}
                </h4>
                <Grid container item xs={12}>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={12} className="player-wrapper">
                        <ReactPlayer
                            className="react-player"
                            url={playUrl}
                            width="100%"
                            height="100%"
                            controls={true}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <CommentComponent
                            t={t}
                            roomId={roomId}
                            enableDisableAllLoading={enableDisableAllLoading}
                            eventId={eventId}
                            event={event}
                            recordId={recordId}
                            user={user}
                            isLoggedIn={isLoggedIn}
                        />  
                    </Grid>
                </Grid>
            </div>
        )
    }
}
export default Category;