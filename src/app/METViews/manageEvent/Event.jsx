import React, { Component } from "react";
import {
  getItemById,
  searchByDto,
  toogleFavouriteEvent,
  getPlayUrlByRecordId,
  listAttendeeByEvent,
  listUserEventFavourite,
  getListUserJoin,
  getListUserJoinNotYet,
  getlistEventStatusAndUserAction,
  updateEventStartStatus,
  totalUserAttend,
} from "./EventService";
import {
  getItemByEvent,
  addMyEvent,
  setIsJoinedEventForUser,
} from "./MyEventService";
import {
  addNew,
  getListEmotionUser,
  deleteEmotion,
} from "./EmotionUserService";
import ReactPlayer from "react-player";
import RequestLoginPopup from "../../EgretLayout/METComponents/RequestLoginPopup";
import { ConfirmationDialog } from "egret";
import SurveyDialog from "../../EgretLayout/METComponents/SurveyDialog";
import {
  searchByDto as searchComment,
  addNewComment,
  searchByParentComment,
} from "./EventComment";
import * as moment from "moment";
import "moment-duration-format";
import { roleSystem, emotionSystem, imgEmotion } from "../../role";
import localStorageService from "app/services/localStorageService";
import Pagination from "../../EgretLayout/METComponents/Pagination";
import CommentComponent from "../Comment/CommentComponent";
import { Form } from "react-bootstrap";
import LoadingOverlay from "react-loading-overlay";
import ConstantList from "../../appConfig";
import { Swiper, SwiperSlide } from "swiper/react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import authService from "../../services/jwtAuthService";
import { isAdmin, isUser, isHost } from "app/auth/authRoles";
import PlayRecordVideoModal from "./PlayRecordVideoModal";
import UserProfile from "app/views/page-layouts/UserProfile";
import SlideCategory from "../../EgretLayout/METComponents/SlideCategory";
import "swiper/components/navigation/navigation.min.css";
import "swiper/components/pagination/pagination.scss";
import { toast } from "react-toastify";
import SwiperCore, { Navigation } from "swiper/core";
SwiperCore.use([Navigation, Pagination]);
const ACTION_START_OR_JOIN = 0;
const NO_ACTION_EVENT_INCOMING = 1;
const ACTION_REGISTER = 2;
const NO_ACTION_EVENT_ENDED = 3;
class Event extends Component {
  state = {
    rowsPerPage: 10,
    page: 0,
    role: [],
    event: [],
    commentList: [],
    openIframe: false,
    comment: "",
    parentComment: null,
    isLoading: false,
    isLoadingLike: false,
    favouriteObject: [],
    eventList: [],
    openReply: false,
    openCommentChild: false,
    recordList: [],
    roomId: "",
    isPopup: false,
    playUrl: "",
    isDownload: false,
    commentParent: "",
    pageSizeChild: 3,
    tabActive: "records",
    listFavourite: [],
    listAttendee: [],
    totalAttendeeList: 0,
    totalFavouriteList: 0,
    emotionUser: [],
    isRequireLogin: false,
    listIsJoin: [],
    listIsJoinNotYet: [],
    totalIsJoin: 0,
    totalIsJoinNotYet: [],
    statusObject: null,
    isSurvey: false,
  };

  componentDidMount() {
    let user = authService.getLoginUser();
    let searchDto = {};
    let hostSite = window.location.origin + ConstantList.ROOT_PATH;
    searchDto.hostSite = hostSite;
    if (user != null) {
      searchDto.userId = user.id;
    }
    this.setState({
      hostSite: hostSite,
      searchDto: searchDto,
    });
    this.updatePageDataListFavourite();
    this.updatePageDataListAttendee();
    this.updatePageDataListUserJoin();
    this.updatePageDataListUserJoinNotYet();
    this.props.enableDisableAllLoading(true);

    // window.history.scrollRestoration = 'manual'
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.getEventById(this.props.match.params.id);
    }

    this.setState({
      role: localStorageService.getLoginUser()?.roles,
    });

