import React, { Component, Fragment } from "react";
import LoadingOverlay from "react-loading-overlay";
import { Hidden } from "@material-ui/core";
import AppContext from "app/appContext";
import { PropTypes } from "prop-types";
import { classList } from "utils";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { withStyles } from "@material-ui/styles";
import METFooter from "../METComponents/METFooter";
import METHeader from "../METComponents/METHeader";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const ViewMETHeader = withTranslation()(METHeader);
const ViewMETFooter = withTranslation()(METFooter);
const styles = theme => {
  return {
    layout: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary
    }
  };
};

class Layout2 extends Component {
  state = { isAllLoading:false };
  updateSidebarMode = sidebarSettings => {
    let { settings, setLayoutSettings } = this.props;
    setLayoutSettings({
      ...settings,
      layout2Settings: {
        ...settings.layout2Settings,
        leftSidebar: {
          ...settings.layout2Settings.leftSidebar,
          ...sidebarSettings
        }
      }
    });
  };
  enableDisableAllLoading = isAllLoading => {
    this.setState({
      isAllLoading: isAllLoading
    });
  };
  setForceUpdateHeader = isForceUpdate => {
    this.setState({
      isForceUpdate: isForceUpdate
    });
  };
  render() {
    let { settings, classes, theme } = this.props;
    let { layout2Settings } = settings;
    let { isAllLoading, isForceUpdate } = this.state;
    // let layoutClasses = {
    //   [classes.layout]: true,
    //   [settings.activeLayout]: true,
    //   [`sidenav-${layout2Settings.leftSidebar.mode}`]: true,
    //   [`layout-${layout2Settings.mode} theme-${theme.palette.type}`]: true
    // };
    let layoutClasses = {
      [classes.layout]: true,
      [settings.activeLayout]: true,
      [`sidenav-${layout2Settings.leftSidebar.mode}`]: true,
      [`layout-${layout2Settings.mode}`]: true
    };
    return (
      <AppContext.Consumer>
        {({ routes }) => (
          <Fragment>
              <LoadingOverlay
              active={isAllLoading}
              spinner
              text='Please wait...'
              className={"zindex-1000 "+(isAllLoading ? "position-fixed full-width full-height" : "")}
            >
            </LoadingOverlay>
              {layout2Settings.topbar.show && <ViewMETHeader  forceUdate ={isForceUpdate}/>}

              {settings.perfectScrollbar && (
                <div
                  options={{ suppressScrollX: true }}
                  className="scrollable-content p-0"
                >
                  {renderRoutes(routes, {enableDisableAllLoading:(isAllLoading) => this.enableDisableAllLoading(isAllLoading), setForceUpdateHeader:(isForceUpdate)=> this.setForceUpdateHeader(isForceUpdate)} )}
                  <div className="my-auto"></div>
                  {settings.footer.show && !settings.footer.fixed && <ViewMETFooter />}
                </div>
              )}

              {!settings.perfectScrollbar && (
                <div
                  options={{ suppressScrollX: true }}
                  className="scrollable-content p-0"
                >
                  {renderRoutes(routes)}
                  <div className="my-auto"></div>
                  {settings.footer.show && !settings.footer.fixed && <ViewMETFooter />}
                </div>
              )}

              {settings.footer.show && settings.footer.fixed && <ViewMETFooter />}
            
          </Fragment>
        )}
      </AppContext.Consumer>
    );
  }
}

Layout2.propTypes = {
  settings: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  setLayoutSettings: PropTypes.func.isRequired,
  settings: state.layout.settings
});

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    { setLayoutSettings }
  )(Layout2)
);
