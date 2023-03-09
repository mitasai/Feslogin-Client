import React, { Component } from "react";
import ConstantList from "../../appConfig";
import { Link } from "react-router-dom";
import ImageComponent from "./ImageComponent";
export default class SlideDetailEvent extends React.Component {
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
            eventList,
            favouriteObject,
            // statusObject,
        } = this.props;
        let { statusObjectState } = this.state;

        return (
            <Swiper
                spaceBetween={50}
                slidesPerView={3}
                slidesPerColumn={1}
                slidesPerColumnFill={"row"}
                scrollbar={false}
                navigation
                pagination={{ clickable: true }}
                // pagination
                onSlideChange={() => console.log("slide change")}
                onSwiper={(swiper) => console.log(swiper)}
            >
                {eventList != null && eventList.map((obj) => {
                    return (
                        <div className="row">
                            <SwiperSlide key={obj.id} className="cc-card">
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
                                                className="translate-middle-y heart-btn"
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
                                            <div className="translate-middle-y heart-btn">
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
                                    </div>

                                    <div className="card-text">
                                        <p>
                                            {" "}
                                            <Link className="card-title" to={"/detail/" + obj.id}>
                                                {obj.name}
                                            </Link>
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
                            </SwiperSlide>
                        </div>
                    );
                })}
            </Swiper>

        )
    }
}