import React, { Component, Fragment } from "react";
import {
    IconButton,
    Icon,
} from "@material-ui/core";
import Pagination from "../../EgretLayout/METComponents/Pagination";
import {
    searchByDto,
    deleteItem,
    getItemById,
} from "./PartnerService";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import PartnerDialog from './PartnerDialog';
import { Breadcrumb, ConfirmationDialog } from "egret";
import { toast } from "react-toastify";

function MaterialButton(props) {
    const { t, i18n } = useTranslation();
    const item = props.item;

    return <div style={{ textAlign: "end" }}>
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

class Partner extends Component {
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
            searchObject.pageIndex = this.state.page + 1;
            searchObject.pageSize = this.state.rowsPerPage;
            searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
                this.setState({ itemList: [...data.content], totalElements: data.totalElements })
            });
        });
    }

    updatePageData = () => {
        this.setState({ page: 1 }, function () {
            var searchObject = {};
            searchObject.text = this.state.keyword;
            searchObject.pageIndex = this.state.page;
            searchObject.pageSize = this.state.rowsPerPage;
            searchByDto(searchObject, this.state.page, this.state.rowsPerPage).then(({ data }) => {
                this.setState({ itemList: [...data.content], totalElements: data.totalElements })
            });
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
                        <PartnerDialog
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
                    <h1 className="text-center title">{t("Profile.Partner")}</h1>
                    <div className="text-center m-5"><img className="img-fluid" src="/assets/login/title-foot.png" alt="" /></div>
                    <div className="text-center mb-5 z-10">
                        <button className="btn btn-dark btn-lg mb-4"
                            onClick={() => {
                                this.handleEditItem({});
                            }}
                        ><img className="img-fluid" src="/assets/manage-type/add.png" alt="" /></button>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <div className=" mb-5 z-10">
                            <table width="1300">
                                <tr >
                                    <th align="left" width="10%">{t("Stt")}</th>
                                    <th align="left" width="30%">{t("Code")}</th>
                                    <th align="left" width="40%">{t("Name")}</th>
                                    {/* <th align="left" width="10%">{t("Partner Id")}</th>
                                    <th align="left" width="15%">{t("Partner Client Id")}</th> */}
                                    <th align="right" style={{ textAlign: "end" }} width="20%" >{t("Action")}</th>
                                </tr>
                                <tr>
                                    <td colspan="4"><hr width="1300" align="center" /></td>
                                </tr>
                                {itemList.length > 0 && itemList.map((item, index) => {
                                    return (
                                        <tr>
                                            <th align="left">{rowsPerPage * (page - 1) + index + 1}</th>
                                            <td align="left">{item.code}</td>
                                            <td align="left">{item.name}</td>
                                            {/* <td align="left">{item.partnerId}</td>
                                            <td align="left">{item.partnerClientId}</td> */}
                                            <td  >
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
                            <Pagination
                                totalElements={totalElements}
                                onChangePage={this.handleChangePage}
                                pageSize={rowsPerPage}
                            />
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
export default Partner;