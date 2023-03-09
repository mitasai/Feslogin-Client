import React, { Component, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Select from "react-select";
import TimezonePicker from "react-bootstrap-timezone-picker";
import authService from "../../services/jwtAuthService";
import { searchByPage as getAllUser } from "../../views/User/UserService";
import { getAllByRoles } from "../../METViews/User/UserService";
import Button from "react-bootstrap/Button";
import { addNew, update, getItemById, checkCode } from "./EventService";
import { searchByDto as getAllCategory } from "../Category/CategoryService";
import moment from "moment";
import Dropzone from "../../EgretLayout/METComponents/dropzone/Dropzone";
import { Link } from "react-router-dom";
import ConstantList from "../../appConfig";
import history from "history.js";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Helmet } from "react-helmet";
import { roleSystemId } from "../../../app/role";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_PATH_UPLOAD = ConstantList.API_ENPOINT + "/api/upload/event-image";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

class Event extends Component {
  state = {
    name: "",
    description: "",
    startTime: "",
    endTime: "",
    livEventPassw: "",
    imageUrl: "",
    roomId: "",
    roomUrl: "",
    userEvents: [],
    eventCategories: [],
    eventTag: [],
    eventComment: [],
    dateStart: "",
    timeStart: "",
    dateEnd: "",
    timeEnd: "",
    timezone: "",
    host: authService.getLoginUser(),
    listCategory: [],
    listPresenterUser: [],
    presenter: [],
    isLoading: false,
    imageUrl: "",
    validationAlert: false,
    validationMessage: "",
    messageCode: "",
    survey: "",
    thankYouUrl: "",
  };
  constructor(props) {
    super(props);
    this.childDropZone = React.createRef();
    this.errorElement = React.createRef();
  }

