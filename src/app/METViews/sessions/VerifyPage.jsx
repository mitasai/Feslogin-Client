import React, { Component } from 'react'
import { scrollTo } from 'utils' 
import RegistrationConfirmation from './RegistrationConfirmation'
import { connect } from 'react-redux'
import { confirmRegistration } from '../../redux/actions/LoginActions'
// import TopBar from './sections/TopBar'
import ConstantList from "../../appConfig";
import axios from "axios";
class VerifyPage extends Component {
  state = {}
  componentDidMount = () => {
    const token = new URLSearchParams(this.props.location.search).get('token')
    
    axios({
      method: 'get',
      url: ConstantList.API_ENPOINT + "/public/user/confirmRegistration",
      params: {
        token
      }
    }).then(res => {
    this.setState({confirmationResult:res.data}) 
    })
  }
  componentWillUnmount() {
    scrollTo('root')
   
  }
  
  handleButtonClick = (number) => {
    if (number === 0) {
      this.props.history.push(ConstantList.ROOT_PATH + 'login')
    } else {
      this.props.history.push(ConstantList.ROOT_PATH)
    }
  }
  render() {
    const { t } = this.props
    return (
      <div className="landing">
        {/* <TopBar /> */}
        <RegistrationConfirmation
          t={t}
          confirmationResult={this.state.confirmationResult}
          handleButtonClick={this.handleButtonClick}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    confirmationResult: state.login.confirmationResult,
  }
}

export default connect(mapStateToProps, {
  confirmRegistration,
})(VerifyPage)
