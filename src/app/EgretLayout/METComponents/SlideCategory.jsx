import React, { Component } from "react";
import ConstantList from "../../appConfig";
import { Link } from "react-router-dom";
import ImageComponent from "./ImageComponent";
export default class SlideCategory extends React.Component {
  state = {
    statusObjectState: null,
  };
  static getDerivedStateFromProps(props, current_state) {
    if (props.statusObject !== null) {
      return {
        statusObjectState: props.statusObject,
        // computed_prop: heavy_computation(props.value)
      };
    }
    return null;
  }

  handleChangeLike = (obj, bolean) => {
    if (bolean) {
      if (obj?.likes == null || obj?.likes == 0) {
        obj.likes = 0;
      } else {
        obj.likes--;
      }
    } else {
      if (obj.likes == null || obj.likes == 0) {
        obj.likes = 1;
      } else {
        obj.likes++;
      }
    }
    this.setState({ obj: obj });
  };
  render() {
    let {
      t,
      handleLogin,
      handleFavourite,
      isLoggedIn,
      obj,
      favouriteObject,
      statusObject,
    } = this.props;
    let { statusObjectState } = this.state;
    return (
      <div className="">
        <div className="card-img-div">
          <Link to={"/detail/" + obj.id}>
            <ImageComponent
              className="card-img-fluid"
              src={
                obj.imageUrl
                  ? ConstantList.API_ENPOINT + "/" + obj.imageUrl
                  : "/assets/homepage/c1.png"
              }
            ></ImageComponent>
          </Link>
        </div>
        <div className="position-relative">
          {!isLoggedIn && (
            <div
              className="translate-middle-y heart-btn heart1"
              onClick={() => {
                handleLogin(obj);
              }}
            >
              <img
                className="img-fluid icon-heart"
                style={{ cursor: "pointer" }}
                src={ConstantList.ROOT_PATH + "assets/homepage/grey-heart.png"}
                alt=""
              />
              <span class="badge like-badge">{obj.likes}</span>
            </div>
          )}
          {isLoggedIn && (
            <div className="translate-middle-y heart-btn heart1">
              {favouriteObject[obj.id] && (
                <img
                  className="img-fluid icon-heart"
                  style={{ cursor: "pointer" }}
                  src={ConstantList.ROOT_PATH + "assets/homepage/heart.png"}
                  alt=""
                  onClick={(event) => {
                    handleFavourite(obj.id);
                    this.handleChangeLike(obj, true);
                  }}
                />
              )}
              {!favouriteObject[obj.id] && (
                <img
                  className="img-fluid icon-heart"
                  src={
                    ConstantList.ROOT_PATH + "assets/homepage/grey-heart.png"
                  }
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={(event) => {
                    handleFavourite(obj.id);
                    this.handleChangeLike(obj, false);
                  }}
                />
              )}
              <span class="badge like-badge">{obj?.likes ? obj.likes : 0}</span>
            </div>
          )}

          {/* {statusObjectState != null && (
            <div className="event-status-div">
              {statusObjectState.status ==
                ConstantList.EVENT_STATUS.STATUS_INCOMING ? (
                <p className="text-status-in">{t("Event.content.upcoming")}</p>
              ) : statusObjectState.status ==
                ConstantList.EVENT_STATUS.STATUS_HAPPENING ? (
                <p className="text-status-on">{t("Event.content.ongoing")}</p>
              ) : statusObjectState.status ==
                ConstantList.EVENT_STATUS.STATUS_ENDED ? (
                <p className="text-status-en">{t("Event.content.ended")}</p>
              ) : (
                <p className="text-status-en">{t("Event.content.ended")}</p>
              )}
            </div>
          )} */}
          {statusObjectState != null &&
            statusObjectState.status ==
            ConstantList.EVENT_STATUS.STATUS_INCOMING && (
              <div className="event-status-div-in">
                <p className="text-status">{t("Event.content.upcoming")}</p>
              </div>
            )}

          {statusObjectState != null &&
            statusObjectState.status ==
            ConstantList.EVENT_STATUS.STATUS_HAPPENING && (
              <div className="event-status-div-on">
                <p className="text-status">{t("Event.content.ongoing")}</p>
              </div>
            )}
          {statusObjectState != null &&
            statusObjectState.status ==
            ConstantList.EVENT_STATUS.STATUS_ENDED && (
              <div className="event-status-div-en">
                <p className="text-status">{t("Event.content.ended")}</p>
              </div>
            )}
          {statusObjectState === null && (
            <div className="event-status-div-en">
              <p className="text-status">{t("Event.content.loading")}</p>
            </div>
          )}
          {statusObjectState === undefined && (
            <div className="event-status-div-en">
              <p className="text-status">{t("Event.content.ended")}</p>
            </div>
          )}
          {/* {statusObjectState === null && (
            <div className="event-status-div">
              <p className="text-status-en">{t("Event.content.loading")}</p>
            </div>
          )}
          {statusObjectState === undefined && (
            <div className="event-status-div">
              <p className="text-status-en">{t("Event.content.ended")}</p>
            </div>
          )} */}
        </div>

        <div className="card-text">
          <p>
            {" "}
            <Link className="card-title " to={"/detail/" + obj.id}>
              {obj.name}
            </Link>
          </p>
          <p className="p-des1">
            {obj.description}
          </p>
          <p className="card-date">
            <i
              class="fa fa-calendar"
              style={{ color: "#fd4a20", marginRight: "10px" }}
            />
            {new Intl.DateTimeFormat("vi-VN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(obj.startTime)}
          </p>
        </div>
      </div>
    );
  }
}
