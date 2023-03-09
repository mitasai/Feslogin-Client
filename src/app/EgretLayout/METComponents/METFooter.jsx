import React, { Component, useState } from "react";
import { withStyles, MuiThemeProvider, Button } from "@material-ui/core";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";

class METFooter extends Component {
  render() {
    const { t, i18n } = this.props;
    let { theme, settings } = this.props;
      const footerTheme = settings.themes[settings.footer.theme] || theme;
      return (
        <MuiThemeProvider theme={footerTheme}>
          <footer id="footer">
            <div>
              <div className="container">
                <div className="footer-content">
                  <div className="f1">
                    <img className="img-fluid" src="/assets/footer/logo-footer.png" alt="" />
                  </div>
                  <div className="f2">
                    <h3>{t("Dashboard.footer.contacts")}</h3>
                    <p className="text-gray">Email: <a href="mailto:">feslogin6868@gmail.com</a> <br />
                Tel: <a href="tel:+"> 0388 322 822</a></p>
                  </div>
                  <div className="d-flex flex-column justify-content-between f3">
                    <h3 className="footer-social-icons">
                      <a href="https://www.facebook.com/fes.browser" target="_blank">
                        <i className="fab fa-facebook-square" /></a>
                      <a href="https://www.youtube.com/channel/UC6UqJj6alGmITg6pDdv4iwA" target="_blank">
                        <i className="fab fa-youtube-square" /></a>
                      <a href="https://t.me/fesloginchannel" target="_blank">
                        <i className="fab fa-telegram" /></a>
                    </h3>
                    <p className="text-gray">© Copyright 2023 FESLogin.com</p>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </MuiThemeProvider>
      );
  }
}

METFooter.propTypes = {
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  settings: state.layout.settings
});

export default withStyles({}, { withTheme: true })(
  connect(
    mapStateToProps,
    {}
  )(METFooter)
);