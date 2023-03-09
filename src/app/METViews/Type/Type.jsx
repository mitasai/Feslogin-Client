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
import {
    searchByDto,
    deleteItem,
    saveItem,
    getItemById,
    checkCode,
    updateItem,
} from "./TypeService";
import 'bootstrap/dist/css/bootstrap.min.css';
import TypeDialog from './TypeDialog';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import { toast } from "react-toastify";

function MaterialButton(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;

    return <div class="icon-button">
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
        page: 0,
        totalElements: 0,
        shouldOpenEditorDialog: false,
        shouldOpenConfirmationDialog: false,
    };

    constructor(props) {
        super(props);
        //this.state = {keyword: ''};
        this.handleTextChange = this.handleTextChange.bind(this);
    }

    handleTextChange(event) {
        this.setState({ keyword: event.target.value });
    }

    search() {
        console.log(this.state.itemList);
        this.setState({ page: 0 }, function () {
            var searchObject = {};
            searchObject.text = this.state.keyword;
            searchObject.pageIndex = this.state.page + 1;
            searchObject.pageSize = this.state.rowsPerPage;
            searchObject.categoryCode = null;
            searchObject.fromDate = null;
            searchObject.toDate = null;
            searchByDto(searchObject).then(({ data }) => {
                this.setState({ itemList: [...data.content], totalElements: data.totalElements })
            });
        });
    }

    updatePageData = () => {
        var searchObject = {};
        searchObject.text = this.state.keyword;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.categoryCode = null;
        searchObject.fromDate = null;
        searchObject.toDate = null;
        searchByDto(searchObject).then(({ data }) => {
            this.setState({ itemList: [...data.content], totalElements: data.totalElements })
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

    componentWillMount() {
        // this.updatePageData();
    }

    componentDidMount() {
        this.updatePageData();
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
        deleteItem(this.state.id).then(() => {
          this.updatePageData();
          this.handleDialogClose();
          toast.success("Delete success")
        });
      };

    render() {
        const { t, i18n } = this.props;
        let { keyword, shouldOpenNotificationPopup } = this.state;
        let {
            id,
            itemList,
            rowsPerPage,
            page,
            totalElements,
            shouldOpenEditorDialog,
            shouldOpenConfirmationDialog
        } = this.state;

        return (

            <div>
                <div>
                    {shouldOpenEditorDialog && (
                        <TypeDialog
                            t={t}
                            i18n={i18n}
                            handleClose={this.handleDialogClose}
                            open={this.state.shouldOpenEditorDialog}
                            handleOKEditClose={this.handleOKEditClose}
                            item={this.state.item}
                        />
                    )}

                    {shouldOpenConfirmationDialog && (
                        <ConfirmationDialog
                            title={t("Delete confirm")}
                            open={shouldOpenConfirmationDialog}
                            onConfirmDialogClose={this.handleDialogClose}
                            onYesClick={this.handleConfirmationResponse}
                            text={t('Delete confirm')}
                            agree={t("Delete")}
                            cancel={t("Cancel")}
                        />
                    )}
                </div>
                <div className="container">
                    <h1 className="text-center title">Quản lý Category</h1>
                    <div className="text-center m-5"><img className="img-fluid" src="/assets/login/title-foot.png" alt="" /></div>
                    <div className="text-center mb-5 z-10">
                        <button className="btn btn-dark btn-lg mb-4"
                            onClick={() => {
                                this.handleEditItem({ startTime: new Date(), endTime: new Date() });
                            }}
                        ><img className="img-fluid" src="/assets/manage-type/add.png" alt="" /></button>
                        <button className="btn btn-dark btn-lg mb-4"><img className="img-fluid" src="/assets/manage-type/search.png" alt="" /></button>
                        <div style={{ textAlign: "-webkit-center" }}>
                            <Grid item md={4} sm={12} xs={12} style={{ textAlign: "-webkit-center" }}>
                                <FormControl fullWidth style={{ marginTop: "6px" }}>
                                    <Input
                                        style={{ color: "white" }}
                                        className="search_box w-100"
                                        onChange={this.handleTextChange}
                                        onKeyDown={this.handleKeyDownEnterSearch}
                                        placeholder={t("Enter Keyword")}
                                        id="search_box"
                                        startAdornment={
                                            <InputAdornment>
                                                <Link>
                                                    {" "}
                                                    <SearchIcon
                                                        onClick={() => this.search(keyword)}
                                                        style={{ position: "absolute", top: "0", right: "0" }}
                                                    />
                                                </Link>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                        </div>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <div className=" mb-5 z-10">
                            <table style={{ minWidth: "100px", maxHeight: "620px" }}>
                                <tbody style={{ width: "100%" }} ><tr>
                                    <th align="center" style={{ width: "30%" }}>Mã</th>
                                    <th align="left" style={{ width: "60%" }}>Tên</th>
                                    <th align="right" style={{ textAlign: 'end', width: "10%" }} >Thao tác</th>
                                </tr>
                                    <tr>
                                        <td colSpan={4}><hr style={{ minWidth: "100px" }} align="center" /></td>
                                    </tr>
                                    {itemList.map((item, index) => {
                                        return (
                                            <tr>
                                                <td align="left">{item.code}</td>
                                                <td align="left">{item.name}</td>
                                                <td align="right" >
                                                    <MaterialButton item={item}
                                                        onSelect={(item, method) => {
                                                            if (method === 0) {
                                                                getItemById(item.id).then(({ data }) => {
                                                                    if (data.parent === null) {
                                                                        data.parent = {};
                                                                    }
                                                                    this.setState({
                                                                        item: data,
                                                                        shouldOpenEditorDialog: true,
                                                                    });
                                                                });
                                                            } else if (method === 1) {
                                                                this.handleDelete(item.id);
                                                            } else {
                                                                alert('Call Selected Here:' + item.id);
                                                            }
                                                        }}
                                                    /></td>
                                            </tr>
                                        )
                                    })}
                                </tbody></table>
                            <div style={{ marginTop: "5%", paddingRight: "10%" }}>
                                {/* <div className="mt-5">
                                    <Pagination
                                        totalElements={totalElements}
                                        onChangePage={this.handleChangePage}
                                        pageSize={rowsPerPage}
                                    />
                                </div> */}
                            </div>
                        </div>
                        <div className="mt-5">
                            <Pagination
                                totalElements={totalElements}
                                onChangePage={this.handleChangePage}
                                pageSize={rowsPerPage}
                            />
                        </div>
                    </div>
                    <div className="text-center mb-5 z-10">
                        {/* <button className="btn btn-dark btn-move btn-lg mb-4"><img className="img-fluid" src="/assets/manage-type/left2.png" alt="" /></button>
                        <button className="btn btn-dark btn-move btn-lg mb-4"><img className="img-fluid" src="/assets/manage-type/left.png" alt="" /></button> */}
                        {/* <button style={{display:"none"}} className="btn btn-dark btn-move btn-lg mb-4"></button> */}
                        {/* <button className="btn btn-dark btn-move btn-lg mb-4"><img className="img-fluid" src="/assets/manage-type/right.png" alt="" /></button>
                        <button className="btn btn-dark btn-move btn-lg mb-4"><img className="img-fluid" src="/assets/manage-type/right2.png" alt="" /></button> */}
                    </div>
                </div>
                <div className>
                    <div className="decor d-flex justify-content-between">
                        <img className src="/assets/userinfo/decor-left.png" alt="" />
                        <img className src="/assets/userinfo/decor-right.png" alt="" />
                    </div>
                </div>
            </div>
        )
    }
}
export default Category;