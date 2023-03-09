import React, { Component } from "react";
import Pagination from "../../EgretLayout/METComponents/Pagination";
import { findUserByUserName, searchByPage as searchByDto, getItemById, saveUser, getAllRoles, getUserByUsername } from "./UserService";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import moment from "moment";
import Form from 'react-bootstrap/Form';
import Select from "react-select"; 
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});
class Update extends Component {

    constructor(props) {
        super(props);

        getAllRoles().then((result) => {
            let listRole = result.data;
            this.setState({ listRole: listRole });
        });
    }

    state = {
        user: {},
        listRole: [],
        roles: [],
        person: {},
        messagePass: '',
        messageconfirmPassword: '',
        isAddNew: false,
    }

    handleFormSubmit = (event) => {
        let { user } = this.state;
        this.state.user.person.displayName = user.person.displayName.trim();
        event.preventDefault();
        this.setState({ loading: true })
        let { id } = this.state;
        let { t } = this.props;
        // this.setState({isView: true});    
        if (this.state.user.displayName.trim().length < 1 || this.state.displayName < 1) {
            this.setState({
                isLoading: false,
                messageDisplayname: 'Họ tên không hợp lệ',
            })
        } else if (this.state.user.password.length < 6) {
            this.setState({
                isLoading: false,
                messagePass: 'Mật khẩu phải có ít nhất 6 ký tự'
            })
        } else if (this.state.confirmPassword != this.state.password) {
            this.setState({
                isLoading: false,
                messageconfirmPassword: 'Mật khẩu không trùng khớp'
            })
        } else {
            saveUser(user).then((res)=>{
                toast.success(t("Category.update"));
                this.props.history.push("/user_manager/user")
            });
        }
    };

    getAllRoles = () => {
        let searchObject = {};
        searchObject.pageIndex = 1;
        searchObject.pageSize = 100000;
        getAllRoles(searchObject).then(({ data }) => {
            this.setState({ listCategory: [...data.content] });
        });
    };

    componentWillMount() {
        let userId = this.props.match.params.userId;
        getItemById(userId).then((result) => {
            let roles = result.data.roles;
            this.setState({ user: result.data, roles: roles })
        });
    }

