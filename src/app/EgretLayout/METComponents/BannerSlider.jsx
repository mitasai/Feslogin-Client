import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/swiper.min.css";
import "swiper/components/effect-coverflow/effect-coverflow.min.css"
import "swiper/components/effect-fade/effect-fade.min.css"
import "swiper/components/navigation/navigation.min.css"
import "swiper/components/pagination/pagination.min.css"
import SwiperCore, {
  EffectCoverflow, Pagination, EffectFade, Navigation, Autoplay
} from 'swiper/core';

// install Swiper modules
SwiperCore.use([EffectCoverflow, Autoplay, EffectFade, Navigation, Pagination]);

export default class BannerSlider extends React.Component {
  render() {
    let { t, i18n } = this.props;
    const setting = {
      direction: "horizontal",
      loop: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      // Navigation arrows
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
        clickable: true,
      },
      spaceBetween: 50,
    };

    return (
      <Swiper
        // // {...setting}
        centeredSlides={true}
        autoplay={{
          "delay": 4000,
          "disableOnInteraction": false
        }}
        navigation={{ clickable: true }}
        effect={'fade'}
        // effect={'coverflow'}
        loop={true}
        grabCursor={true}
        centeredSlides={true}
        slidesPerColumnFill={"row"}
        slidesPerView={'auto'}
        coverflowEffect={{
          "rotate": 50,
          "stretch": 0,
          "depth": 100,
          "modifier": 1,
          "slideShadows": true
        }}
        pagination={{ el: ".swiper-pagination", clickable: true }}
      >
        {t("general.vi") === "vi" ? (<div>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/vi1.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/vi2.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/vi3.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/vi4.png"
                alt=""
              />
            </div>
          </SwiperSlide>
        </div>

        ) : (<div>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/en1.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/en2.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/en3.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div>
              <img
                className="img-fluid swiper-slide"
                src="/assets/homepage/en4.png"
                alt=""
              />
            </div>
          </SwiperSlide>
        </div>)}

      </Swiper>

    );
  }
}
