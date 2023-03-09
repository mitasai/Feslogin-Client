import React, { Component } from 'react'
import ConstantList from '../../appConfig'
import { connect } from 'react-redux'
import { PropTypes } from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Col, Form } from 'react-bootstrap'
import { resetPassword } from '../../redux/actions/LoginActions'
import { checkEmail, forgotPassword } from './SessionService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

toast.configure({
  autoClose: 3000,
  draggable: false,
  limit: 3,
})

class ForgotPassword extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    email: '',
  }

  componentDidMount = () => {
    this.setState({
      hostSite: window.location.origin + ConstantList.ROOT_PATH,
    })
  }

  handleDialogClose = () => {
    this.setState({
      showResetConfirmDialog: false,
    })
  }

  handleChange = (event) => {
    event.persist()
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  handleFormSubmit = (event) => {
    let { t, i18n } = this.props
    event.preventDefault()
    let dto = { ...this.state }

    forgotPassword(dto)
      .then((data) => {
        this.props.history.push({
          pathname: 'change-pass-verify',
          state: { ...this.state },
        })
      })
      .catch((err) => {
        toast.error(t('sign_up.error'))
      })
  }

  render() {
    let { email } = this.state
    let { t, i18n } = this.props
    return (
      <div>
        <div className="container">
          <h1 className="text-center title ">Reset Password</h1>
          <div className="text-center m-5">
            <img
              className="img-decor"
              src="/assets/login/title-foot.png"
              alt=""
            />
          </div>{' '}
          <form onSubmit={this.handleFormSubmit}>
            <div className="row ">
              <div className="col" />
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    required
                    className="form-control mb-4"
                    id="email"
                    name="email"
                    type="text"
                    value={email}
                    onChange={this.handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col" />
            </div>
            <div className="text-center z-10 row">
              <div className="col"></div>
              <div className="col-md-4">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg mb-4 w100"
                >
                  {t('reset_password.title')}
                </button>
                <div className="text-gray">
                  <p
                    style={{ cursor: 'pointer', display: 'inline' }}
                    onClick={() =>
                      this.props.history.push(ConstantList.ROOT_PATH + 'login')
                    }
                  >
                    {t('sign_in.title')}{' '}
                  </p>
                </div>
              </div>

              <div className="col"></div>
            </div>
          </form>
        </div>
        <div className="ponly">
          <div className="decor d-flex justify-content-between"></div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  resetPassword: PropTypes.func.isRequired,
  login: state.login,
})
export default withRouter(
  connect(mapStateToProps, { resetPassword })(ForgotPassword),
)
