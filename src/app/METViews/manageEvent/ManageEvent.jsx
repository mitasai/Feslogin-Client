import React, { Component } from "react";
import {
  searchByDtoPrivate as searchByPage,
  getlistEventStatusAndUserActionPrivate,
  getExcel,
  deleteItem,
} from "./EventService";
import moment from "moment";
import Select from "react-select";
import Pagination from "../../EgretLayout/METComponents/Pagination";
import {
  searchByDto as searchByPageRoleUser,
  getItemByEvent,
  getItemById,
  setIsJoinedEventForUser,
} from "./MyEventService";
import { updateEventStartStatus } from "./EventService";
import { roleSystem, roleSystemId } from "../../role";
import localStorageService from "app/services/localStorageService";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import history from "history.js";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet";
import { Alert, AlertTitle } from "@material-ui/lab";
import authService from "../../services/jwtAuthService";
import { Form } from "react-bootstrap";
import { isAdmin, isHost, isUser } from "app/auth/authRoles";
import { getAllByRoles } from "../User/UserService";
import { ContinuousColorLegend } from "react-vis";
import ConfirmDelete from "../../EgretLayout/METComponents/ConfirmDelete";

toast.configure({
  autoClose: 3000,
  draggable: false,
  limit: 3,
});

class ManageEvent extends Component {
  state = {
    keyword: "",
    rowsPerPage: 5,
    page: 0,
    totalElements: 0,
    item: {},
    itemList: [],
    totalUserAttend: 0,
    openIframe: false,
    role: [],
    level: 0,
    host: {},
    presenter: {},
    eventAction: "",
    listPresenterUser: [],
    listHostUser: [],
    listEventStatusAndUserAction: {},
    isDelete: false,
  };

  componentDidMount() {
    if (
      this.props.location?.state &&
      this.props.location.state.validationAlert
    ) {
      toast.success(this.props.location?.state.messageAlert);
      this.props.location.state.validationAlert = false;
      history.replace("/event", { state: {} });
    }
    this.updatePageData();
    this.getAllPresenterUser();
    this.getAllHostUser();
  }

  componentWillMount() {
    this.setState(
      {
        role: localStorageService.getLoginUser()?.roles,
      },
      () => {}
    );
  }
  getAllPresenterUser = () => {
    getAllByRoles({ roles: [{ id: roleSystemId.ROLE_PRESENTER }] }).then(
      ({ data }) => {
        this.setState({ listPresenterUser: [...data.content] });
      }
    );
  };
  getAllHostUser = () => {
    getAllByRoles({ roles: [{ id: roleSystemId.ROLE_HOST }] }).then(
      ({ data }) => {
        this.setState({ listHostUser: [...data.content] });
      }
    );
  };
  updatePageData = () => {
    let { enableDisableAllLoading } = this.props;
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.categoryCode = null;
    searchObject.fromDate = null;
    searchObject.toDate = null;
    searchObject.presenter = this.state.presenter;
    searchObject.eventAction = this.state.eventAction;
    searchObject.needUpdateStatus = false;
    searchObject.host = this.state.host;
    if (this.state.role == null) {
      history.push({
        pathname: ConstantList.LOGIN_PAGE,
        state: { returnUrl: window.location.pathname },
      });
      return;
    }
    let roles = [];
    this.state.role.forEach((e) => {
      roles.push(e);
    });
    if (isAdmin()) {
      enableDisableAllLoading(true);
      searchByPage(searchObject).then(({ data }) => {
        if (data != null) {
          this.setState(
            {
              itemList: [...data.content],
              totalElements: data.totalElements,
              level: 1,
            },
            function () {
              this.getlistEventStatusAndUserActionPrivate(data.content);
              enableDisableAllLoading(false);
            }
          );
        }
      });
      return;
    } else {
      enableDisableAllLoading(true);
      searchByPageRoleUser(
        searchObject,
        this.state.page,
        this.state.rowsPerPage
      ).then(({ data }) => {
        this.setState(
          {
            itemList: [...data.content],
            totalElements: data.totalElements,
            level: 2,
          },
          function () {
            this.getlistEventStatusAndUserActionPrivate(data.content);
            enableDisableAllLoading(false);
          }
        );
      });
      return;
    }
  };

