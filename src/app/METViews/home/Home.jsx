import React, { Component } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import BannerSlider from '../../EgretLayout/METComponents/BannerSlider'
import authService from '../../services/jwtAuthService'
import { connect } from 'react-redux'
import RequestLoginPopup from '../../EgretLayout/METComponents/RequestLoginPopup'
import 'swiper/components/navigation/navigation.min.css'
import 'swiper/components/pagination/pagination.scss'
import { withTranslation } from 'react-i18next'

import SwiperCore, { Pagination, Navigation } from 'swiper/core'

// install Swiper modules
SwiperCore.use([Navigation, Pagination])
const ViewBannerSlider = withTranslation()(BannerSlider)
class Home extends Component {
  state = {
    eventList: [],
    tabActive: 'all',
    isLoading: false,
    favouriteObject: [],
    isRequireLogin: false,
    textContent: '',
    startTimeContent: '',
    statusObject: null,
  }
  componentDidMount() {
  }

  handleClose = () => {
    this.setState({ isRequireLogin: false, isLoading: false })
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
    let {
      eventList,
      tabActive,
      isLoading,
      favouriteObject,
      isRequireLogin,
      statusObject,
    } = this.state
    let TitlePage = t('sign_up.title_form')
    let user = authService.getLoginUser()
    let isLoggedIn = user != null
    return (
      <div id="homepage">
        <div className="container">
          <div className="info-flex">
            <div className='card info-card1 c-info'>
              <div className='card-header'><b>{t("Home.login.all_deposit")}</b></div>
                { isLoggedIn ? 
                (
                  <div className='card-body'>
                    <p>VND:{" "}{ user.moneyVN }</p>
                    <p>USD:{" "}{ user.moneyUSD }</p>
                  </div>
                ): 
                (
                  <div className='card-body'>
                    <p>VND:{" "}0</p>
                    <p>USD:{" "}0</p>
                  </div>
                )}
            </div>
            <div className='card info-card2 c-info'>
              <div className='card-header'><b>{t("Home.login.paid")}</b></div>
              { isLoggedIn ? 
                (
                  <div className='card-body'>
                    <p>VND:{" "}{ user.paidVN }</p>
                    <p>USD:{" "}{ user.paidUSD }</p>
                  </div>
                ): 
                (
                  <div className='card-body'>
                    <p>VND:{" "}0</p>
                    <p>USD:{" "}0</p>
                  </div>
                )}
            </div>
            <div className='card info-card3 c-info'>
              <div className='card-header'><b>{t("Home.login.remain")}</b></div>
              { isLoggedIn ? 
                (
                  <div className='card-body'>
                    <p>VND:{" "}{ user.remainVN }</p>
                    <p>USD:{" "}{ user.remainUSD }</p>
                  </div>
                ): 
                (
                  <div className='card-body'>
                    <p>VND:{" "}0</p>
                    <p>USD:{" "}0</p>
                  </div>
                )}
            </div>
            <div className='card info-card4 c-info'>
              <div className='card-header'><b>{t("Home.login.discount")}</b></div>
              { isLoggedIn ? 
                (
                  <div className='card-body'>
                    <p>VND:{" "}{ 0 }</p>
                    <p>USD:{" "}{ 0 }</p>
                  </div>
                ): 
                (
                  <div className='card-body'>
                    <p>VND:{" "}0</p>
                    <p>USD:{" "}0</p>
                  </div>
                )}
            </div>
          </div>   
        </div>
        <div className="container">
          {isLoggedIn ? (
            <div className="text-center my-6 z-10">
              <a
                className="btn btn-primary btn-lg mb-4"
                href="/deposit"
              >
                {' '}
                {t('Home.login.deposit')}{' '}
              </a>
              <p className="text-gray">
                 {t('Home.login.deposit_notice')}{' '}
                <a href="/payment"> {t('Home.login.payment')} </a>
              </p>
            </div>
          ) : (
            <div className="text-center my-6 z-10">
              <a
                className="btn btn-primary btn-lg mb-4"
                href="/register"
              >
                {' '}
                {t('Home.login.registration')}{' '}
              </a>
              <p className="text-gray">
                {t('Home.login.title')}{' '}
                <a href="/login"> {t('Home.login.login')} </a>
              </p>
            </div>
          )}

          <div id="about-us">
            <div className="row my-6">
              <div className="col-xl-1" />
              <div className="col">
                <div className="row category-options ">
                  <div className='col cursor-pointer active pb-3'>
                    {t('Home.login.about')}
                  </div>
                </div>
              </div>
              <div className="col-xl-1" />
            </div>
            <div className='px-5 mx-5' id='vision'>
              <div className="col-xl-1" />
              <div className="col text-cont">
                <p>{t("About.content.title")}</p>
                <p>{t("About.content.title2")}</p>
              </div>
              <div className="col-xl-1" />
            </div>
            <div className="row my-6">
              <div className="col-xl-1" />
              <div className="col">
                <div className="row category-options ">
                  <div className='col cursor-pointer active pb-3'>
                    {t('Home.login.about_fes')}
                  </div>
                </div>
              </div>
              <div className="col-xl-1" />
            </div>
            <div className='container px-5 mx-5'>
              <div className='row' id='mission'>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/profiles.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header3")}</h5>
                  <p className="my-3">{t("About.content.title3")}</p>
                </div>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/anti-detection.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header4")}</h5>
                  <p className="my-3">{t("About.content.title4")}</p>
                </div>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/vm.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header5")}</h5>
                  <p className="my-3">{t("About.content.title5")}</p>
                </div>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/storage.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header6")}</h5>
                  <p className="my-3">{t("About.content.title6")}</p>
                </div>
              </div>
              <h1></h1>
              <div className='row'  id='mission'>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/account.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header7")}</h5>
                  <p className="my-3">{t("About.content.title7")}</p>
                </div>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/auto.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header8")}</h5>
                  <p className="my-3">{t("About.content.title8")}</p>
                </div>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/automation.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header9")}</h5>
                  <p className="my-3">{t("About.content.title9")}</p>
                </div>
                <div className='col text-cont'>
                  <img className="img-fluid img-cont" src="/assets/homepage/finger.png" alt="" />
                  <h5 className='cont-header'>{t("About.content.header10")}</h5>
                  <p className="my-3">{t("About.content.title10")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        
        {isRequireLogin && (
          <RequestLoginPopup
            t={t}
            isPopup={isRequireLogin}
            handleClose={this.handleClose}
            // title={t("Event.content.require_login")}
            textContent={this.state.textContent}
            startTimeContent={this.state.startTimeContent}
          />
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  // setUser: PropTypes.func.isRequired
})

export default connect(mapStateToProps, {})(Home)
