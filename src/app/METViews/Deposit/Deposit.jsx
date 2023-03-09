import React, { Component } from 'react'
import authService from '../../services/jwtAuthService'
import { searchPublicByDto as getAllCategory } from '../Category/CategoryService'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { connect } from 'react-redux'
import EventCard from '../../EgretLayout/METComponents/EventCard'
import RequestLoginPopup from '../../EgretLayout/METComponents/RequestLoginPopup'
import Select from 'react-select'
import LoadingOverlay from 'react-loading-overlay'
import {
  searchByDto as searchEvent,
  getAllUserByRoles,
  toogleFavouriteEvent,
  getlistEventStatusAndUserAction,
} from '../manageEvent/EventService'
import ConstantList from '../../appConfig'
import localStorageService from '../../services/localStorageService'
import { Link } from 'react-router-dom'
import { roleSystemId } from '../../role'
import { Helmet } from 'react-helmet'
import { SearchOutlined } from '@material-ui/icons'
import {Paypal} from './Paypal'
import CLIENT_ID from '../../appConfig'
// import { PayPalScriptProvider } from "@paypal/react-paypal-js"



class Deposit extends Component {
  state = {
    tabActive: 'viet_qr',
    code: '',
    isLoading: false,
    isRequireLogin: false,
  }

  handleTabClick(value) {
    let tabActive = value
    switch (value) {
      case 'viet_qr':
        // this.getVietQRCode();
        break
      case 'paypal':
        // this.getThisWeekList();
        break
      default:
        // this.updatePageData()
    }
    this.setState({
      tabActive: tabActive,
      isLoading: true,
    })
  }

  getVietQRCode() {}

  getPayPalQRCode() {}

  componentDidMount() {}

  handleClose = () => {
    this.setState({ isRequireLogin: false })
  }

  handleLogin = (obj) => {
    let textContent = obj.name
    let startTimeContent = obj.startTime
    this.setState({
      isRequireLogin: true,
      textContent: textContent,
      startTimeContent: startTimeContent,
    })
  }

  render() {
    let { t, i18n } = this.props
    let { tabActive, isLoading, isRequireLogin } = this.state
    let TitlePage = t('sign_up.title_form')
    let user = authService.getLoginUser()
    let isLoggedIn = user != null

    return (
      <div id="deposit">
        <Helmet>
          <title>
            {t('web_site.title_page')} | {t('web_site.search')}
          </title>
        </Helmet>

        <div className="container">
          <div className="row my-6">
            <div className="col-xl-1" />
            <div className="col">
              <div className="row category-options ">
                <div
                  className={
                    'col cursor-pointer ' +
                    (tabActive == 'viet_qr' ? 'active pb-3' : '')
                  }
                  onClick={(tab) => this.handleTabClick('viet_qr')}
                >
                  {t('Home.login.viet_qr')}
                </div>
                <div
                  className={
                    'col cursor-pointer ' +
                    (tabActive == 'paypal' ? 'active pb-3' : '')
                  }
                  onClick={(tab) => this.handleTabClick('paypal')}
                >
                  {t('Home.login.paypal')}
                </div>{' '}
              </div>
            </div>
            <div className="col-xl-1" />
          </div>
        </div>
        <div className="container d_notice">
          <p>{t('deposit.amount_notice')}</p>
          <input type="text" name="amount" className="amount" />
        </div>
        <div className="viet_qr" id="viet_qr">
          <img src="https://img.vietqr.io/image/VCB-0341007182215-compact2.png?amount=1000000\&addInfo=MA_GD\&accountName=NGUYEN%20VAN%20HOC" />
        </div>

        {/* <div className="paypal" id="paypal">
          <PayPalScriptProvider options={{ "client-id": CLIENT_ID }}>
            <Paypal/>
          </PayPalScriptProvider>
        </div> */}

        <div className="text-center my-6 z-10">
          <a className="btn btn-primary btn-lg mb-4" href="/deposit">
            {' '}
            {t('Home.login.deposit')}{' '}
          </a>
        </div>

        {isRequireLogin && (
          <RequestLoginPopup
            t={t}
            isPopup={isRequireLogin}
            handleClose={this.handleClose}
            textContent={this.state.textContent}
            startTimeContent={this.state.startTimeContent}
          />
        )}
      </div>
    )
  }
}
// export default withRouter(Deposit);
const mapStateToProps = (state) => ({
  // setUser: PropTypes.func.isRequired
})

export default connect(mapStateToProps, {})(Deposit)
