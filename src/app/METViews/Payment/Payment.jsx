import React, { Component } from "react";
import Select from "react-select";
import authService from "../../services/jwtAuthService";
import BannerSlider from "../../EgretLayout/METComponents/BannerSlider";
import Form from "react-bootstrap/Form";
import LoadingOverlay from "react-loading-overlay";
import { Swiper, SwiperSlide } from "swiper/react";
import ConstantList from "../../appConfig";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";

class Payment extends Component {
  state = {

  };
  componentDidMount() {

  }
  render() {
    let { t, i18n } = this.props;
    return (
      <div>
        <div id="about-us">
          <Helmet>
            <title>{t('web_site.title_page')} | {t('web_site.about_us')}</title>
          </Helmet>

          <div className="container">
            
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  // setUser: PropTypes.func.isRequired
});

export default connect(mapStateToProps, {})(Payment);
