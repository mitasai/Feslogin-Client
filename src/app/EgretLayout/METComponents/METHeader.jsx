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
import { EgretMenu, EgretToolbarMenu, EgretSearchBox } from "egret";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import authService from "../../services/jwtAuthService";

import { roleSystem } from "../../../app/role";
import localStorageService from "app/services/localStorageService";
import history from "history.js";
import ConstantList from "../../appConfig";
import LanguageSelect from "../SharedCompoents/LanguageSelect";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import { logoutUser } from "app/redux/actions/UserActions";
import METLanguageSelect from "./METLanguageSelect";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { isAdmin, isHost, isUser } from "app/auth/authRoles";
const ViewLanguageSelect = withTranslation()(METLanguageSelect);
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);
class METHeader extends Component {
  state = {
    text: "",
    isSearch: false,
    user:authService.getLoginUser(),
    mobileNavigation: false
  };

  handleSignOut = () => {
    this.props.logoutUser();
  };

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;

    setLayoutSettings({
      ...settings,
      layout2Settings: {
        ...settings.layout2Settings,
        leftSidebar: {
          ...settings.layout2Settings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  
  handleSidebarToggle = () => {
    let { settings } = this.props;
    let { layout2Settings } = settings;

    let mode =
      layout2Settings.leftSidebar.mode === "close" ? "mobile" : "close";

    this.updateSidebarMode({ mode });
  };

  componentDidMount() {
    // let currSite = window.location.href;
    // let keyword = localStorageService.getItem("searchKeyWord");
    // this.setState({ text: keyword });
    // console.log(localStorageService.getLoginUser().roles);
    // console.log(currSite.search("search-result"));
    // if (currSite.search("search-result") !== -1) {
    //   this.setState({ isSearch: true });
    // } else if (currSite.search("search-result") === -1) {
    //   this.setState({ isSearch: false });
    // }
  }
  componentWillReceiveProps(nextProps) {

    
  }
  render() {
    let { theme, settings , forceUpdate} = this.props;
    let { user, isLoggedIn, mobileNavigation } = this.state;
    let imagePath = ConstantList.ROOT_PATH + "assets/images/avatar.jpg";
    isLoggedIn = user != null;
    if (forceUpdate)
    {
      isLoggedIn = false;
    }
   
    if (user != null && user.imagePath != null) {
      imagePath = ConstantList.API_ENPOINT + user.imagePath;
    }
    const { t, i18n } = this.props;
    let language = "en";
    const changeLanguage = (lng) => {
      alert(lng);
      i18n.changeLanguage(lng);
      //alert('here');
    };
    const topbarTheme =
      settings.themes[settings.layout2Settings.topbar.theme] || theme;
    return (
      <MuiThemeProvider theme={topbarTheme}>
        <header id="header" className="">
          <div className="container" id="header-container">
            <div className="d-flex align-items-center mb-0 justify-content-between header-content">
              <div className="ponly ponly">
                <a href="/">
                  {" "}
                  <img
                    id="pc-logo1"
                    className="img-fluid "
                    src="/assets/header/logo-f.png"
                    alt=""
                  />
                  <img
                    id="pc-logo"
                    className="img-fluid "
                    src="/assets/header/logo.png"
                    alt=""
                  />
                </a>
              </div>
              <div className="monly">
                <a href="/">
                  <img
                    className="img-fluid"
                    src="/assets/header/logo-m.png"
                    alt=""
                  />
                </a>
              </div>
              {/* <div className="monly">
                <div 
                  className="align-items-center justify-content-end monly m-header-icons"
                  style={{display: 'flex'}}
                > */}
                  {/* <i className="fas fa-search"></i>
                  <a href="/">
                    <img
                      className="img-fluid avatar"
                      src="/assets/homepage/avatar.png"
                      alt=""
                    />
                  </a> */}
                  {/* <ViewLanguageSelect />
                  <i className="fas fa-bars" onClick={()=>{this.setState({mobileNavigation: true})}}></i>
                </div>
              </div> */}
              <div className="ponly ">
                <div className="align-items-center">
                  <div className="d-flex lang-info">
                    {/* {!this.state.isSearch && (
                      <div className="search-position">
                        <input
                          type="text"
                          className="form-control search-bar"
                          placeholder={t("Dashboard.header.search")}
                          name="text"
                          value={this.state.text}
                          onChange={this.handleTextChange}
                          onKeyPress={(e) => {
                            this.handleKeyDownEnterSearch(e);
                          }}
                        />
                        <button
                          className="button-search"
                          onClick={() => this.search()}
                        >
                          <i
                            className="fa fa-search"
                            aria-hidden="true"
                            title="search"
                          />
                        </button>
                      </div>
                    )} */}

                    <ViewLanguageSelect />
                  </div>

                  <div className="d-flex mb-0 ">
                    <ul className="nav d-flex align-items-center" id="pc-nav-menu">
                      <li className="nav-item">
                        <a className="nav-link active" href="/">
                          {t("Dashboard.header.home")}
                        </a>
                      </li>
                      {/* {isLoggedIn && (
                        <li className="nav-item">
                          <a className="nav-link active" href="/payment">
                            {t("Dashboard.header.payment")}
                          </a>
                        </li>
                      )} */}
                      {isLoggedIn && (
                        <li className="nav-item dropdown">
                          <Dropdown>
                            <Dropdown.Toggle
                              as={CustomToggle}
                              id="dropdown-custom-components"
                            >
                              <a className="nav-link active dropdown-toggle">
                                <img
                                  className="img-fluid avatar"
                                  src={imagePath}
                                  alt=""
                                />
                                {" "+user?.name}
                              </a>
                            </Dropdown.Toggle>

                            <Dropdown.Menu as={CustomMenu}>
                              <Dropdown.Item eventKey="1" href="/profile">
                                {t("Dashboard.header.profile")}
                              </Dropdown.Item>
                              <Dropdown.Item
                                eventKey="6"
                                onClick={(event) => this.handleSignOut()}
                              >
                                {t("Dashboard.header.logout")}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </li>
                      )}
                      {!isLoggedIn && (
                        <>
                          <li className="nav-item ">
                            <a
                              className="nav-link "

                              href="/login"
                            >
                              {t("sign_in.title")}
                            </a>
                          </li>
                          <li className="nav-item ">
                            <a
                              className="nav-link"
                              href="/register"
                            >
                              {t("sign_up.title")}
                            </a>
                          </li>
                        </>
                      )}
                      {/* <li className="nav-item">
                        <ViewLanguageSelect />
                      </li> */}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {mobileNavigation && (
            <div className='row'>
              <div className='navigation-mobile col-md-6 col-sm-12'>
                <div className='navigation-close'>
                  <span className="fa fa-times icon-cross" 
                  onClick={()=>{this.setState({mobileNavigation: false})}}></span>
                </div>
                <div className='navigation-header'>
                  <a className='logo' href="/">
                    <img className="img-fluid" src="/assets/header/logo.png" />   
                  </a>
                  {isLoggedIn && (
                    <>
                    <a className='logo nav-link text-center' href="/profile">
                      <img
                        className="avatar"
                        style={{width: '50%', height: 'auto'}}
                        src={imagePath}
                        alt=""
                        />
                        <p>{" "+user?.name}</p>
                        
                    </a>
                    </>
                  )}
                  <div className='navigation-search'>
                    {/* <input 
                      type="text" 
                      placeholder={t("Dashboard.header.search")}
                      name="text"
                      value={this.state.text}
                      onChange={this.handleTextChange}
                      onKeyPress={(e) => {
                        this.handleKeyDownEnterSearch(e);
                      }}
                    />
                    <span 
                      className='fa fa-search' 
                      onClick={() => this.search()}>
                    </span> */}
                  </div>
                </div>
                <div className='navigation-group'>
                  <nav className='nav-group'>
                    <ul className='ul-group'>
                      {!isLoggedIn && (
                        <>
                          <li>
                            <a className="nav-link " href="/login">
                            {t("sign_in.title")}
                            </a>
                          </li>
                          <li>
                            <a className="nav-link " href="/register">
                            {t("sign_up.title")}
                            </a>
                          </li>
                        </>
                      )}
                      {isLoggedIn && (
                        <>
                          <li>
                            <a className="nav-link " href="/profile">
                              {t("Dashboard.header.profile")}
                            </a>
                          </li>
                          <li>
                            <a className="nav-link " 
                            onClick={(event) => this.handleSignOut()}
                            style={{cursor: 'pointer'}}
                            >
                            {t("Dashboard.header.logout")}
                            </a>
                          </li>
                        </>
                      )}
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </header>
      </MuiThemeProvider>
    );
  }
}

METHeader.propTypes = {
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
)(connect(mapStateToProps, { setLayoutSettings, logoutUser })(METHeader));