    handleChange = (event, source) => {
        event.persist();

        if (source === "displayName") {
            let { user } = this.state;
            user = user ? user : {};
            user.person.displayName = event.target.value;
            this.setState({ user: user });
            return;
        }

        if (source === 'gender') {
            let { user } = this.state;
            user = user ? user : {};
            user.person.gender = event.target.value;
            this.setState({ user: user });
            return;
        }

        if (source === 'active') {
            let { user } = this.state;
            user = user ? user : {};
            user.active = event.target.value;
            this.setState({ user: user });
            return;
        }

        if (source === "phoneNumber") {
            let { user } = this.state;
            user = user ? user : {};
            user.person.phoneNumber = event.target.value;
            this.setState({ user: user });
            return;
        }

        if (source === "address") {
            let { user } = this.state;
            user = user ? user : {};
            user.person.birthPlace = event.target.value;
            this.setState({ user: user });
            return;
        }

        if (source === "birthDate") {
            let { user } = this.state;
            user = user ? user : {};
            user.person.birthDate = event.target.value;
            this.setState({ user: user });
            return;
        }
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleChangeDisplayname = (event, source) => {
        event.persist()
        if (source === 'displayName') {
            let { user } = this.state;
            user = user ? user : {};
            user.person.displayName = event.target.value;
            this.setState({ user: user });
            // return;
        }
        this.setState({
            [event.target.name]: event.target.value,
            messageDisplayname: '',
        }, function () {
            if (this.state.user.person.displayName.trim().length < 1 || this.state.user.person.displayName < 1) {
                this.setState({
                    messageDisplayname: 'Họ tên không hợp lệ'
                })
            }
        })
    }


    handleChangeSelect = (value, source) => {
        let { user } = this.state;
        let roles = value;
        console.log(value)
        user.roles = roles;
        this.setState({
            user: user,
            roles: roles
        });
    };

    handleChangePass = name => event => {

        let { user } = this.state;
        user = user ? user : {};
        user.password = event.target.value;
        user.changePass = true;
        this.setState({
            user: user,
            [name]: event.target.value,
            messagePass: '',
        }, function () {
            if (this.state.password.length < 6) {
                this.setState({
                    messagePass: 'Mật khẩu phải có ít nhất 6 ký tự'
                })
            }
        });
    }

    handleChangeRePass = name => event => {
        this.setState({
            [name]: event.target.value,
        })
        this.setState({
            messageconfirmPassword: '',
        }, function () {
            if (this.state.confirmPassword != this.state.password) {
                this.setState({
                    messageconfirmPassword: 'Mật khẩu không trùng khớp'
                })
            }
        });
    }

    render() {
        const { t, i18n } = this.props;
        let {
            id,
            user,
            roles,
            person,
            listRole,
            active,
            messagePass,
            messageconfirmPassword,
            isAddNew,
            messageDisplayname,
        } = this.state;
        return (
            <div>
                <div className="container">
                    <Helmet>
                        <title>{t('web_site.title_page')} | {t('web_site.manage_user')}</title>
                    </Helmet>
                    <h1 className="text-center title title-mb">{t("user.account")}</h1>
                    <div className="text-center m-3"><img className="img-fluid img-title-mb" src="/assets/userinfo/title-foot.png" height={250} width={250} alt="" /></div>
                    <h1 className="text-center text-teal fw-bold mb-5">{user?.displayName}</h1>
                    {/* <h2 className="text-center title-foott">{moment(user?.person ? user?.person.birthDate : '').format("DD MMMM, YYYY")}</h2> */}
                    <form onSubmit={this.handleFormSubmit} >
                        <form action className="fz-mb" >
                            <div className="row ">
                                <div className="col-xl-2" />
                                <div className="col-xl">
                                    <Form.Group controlId="displayName" className="mb-4">
                                        <Form.Label><span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("user.displayName")}
                                        </span>
                                        </Form.Label>
                                        <Form.Control
                                            onChange={displayName => this.handleChangeDisplayname(displayName, "displayName")}
                                            required
                                            type="name"
                                            name="displayName"
                                            value={user.person ? user.person.displayName : ''}
                                        />
                                        <p><h6 className="validated-error">{messageDisplayname}&nbsp;</h6></p>
                                    </Form.Group>
                                </div>
                                <div className="col-xl">
                                    <Form.Group controlId="gender" className="mb-4">
                                        <Form.Label>{t("Profile.gender")}</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={user.person ? user.person.gender : ''}
                                            custom className="form-select"
                                            onChange={(value) => this.handleChange(value, 'gender')}>
                                            <option value="M">{t("Profile.male")}</option>
                                            <option value="F">{t("Profile.female")}</option>
                                            <option value="U">{t("Profile.underfine")}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-2" />
                            </div>
                            <div className="row ">
                                <div className="col-xl-2" />
                                <div className="col-xl">
                                    <Form.Group controlId="username" className="mb-4">
                                        <Form.Label><span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("Profile.username")}
                                        </span>
                                        </Form.Label>
                                        <Form.Control
                                            InputProps={{
                                                readOnly: !isAddNew,
                                            }}
                                            required
                                            disabled
                                            type="text"
                                            name="username"
                                            value={user?.username} />
                                    </Form.Group>
                                </div>
                                <div className="col-xl">
                                    <Form.Group controlId="email" className="mb-4">
                                        <Form.Label><span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("Profile.email")}
                                        </span>
                                        </Form.Label><br />
                                        <Form.Control
                                            required
                                            type="email"
                                            name="email"
                                            disabled
                                            value={user?.email}
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-xl-2" />
                            </div>
                            <div className="row">
                                <div className="col-xl-2" />
                                <div className="col-xl">
                                    <Form.Group controlId="roles">
                                        <Form.Label><span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("user.role")}
                                        </span>
                                        </Form.Label>
                                        <Select
                                            isMulti
                                            name="roles"
                                            required
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            options={listRole}
                                            defaultValue={user.roles}
                                            value={roles}
                                            onChange={(value) => {
                                                this.handleChangeSelect(value, "roles");
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-xl">
                                    <Form.Group controlId="active" className="mb-4">
                                        <Form.Label>{t("user.status")}</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={user.active}
                                            custom className="form-select"
                                            onChange={(value) => this.handleChange(value, 'active')}>
                                            <option value={true} >{t("user.enable")}</option>
                                            <option value={false}>{t("user.disable")}</option>
                                        </Form.Control>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-2" />
                            </div>
                            <div className="row mb-5">
                                <div className="col-xl-2" />
                                <div className="col-xl">
                                    <Form.Label><span className="font">
                                        <span style={{ color: "red" }}> * </span>
                                        {t("user.new_pass")}
                                    </span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder=""
                                        onChange={this.handleChangePass('password')}
                                        name="password"
                                        value={user?.password}
                                    />
                                    <p><h6 className="validated-error">{messagePass}</h6></p>
                                </div>
                                <div className="col-xl">
                                    <Form.Label><span className="font">
                                        <span style={{ color: "red" }}> * </span>
                                        {t("user.re_pass")}
                                    </span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder=""
                                        onChange={this.handleChangeRePass('confirmPassword')}
                                        name="confirmPassword"
                                        value={user?.confirmPassword}
                                    />
                                    <p><h6 className="validated-error">{messageconfirmPassword}</h6></p>
                                </div>
                                <div className="col-xl-2" />
                            </div>
                            <div className="text-center mb-5 z-10">
                                <a style={{ minWidth: '250px' }} href="/user_manager/user" ><button style={{ minWidth: '250px' }} className="btn btn-orangee btn-lg mb-4" type="button" >{t("user.cancel")}</button></a>
                                <button style={{ minWidth: '250px' }} className="btn btn-blue btn-lg mb-4" type="submit">{t("user.save")}</button>
                            </div>
                        </form>
                    </form>
                </div>
                <div className>
                    <div className="decor d-flex justify-content-between">
                        <img className="img-decor-mb" src="/assets/userinfo/decor-left.png" alt="" />
                        <img className="img-decor-mb" src="/assets/userinfo/decor-right.png" alt="" />
                    </div>
                </div>
            </div>
        )
    }

}
export default (Update);