  setPage = (page) => {
    this.setState({ page, listEventStatusAndUserAction: [] }, function () {
      this.updatePageData();
    });
  };

  handleChangePage = (newPage) => {
    this.setPage(newPage);

    let element = document.getElementById("table");
    element.scrollIntoView();
  };

  getlistEventStatusAndUserActionPrivate = (eventDtos) => {
    getlistEventStatusAndUserActionPrivate(eventDtos).then(({ data }) => {
      if (data != null) {
        this.setState({
          listEventStatusAndUserAction: data,
        });
      }
    });
  };

  joinEvent = (id) => {
    getItemByEvent(id).then((result) => {
      if (result.data != null && result.data != "") {
        if (
          result.data.event?.status != ConstantList.EVENT_STATUS.STATUS_ENDED
        ) {
          if (result.data.autoLoginUrl) {
            this.setState(
              {
                urlAutoLogin: result.data.autoLoginUrl,
              },
              function () {
                setIsJoinedEventForUser(id).then((result) => {});
                window.open(this.state.urlAutoLogin, "_blank");
              }
            );
          } else {
            alert("Có lỗi xảy ra");
          }
        } else {
          toast.error("This event has ended, Please reload this page.");
        }
      } else {
        alert("không tồn tại trong bảng userEvent");
      }
    });
  };

  startEvent = (id) => {
    getItemByEvent(id).then((result) => {
      if (result.data != null && result.data != "") {
        if (
          result.data.event?.status != ConstantList.EVENT_STATUS.STATUS_ENDED
        ) {
          if (result.data.autoLoginUrl) {
            this.setState(
              {
                urlAutoLogin: result.data.autoLoginUrl,
              },
              function () {
                updateEventStartStatus(id);
                window.open(this.state.urlAutoLogin, "_blank");
              }
            );
          } else {
            alert("Có lỗi xảy ra");
          }
        } else {
          toast.error("This event has ended, Please reload this page.");
        }
      } else {
        alert("Có lỗi xảy ra");
      }
    });
  };

  viewDetail = (id) => {
    this.props.history.push({ pathname: "detail/" + id });
  };

  checkTimeTwoHours = (startTime) => {
    let date = moment(new Date()).add(2, "hours");
    if (moment(startTime).isAfter(date._d)) {
      return true;
    }
    return false;
  };

  registEvent = (startTime, id) => {
    let check = this.checkTimeTwoHours(startTime);
    if (check) {
      alert("OK");
    } else {
    }
  };

  getFileExcel = () => {
    var searchObject = {};
    searchObject.keyword = this.state.keyword;
    getExcel(searchObject)
      .then((result) => {
        const url = window.URL.createObjectURL(
          new Blob([result.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "List_Event.xlsx");
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        toast.warning(err + "");
      });
  };

  _handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  _handleChangeSelect = (statename, value) => {
    if (value != null) {
      if (statename === "eventAction") {
        this.setState(
          {
            [statename]: value.id,
          },
          () => {
            this.updatePageData();
          }
        );
      } else {
        this.setState(
          {
            [statename]: { id: value.id, username: value.username },
          },
          () => {
            this.updatePageData();
          }
        );
      }
    } else {
      this.setState(
        {
          [statename]: null,
        },
        () => {
          this.updatePageData();
        }
      );
    }
  };
  _handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.updatePageData();
    }
  };

  confirmDelete = (item) => {
    let textContent = item.name;
    let startTimeContent = item.startTime;
    this.setState({
      isDelete: true,
      textContent: textContent,
      startTimeContent: startTimeContent,
      eventId: item.id,
    });
  };

  handleClose = () => {
    this.setState({ isDelete: false });
  };

  deleteEvent = () => {
    let { t } = this.props;
    let { eventId } = this.state;
    deleteItem(eventId)
      .then((result) => {
        this.setState({ isDelete: false }, () => {
          this.updatePageData();
          toast.success(t("general.success"));
        });
      })
      .catch((error) => {
        toast.warning(t("general.error"));
      });
  };

