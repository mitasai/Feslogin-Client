import React, { Component } from "react";
import Select from "react-select";
import Pagination from "../../EgretLayout/METComponents/Pagination";
import { findUserByUserName, searchByDto, searchByPage, getItemById } from "./UserService";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import ConstantList from "../../appConfig";
import { Link } from "react-router-dom";
import {
    Grid,
    IconButton,
    Icon,
    TablePagination,
    Button,
    TextField
} from "@material-ui/core";
import { Form } from "react-bootstrap";
import { Helmet } from "react-helmet";

function MaterialButton(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;

    return <div style={{ textAlign: "end" }}>
        <IconButton
            onClick={() => props.onSelect(item, 0)}
        >
            <Icon fontSize="large" color="primary" title={t("")}>edit</Icon>
        </IconButton>
    </div >
}

class User extends Component {
    state = {
        itemList: [],
        keyword: '',
        rowsPerPage: 10,
        page: 1,
        active: { value: null },
        item: {},
        shouldOpenEditorDialog: false,
        selectAllItem: false,
        selectedList: [],
        totalElements: 0,
        shouldOpenConfirmationDeleteAllDialog: false,
        isAddNew: false,
    };

    handleTextChange = event => {
        this.setState({ keyword: event.target.value }, function () {
        })
    };
    handleChange = (event, source) => {
        if (source === "active") {
            let active = event
            this.setState({ active: active }, () => {
                this.updatePageData()
            })
        }
    }

    handleKeyDownEnterSearch = e => {
        if (e.key === 'Enter') {
            this.search();
        }
    };

    setPage = page => {
        this.setState({ page }, function () {
            this.updatePageData();
        })
    };

    handleChangePage = (newPage) => {
        this.setPage(newPage);
        let element = document.getElementById("table-top");
        element.scrollIntoView();
    };

    search() {
        var searchObject = {};
        searchObject.text = this.state.keyword.trim();
        searchObject.active = this.state.active?.value != null ? this.state.active.value : null;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;
        // searchByPage(searchObject.pageIndex, searchObject.pageSize).then(({ data }) => {
        //     this.setState({ itemList: [...data.content], totalElements: data.totalElements })
        // });  
        searchByDto(searchObject).then(({ data }) => {
            this.setState({ itemList: [...data.content], totalElements: data.totalElements })
        })
    }

    updatePageData = () => {
        var searchObject = {};
        //searchObject.text = this.state.keyword;
        searchObject.text = this.state.keyword.trim();
        searchObject.active = this.state.active?.value != null ? this.state.active.value : null;
        searchObject.pageIndex = this.state.page;
        searchObject.pageSize = this.state.rowsPerPage;

        // searchByPage(searchObject.pageIndex, searchObject.pageSize).then(({ data }) => {
        //     this.setState({ itemList: [...data.content], totalElements: data.totalElements })
        // });
        searchByDto(searchObject).then(({ data }) => {
            this.setState({ itemList: [...data.content], totalElements: data.totalElements })
        })

    };

    componentDidMount() {
        this.updatePageData();
    }


    render() {
        const { t, i18n } = this.props;
        let {
            itemList,
            item,
            totalElements,
            rowsPerPage,
            isAddNew,
            page,
            active
        } = this.state;

        return (
            <div>
                <div className="container">
                    <Helmet>
                        <title>{t('web_site.title_page')} | {t('web_site.manage_user')}</title>
                    </Helmet>
                    <h1 className="text-center title title-mb">{t("user.title")}</h1>
                    <div className="text-center m-5"><img className="img-fluid img-title-mb" src="/assets/manage-event/barrie.png" alt="" /></div>
                    {/* <div className="text-center mb-5 z-10"> */}
                    {/* <a href="/user_manager/save"><button className="btn btn-dark btn-lg mb-4"><img className="img-fluid" src="/assets/manage-type/add.png" alt="" /></button></a> */}
                    {/* <button className="btn btn-dark btn-lg mb-4"><img className="img-fluid" src="/assets/manage-type/search.png" alt="" /></button> */}
                    {/* </div> */}
                    <div className="row">
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <Form.Group controlId="name">
                                <Form.Control
                                    className="line-height-3-5"
                                    type="text"
                                    style={{ color: "white", background: "black" }}
                                    name="keyword"
                                    placeholder={t("general.enterSearch")}
                                    value={this?.state?.keyword ? this.state.keyword : ""}
                                    onChange={this.handleTextChange}
                                    onKeyDown={this.handleKeyDownEnterSearch}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-12">
                            <Form.Group controlId="active">
                                <Select
                                    name="active"
                                    className="line-height-3-5"
                                    placeholder={t("user.findByStatus")}
                                    // text={t("Trạng thái kích hoạt")}
                                    isClearable={true}
                                    getOptionLabel={(option) => option.display}
                                    getOptionValue={(option) => option.value}
                                    options={[{ value: false, display: t("user.inActive") }, { value: true, display: t("user.active") }, { value: null, display: t("user.all") }]}
                                    onChange={(value) => this.handleChange(value, 'active')}
                                    // className="basic-select"
                                    classNamePrefix="select"
                                    inputValue="" />
                            </Form.Group>
                        </div>
                    </div>

                    <div className="fw-bold my-6">
                        <h2 className="subtitle">
                            {" "}
                            <span className="text-teal pb-4">
                                {t("user.list")}
                                {" ( " + totalElements + " )"}
                            </span>
                            <Link className="nav-link btn-primary btn-lg pull-right color-white" type="submit" to="/user_manager/save">
                                <i className="fas fa-plus" /> {t("Dashboard.header.createUser")}
                            </Link>
                        </h2>
                    </div>
                    <div id="table-top" style={{ textAlign: "-webkit-center" }}>
                        <div className=" mb-5 z-10 table-tble1">
                            <table className="table-tble">
                                <tr>
                                    <th width="10%">{t("user.no")}</th>
                                    <th width="20%">{t("user.account")}</th>
                                    <th width="30%">{t("user.displayName")}</th>
                                    <th width="30%">{t("user.email")}</th>
                                    <th className="right-fix" width="10%">{t("user.action")}</th>
                                </tr>
                                <tr>
                                    <td colSpan={5}><hr /></td>
                                </tr>
                                {itemList.length > 0 && itemList.map((item, index) => {
                                    return (
                                        <tr className="tr-table1">
                                            <th>{rowsPerPage * (page - 1) + index + 1}</th>
                                            <td>{item.username}</td>
                                            <td>{item.displayName}</td>
                                            <td>{item.email}</td>
                                            <td className="right-fix">
                                                <MaterialButton item={item}
                                                    onSelect={(item, method) => {
                                                        if (method === 0) {
                                                            getItemById(item.id, isAddNew).then(({ data }) => {
                                                                if (data.parent === null) {
                                                                    data.parent = {};
                                                                }
                                                                this.setState({
                                                                    item: data,
                                                                });
                                                                this.props.history.push({
                                                                    pathname: 'update/' + data.id,
                                                                });
                                                            });
                                                        } else {
                                                            alert('Call Selected Here:' + item.id);
                                                        }
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                                {itemList.length == 0 && <tr><td colspan="4">{t("Category.no_records")}</td> </tr>}
                            </table>
                        </div>
                    </div>
                    <div className="text-center mb-5 z-10">
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
                <div>
                    <div className="decor d-flex justify-content-between">
                        <img className="img-decor-mb" src="/assets/userinfo/decor-left.png" alt="" />
                        <img className="img-decor-mb" src="/assets/userinfo/decor-right.png" alt="" />
                    </div>
                </div>
            </div>
        );
    }
}
export default User;
