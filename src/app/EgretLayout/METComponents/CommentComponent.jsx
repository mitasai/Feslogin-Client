import React from "react";
import { Form } from "react-bootstrap";
import ConstantList from "../../appConfig";
import { roleSystem, emotionSystem, imgEmotion } from "../../role";
import * as moment from "moment";
import LoadingOverlay from "react-loading-overlay";
import Pagination from "./Pagination";
import localStorageService from "app/services/localStorageService";
import authService from "../../services/jwtAuthService";
import {
  searchByDto as searchComment,
  addNewComment,
  searchByParentComment,
  deleteComment
} from "../../METViews/manageEvent/EventComment";
import {
  addNew,
  getListEmotionUser,
  deleteEmotion,
} from "../../METViews/manageEvent/EmotionUserService";
import { isAdmin, isHost, isUser} from "app/auth/authRoles";
import PopupComfirmDelete from "../../METViews/Comment/PopupComfirmDelete";

class CommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageStatus: "loading", 
      error: false, 
      rowsPerPage: 5,
      page: 0, 
      commentList: [],
      pageSizeChild: 2,
      index: null,
      seconds: 60,
      isTimeComment: false,
      openPopupDelete: false
    };
  }

  componentDidMount() {
    this.updatePageData()
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.eventId !== prevProps.eventId) {
      this.updatePageData()
    }
  }

  submitComment = (event) => {
    event.preventDefault();
    this.setState({
      isLoading: true,
    });
    let that = this;
    addNewComment({
      event: this.props.event,
      comment: this.state.commentParent,
      user: localStorageService.getLoginUser(),
      parentComment: null,
      userReply: null,
      recordId: this.props?.recordId
    }).then((result) => {
      that.setState({
        isLoading: false,
        commentParent: "",
        openReply: false,
        isTimeComment: true, 
        seconds: 60
      });
      this.updatePageData();
      this.countToComment();
    });
  };

  updatePageData = () => {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    var searchObject = {};
    searchObject.text = this.state.keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
    searchObject.eventId = this.props.eventId;
    searchObject.roomId = this.props?.roomId;
    searchObject.recordId = this.props?.recordId;
    searchComment(searchObject, this.state.page, this.state.rowsPerPage).then(
      ({ data }) => {
        this.setState(
          {
            commentList: [...data.content],
            totalElements: data.totalElements,
          },
          function () {enableDisableAllLoading(false)}
        );

        this.getListEmotionUser([...data.content]);
      }
    );
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
    getListEmotionUser(this.props.eventId).then(({ data }) => {
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
    getListEmotionUser(this.props.eventId).then(({ data }) => {
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

  submitCommentChild = (event) => {
    event.preventDefault();
    console.log(this.state.replyTo);
    this.setState({
      isLoading: true,
    });
    let that = this;
    addNewComment({
      event: this.props.event,
      comment: this.state.reComment,
      user: localStorageService.getLoginUser(),
      parentComment: { id: this.state.parentComment },
      userReply: this.state.replyTo,
      recordId: this.props?.recordId
    }).then((result) => {
      that.setState({
        isLoading: false,
        openReply: true,
        reComment: "",
      });
      this.getCommentChild(this.state.parentComment);
    });
  };


  getCommentChild = (id) => {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    var searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.pageSizeChild;
    searchObject.eventId = id;  
    searchObject.roomId = this.props?.roomId;
    searchObject.recordId = this.props?.recordId;
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
      this.updatePageData()
    });
  };

  cancelComment = () => {
    this.setState({
      openReply: false,
      openCommentChild: false,
      reComment: "",
      pageSizeChild: 3,
      index: null
    });
    this.updatePageData()
    let element = document.getElementById("comment-top");
    element.scrollIntoView();
  };

  replyComment = (id, index, user, quantity) => {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    var searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = this.state.pageSizeChild;
    searchObject.roomId = this.props?.roomId;
    searchObject.recordId = this.props?.recordId;
    if (quantity != null && quantity <= 3) {
      this.setState({pageSizeChild: quantity})
    }
    if(quantity != null && quantity > 3) {
      searchObject.pageSize = quantity
    }
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
            quantity != null ? false : data.totalElements > this.state.pageSizeChild ? true : false,
          isHidden: quantity != null && quantity > 3 ? true : this.state.pageSizeChild > 3 ? true : false,
          // pageSizeChild: quantity != null ? quantity : this.state.pageSizeChild,
        },
        () => {
          enableDisableAllLoading(false);
        }
      );
      this.updatePageData()
    });
  };

  handleChange = (event) => {
    event.persist();
    this.setState({
      comment: event.target.value,
      [event.target.name]: event.target.value,
    });
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
          pageSizeChild: this.state.pageSizeChild > 3 ? this.state.pageSizeChild - 3 : this.state.pageSizeChild,
          isHidden: true
        },
        () => this.getCommentChild(this.state.parentComment)
      );
    }
  };

  handleKeyDownEnterSearch = (e) => {
    if (e.key === 'Enter' && this.state.commentParent?.trim().length > 0 && !this.state.isTimeComment) {
      this.submitComment(e)
    }
  }
  // handleKeyDownEnterSearchChild = (e) => {
  //   if (e.key === 'Enter' && this.state.reComment?.trim().length>0 ) {
  //     this.submitCommentChild(e)
  //   }
  // }
  handleChangePage = (newPage) => {
    this.setPage(newPage);
    let element = document.getElementById("comment-top");
    element.scrollIntoView();
  };

  setPage = (page) => {
    this.setState({ page, page }, function () {
      this.updatePageData();
    });
  };

  countToComment = () => {
    setInterval(() => {
      const { seconds } = this.state
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }))
      }
      if (seconds === 0) {
        clearInterval(this.myInterval)
        this.setState({ isTimeComment: false })
      }
    }, 1000)
  }

  deleteComment = (id) => {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    deleteComment(id).then(() => {
      enableDisableAllLoading(false);
      this.handleClosePopup();
      this.getCommentChild(this.state.parentComment);
      this.updatePageData();
    })
  }

  handleClosePopup = () => {
    this.setState({ openPopupDelete: false });
  };

  render() {
    let {
      t, isLoggedIn, user, handleLogin
    } = this.props;
    let {
      reComment,
      totalElements,
      rowsPerPage,
      isLoadMore, isLoading, isHidden,
      replyTo,
      openCommentChild,
      commentListChild,
      commentList,
      openReply,
      commentParent,
      openPopupDelete
    } = this.state;
    return (
      <div style={{ backgroundColor: '#242526' }}  id="comment-top">
        <div className="mb-5">
          {user ? (
            <form onSubmit={this.submitComment}>
              <div>
                <Form.Group>
                  <Form.Control
                    className="text-comment parent-comment"
                    as="textarea"
                    placeHolder={t("Event.content.opinion_comment")}
                    rows={3}
                    name="commentParent"
                    value={commentParent}
                    onKeyDown={this.handleKeyDownEnterSearch}
                    onChange={this.handleChange}
                  ></Form.Control>
                </Form.Group>
              </div>
              <div style={{ textAlign: "center" }}>
                <button
                  style={{width:'100px', height:'50px' ,padding:'0px'}}
                  className={
                    commentParent?.trim()
                      ? "btn btn-submit-comment mt-2"
                      : "btn btn-submit-comment mt-2 disabled"
                  }
                  type="submit"
                >
                  {t("Event.content.post")}
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p className="text-center no-event">
                {t("Event.content.require_login_comment")}
              </p>
            </div>
          )}
        </div>
        {/* <div className="text-center">
          <p style={{display:'inline-flex', fontSize:'15px'}} >
            {this.state.seconds > 0 && this.state.isTimeComment ? 
            <p style={{fontSize:'15px'}}>{t('Event.content.timeout')}</p>:``} 
            {this.state.seconds > 0 && this.state.isTimeComment ? ` ${this.state.seconds}s` : ''}
          </p>
        </div> */}
        {commentList.length == 0 && (
          <div>
            <p className="text-center no-event">
              {t("Event.content.no_comments")}
            </p>
          </div>
        )}
        {/* nếu có bình luận */}
        {commentList.map((item, index) => {
          return (
            <div>
              <div className="row mb-3 cmtParent1">
                <div className="col-1 avarta-cmt">
                  {item.user.imagePath != null ? (
                    <img
                      className="avatar-comment"
                      src={ConstantList.API_ENPOINT + item.user.imagePath}
                      alt=""
                    />
                  ) : (
                    <img
                      className="avatar-comment"
                      src={"/assets/images/avatar.jpg"}
                      alt=""
                    />
                  )}
                </div>
                <div className="col-10 comment-font" >
                  <p className="text-green font-size-cmt bold comment-text"  >
                    {item?.user?.displayName}<span className="text-white comment-detail"  >
                      {item?.comment}
                    </span>
                  </p>


                  {item.isEmotion == undefined && isLoggedIn && (
                    <div
                      onClick={() => {
                        this.likeComment(item.id, emotionSystem.like);
                      }}
                      class="tooltipv2 like-comment-ver1"
                      style={{
                        cursor: "pointer", position: 'absolute',
                        right: -9, bottom: -22, borderRadius: 10, backgroundColor: '#3e4042', paddingRight: 5, paddingLeft: 5
                      }}
                    >
                      <img
                        src={
                          ConstantList.ROOT_PATH +
                          "assets/homepage/grey-heart.png"
                        }
                        alt=""
                        style={{ height: 30 }}
                      />
                      <span style={{ fontSize: 20 }}>
                        {item.likes == 0 ? "" : item.likes}</span>
                    </div>
                  )}

                  {item.isEmotion == true &&
                    isLoggedIn &&
                    item.statusEmotion == emotionSystem.like && (
                      <div
                        class="tooltipv2 like-comment-ver1"
                      >
                        {" "}
                        <img
                          onClick={() => {
                            this.deleteEmotion(item.id, emotionSystem.love);
                          }}
                          style={{ height: 30 }}
                          src={
                            ConstantList.ROOT_PATH +
                            "assets/homepage/heart.png"
                          }
                          alt=""
                        />
                        <span style={{ fontSize: 20 }}>
                          {item.likes == 0 ? "" : item.likes}</span>
                      </div>
                    )}

                  {!isLoggedIn && (<div class="tooltipv2 like-comment-ver1" onClick={() => handleLogin()}>
                    <img
                      style={{ height: 30 }}
                      src={
                        ConstantList.ROOT_PATH + "assets/homepage/heart.png"
                      }
                      alt=""
                    />
                    <span style={{ fontSize: 20 }}>
                      {item.likes == 0 ? "" : item.likes}</span>
                  </div>)}
                </div>
                <div className="text-gray font-size-cmt-2 mgt-0 comment-text1" style={{paddingLeft: '10%', marginTop: '1px'}}>
                  {/*---- xem phản hồi --------*/}
                  {item.totalCommentChild > 0 && this.state.index !== item.id && (
                    <a className="mg-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => this.replyComment(item.id, item.id, null, item.totalCommentChild)}
                    >
                      <i style={{ color: '#076DB6' }} class="fas fa-share"></i> {item.totalCommentChild}  {t("Event.content.see_feedback")}
                    </a>
                  )}
                  {/*------- ẩn phản hồi -----*/}
                  {item.totalCommentChild > 0 && this.state.index == item.id && (
                    <a className="mg-2"
                      style={{ cursor: "pointer" }}
                      onClick={() => this.cancelComment()}
                    >
                      {t("Event.content.hidden_feedback")}
                    </a>
                  )}
                  {/*------- trả lời -----------*/}
                  {!isLoggedIn ? (
                    <a
                      onClick={() => handleLogin()}
                      className="reply-comment mg-2"
                      style={{ cursor: "pointer" }}
                    >
                      {t("Event.content.reply")}
                    </a>
                  ) : (
                    <a
                      onClick={() => this.replyComment(item.id, item.id, null, null)}
                      className="reply-comment mg-2"
                      style={{ cursor: "pointer" }}
                    >
                      {t("Event.content.reply")}
                    </a>
                  )}
                  
                  {/*------- ngày bình luận --------*/}
                  {moment(item.createDate).subtract(1, 'month').format("HH:mm - DD MMMM, YYYY")}
                  {/*------- xóa bình luận ---------*/}
                  {isLoggedIn && isAdmin() && (
                    <a
                      class="reply-comment delete-comment"
                      onClick={() => this.setState({openPopupDelete: true, deleteId: item.id})}
                    >
                      {t("Event.content.delete")}
                    </a>
                  )}
                  {isLoggedIn && (isUser() || isHost()) && user.id == item.user.id && (
                    <a
                      onClick={() => this.setState({openPopupDelete: true, deleteId: item.id})}
                      class="reply-comment delete-comment"
                    >
                      {t("Event.content.delete")}
                    </a>
                  )}
                </div>
              </div>

              {/* hiển thị danh sách comment child */}
              {     openCommentChild && commentListChild && this.state.index == item.id && (
                <div className="cmtChild1" style={{ marginLeft: "5%" }}>
                  {commentListChild.map((itemchild) => {
                    return (
                      <>
                        <div>
                          <div className="row mb-3">
                            <div className="col-1 avarta-cmt">
                              {itemchild.user.imagePath != null ? (
                                <img
                                  className="avatar-comment"
                                  src={
                                    ConstantList.API_ENPOINT +
                                    itemchild.user.imagePath
                                  }
                                  alt=""
                                />
                              ) : (
                                <img
                                  className="avatar-comment"
                                  src={"/assets/images/avatar.jpg"}
                                  alt=""
                                />
                              )}
                            </div>
                            <div className="col-10 comment-font">
                              <p className="text-green font-size-cmt bold comment-text">
                                {itemchild.user.displayName}<span className="text-white comment-detail"  >
                                  <span style={{ color: "#FD4A20" }}>
                                    {itemchild.userReply == null
                                      ? ""
                                      : itemchild.userReply?.id ===
                                        itemchild.user.id
                                        ? ""
                                        : "@" + itemchild.userReply?.displayName + " "}
                                  </span>
                                  {itemchild?.comment}
                                </span>
                              </p>

                              {itemchild.isEmotion == undefined &&
                                isLoggedIn && (
                                  <div
                                    onClick={() => {
                                      this.likeComment(
                                        itemchild.id,
                                        emotionSystem.like
                                      );
                                    }}
                                    class="tooltipv2 like-comment-ver1"    >
                                    <img
                                      src={
                                        ConstantList.ROOT_PATH +
                                        "assets/homepage/grey-heart.png"
                                      }
                                      alt=""
                                      style={{ height: 30 }}
                                    />
                                    <span style={{ fontSize: 20 }}>
                                      {itemchild.likes == 0 ? "" : itemchild.likes}</span>
                                  </div>
                                )}
                              {itemchild.isEmotion == true &&
                                isLoggedIn &&
                                itemchild.statusEmotion ==
                                emotionSystem.like && (
                                  <div
                                    class="tooltipv2 like-comment-ver1"
                                  >
                                    {" "}
                                    <img
                                      onClick={() => {
                                        this.deleteEmotion(
                                          itemchild.id,
                                          emotionSystem.love
                                        );
                                      }}
                                      style={{ height: 30 }}
                                      src={
                                        ConstantList.ROOT_PATH +
                                        "assets/homepage/heart.png"
                                      }
                                      alt=""
                                    />
                                    <span style={{ fontSize: 20 }}>
                                      {itemchild.likes == 0 ? "" : itemchild.likes}</span>
                                  </div>
                                )}{" "}
                              {!isLoggedIn && (
                                <div class="tooltipv2 like-comment-ver1" onClick={() => handleLogin()}>
                                  <img
                                    src={
                                      ConstantList.ROOT_PATH + "assets/homepage/heart.png"
                                    }
                                    alt=""
                                    style={{ height: 30 }}
                                  />
                                  <span style={{ fontSize: 20 }}>
                                    {itemchild.likes == 0 ? "" : itemchild.likes}</span>
                                </div>
                              )}
                            </div>

                            <span className="text-gray font-size-cmt-2 mgt-0 comment-text1" style={{paddingLeft: '10%', marginTop: '1px'}}>
                              {!isLoggedIn ? (
                                <a
                                  onClick={() => handleLogin()}
                                  className="reply-comment mg-2"
                                  style={{ cursor: "pointer" }}
                                >
                                  {t("Event.content.reply")}
                                </a>
                              ) : (
                                <a
                                  onClick={() => this.replyComment(item.id, item.id, itemchild.user, null)}
                                  className="reply-comment"
                                  style={{ cursor: "pointer", marginRight: 10 }}
                                >
                                  {t("Event.content.reply")}
                                </a>
                              )}
                              {/* <a
                                onClick={() => this.replyComment(
                                  item.id,
                                  item.id,
                                  itemchild.user, null
                                )} class="reply-comment"
                                style={{ cursor: "pointer", marginRight: 10 }}
                              >
                                {t("Event.content.reply")}
                              </a> */}
                              {moment(itemchild.createDate).subtract(1, 'month').format("HH:mm - DD MMMM, YYYY")}
                              {isLoggedIn && isAdmin() && (
                                <a
                                  class="reply-comment delete-comment"
                                  onClick={() => this.setState({openPopupDelete: true, deleteId: itemchild.id})}
                                  
                                >
                                  {t("Event.content.delete")}
                                </a>
                              )}
                              {isLoggedIn && (isUser() || isHost()) && user.id == itemchild.user.id && (
                                <a
                                  class="reply-comment delete-comment"
                                  onClick={() => this.setState({openPopupDelete: true,  deleteId: itemchild.id})}
                                >
                                  {t("Event.content.delete")}
                                </a>
                              )}
                            </span>

                          </div>
                        </div>
                      </>
                    );
                  })}
                  {/* phân trang cho comment child */}
                  <div className="text-center text-comment1">
                    {isHidden && (
                      <a
                        className="load-hiden"
                        onClick={(event) =>
                          this.showMore(event, "hidden")
                        }
                      >
                        <i class="fas fa-caret-up"></i>&nbsp;{t("SearhResult.hidden")}
                      </a>
                    )} &emsp;
                    {isLoadMore && (
                      <a
                        className="load-hiden"
                        onClick={(event) =>
                          this.showMore(event, "showMore")
                        }
                      >
                        <i class="fas fa-caret-down">&nbsp;</i>{t("SearhResult.see_more")}
                      </a>
                    )}
                  </div>
                </div>
              )
              }
              {/* hiển thị form reply */}
              {openReply && this.state.index == item.id && user && (
                <div className="form-reply col-10 mb-3" style={{ marginLeft: '10%' }}>
                  <div>
                    <p>
                      {replyTo == null || user?.id == replyTo?.id
                        ? "Reply"
                        : "Reply To " + replyTo.displayName}
                    </p>
                    <form onSubmit={this.submitCommentChild}>
                      <div>
                        <Form.Group>
                          <Form.Control
                            className="text-comment parent-comment"
                            as="textarea"
                            rows={2}
                            name="reComment"
                            value={reComment}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDownEnterSearchChild}                          
                          >
                          </Form.Control>
                        </Form.Group>
                      </div>
                      <LoadingOverlay
                        active={isLoading}
                        spinner
                        text="Please wait..."
                      >
                        <div style={{ textAlign: "right" }}>
                          <button
                            className={"btn btn-default-comment btn-cancel-cmt btn-size-cmt mt-2"}
                            onClick={() => this.cancelComment()}
                          >
                            {t("Event.content.cancel")}
                          </button>
                          <button
                            className={
                              reComment?.trim()
                                ? "btn btn-submit-comment btn-size-cmt mt-2"
                                : "btn btn-submit-comment btn-size-cmt mt-2 disabled"
                            }
                            type="submit"
                          >
                            {t("Event.content.feedback")}
                          </button>
                        </div>
                      </LoadingOverlay>
                    </form>
                  </div>
                </div>
              )}
            </div>
          );
        })
        }
        {
          commentList != null && commentList.length > 0 && (
            <div className="mt-5">
              <Pagination
                totalElements={totalElements}
                onChangePage={(page) => { this.handleChangePage(page) }}
                pageSize={rowsPerPage}
              />
            </div>
          )
        }
        {openPopupDelete && (
          <PopupComfirmDelete 
            t={t}
            isPopup={openPopupDelete}
            handleClose={this.handleClosePopup}
            confirmDelete={this.deleteComment}
            deleteId= {this.state.deleteId}
          />
        )}
      </div>
    );
  }
}
export default CommentComponent;