  render() {
    let { t, i18n } = this.props;
    let {
      keyword,
      itemList,
      totalElements,
      rowsPerPage,
      isDelete,
      listPresenterUser,
      listHostUser,
      totalUserAttend,
      openIframe,
      totalLike,
      totalEventAttend,
      listEventStatusAndUserAction,
    } = this.state;
    let user = authService.getLoginUser();
    return (
      <div>
        <div id="manage-event">
          <Helmet>
            <title>
              {t("web_site.title_page")} | {t("web_site.manage_event")}
            </title>
          </Helmet>
          <div className="container ">
            <section>
              <h1 className="text-center title ">
                {t("Event.content.manage")}
              </h1>
              <div className="text-center my-6">
                <img
                  className="img-fluid"
                  src="/assets/manage-event/barrie.png"
                  alt=""
                />
              </div>
            </section>
            <section className="search-event">
              <Form ref="form" onSubmit={this.handleFormSubmit}>
                <div className="row">
                  <div className="col-md-4 col-sm-12">
                    <Form.Group controlId="name">
                      <Form.Control
                        className="line-height-3-5"
                        type="text"
                        name="keyword"
                        placeholder={t("Event.content.searchByNameOrCode")}
                        value={this?.state?.keyword ? this.state.keyword : ""}
                        onChange={(searchName) => {
                          this._handleChange(searchName);
                        }}
                        onKeyDown={this._handleKeyDown}
                      />
                    </Form.Group>
                  </div>
                  {isUser() && (
                    <div className="col-md-4 col-sm-12">
                      <Form.Group controlId="host">
                        <Select
                          name="eventAction"
                          className="line-height-3-5 basic-select"
                          placeholder={t("Event.content.find_by_favou_attend")}
                          isClearable={true}
                          getOptionLabel={(option) => option.display}
                          getOptionValue={(option) => option.id}
                          options={[
                            {
                              id: "isAttendee",
                              display: t("Event.content.list_register"),
                            },
                            {
                              id: "isPresenter",
                              display: t("Event.content.list_presenter"),
                            },
                            {
                              id: "isFavourite",
                              display: t("Event.content.list_favourite"),
                            },
                          ]}
                          onChange={(value) => {
                            this._handleChangeSelect("eventAction", value);
                          }}
                          classNamePrefix="select"
                          inputValue=""
                        />
                      </Form.Group>
                    </div>
                  )}
                  {isAdmin() && (
                    <div className="col-md-4 col-sm-12">
                      <Form.Group controlId="host">
                        <Select
                          name="host"
                          className="line-height-3-5 basic-select"
                          placeholder={t("Event.content.find_by_host")}
                          isClearable={true}
                          getOptionLabel={(option) => option.displayName}
                          getOptionValue={(option) => option.id}
                          options={
                            this?.state?.listHostUser
                              ? this.state.listHostUser
                              : []
                          }
                          onChange={(value) => {
                            this._handleChangeSelect("host", value);
                          }}
                          classNamePrefix="select"
                          inputValue=""
                        />
                      </Form.Group>
                    </div>
                  )}
                  <div className="col-md-4 col-sm-12 basic-select">
                    <Form.Group controlId="presenter">
                      <Select
                        name="presenter"
                        className="line-height-3-5"
                        placeholder={t("Event.content.find_by_presenter")}
                        isClearable={true}
                        getOptionLabel={(option) => option.displayName}
                        getOptionValue={(option) => option.id}
                        options={
                          this?.state?.listPresenterUser
                            ? this.state.listPresenterUser
                            : []
                        }
                        onChange={(value) => {
                          this._handleChangeSelect("presenter", value);
                        }}
                        classNamePrefix="select"
                        inputValue=""
                      />
                    </Form.Group>
                  </div>
                </div>
              </Form>
            </section>
            <section id="table">
              <div className="fw-bold my-6">
                <h2 className="subtitle">
                  {" "}
                  <span className="text-teal spansp1 pb-4">
                    {t("Event.content.list")}
                    {" ( " + totalElements + " )"}
                  </span>
                  {(isAdmin() || isHost()) && (
                    <Link
                      className="nav-link btn-orange btn-lg pull-right color-white link1"
                      type="submit"
                      to="/create-event"
                    >
                      <i className="fas fa-plus" />{" "}
                      {t("Dashboard.header.createEvent")}
                    </Link>
                  )}
                </h2>
              </div>
              <div className="list-Event1">
                <div className="row fw-bold pb-5 bb-gray list-Event-head1">
                  {/* <div className="col">{t("Event.content.startTime")}</div> */}
                  <div className="col-5 text-center">
                    {t("Event.content.event")}
                  </div>
                  <div className="col text-end">{t("Event.content.host")}</div>
                  <div className="col text-end">
                    {t("Event.content.attendee")}
                  </div>
                  <div className="col text-end">
                    {t("Event.content.status")}
                  </div>
                  <div className="col text-end">
                    {t("Event.content.action")}
                  </div>
                </div>
                {itemList.map((item, index) => {
                  if (this.state.level == 2) {
                    return (
                      <div className="list-Event-body1">
                        <div className="row pb-5 bb-gray mt-5">
                          <div className="col-5">
                            <div className="row">
                              <div className="col-3 d-flex flex-column justify-content-center">
                                <h2 className="fs-med fw-bold text-orange">
                                  {moment(item.startTime).format("MMMM")}
                                </h2>
                                <h2 className="fs-big fw-bold">
                                  {moment(item.startTime).format("DD")}
                                </h2>
                              </div>
                              <div className="col-3">
                                {item.imageUrl !== null &&
                                item.imageUrl.length > 0 ? (
                                  <img
                                    style={{
                                      height: "100px",
                                      minWidth: "100px",
                                    }}
                                    className="img-fluid"
                                    src={
                                      ConstantList.API_ENPOINT +
                                      "/" +
                                      item.imageUrl
                                    }
                                    alt={"image"}
                                  />
                                ) : (
                                  <img
                                    style={{
                                      height: "100px",
                                      minWidth: "100px",
                                    }}
                                    className="img-fluid w-100"
                                    src={
                                      "/assets/manage-event/img-place-holder.png"
                                    }
                                    alt={"image"}
                                  />
                                )}
                              </div>
                              <div className="col-6">
                                <h4>{item.name}</h4>
                                <p>{item.createdBy}</p>
                                <p>
                                  {/* {moment(item.startTime).format(
                                    "dddd, DD MMMM, YYYY - kk:mm a"
                                  )} */}
                                  {new Intl.DateTimeFormat("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(item.startTime)}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* <div className="col">
                      </div> */}
                          {item?.host?.displayName ? (
                            <div className="col d-flex align-items-center align-items-center1">
                              {item.host.displayName}
                            </div>
                          ) : (
                            <div className="col col d-flex align-items-center align-items-center1">
                              {"Amber Academy"}
                            </div>
                          )}

                          <div className="col col d-flex align-items-center align-items-center1">
                            {item.totalAttendee}/50
                          </div>
                          <div className="col col d-flex align-items-center align-items-center1">
                            {Object.keys(listEventStatusAndUserAction)
                              .length === 0
                              ? t("Event.content.loading")
                              : listEventStatusAndUserAction[item.id]?.status ==
                                ConstantList.EVENT_STATUS.STATUS_INCOMING
                              ? t("Event.content.upcoming")
                              : listEventStatusAndUserAction[item.id]?.status ==
                                ConstantList.EVENT_STATUS.STATUS_HAPPENING
                              ? t("Event.content.ongoing")
                              : listEventStatusAndUserAction[item.id]?.status ==
                                ConstantList.EVENT_STATUS.STATUS_ENDED
                              ? t("Event.content.ended")
                              : t("Event.content.ended")}
                          </div>
                          <div className="col col d-flex align-items-center align-items-center1">
                            {listEventStatusAndUserAction[item.id]
                              ?.userAction ==
                              ConstantList.EVENT_ACTION_FOR_USER
                                .ACTION_REGISTER && (
                              <a
                                className="btn btn-sm-table btn-style1"
                                // onClick={() => this.registEvent(item.event.startTime, item.event.id)}
                                onClick={() => this.viewDetail(item.id)}
                              >
                                <i
                                  class="fa fa-plus fa-2x"
                                  aria-hidden="true"
                                  title="Đăng ký"
                                ></i>
                              </a>
                            )}
                            {listEventStatusAndUserAction[item.id]
                              ?.userAction ==
                              ConstantList.EVENT_ACTION_FOR_USER
                                .ACTION_START_OR_JOIN &&
                              isUser() && (
                                <a
                                  className="btn btn-sm-table btn-style1"
                                  onClick={() => this.joinEvent(item.id)}
                                >
                                  <i
                                    class="fa fa-desktop fa-2x"
                                    aria-hidden="true"
                                    title="Tham gia"
                                  ></i>
                                </a>
                              )}
                            {listEventStatusAndUserAction[item.id]
                              ?.userAction ==
                              ConstantList.EVENT_ACTION_FOR_USER
                                .ACTION_START_OR_JOIN &&
                              isHost() && (
                                <button
                                  className="btn btn-sm-table btn-style1"
                                  onClick={() => this.startEvent(item.id)}
                                >
                                  <i
                                    className="fa fa-play fa-2x"
                                    aria-hidden="true"
                                    title="Bắt đầu Event"
                                  ></i>
                                </button>
                              )}
                            {item.status ==
                              ConstantList.EVENT_STATUS.STATUS_INCOMING &&
                              isHost() &&
                              item.host.id == user.id && (
                                <Link
                                  className="btn btn-sm-table btn-style1"
                                  to={"/edit-event/" + item.id}
                                >
                                  <i
                                    className="fa fa-wrench fa-2x"
                                    aria-hidden="true"
                                    title="Chỉnh sửa"
                                  ></i>
                                </Link>
                              )}
                            <Link
                              className="btn btn-sm-table btn-style1"
                              to={"/detail/" + item.id}
                            >
                              <i
                                className="fa fa-info fa-2x"
                                aria-hidden="true"
                                title="Chi tiết"
                              ></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  if (this.state.level == 1) {
                    return (
                      <div className="list-Event-body1">
                        <div className="row pb-5 bb-gray mt-5">
                          <div
                            style={{ cursor: "pointer" }}
                            className="col-5"
                            onClick={() => this.viewDetail(item.id)}
                          >
                            <div className="row">
                              <div className="col-3 d-flex flex-column justify-content-center">
                                <h2 className="fs-med fw-bold text-orange">
                                  {moment(item.startTime).format("MMMM")}
                                </h2>
                                <h2 className="fs-big fw-bold">
                                  {moment(item.startTime).format("DD")}
                                </h2>
                              </div>
                              <div className="col-3">
                                {item.imageUrl !== null &&
                                item.imageUrl.length > 0 ? (
                                  <img
                                    style={{
                                      height: "100px",
                                      minWidth: "100px",
                                    }}
                                    className="img-fluid"
                                    src={
                                      ConstantList.API_ENPOINT +
                                      "/" +
                                      item.imageUrl
                                    }
                                    alt={"image"}
                                  />
                                ) : (
                                  <img
                                    style={{
                                      height: "100px",
                                      minWidth: "100px",
                                    }}
                                    className="img-fluid w-100"
                                    src={
                                      "/assets/manage-event/img-place-holder.png"
                                    }
                                    alt={"image"}
                                  />
                                )}
                              </div>
                              <div className="col-6">
                                <h4>{item.name}</h4>
                                <p>{item.createdBy}</p>
                                <p>
                                  {/* {moment(item.startTime).format(
                                    "dddd, DD MMMM, YYYY - kk:mm a"
                                  )} */}
                                  {new Intl.DateTimeFormat("vi-VN", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }).format(item.startTime)}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="col d-flex align-items-center align-items-center1">
                            {item.host.displayName}
                          </div>
                          <div className="col d-flex align-items-center align-items-center1">
                            {item.totalAttendee}/50
                          </div>
                          <div className="col d-flex align-items-center align-items-center1">
                            {Object.keys(listEventStatusAndUserAction)
                              .length === 0
                              ? t("Event.content.loading")
                              : listEventStatusAndUserAction[item.id]?.status ==
                                ConstantList.EVENT_STATUS.STATUS_INCOMING
                              ? t("Event.content.upcoming")
                              : listEventStatusAndUserAction[item.id]?.status ==
                                ConstantList.EVENT_STATUS.STATUS_HAPPENING
                              ? t("Event.content.ongoing")
                              : listEventStatusAndUserAction[item.id]?.status ==
                                ConstantList.EVENT_STATUS.STATUS_ENDED
                              ? t("Event.content.ended")
                              : t("Event.content.ended")}
                          </div>
                          <div className="col d-flex align-items-center align-items-center1">
                            {listEventStatusAndUserAction[item.id]
                              ?.userAction ==
                              ConstantList.EVENT_ACTION_FOR_USER
                                .ACTION_START_OR_JOIN && (
                              <button
                                className="btn btn-sm-table btn-style1"
                                onClick={() => this.startEvent(item.id)}
                              >
                                <i
                                  className="fa fa-play fa-2x"
                                  aria-hidden="true"
                                  title="Bắt đầu Event"
                                ></i>
                              </button>
                            )}
                            {item.status ==
                              ConstantList.EVENT_STATUS.STATUS_INCOMING &&
                              isAdmin() &&
                              item.host.id == user.id && (
                                <Link
                                  className="btn btn-sm-table btn-style1"
                                  to={"/edit-event/" + item.id}
                                >
                                  <i
                                    className="fa fa-wrench fa-2x"
                                    aria-hidden="true"
                                    title="Chỉnh sửa"
                                  ></i>
                                </Link>
                              )}
                            <Link
                              className="btn btn-sm-table btn-style1"
                              to={"/detail/" + item.id}
                            >
                              <i
                                className="fa fa-info fa-2x"
                                aria-hidden="true"
                                title="Chi tiết"
                              ></i>
                            </Link>
                            <button
                              className="btn btn-sm-table btn-style1"
                              onClick={() => this.confirmDelete(item)}
                            >
                              <i
                                className="fa fa-trash fa-2x"
                                aria-hidden="true"
                                title="Xoá"
                              ></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
                {itemList.length == 0 && <tr><td colspan="4">{t("Category.no_records")}</td> </tr>}
              </div>
              <div className="mt-5">
                {itemList.length > 0 && (
                  <Pagination
                    totalElements={totalElements}
                    onChangePage={(page) => {
                      this.handleChangePage(page);
                    }}
                    pageSize={rowsPerPage}
                  />
                )}
              </div>
            </section>
            <div className="text-center my-6">
              <img
                className="img-fluid"
                src="/assets/manage-event/barrie2.png"
                alt=""
              />
            </div>
            {/* <div className="my-6 d-flex">
              <Button
                className="align-bottom"
                size="sm"
                variant="outline-success"
                onClick={() => this.getFileExcel()}
                style={{ width: "15%", height: 40 }}
              >
                <img
                  className="img-fluid me-3"
                  src="/assets/manage-event/export.png"
                  alt=""
                />
                {t("general.exportToExcel")}
              </Button>
            </div> */}
          </div>
        </div>
        <div className="my-6">
          <div className="decor d-flex justify-content-between">
            <img className src="/assets/register/decor-left.png" alt="" />
            <img className src="/assets/register/decor-right.png" alt="" />
          </div>
        </div>
        {/* {openIframe && (
          <div className="window-event">
            <iframe
              className="iframe"
              allow="camera; microphone"
              src={this.state.urlAutoLogin}
            />
          </div>
        )} */}
        {isDelete && (
          <ConfirmDelete
            t={t}
            isConfirm={isDelete}
            handleClose={this.handleClose}
            textContent={this.state.textContent}
            startTimeContent={this.state.startTimeContent}
            yes={this.deleteEvent}
            no={this.handleClose}
          />
        )}
      </div>
    );
  }
}

ManageEvent.propTypes = {};

export default ManageEvent;