    this.updatePageData();
    this.updateSlideEvent();
    // this.getUserEvent(this.props.match.params.id);
    let shareLink =
      "https://www.facebook.com/sharer/sharer.php?u=" +
      window.location.href +
      "&amp;src=sdkpreparse";
    this.setState({ shareLink });
    this.props.enableDisableAllLoading(true);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      // window.location.reload();
      this.props.enableDisableAllLoading(true);
      this.getEventById(this.props.match.params.id);
      this.updatePageData();
      this.updateSlideEvent();
      let element = document.getElementById("top-page");
      element.scrollIntoView();
      this.updatePageDataListFavourite();
      this.updatePageDataListAttendee();
      this.updatePageDataListUserJoin();
      this.updatePageDataListUserJoinNotYet();
      // this.getUserEvent(this.props.match.params.id);
    }
  }
  handleTabClick = (value) => {
    switch (value) {
      case "records":
        this.switchTab(value);
        break;
      case "usersFavorite":
        this.switchTab(value);
        break;
      case "registerEvent":
        this.switchTab(value);
        break;
      case "isJoin":
        this.switchTab(value);
        break;
      case "isJoinNotYet":
        this.switchTab(value);
        break;
      default:
        this.switchTab(value);
    }
  };
  switchTab(value) {
    let tabActive = value;
    switch (value) {
      case "usersFavorite":
        this.updatePageDataListFavourite();
        break;
      case "registerEvent":
        this.updatePageDataListAttendee();
        break;
      case "isJoin":
        this.updatePageDataListUserJoin();
        break;
      case "isJoinNotYet":
        this.updatePageDataListUserJoinNotYet();
        break;
      default:
        this.updatePageDataListAttendee();
    }
    this.setState({
      tabActive: tabActive,
      isLoading: true,
      searchObject: {},
    });
  }
  getEventById = (id) => {
    this.props.enableDisableAllLoading(true);
    let isLoggedIn = authService.getLoginUser() != null;
    getItemById(id, isLoggedIn).then(({ data }) => {
      data["dateStart"] = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(data.startTime)
        .split("/")
        .reverse()
        .join("-");
      data["timeStart"] = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
      }).format(data.startTime);
      data["dateEnd"] = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
        .format(data.endTime)
        .split("/")
        .reverse()
        .join("-");
      data["timeEnd"] = new Intl.DateTimeFormat("vi-VN", {
        timeZone: "UTC",
        hour: "2-digit",
        minute: "2-digit",
      }).format(data.endTime);
      this.setState(
        {
          event: { ...data },
          recordList: data?.partnerPlatform?.records
            ? data.partnerPlatform.records
            : [],
          roomId: data.roomId,
        },
        function () {
          this.props.enableDisableAllLoading(false);
        }
      );
    });
  };
  updatePageDataListAttendee = (searchObject) => {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    if (!searchObject) {
      searchObject = {};
    }
    searchObject.isAttendee = 1;
    if (!searchObject.pageIndex) {
      searchObject.pageIndex = 1;
    }
    searchObject.pageSize = 10;
    listAttendeeByEvent(searchObject, this.props.match.params.id).then(
      ({ data }) => {
        this.setState(
          {
            listAttendee: [...data.content],
            totalAttendeeList: data.totalElements,
          },
          function () {
            enableDisableAllLoading(false);
          }
        );
      }
    );
  };

  updatePageDataListFavourite = (searchObject) => {
    let { enableDisableAllLoading } = this.props;
    if (!searchObject) {
      searchObject = {};
    }
    if (!searchObject.pageIndex) {
      searchObject.pageIndex = 1;
    }
    searchObject.isFavourite = 1;
    searchObject.pageSize = 10;
    listUserEventFavourite(searchObject, this.props.match.params.id).then(
      ({ data }) => {
        this.setState(
          {
            listFavourite: [...data.content],
            totalFavouriteList: data.totalElements,
          },
          function () {
            enableDisableAllLoading(false);
          }
        );
      }
    );
  };

  updatePageDataListUserJoin = (searchObject) => {
    let { enableDisableAllLoading } = this.props;
    if (!searchObject) {
      searchObject = {};
    }
    if (!searchObject.pageIndex) {
      searchObject.pageIndex = 1;
    }
    searchObject.isFavourite = 1;
    searchObject.pageSize = 10;
    getListUserJoin(searchObject, this.props.match.params.id).then(
      ({ data }) => {
        this.setState(
          {
            listIsJoin: [...data.content],
            totalIsJoin: data.totalElements,
            isLoading: false,
          },
          function () {
            enableDisableAllLoading(false);
          }
        );
      }
    );
  };

  updatePageDataListUserJoinNotYet = (searchObject) => {
    let { enableDisableAllLoading } = this.props;
    if (!searchObject) {
      searchObject = {};
    }
    if (!searchObject.pageIndex) {
      searchObject.pageIndex = 1;
    }
    searchObject.isFavourite = 1;
    searchObject.pageSize = 10;
    getListUserJoinNotYet(searchObject, this.props.match.params.id).then(
      ({ data }) => {
        this.setState(
          {
            listIsJoinNotYet: [...data.content],
            totalIsJoinNotYet: data.totalElements,
          },
          function () {
            enableDisableAllLoading(false);
          }
        );
      }
    );
  };
  handleConfirmationDownload = () => {
    window.open(this.state.downloadUrl, "_blank");
    this.handleClose();
  };
  handleLogin = (obj) => {
    if (obj != null) {
      let textContent = obj.name;
      let startTimeContent = obj.startTime;
      this.setState({
        isRequireLogin: true,
        textContent: textContent,
        startTimeContent: startTimeContent,
      });
    } else {
      this.setState({
        isRequireLogin: true,
      });
    }
  };
  getPlayUrlByRecordId = async (roomId, recordId) => {
    let { enableDisableAllLoading } = this.props;
    // await getPlayUrlByRecordId(roomId, recordId).then((data) => {
    //   if (data != null && data.status == 200) {
    //     this.setState({ isPopup: true, playUrl: data.data });
    //   }
    // });
    await getPlayUrlByRecordId(roomId, recordId).then((data) => {
      if (data != null && data.status == 200) {
        let path =
          ConstantList.ROOT_PATH +
          `record/` +
          roomId +
          `/` +
          recordId +
          `/` +
          this.state.event.id;
        this.props.history.push({
          pathname: path,
          name: this.state.event?.name,
        });
      }
    });
  };
  handleClose = () => {
    this.setState({
      isPopup: false,
      isDownload: false,
      isRequireLogin: false,
      isLoading: false,
      isSurvey: false,
    });
  };

  getUserEvent = (id) => {
    getItemByEvent(id).then((result) => {
      this.setState({ userEvent: result.data });
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
            setIsJoinedEventForUser(id).then((result) => { });
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

  addMyEvent = (id, searchDto) => {
    addMyEvent(id, searchDto).then((result) => {
      if (result.data.id != null && result.data.id != "") {
        let path = ConstantList.ROOT_PATH + `event-noti/`;
        this.props.history.push({
          pathname: path,
          id: result.data.email,
          hostSite: this.state.hostSite,
          state: this.state,
        });
      } else if (result.data.id === null || result.data.id === "") {
        alert("Đăng ký sự kiện không thành công");
      }
    });
  };

  toSignInPage = () => {
    // this.props.history.push(ConstantList.ROOT_PATH + "session/signin");
    window.open("http://gmail.com", "_self");
  };

  updatePageData = () => {
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.eventId = this.props.match.params.id;

    searchComment(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState(
          {
            commentList: [...data.content],
            totalElements: data.totalElements,
          },
          function () { }
        );

        this.getListEmotionUser([...data.content]);
      }
    );
  };

  getListEmotionUser = () => {
    let user = authService.getLoginUser();
    let isLoggedIn = user != null;
    if (!isLoggedIn) {
      return;
    }
    let commentList = this.state.commentList;
    if (commentList == undefined) {
      return;
    }
    getListEmotionUser(this.props.match.params.id).then(({ data }) => {
      this.setState({ emotionUser: [...data] }, function () {
        commentList.forEach((eComment) => {
          [...data].forEach((eEmotion) => {
            if (eEmotion.eventComment.id == eComment.id) {
              eComment.isEmotion = true;
              eComment.statusEmotion = eEmotion.statusEmotion;
            }
          });
        });
        this.setState({ commentList });
      });
    });

    let commentListChild = [];
    commentListChild = this.state.commentListChild;
    if (commentListChild == undefined) {
      return;
    }
    getListEmotionUser(this.props.match.params.id).then(({ data }) => {
      this.setState({ emotionUser: [...data] }, function () {
        commentListChild.forEach((eComment) => {
          [...data].forEach((eEmotion) => {
            if (eEmotion.eventComment.id == eComment.id) {
              eComment.isEmotion = true;
              eComment.statusEmotion = eEmotion.statusEmotion;
            }
          });
        });
        this.setState({ commentListChild });
      });
    });
  };

  updateSlideEvent = () => {
    var searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = 10;
    searchObject.needUpdateStatus = false;
    searchByDto(searchObject).then(({ data }) => {
      this.getFavouriteList(data.content);
      this.getlistEventStatusAndUserAction(data.content);
      this.setState({ eventList: [...data.content] });
    });
  };

  getlistEventStatusAndUserAction = (eventList) => {
    getlistEventStatusAndUserAction(eventList).then(({ data }) => {
      this.setState({
        statusObject: data,
      });
    });
  };

  handleChangePage = (newPage) => {
    this.setPage(newPage);
  };
  handleChangeOptionalPage = (newPage, optionalList) => {
    switch (optionalList) {
      case "usersFavorite":
        this.updatePageDataListFavourite({ pageIndex: newPage });
        break;
      case "registerEvent":
        this.updatePageDataListAttendee({ pageIndex: newPage });
        break;
      // case "isJoin":
      //   this.updatePageDataListUserJoin({ pageIndex: newPage });
      //   break;
      case "listIsJoin":
        this.updatePageDataListUserJoin({ pageIndex: newPage });
        break;
      default:
        this.updatePageDataListAttendee({ pageIndex: newPage });
    }
    let element = document.getElementById("table-list");
    element.scrollIntoView();
  };
  handleChangeUrl = (recordingUrl) => {
    this.setState({ downloadUrl: recordingUrl });
  };

  setPage = (page) => {
    this.setState({ page }, function () {
      this.updatePageData();
    });
  };

  submitComment = (event) => {
    event.preventDefault();
    this.setState({
      isLoading: true,
    });
    let that = this;
    addNewComment({
      event: this.state.event,
      comment: this.state.commentParent,
      user: localStorageService.getLoginUser(),
      parentComment: null,
      userReply: null,
    }).then((result) => {
      that.setState({
        isLoading: false,
        commentParent: "",
        openReply: false,
      });
      this.updatePageData();
    });
  };

  submitCommentChild = (event) => {
    event.preventDefault();
    this.setState({
      isLoading: true,
    });
    let that = this;
    addNewComment({
      event: this.state.event,
      comment: this.state.reComment,
      user: localStorageService.getLoginUser(),
      parentComment: { id: this.state.parentComment },
      userReply: this.state.replyTo,
    }).then((result) => {
      that.setState({
        isLoading: false,
        openReply: true,
        reComment: "",
      });
      this.getCommentChild(this.state.parentComment);
    });
  };

  handleChange = (event) => {
    event.persist();
    this.setState({
      comment: event.target.value,
      [event.target.name]: event.target.value,
    });
  };

  handleFavourite = (id) => {
    let { favouriteObject } = this.state;
    this.setState({
      isLoading: true,
    });
    toogleFavouriteEvent(id).then((result) => {
      if (result?.data == 1) {
        favouriteObject[id] = true;
      } else if (result?.data == 0) {
        favouriteObject[id] = false;
      }
      this.setState({
        isLoading: false,
        favouriteObject: favouriteObject,
      });
    });
  };

  getCommentChild = (id) => {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    var searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.pageSizeChild;
    searchObject.eventId = id;

    searchByParentComment(searchObject).then(({ data }) => {
      this.setState(
        {
          commentListChild: [...data.content],
          isLoadMore:
            data.totalElements > this.state.pageSizeChild ? true : false,
          isHidden: this.state.pageSizeChild > 3 ? true : false,
        },
        () => {
          enableDisableAllLoading(false);
        }
      );
      this.getListEmotionUser();
    });
  };

  replyComment = (id, index, user) => {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    var searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.pageSizeChild;
    searchObject.eventId = id;
    searchByParentComment(searchObject).then(({ data }) => {
      this.setState(
        {
          commentListChild: [...data.content],
          reComment: "",
          replyTo: user,
          index: index,
          openReply: true,
          openCommentChild: true,
          parentComment: id,
          isLoadMore:
            data.totalElements > this.state.pageSizeChild ? true : false,
          isHidden: this.state.pageSizeChild > 3 ? true : false,
        },
        () => {
          enableDisableAllLoading(false);
        }
      );
      this.getListEmotionUser();
    });
  };

  checkTimeTwoHours = (startTime) => {
    let date = moment(new Date()).add(2, "hours");
    if (moment(startTime).isAfter(date._d)) {
      return true;
    }
    return false;
  };

  cancelComment = () => {
    this.setState({
      openReply: false,
      openCommentChild: false,
      reComment: "",
      pageSizeChild: 3,
    });
    let element = document.getElementById("comment-top");
    element.scrollIntoView();
  };

  showMore = (event, source) => {
    event.preventDefault();
    if (source == "showMore") {
      this.setState(
        {
          pageSizeChild: this.state.pageSizeChild + 3,
        },
        () => this.getCommentChild(this.state.parentComment)
      );
    }
    if (source == "hidden") {
      this.setState(
        {
          pageSizeChild: this.state.pageSizeChild - 3,
        },
        () => this.getCommentChild(this.state.parentComment)
      );
    }
  };
  getFavouriteList = (events) => {
    let user = localStorageService.getItem("auth_user");
    let { favouriteObject } = this.state;
    if (user != null) {
      events.map((obj) => {
        let favouriteObj =
          obj.userEvents.findIndex((userEvent) => {
            return (
              userEvent.isFavourite == 1 &&
              userEvent.user.username == user.username
            );
          }) > -1;
        favouriteObject[obj.id] = favouriteObj;
      });
      // console.log(favouriteObject);
      this.setState({
        favouriteObject: favouriteObject,
        isLoading: false,
      });
    }
  };

  likeComment(idComment, statusEmotion) {
    var emotionCommentEvent = {};
    emotionCommentEvent.eventComment = {
      id: idComment,
    };
    emotionCommentEvent.statusEmotion = statusEmotion;
    addNew(emotionCommentEvent).then((data) => {
      let commentListChild = [];
      commentListChild = this.state.commentListChild;
      if (commentListChild != undefined) {
        commentListChild.forEach((e) => {
          if (e.id == idComment) {
            e.likes++;
            e.isEmotion = true;
            e.statusEmotion = emotionSystem.like;
          }
        });
      }

      let commentList = this.state.commentList;
      if (commentList != undefined) {
        commentList.forEach((e) => {
          if (e.id == idComment) {
            e.likes++;
            e.isEmotion = true;
            e.statusEmotion = emotionSystem.like;
          }
        });
      }

      this.setState({ commentList, commentListChild });
    });
  }

  async deleteEmotion(idComment, statusEmotion) {
    var emotionCommentEvent = {};
    emotionCommentEvent.eventComment = {
      id: idComment,
    };
    emotionCommentEvent.statusEmotion = statusEmotion;
    deleteEmotion(idComment).then((data) => {
      let commentListChild = [];
      commentListChild = this.state.commentListChild;
      if (commentListChild != undefined) {
        commentListChild.forEach((e) => {
          if (e.id == idComment) {
            e.likes--;
            e.isEmotion = undefined;
            e.statusEmotion = emotionSystem.like;
          }
        });
      }

      let commentList = this.state.commentList;
      if (commentList != undefined) {
        commentList.forEach((e) => {
          if (e.id == idComment) {
            e.likes--;
            e.isEmotion = undefined;
            e.statusEmotion = emotionSystem.like;
          }
        });
      }
      this.setState({ commentList, commentListChild });
    });
  }

  startSurvey = (survey) => {
    this.setState({ isSurvey: true, survey: survey });
  };

  render() {
    let { t, i18n } = this.props;
    let user = authService.getLoginUser();
    let isLoggedIn = user != null;
    let {
      event,
      totalFavouriteList,
      listFavourite,
      listAttendee,
      commentList,
      totalElements,
      rowsPerPage,
      page,
      emotionUser,
      tabActive,
      recordList,
      isLoading,
      searchDto,
      eventList,
      favouriteObject,
      openReply,
      reComment,
      commentParent,
      commentListChild,
      roomId,
      isPopup,
      playUrl,
      openCommentChild,
      isDownload,
      replyTo,
      isRequireLogin,
      isLoadMore,
      isHidden,
      totalAttendeeList,
      listIsJoin,
      listIsJoinNotYet,
      totalIsJoin,
      totalIsJoinNotYet,
      statusObject,
      totalRecord,
      survey,
    } = this.state;
    return (
      <div id="top-page">
        <h1 className="text-center title title-mb mb-5">
          {t("Event.content.event")}
        </h1>
        <div className="text-center mb-5">
          <img
            className="img-fluid"
            style={{
              display: "inline-block",
              verticalAlign: "middle",
              maxHeight: "500px",
            }}
            src={
              event?.imageUrl
                ? ConstantList.API_ENPOINT + "/" + event.imageUrl
                : "/assets/homepage/c1.png"
            }
            alt=""
          />
        </div>
        <div className="container">
          <h2 className="text-center title-foott-event">
            {event ? event.name : ""}
          </h2>
          <h2 className="text-center title-foot-event text-green">
            {t("Event.content.host")}
            {" : "}
            {event?.host?.displayName
              ? event.host.displayName
              : "Amber Academy"}
          </h2>
          <h2 className="text-center title-foot-event">
            {event
              ? moment(event.startTime).format("dddd, MMMM DD, YYYY - h:mm a")
              : ""}
          </h2>
          <br />
          <div className='row' style={{display:'flex', justifyContent:'space-around'}}>
            {event?.survey && isLoggedIn && event.status == ConstantList.EVENT_STATUS.STATUS_INCOMING && (
                <button
                  className="btn btn-title-rg btn-lg"
                  onClick={() => this.startSurvey(event.survey)}
                >
                  {t("Event.content.survey")}
                </button>
            )}

            {this.state.isSurvey && (
              <SurveyDialog
                isPopup={this.state.isSurvey}
                handleClose={this.handleClose}
                survey={this.state.survey}
                t={t}
              />
            )}
            
            {event.userAction == ACTION_START_OR_JOIN && (
              <>
                  <button
                    className="btn btn-title-rg btn-lg"
                    onClick={() => this.startEvent(event.id)}
                  >
                    {isAdmin() || isHost()
                      ? t("Event.content.start")
                      : t("Event.content.join_meetings")}
                  </button>
              </>
            )}
            {event.userAction == NO_ACTION_EVENT_INCOMING && (
              <>
                <h2 className="text-center title-foot-event not-event-title">
                  {t("Event.content.not_event")}
                </h2>
              </>
            )}
            {event.userAction == ACTION_REGISTER && (
              <>
                  <button
                    className="btn btn-title-rg btn-lg"
                    onClick={() => this.addMyEvent(event.id, searchDto)}
                  >
                    {t("Dashboard.header.register")}
                  </button>
              </>
            )}
          </div>
          {event.userAction == NO_ACTION_EVENT_ENDED && (
            <>
              <h2 className="text-center title-foot-event">
                {t("Event.content.event_ended")}
              </h2>
            </>
          )}

          <h3 className="title-content">{t("Event.content.description")}</h3>
          <p className="mb-6" style={{ textAlign: "justify" }}>
            {event ? event.description : ""}
          </p>
          <div className=" d-flex justify-content-between mb-6 ">
            <a
              href={this.state.shareLink}
              target="_blank"
              className="btn btn-dark-event btn-lg   cl-event"
            >
              <i
                class="fab fa-facebook"
                style={{ paddingRight: 5, paddingTop: 10 }}
              ></i>
              {t("Event.content.share")}
            </a>
          </div>
          <div className="row my-6">
            <div className="col">
              <div className="row category-options ">
                <div
                  className={
                    "col cursor-pointer title-content-small " +
                    (tabActive == "records" ? "active pb-3" : "")
                  }
                  onClick={(tab) => this.handleTabClick("records")}
                >
                  {t("Event.record.record_list")}
                  {" ( " + recordList.length + " )"}
                </div>
                <div
                  className={
                    "col cursor-pointer title-content-small " +
                    (tabActive == "usersFavorite" ? "active pb-3" : "")
                  }
                  onClick={(tab) => this.handleTabClick("usersFavorite")}
                >
                  {t("Event.content.usersFavorite")}
                  {" ( " + totalFavouriteList + " )"}
                </div>
                {isLoggedIn && (isAdmin() || isHost()) && (
                  <>
                    <div
                      className={
                        "col cursor-pointer title-content-small " +
                        (tabActive == "registerEvent" ? "active pb-3" : "")
                      }
                      onClick={(tab) => this.handleTabClick("registerEvent")}
                    >
                      {t("Event.content.registerEvent")}
                      {" ( " + totalAttendeeList + " )"}
                    </div>{" "}
                    <div
                      className={
                        "col cursor-pointer title-content-small " +
                        (tabActive == "isJoin" ? "active pb-3" : "")
                      }
                      onClick={(tab) => this.handleTabClick("isJoin")}
                    >
                      {t("Event.content.isJoin")}
                      {" ( " + totalIsJoin + " )"}
                    </div>{" "}
                    {event.userAction == NO_ACTION_EVENT_ENDED && (
                      <>
                        {" "}
                        <div
                          className={
                            "col cursor-pointer title-content-small " +
                            (tabActive == "isJoinNotYet" ? "active pb-3" : "")
                          }
                          onClick={(tab) => this.handleTabClick("isJoinNotYet")}
                        >
                          {t("Event.content.isJoinNotYet")}
                          {" ( " + totalIsJoinNotYet + " )"}
                        </div>{" "}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div
            className={
              "cc-container " + (tabActive == "records" ? "" : "hidden")
            }
          >
            {recordList.length > 0 && isLoggedIn && (
              <section className="listAcc1">
                <div className="row fw-bold pb-5 bb-gray thead1">
                  <div className="col-6 text-center">
                    {t("Event.record.recordId")}
                  </div>
                  <div className="col-3 text-center">
                    {t("Event.record.duration")}
                  </div>
                  {/* <div className="col-2 text-center">{t("Event.record.download")}</div> */}
                  <div className="col-3 text-center">
                    {t("Event.record.play")}
                  </div>
                </div>
                {recordList.map((item) => {
                  return (
                    <div className="row pb-5 bb-gray mt-5 tbody1">
                      <div className="col-6 d-flex justify-content-center">
                        {item.recordId}
                      </div>
                      <div className="col-3 d-flex justify-content-center">
                        <p>
                          {moment
                            .duration(item.recordingDuration, "second")
                            .format()}
                        </p>
                      </div>
                      {/* <div className="col-2 d-flex justify-content-center">
                        <button
                          className="btn btn-sm-table"
                          onClick={() => {
                            this.handleChangeUrl(item.recordingUrl);
                            this.setState({
                              isDownload: true,
                            });
                          }}
                        >
                          <i
                            className="fa fa-download fa-2x"
                            aria-hidden="true"
                            title="Download"
                          ></i>
                        </button>
                      </div> */}
                      <div className="col-3 d-flex justify-content-center">
                        <button
                          className="btn btn-sm-table"
                          onClick={() =>
                            this.getPlayUrlByRecordId(roomId, item.recordId)
                          }
                        >
                          <i
                            className="fa fa-play fa-2x"
                            aria-hidden="true"
                            title="Play Record"
                          ></i>
                        </button>
                      </div>

                      {isPopup && (
                        <PlayRecordVideoModal
                          t={t}
                          i18n={i18n}
                          isPopup={isPopup}
                          handleClose={this.handleClose}
                          playUrl={playUrl}
                        />
                      )}

                      {isDownload && (
                        <ConfirmationDialog
                          title={t("Event.record.title")}
                          open={isDownload}
                          onConfirmDialogClose={this.handleClose}
                          onYesClick={this.handleConfirmationDownload}
                          text={t("Event.record.download_confirm")}
                          agree={t("general.confirm")}
                          cancel={t("general.cancel")}
                        />
                      )}
                    </div>
                  );
                })}
              </section>
            )}
            {recordList.length == 0 && (
              <p className="text-center no-event">{t("Category.no_records")}</p>
            )}
            <div className="cc-pagination text-center" />
          </div>
          <div
            className={
              "cc-container " + (tabActive == "usersFavorite" ? "" : "hidden")
            }
          >
            {listFavourite.length > 0 && (
              <section className="listAcc1">
                {listFavourite.length != null && (
                  <>
                    <div>
                      <div className="row fw-bold pb-5 bb-gray thead1">
                        <div className="col-2 text-center">
                          {t("Category.no")}
                        </div>
                        {/* <div className="col-3 text-center">{t("Username")}</div> */}
                        <div className="col-6 text-center">
                          {t("Event.content.full_name")}
                        </div>
                        {/* <div className="col-4 text-center">{t("Email")}</div> */}
                        <div className="col-4 text-center">
                          {t("Event.content.Position")}
                        </div>
                      </div>
                      {listFavourite.map((obj, index) => {
                        return (
                          <div>
                            <div className="row pb-5 bb-gray mt-5 tbody1">
                              <div className="col-2 d-flex justify-content-center">
                                {(index += 1)}
                              </div>
                              {/* <div className="col-3 d-flex justify-content-center">
                                {obj.user.username}
                              </div> */}
                              <div className="col-6 d-flex justify-content-center">
                                {obj.user.displayName}
                              </div>
                              {/* <div className="col-4 d-flex justify-content-center">
                                {obj.user.email}
                              </div> */}
                              <div className="col-4 d-flex justify-content-center">
                                {obj.isHost == 1
                                  ? t("Event.content.Host")
                                  : obj.isPresenter == 1
                                    ? t("Event.content.Presenter")
                                    : obj.isAttendee == 1
                                      ? t("Event.content.Attendee")
                                      : t("Event.content.Stranger")}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2">
                      <Pagination
                        totalElements={totalFavouriteList}
                        onChangePage={(page) => {
                          this.handleChangeOptionalPage(page, "usersFavorite");
                        }}
                        pageSize={rowsPerPage}
                      />
                    </div>
                  </>
                )}
              </section>
            )}
            {listFavourite.length == 0 && (
              <p className="text-center no-event">{t("Category.no_records")}</p>
            )}
          </div>
          <div
            className={
              "cc-container " + (tabActive == "registerEvent" ? "" : "hidden")
            }
          >
            {listAttendee.length > 0 && (
              <section className="listAcc1">
                {listAttendee.length != null && (
                  <>
                    <div id="table-list">
                      <div className="row fw-bold pb-5 bb-gray thead1">
                        <div className="col-3 text-center">
                          {t("Category.no")}
                        </div>
                        {/* <div className="col-3 text-center">{t("Username")}</div> */}
                        <div className="col-9 text-center">
                          {t("Event.content.full_name")}
                        </div>
                        {/* <div className="col-5 text-center">{t("Email")}</div> */}
                      </div>
                      {listAttendee.map((obj, index) => {
                        return (
                          <div>
                            <div className="row pb-5 bb-gray mt-5 tbody1">
                              <div className="col-3 d-flex justify-content-center">
                                {(index += 1)}
                              </div>
                              {/* <div className="col-3 d-flex justify-content-center">
                                {obj.user.username}
                              </div> */}
                              <div className="col-9 d-flex justify-content-center">
                                {obj.user.displayName}
                              </div>
                              {/* <div className="col-5 d-flex justify-content-center">
                                {obj.user.email}
                              </div> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2">
                      <Pagination
                        totalElements={totalAttendeeList}
                        onChangePage={(page) => {
                          this.handleChangeOptionalPage(page, "registerEvent");
                        }}
                        pageSize={rowsPerPage}
                      />
                    </div>{" "}
                  </>
                )}
              </section>
            )}
            {listAttendee.length == 0 && (
              <p className="text-center no-event">{t("Category.no_records")}</p>
            )}
          </div>
          <div
            className={
              "cc-container " + (tabActive == "isJoin" ? "" : "hidden")
            }
          >
            {listIsJoin.length > 0 && isLoggedIn && (
              <section className="listAcc1">
                {listIsJoin.length != null && (
                  <>
                    <div>
                      <div className="row fw-bold pb-5 bb-gray thead1">
                        <div className="col-3 text-center">
                          {t("Category.no")}
                        </div>
                        {/* <div className="col-3 text-center">{t("Username")}</div> */}
                        <div className="col-9 text-center">
                          {t("Event.content.full_name")}
                        </div>
                        {/* <div className="col-5 text-center">{t("Email")}</div> */}
                      </div>
                      {listIsJoin.map((obj, index) => {
                        return (
                          <div>
                            <div className="row pb-5 bb-gray mt-5 tbody1">
                              <div className="col-3 d-flex justify-content-center">
                                {(index += 1)}
                              </div>
                              {/* <div className="col-3 d-flex justify-content-center">
                                {obj.user.username}
                              </div> */}
                              <div className="col-9 d-flex justify-content-center">
                                {obj.user.displayName}
                              </div>
                              {/* <div className="col-5 d-flex justify-content-center">
                                {obj.user.email}
                              </div> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2">
                      <Pagination
                        totalElements={totalIsJoin}
                        onChangePage={(page) => {
                          this.handleChangeOptionalPage(page, "listIsJoin");
                        }}
                        pageSize={rowsPerPage}
                      />
                    </div>{" "}
                  </>
                )}
              </section>
            )}
            {listIsJoin.length == 0 && (
              <p className="text-center no-event">{t("Category.no_records")}</p>
            )}
          </div>
          <div
            className={
              "cc-container " + (tabActive == "isJoinNotYet" ? "" : "hidden")
            }
          >
            {listIsJoinNotYet.length > 0 && isLoggedIn && (
              <section className="listAcc1">
                {listIsJoinNotYet.length != null && (
                  <>
                    <div>
                      <div className="row fw-bold pb-5 bb-gray thead1">
                        <div className="col-3 text-center">
                          {t("Category.no")}
                        </div>
                        {/* <div className="col-3 text-center">{t("Username")}</div> */}
                        <div className="col-9 text-center">
                          {t("Event.content.full_name")}
                        </div>
                        {/* <div className="col-5 text-center">{t("Email")}</div> */}
                      </div>
                      {listIsJoinNotYet.map((obj, index) => {
                        return (
                          <div>
                            <div className="row pb-5 bb-gray mt-5 tbody1">
                              <div className="col-3 d-flex justify-content-center">
                                {(index += 1)}
                              </div>
                              {/* <div className="col-3 d-flex justify-content-center">
                                {obj.user.username}
                              </div> */}
                              <div className="col-9 d-flex justify-content-center">
                                {obj.user.displayName}
                              </div>
                              {/* <div className="col-5 d-flex justify-content-center">
                                {obj.user.email}
                              </div> */}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-2">
                      <Pagination
                        totalElements={totalIsJoinNotYet}
                        onChangePage={(page) => {
                          this.handleChangeOptionalPage(page, "isJoinNotYet");
                        }}
                        pageSize={rowsPerPage}
                      />
                    </div>{" "}
                  </>
                )}
              </section>
            )}
            {listIsJoinNotYet.length == 0 && (
              <p className="text-center no-event">{t("Category.no_records")}</p>
            )}
          </div>

          <h3 className="title-content">{t("Event.content.comments")}</h3>
          <CommentComponent
            t={t}
            user={user}
            isLoggedIn={isLoggedIn}
            event={event}
            eventId={this.props.match.params.id}
            enableDisableAllLoading={this.props.enableDisableAllLoading}
            handleLogin={this.handleLogin}
          />
          <div className="mt-5">
            {event.eventTag?.map((obj) => {
              return (
                <>
                  <button className="btn btn-hashtag ">#{obj.name}</button>
                </>
              );
            })}
          </div>

          <h3 className="title-content">{t("Event.content.other_events")}</h3>
        </div>
        <LoadingOverlay
          active={this.state.isLoadingLike}
          spinner
          text="Please wait..."
        >
          <div className="cc-container container">
            {eventList.length != null && (
              <Swiper
                spaceBetween={50}
                slidesPerView={3}
                breakpoints={{
                  1000: {
                    slidesPerView: 3,
                  },
                  700: {
                    slidesPerView: 2,
                  },
                  200: {
                    slidesPerView: 1,
                  },
                }}
                slidesPerColumn={1}
                slidesPerColumnFill={"row"}
                scrollbar={false}
                navigation
                // pagination={{ clickable: true }}
                // pagination
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
              >
                {eventList.map((obj) => {
                  return (
                    <div className="row">
                      <SwiperSlide key={obj.id} className="cc-card">
                        {/* <div className="position-relative">
                          <Link to={"/detail/" + obj.id}>
                            <img
                              className="img-fluid"
                              src={
                                obj.imageUrl
                                  ? ConstantList.API_ENPOINT +
                                  "/" +
                                  obj.imageUrl
                                  : "/assets/homepage/c1.png"
                              }
                              alt=""
                            />
                          </Link>
                        </div>
                        {!isLoggedIn && (
                          <div
                            className="position-absolute bottom-1 end-0 translate-middle-y"
                            onClick={(event) => {
                              this.handleFavourite(obj.id);
                            }}
                          >
                            <img
                              src={
                                ConstantList.ROOT_PATH +
                                "assets/homepage/grey-heart.png"
                              }
                              alt=""
                            />
                          </div>
                        )}
                        {isLoggedIn && (
                          <div className="position-absolute bottom-1 end-0 translate-middle-y">
                            {favouriteObject[obj.id] && (
                              <img
                                src={
                                  ConstantList.ROOT_PATH +
                                  "assets/homepage/heart.png"
                                }
                                alt=""
                                onClick={(event) => {
                                  this.handleFavourite(obj.id);
                                }}
                              />
                            )}
                            {!favouriteObject[obj.id] && (
                              <img
                                src={
                                  ConstantList.ROOT_PATH +
                                  "assets/homepage/grey-heart.png"
                                }
                                alt=""
                                onClick={(event) => {
                                  this.handleFavourite(obj.id);
                                }}
                              />
                            )}
                          </div>
                        )}
                        <div className="card-text">
                          <p>
                            {" "}
                            <Link
                              className="card-title"
                              to={"/detail/" + obj.id}
                            >
                              {obj.name}
                            </Link>
                          </p>
                          <p className="card-date">
                            <i
                              class="fa fa-calendar"
                              style={{ color: '#fd4a20', marginRight: '10px' }}
                            />
                            {new Intl.DateTimeFormat("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            }).format(obj.startTime)}
                          </p>
                        </div> */}
                        <SlideCategory
                          t={t}
                          obj={obj}
                          isLoggedIn={isLoggedIn}
                          favouriteObject={this.state.favouriteObject}
                          statusObject={
                            statusObject != null ? statusObject[obj.id] : null
                          }
                          handleLogin={this.handleLogin}
                          handleFavourite={this.handleFavourite}
                        />
                      </SwiperSlide>
                    </div>
                  );
                })}
              </Swiper>
            )}
            {eventList.length == 0 && (
              <p className="text-center no-event"> {t("Home.login.title2")}</p>
            )}
            <div className="cc-pagination text-center" />
          </div>
        </LoadingOverlay>
        {isRequireLogin && (
          <RequestLoginPopup
            t={t}
            isPopup={isRequireLogin}
            handleClose={this.handleClose}
            textContent={this.state.textContent}
            startTimeContent={this.state.startTimeContent}
          />
        )}
        {/* {openIframe && (
          <div className="window-event">
            <iframe
              className="iframe"
              allow="geolocation microphone camera midi encrypted-media vr"
              src={this.state.urlAutoLogin}
            />
          </div>
        )} */}
        {isRequireLogin && (
          <RequestLoginPopup
            t={t}
            isPopup={isRequireLogin}
            handleClose={this.handleClose}
            // title={t("Event.content.require_login")}
            textContent={this.state.textContent}
            startTimeContent={this.state.startTimeContent}
          />
        )}
      </div>
    );
  }
}

Event.propTypes = {};

export default Event;
