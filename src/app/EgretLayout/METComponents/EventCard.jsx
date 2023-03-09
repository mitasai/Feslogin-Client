import React, { Component } from "react";
import { Link } from "react-router-dom";
import ConstantList from "../../appConfig";

import PropTypes from "prop-types";

class EventCard extends Component {
  state = {
    statusObjectState: null,
  };

  componentWillMount() { }

  static getDerivedStateFromProps(props, current_state) {
    if (props.statusObject !== null) {
      return {
        statusObjectState: props.statusObject,
        // computed_prop: heavy_computation(props.value)
      };
    }
    return null;
  }

  handleChangeLike = (event, boolean) => {
    if (boolean) {
      if (event?.likes == null || event?.likes == 0) {
        event.likes = 0;
      } else {
        event.likes--;
      }
    } else {
      if (event.likes == null || event.likes == 0) {
        event.likes = 1;
      } else {
        event.likes++;
      }
    }
    this.setState({ event: event });
  };

  render() {
    let {
      handleFavourite,
      handleLogin,
      t,
      i18n,
      statusObject,
      isLoggedIn,
      event,
      favouriteObject,
    } = this.props;
    let { statusObjectState } = this.state;
    return (
      <div className="col-xl-4 col-md-12 col-lg-12 col-sm-6 margin-b-4" style={{ maxHeight: '600px', marginBottom: '15px' }}>
        <div className="swiper-slide cc-card">
          <div className="card-img-div">
            <Link to={"/detail/" + event.id}>
              <img
                className="card-img-fluid img-fluid"
                src={
                  event.imageUrl
                    ? ConstantList.API_ENPOINT + "/" + event.imageUrl
                    : "/assets/homepage/c1.png"
                }
                alt=""
              />
            </Link>
            {/* <div className="position-absolute bottom-1 end-0 translate-middle-y">
                          <img src="/assets/homepage/heart.png" alt="" />
                        </div> */}
          </div>
          <div className="position-relative">
            {!isLoggedIn && (
              <div
                className="bottom-1 end-0 translate-middle-y heart-btn heart1"
                onClick={() => handleLogin(event)}
              >
                <img
                  className="img-fluid icon-heart"
                  src={
                    ConstantList.ROOT_PATH + "assets/homepage/grey-heart.png"
                  }
                  alt=""
                />
                <span class="badge like-badge">{event.likes}</span>
              </div>
            )}
            {isLoggedIn && (
              <div className="position-absolute bottom-1 end-0 translate-middle-y heart-btn heart1">
                {favouriteObject[event.id] && (
                  <img
                    className="img-fluid icon-heart"
                    src={ConstantList.ROOT_PATH + "assets/homepage/heart.png"}
                    alt=""
                    onClick={() => {
                      handleFavourite(event.id);
                      this.handleChangeLike(event, true);
                    }}
                  />
                )}
                {!favouriteObject[event.id] && (
                  <img
                    className="img-fluid icon-heart"
                    src={
                      ConstantList.ROOT_PATH + "assets/homepage/grey-heart.png"
                    }
                    alt=""
                    onClick={() => {
                      handleFavourite(event.id);
                      this.handleChangeLike(event, false);
                    }}
                  />
                )}
                <span class="badge like-badge">{event.likes}</span>
              </div>
            )}
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
            {/* {statusObjectState.status ==
                  ConstantList.EVENT_STATUS.STATUS_INCOMING ? (
                    <div className="event-status-div-in">
                  <p className="text-status">{t("Event.content.upcoming")}</p>
                  </div>
                ) : statusObjectState.status ==
                  ConstantList.EVENT_STATUS.STATUS_HAPPENING ? (
                  <p className="text-status-on">{t("Event.content.ongoing")}</p>
                ) : statusObjectState.status ==
                  ConstantList.EVENT_STATUS.STATUS_ENDED ? (
                  <p className="text-status-en">{t("Event.content.ended")}</p>
                ) : (
                  <p className="text-status-en">{t("Event.content.ended")}</p>
                )}
            )}
           */}
          </div>
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
          <div className="card-text card-text1">
            <div className="p-dess">
              <p>
                {" "}
                <Link className="card-title" to={"/detail/" + event.id}>
                  {event.name}
                </Link>
              </p>
            </div>
            <div className="p-des2">
              <h6 className="p-des1">
                {event.description}
              </h6>
            </div>
            <p className="card-date">
              {new Intl.DateTimeFormat("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(event.startTime)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

EventCard.propTypes = {};

export default EventCard;