  componentDidMount() {
    let { code } = this.state;
    this.getAllCategory();
    this.getAllPresenterUser();
    if (code == null || code == "") {
      this.autoGenerateCode();
    }

    if (this.props.match.params.id) {
      this.getEventById(this.props.match.params.id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { validationAlert } = this.state;
    if (prevState.validationAlert !== validationAlert && validationAlert) {
      this.errorElement.current.scrollIntoView();
    }
  }
  getAllCategory = () => {
    let searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = 100000;
    getAllCategory(searchObject).then(({ data }) => {
      this.setState({ listCategory: [...data.content] });
    });
  };

  getAllPresenterUser = () => {
    getAllByRoles({ roles: [{ id: roleSystemId.ROLE_PRESENTER }] }).then(
      ({ data }) => {
        this.setState({ listPresenterUser: [...data.content] });
      }
    );
  };

  getEventById = (id) => {
    let isLoggedIn = authService.getLoginUser() != null;
    getItemById(id, isLoggedIn).then(({ data }) => {
      data["dateStart"] = new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(data.startTime)
        .split("/")
        .reverse()
        .join("-");
      data["timeStart"] = new Intl.DateTimeFormat("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(data.startTime);
      if (data.endTime != null) {
        data["dateEnd"] = new Intl.DateTimeFormat("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
          .format(data.endTime)
          .split("/")
          .reverse()
          .join("-");
        data["timeEnd"] = new Intl.DateTimeFormat("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(data.endTime);
      }
      if (data.presenter != null && data.presenter.length > 0) {
        data.presenter.map((item, index) => {
          let presenter = {};
          let userPresenter = item;
          presenter.isPresenter = 1;
          presenter.user = userPresenter;
          data.userEvents.push(presenter);
        });
      }
      this.setState({ ...data });
    });
  };

  handleFormSubmit = (e) => {
    e.preventDefault();
    let { id, dateStart, timeStart, dateEnd, timeEnd, code } = this.state;
    let { enableDisableAllLoading } = this.props;
    let { t } = this.props;
    // var checkTime = moment(this.state.startTime).isBefore(this.state.endTime);
    // var checkTime2 = new Date() <= (this.state.endTime);
    // var checkTime3 = new Date() >= (this.state.startTime);
    enableDisableAllLoading(true);
    if (this.state.name === "") {
      this.setState({ errors: "Nhập ký tự" });
    }
    // checkCode(id, code).then((data) => {
    // if (data.data) {
    // enableDisableAllLoading(false);
    // this.setState({
    //   validationAlert: true,
    //   severityAlert: "warning",
    //   messageAlert: t("Event.content.alert_exist_code"),
    // });
    // } else {
    this.setState(
      {
        startTime: new Date(dateStart.toString() + " " + timeStart.toString()),
        endTime: new Date(dateEnd.toString() + " " + timeEnd.toString()),
        isLoading: true,
      },
      function () {
        if (id) {
          // if (checkTime && checkTime2 && checkTime3) {
          this.updateEvent();
          // } else {
          //   enableDisableAllLoading(false);
          //   if (!checkTime) toast.error("Thời gian bắt đầu phải trước thời gian kết thúc");
          //   if (!checkTime2) toast.error("Thời gian kết thúc phải sau thời gian hiện tại");
          //   if (!checkTime3) toast.error("azzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
          // }
        } else {
          this.addNewEvent();
        }
      }
    );
    //   }
    // });
  };

  checkExitsField = () => {
    let { t } = this.props;
    if (this.state.name == "") {
      this.setState({ messageName: t("Event.content.not_blank") });
      this.refs.name.focus();
      return true;
    }
    if (this.state.dateStart == "") {
      this.setState({ messageDateStart: t("Event.content.not_blank") });
      this.refs.dateStart.focus();
      return true;
    }
    if (this.state.timeStart == "") {
      this.setState({ messageTimeStart: t("Event.content.not_blank") });
      this.refs.timeStart.focus();
      return true;
    }
    if (this.state.dateEnd == "") {
      this.setState({ messageDateEnd: t("Event.content.not_blank") });
      this.refs.dateEnd.focus();
      return true;
    }
    if (this.state.timeEnd == "") {
      this.setState({ messageTimeEnd: t("Event.content.not_blank") });
      this.refs.timeEnd.focus();
      return true;
    }
    return false;
  };

  checkTime() {
    let { t } = this.props;
    var today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

    // this.state = {
    //   date: date
    // };
    if (moment(this.state.dateStart).isBefore(date)) {
      this.setState({ messageDateStart: t("Event.content.error_dateStart") });
      this.refs.dateStart.focus();
      return true;
    }
    if ((new Date() > (this.state.startTime))) {
      this.setState({ messageTimeStart: t("Event.content.error_timeStart") });
      this.refs.timeStart.focus();
      return true;
    }
    if (moment(this.state.dateStart).isAfter(this.state.dateEnd)) {
      this.setState({
        messageDateEnd: t("Event.content.error_dateEnd")
      });
      this.refs.dateEnd.focus();
      return true;
    }
    if (moment(this.state.startTime).isAfter(this.state.endTime)) {
      this.setState({
        messageTimeEnd: t("Event.content.error_timeEnd")
      });
      this.refs.timeEnd.focus();
      return true;
    }
    return false;
  }

  addNewEvent = () => {
    let { t, enableDisableAllLoading } = this.props;
    if (this.checkExitsField()) {
      enableDisableAllLoading(false);
    } else if (this.checkTime()) {
      enableDisableAllLoading(false);
    } else {
      addNew({ ...this.state })
        .then((response) => {
          if (response.data != null && response.status == 200) {
            this.state.isLoading = false;
            this.setState({ ...this.state });
            if (response.data.messageAlert) {
              this.setState({
                validationAlert: true,
                messageAlert: response.data.messageAlert,
              });
            } else {
              this.childDropZone.current.uploadFiles(API_PATH_UPLOAD, [
                { key: "eventId", value: response.data.id },
              ]);
              history.push({
                pathname: "/event",
                state: {
                  validationAlert: true,
                  severityAlert: "success", //  Giá trị mặc định, không thay đổi theo multilanguage
                  messageAlert: t("Event.content.alert_create_success"),
                },
              });
            }
            enableDisableAllLoading(false);
          } else {
            this.setState({
              validationAlert: true,
              messageAlert: response.status + "Có lỗi xảy ra, ",
            });
          }
        })
        .catch((error) => {
          if (error.response != null && error.response.data != null) {
            this.setState({
              validationAlert: true,
              severityAlert: "error",
              messageAlert: error.response.data.errorMessage,
            });
          } else {
            this.setState({
              validationAlert: true,
              severityAlert: "error", //  Giá trị mặc định, không thay đổi theo multilanguage
              messageAlert: t("Event.content.alert_create_failed"),
            });
          }
          enableDisableAllLoading(false);

          // this.setState({ isView: false });
        });
    }
  };

  updateEvent = () => {
    let { t, enableDisableAllLoading } = this.props;
    if (this.checkExitsField()) {
      enableDisableAllLoading(false);
    } else if (this.checkTime()) {
      enableDisableAllLoading(false);
    } else {
      update({ ...this.state })
        .then((response) => {
          if (response.data != null && response.status == 200) {
            if (response.data.messageAlert) {
              this.setState({
                validationAlert: true,
                severityAlert: "error", //  Giá trị mặc định, không thay đổi theo multilanguage
                messageAlert: response.data.errorMessage,
              });
            } else {
              this.state.isLoading = false;
              this.setState({ ...this.state });
              this.childDropZone.current.uploadFiles(API_PATH_UPLOAD, [
                { key: "eventId", value: response.data.id },
              ]);
              history.push({
                pathname: "/event",
                state: {
                  validationAlert: true,
                  severityAlert: "success", //  Giá trị mặc định, không thay đổi theo multilanguage
                  messageAlert: t("Event.content.alert_update_success"),
                },
              });
            }
            enableDisableAllLoading(false);
          }
        })
        .catch((error) => {
          if (error.response != null && error.response.data != null) {
            this.setState({
              validationAlert: true,
              severityAlert: "error", //  Giá trị mặc định, không thay đổi theo multilanguage
              messageAlert: error.response.data.errorMessage,
            });
          } else {
            this.setState({
              validationAlert: true,
              severityAlert: "error", //  Giá trị mặc định, không thay đổi theo multilanguage
              messageAlert: t("Event.content.alert_update_failed"),
            });
          }
          enableDisableAllLoading(false);
        });
    }
  };

  handleChange = (event, source) => {
    this.setState({
      [event.target.name]: event.target.value,
      validationAlert: false,
    });
    if (source === "name") {
      this.setState({
        messageName: "",
        [event.target.name]: event.target.value,
      });
    }
    if (source === "dateStart") {
      this.setState({
        messageDateStart: "",
        [event.target.name]: event.target.value,
      });
    }
    if (source === "timeStart") {
      this.setState({
        messageTimeStart: "",
        [event.target.name]: event.target.value,
      });
    }
    if (source === "dateEnd") {
      this.setState({
        messageDateEnd: "",
        [event.target.name]: event.target.value,
      });
    }
    if (source === "timeEnd") {
      this.setState({
        messageTimeEnd: "",
        [event.target.name]: event.target.value,
      });
    }
    if (source === "survey") {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  };

  handleChangeSelect = (value, source) => {
    if (source === "presenter") {
      let userEvents = [];
      value.map((item, index) => {
        let presenter = {};
        let userPresenter = item;
        presenter.isPresenter = 1;
        presenter.user = userPresenter;
        userEvents.push(presenter);
      });
      this.setState({ presenter: value, userEvents: userEvents });
    }
    this.setState({
      [source]: value,
    });
  };
  autoGenerateCode = () => {
    let { thankYouUrl } = this.state;
    let code = "Amber" + new Date().getTime();
    if (thankYouUrl == null || thankYouUrl == "") {
      let tkUrl =
        window.location.origin + ConstantList.ROOT_PATH + "thankyou/" + code;
      this.setState({ code: code, thankYouUrl: tkUrl });
    }
  };
  handleChangeCode = (event, source) => {
    event.persist();
    var checkCode = new RegExp(/^[a-zA-Z0-9_-]{6,999}$/);
    //TODO CHeck code
    // if (event.target.name === 'code') {
    //   if (!checkCode.test(event.target.value)) {
    //     this.setState({
    //       validationAlert: true,
    //       severityAlert: "error", //  Giá trị mặc định, không thay đổi theo multilanguage
    //       messageAlert: "CODE CONTAIN WHITE SPACES",
    //     });
    //   }
    // }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    let { t, i18n } = this.props;
    let {
      listCategory,
      eventCategories,
      imageUrl,
      validationAlert,
      messageAlert,
      severityAlert,
      messageCode,
      messageName,
      messageDescription,
      messageDateStart,
      messageTimeStart,
      messageDateEnd,
      messageTimeEnd,
    } = this.state;
    return (
      <div>
        <div id="create-event">
          <Helmet>
            <title>
              {t("web_site.title_page")} | {t("web_site.create_event")}
            </title>
          </Helmet>
          <div className="container ">
            <section>
              <h1 className="text-center title ">
                {this.state.id
                  ? t("Event.content.title3")
                  : t("Event.content.title")}
              </h1>
              <div className="text-center my-6">
                <img
                  className="img-fluid"
                  src="/assets/manage-event/barrie.png"
                  alt=""
                />
              </div>
            </section>
            <section>
              {validationAlert && (
                <Alert
                  ref={this.errorElement}
                  variant="filled"
                  severity={severityAlert}
                >
                  <AlertTitle>{severityAlert}</AlertTitle>
                  {messageAlert}
                  {/* <strong>
                    {this.state.id ? t("Event.content.alert_update_success") : t("Event.content.alert_create_success")}
                  </strong> */}
                </Alert>
              )}
              <div className="fw-bold my-5">
                <h2 className="subtitle">
                  <div className="text-teal pb-4 pe-5">
                    {t("Event.content.info")}
                  </div>
                </h2>
              </div>
              <Form ref="form" onSubmit={this.handleFormSubmit}>
                <Form.Group>
                  <Form.Label>{t("Event.content.image")}</Form.Label>
                  <Dropzone
                    ref={this.childDropZone}
                    imageUrl={
                      imageUrl ? ConstantList.API_ENPOINT + "/" + imageUrl : ""
                    }
                  />
                </Form.Group>
                <Form.Group controlId="name">
                  <Form.Label>
                    {
                      <span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Event.content.name")}
                      </span>
                    }
                  </Form.Label>
                  <Form.Control
                    // required
                    type="text"
                    name="name"
                    ref="name"
                    value={this?.state?.name ? this.state.name : ""}
                    onChange={(value) => {
                      this.handleChange(value, "name");
                    }}
                  />
                  <p>
                    <h6 className="validated-error">{messageName}&nbsp;</h6>
                  </p>
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group controlId="presenter">
                      <Form.Label>{t("Event.content.presenter")}</Form.Label>
                      <Select
                        isMulti={true}
                        name="presenter"
                        getOptionLabel={(option) => option.displayName}
                        getOptionValue={(option) => option.id}
                        options={
                          this?.state?.listPresenterUser
                            ? this.state.listPresenterUser
                            : []
                        }
                        value={
                          this?.state?.presenter ? this.state.presenter : ""
                        }
                        onChange={(value) => {
                          this.handleChangeSelect(value, "presenter");
                        }}
                        className="basic-select"
                        classNamePrefix="select"
                        inputValue=""
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="eventCategories">
                      <Form.Label>{t("Event.content.category")}</Form.Label>
                      <Select
                        isMulti
                        name="eventCategories"
                        getOptionLabel={(option) => option.name}
                        getOptionValue={(option) => option.id}
                        options={listCategory}
                        value={eventCategories}
                        onChange={(value) => {
                          this.handleChangeSelect(value, "eventCategories");
                        }}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="description">
                  <Form.Label>{t("Event.content.description")}</Form.Label>
                  <Form.Control
                    as="textarea"
                    // required
                    name="description"
                    ref="description"
                    value={this.state.description}
                    onChange={this.handleChange}
                    rows={10}
                  />
                </Form.Group>
                <Form.Group controlId="survey">
                  <Form.Label>{t("Event.content.survey")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="survey"
                    ref="survey"
                    value={this?.state?.survey ? this.state.survey : ""}
                    onChange={(event) => {
                      this.handleChange(event, "survey");
                    }}
                  />
                </Form.Group>
                {/* <Row> */}
                {/* <Col>
                    <Form.Group controlId="type">
                      <Form.Label>{<span className="font">
                        <span style={{ color: "red" }}> * </span>
                        {t("Event.content.code")}
                      </span>}</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        value={this.state.code}
                        name="code"
                        onChange={this.handleChangeCode}
                      />
                      <p><h6 className="validated-error">{messageCode}&nbsp;</h6></p>
                    </Form.Group>
                  </Col> */}

                {/* </Row> */}
                <Form.Group>
                  <div className="fw-bold my-5">
                    <h2 className="subtitle">
                      <div className="text-teal pb-4 pe-5">
                        {t("Event.content.setdate")}
                      </div>
                    </h2>
                  </div>
                </Form.Group>
                <Row>
                  <div className="col-xs-12 col-md-12 col-sm-12 col-lg-6">
                    <Form.Group controlId="date-time">
                      <Form.Label> {t("Event.content.single")}</Form.Label>
                      <Form.Label>
                        <h4>{t("Event.content.title2")}</h4>
                      </Form.Label>
                      <div className="row mb-5">
                        <div className="col white-border mg-reponsive">
                          <div className="row">
                            <div className="col-2 d-flex align-items-center">
                              <i className="far fa-calendar-alt" />
                            </div>
                            <div className="col">
                              {
                                <span className="font">
                                  <span style={{ color: "red" }}> * </span>
                                  {t("Event.content.eventS")}
                                </span>
                              }
                              <Form.Group controlId="dateStart">
                                <Form.Control
                                  // required
                                  className="date-controls"
                                  type="date"
                                  dateFormat="dd/MM/yyyy"
                                  name="dateStart"
                                  ref="dateStart"
                                  min="2020-01-01"
                                  max="2100-12-31"
                                  value={this.state.dateStart}
                                  onChange={(value) =>
                                    this.handleChange(value, "dateStart")
                                  }
                                />
                                <p>
                                  <h6 className="validated-error">
                                    {messageDateStart}&nbsp;
                                  </h6>
                                </p>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                        <div className="col white-border mg-reponsive">
                          <div className="row">
                            <div className="col-2 d-flex align-items-center">
                              <i className="far fa-calendar-alt" />
                            </div>
                            <div className="col">
                              {
                                <span className="font">
                                  <span style={{ color: "red" }}> * </span>
                                  {t("Event.content.startT")}
                                </span>
                              }
                              <Form.Group controlId="timeStart">
                                <Form.Control
                                  // required
                                  className="date-controls"
                                  type="time"
                                  name="timeStart"
                                  ref="timeStart"
                                  value={this.state.timeStart}
                                  onChange={(value) =>
                                    this.handleChange(value, "timeStart")
                                  }
                                />
                                <p>
                                  <h6 className="validated-error">
                                    {messageTimeStart}&nbsp;
                                  </h6>
                                </p>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-5">
                        <div className="col white-border mg-reponsive">
                          <div className="row">
                            <div className="col-2 d-flex align-items-center">
                              <i className="far fa-calendar-alt" />
                            </div>
                            <div className="col">
                              {
                                <span className="font">
                                  <span style={{ color: "red" }}> * </span>
                                  {t("Event.content.eventE")}
                                </span>
                              }
                              <Form.Group controlId="dateEnd">
                                <Form.Control
                                  type="date"
                                  className="date-controls"
                                  name="dateEnd"
                                  ref="dateEnd"
                                  value={this.state.dateEnd}
                                  dateFormat="dd/MM/yyyy"
                                  min="2021-01-01"
                                  max="2022-12-31"
                                  onChange={(value) =>
                                    this.handleChange(value, "dateEnd")
                                  }
                                />
                                <p>
                                  <h6 className="validated-error">
                                    {messageDateEnd}&nbsp;
                                  </h6>
                                </p>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                        <div className="col white-border mg-reponsive">
                          <div className="row">
                            <div className="col-2 d-flex align-items-center">
                              <i className="far fa-calendar-alt" />
                            </div>
                            <div className="col">
                              {
                                <span className="font">
                                  <span style={{ color: "red" }}> * </span>
                                  {t("Event.content.endT")}
                                </span>
                              }
                              <Form.Group controlId="timeEnd">
                                <Form.Control
                                  type="time"
                                  className="date-controls"
                                  name="timeEnd"
                                  ref="timeEnd"
                                  value={this.state.timeEnd}
                                  onChange={(value) =>
                                    this.handleChange(value, "timeEnd")
                                  }
                                />
                                <p>
                                  <h6 className="validated-error">
                                    {messageTimeEnd}&nbsp;
                                  </h6>
                                </p>
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-xs-12 col-md-12 col-sm-12 col-lg-6">
                    <Form.Group className="col" controlId="validationCustom06">
                      <Form.Label> {t("Event.content.agenda")}</Form.Label>
                      <br />
                      <br />
                      <br />
                      <Form.Control as="textarea" rows={15} />
                    </Form.Group>
                  </div>
                </Row>
                <div className="fw-bold my-5">
                  <h2 className="subtitle">
                    <div className="text-teal pb-4 pe-5">
                      {t("Event.content.platform")}
                    </div>
                  </h2>
                </div>
                <img
                  className="img-fluid mb-5"
                  src="/assets/create-event/logo_clickmeeting.png"
                  alt=""
                />
                <div className="last-btns my-6">
                  <Button className="btn btn-lg btn-orange btn-create">
                    <Link
                      style={{ color: "black", textDecoration: "none" }}
                      to="/event"
                    >
                      {t("Event.content.cancel")}
                    </Link>
                  </Button>
                  <Button
                    className="btn btn-primary btn-lg btn-create"
                    type="submit"
                  >
                    {t("Event.content.save")}
                  </Button>
                </div>
              </Form>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

Event.propTypes = {};

export default Event;
