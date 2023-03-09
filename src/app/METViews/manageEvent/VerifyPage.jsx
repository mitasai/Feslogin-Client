import React, { Component } from "react";
import { scrollTo } from "utils";
import EventRegistrationConfirmation from "./EventRegistrationConfirmation";
import { connect } from "react-redux";
import RequestLoginPopup from "../../EgretLayout/METComponents/RequestLoginPopup";
import { confirmRegistration } from "../../redux/actions/LoginActions";
import { verifyEmail } from "./MyEventService";
import authService from "../../services/jwtAuthService";
import { VERIFY_EVENT } from "../../appConfig";
import ConstantList from "../../appConfig";
class VerifyPage extends Component {
  state = { isRequireLogin: false, confirmationResult: true };

  async componentDidMount() {
    let { enableDisableAllLoading } = this.props;
    enableDisableAllLoading(true);
    const token = new URLSearchParams(this.props.location.search).get("token");
    let user = authService.getLoginUser();
    if (user) {
      let otpDto = {};
      otpDto.userID = user.id;
      otpDto.token = token;
      await verifyEmail(otpDto).then((res) => {
        this.setState({ confirmationResult: res.data, isRequireLogin: false });
        enableDisableAllLoading(false);
      });
    } else {
      this.setState({
        isRequireLogin: true,
        confirmationResult: VERIFY_EVENT.ACCOUNT_NOT_MATCH,
      },()=>enableDisableAllLoading(false));
    }
  };
  componentWillUnmount() {
    scrollTo("root");
  }

  handleButtonClick = (number) => {
    if (number === 0) {
      this.props.history.push(ConstantList.ROOT_PATH + "event"); // Link to manage event page
    } else {
      this.props.history.push(ConstantList.ROOT_PATH); // Link to home page
    }
  };

  handleClose = () => {
    this.setState({ isRequireLogin: false });
  };

  render() {
    const { t } = this.props;
    return (
      <div className="landing">
        {/* <TopBar /> */}
        {this.state.confirmationResult != null&& (
          <EventRegistrationConfirmation
            t={t}
            confirmationResult={this.state.confirmationResult}
            handleButtonClick={this.handleButtonClick}
          />)
        }
        {this.state.isRequireLogin && (
          <RequestLoginPopup
            t={t}
            isPopup={this.state.isRequireLogin}
            handleClose={this.handleClose}
            textContent={null}
            startTimeContent={null}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    confirmationResult: state.login.confirmationResult,
  };
};

export default connect(mapStateToProps, {
  confirmRegistration,
})(VerifyPage);
