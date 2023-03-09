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
} from "./CategoryService";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import CategoryDialog from './CategoryDialog';
import { Form } from "react-bootstrap";
import { Breadcrumb, ConfirmationDialog } from "egret";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

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
        this.setState({ page: 1 }, function () {
            var searchObject = {};
            searchObject.text = this.state.keyword;
            searchObject.pageIndex = this.state.page;
            searchObject.pageSize = this.state.rowsPerPage;
            searchObject.categoryCode = null;
            searchObject.fromDate = null;
            searchObject.toDate = null;
            searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
                this.setState({ itemList: [...data.content], totalElements: data.totalElements })
            });
        });
    }

    updatePageData = () => {
        let { enableDisableAllLoading } = this.props;
        var searchObject = {};
        searchObject.text = this.state.keyword;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        searchObject.categoryCode = null;
        searchObject.fromDate = null;
        searchObject.toDate = null;
        searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
            this.setState({ itemList: [...data.content], totalElements: data.totalElements })
        });
    };

    setPage = (page) => {
        this.setState({ page }, function () {
            this.updatePageData();
        })
    };

    handleChangePage = (newPage) => {
        this.setPage(newPage);
        let element = document.getElementById("category-top");
        element.scrollIntoView();
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
        this.setPage(1);
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
        deleteItem(this.state.id).then(() => {
            this.updatePageData();
            this.handleDialogClose();
            toast.success(t("Category.delete"))
        }).catch((err) => {
            toast.warning(t("Category.category_exist"));
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
                <Helmet>
                    <title>{t('web_site.title_page')} | {t('web_site.manage_category')}</title>
                </Helmet>
                <div>
                    {shouldOpenEditorDialog && (
                        <CategoryDialog
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
                            title={t("DeleteForm.title")}
                            open={shouldOpenConfirmationDialog}
                            onConfirmDialogClose={this.handleDialogClose}
                            onYesClick={this.handleConfirmationResponse}
                            // text={t('Delete confirm')}
                            agree={t("DeleteForm.delete")}
                            cancel={t("DeleteForm.cancel")}
                        />
                    )}
                </div>
                <div className="container">
                    <h1 className="text-center title">{t("Category.category_manager")}</h1>
                    <div className="text-center m-5"><img className="img-fluid" src="/assets/login/title-foot.png" alt="" /></div>
                    <div className="text-center mb-5 z-10">
                        {/* <button className="btn btn-dark btn-lg mb-4"
                            onClick={() => {
                                this.handleEditItem({});
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
                        </div> */}
                    </div>

                    <div className="">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <Form.Group controlId="name">
                                <Form.Control
                                    className="line-height-3-5"
                                    type="text"
                                    style={{ color: "white", background: "black" }}
                                    name="keyword"
                                    placeholder={t("Event.content.searchByNameOrCode")}
                                    value={this?.state?.keyword ? this.state.keyword : ""}
                                    onChange={this.handleTextChange}
                                    onKeyDown={this.handleKeyDownEnterSearch}
                                />
                            </Form.Group>
                        </div>
                    </div>


                    <div className="fw-bold my-6">
                        <h2 className="subtitle">
                            {" "}
                            <span className="text-teal pb-4">
                                {t("Category.list")}
                                {" ( " + totalElements + " )"}
                            </span>
                            <Button className="btn btn-primary btn-sm-category pull-right mt-4 mb-4"
                                onClick={() => {
                                    this.handleEditItem({});
                                }}>
                                <i className="fas fa-plus" /> {t("Dashboard.header.createCategory")}
                            </Button>
                        </h2>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <div className=" mb-5 z-10 table-tble1">
                            <table id="category-top" className="table-tble">
                                <tr >
                                    <th align="left" width="10%">{t("Category.no")}</th>
                                    <th align="center" width="30%">{t("Category.code")}</th>
                                    <th align="left" width="40%">{t("Category.name")}</th>
                                    <th align="right" style={{ textAlign: "center" }} width="20%" >{t("Category.action")}</th>
                                </tr>
                                <tr>
                                    <td colspan="4"><hr align="center" /></td>
                                </tr>
                                {itemList.map((item, index) => {
                                    return (
                                        <tr className="tr-table1">
                                            <th align="left">{rowsPerPage * (page - 1) + index + 1}</th>
                                            <td align="left">{item.code}</td>
                                            <td align="left">{item.name}</td>
                                            <td style={{ textAlignLast: 'center' }} >
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
                                {itemList.length == 0 && <tr><td colspan="4">{t("Category.no_records")}</td> </tr>}
                            </table>

                        </div>

                        <div className="mt-5">
                            {itemList.length > 0 && (
                                <Pagination
                                    totalElements={totalElements}
                                    onChangePage={this.handleChangePage}
                                    pageSize={rowsPerPage}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className style={{ marginTop: "5%" }}>
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