import React, { Component, Fragment, useState } from "react";
import {
  Icon,
  IconButton,
  Badge,
  Hidden,
  withStyles,
  MuiThemeProvider,
  MenuItem,
} from "@material-ui/core";
import {
  updateEventEndStatusByCode,
} from "./EventService";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import authService from "../../services/jwtAuthService";
import localStorageService from "app/services/localStorageService";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { logoutUser } from "app/redux/actions/UserActions";
import METLanguageSelect from "../../EgretLayout/METComponents/METLanguageSelect";
import { isAdmin, isHost } from "app/auth/authRoles";
const ViewLanguageSelect = withTranslation()(METLanguageSelect);
class ThankyouPage extends Component {
  state = {
    text: "",
    isSearch: false,
  };

  componentWillMount() {
    this.props.enableDisableAllLoading(true);
    if (this.props.match.params.code && (isHost() || isAdmin())) {
      updateEventEndStatusByCode(this.props.match.params.code).then(() => { this.props.enableDisableAllLoading(false) });
    } else {
      this.props.enableDisableAllLoading(false);
    }
  }

  render() {
    const { t, i18n } = this.props;
    return (
      <div>
        <div className="container mt-5">
          <div className="text-center font-size-2 mb-5 z-10">
            <p><span className="text-center" dangerouslySetInnerHTML={{ __html: t("general.thankyou") }}></span> </p>
          </div>
          <div className="text-center mb-5 z-10">
            <p className="text-black font-size-2">
              <Link 
                className="btn btn-light btn-lg btn-space" to="/">
                {t("general.backToHomePage")}
              </Link>
            </p>
          </div>
        </div>
        <div className>
          <div className="decor d-flex justify-content-between">
            <img className src="/assets/login/decor-left.png" alt="" />
            <img className src="/assets/login/decor-right.png" alt="" />
          </div>
        </div>
      </div>
    );
  }
}

ThankyouPage.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  settings: state.layout.settings,
});

export default withStyles(
  {},
  { withTheme: true }
)(connect(mapStateToProps, { setLayoutSettings, logoutUser })(ThankyouPage));
