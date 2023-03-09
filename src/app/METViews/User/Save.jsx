import React, { Component } from "react";
import Pagination from "../../EgretLayout/METComponents/Pagination";
import { findUserByUserName, searchByPage as searchByDto, getItemById, saveUser, getAllRoles, getUserByUsername, checkEmail } from "./UserService";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import moment from "moment";
import Form from 'react-bootstrap/Form';
import Select from "react-select";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ConstantList from "../../appConfig";
import LoadingOverlay from 'react-loading-overlay';
import { Helmet } from "react-helmet";

toast.configure({
    autoClose: 2000,
    draggable: false,
    limit: 3,
});

class Save extends Component {

    constructor(props) {
        super(props);

        getAllRoles().then((result) => {
            let listRole = result.data;
            this.setState({ listRole: listRole });
        });
    }

    state = {
        displayName: "",
        username: "",
        gender: "M",
        email: "",
        user: {},
        person: {},
        listRole: [],
        roles: [],
        active: true,
        messagePass: '',
        messageconfirmPassword: '',
        isAddNew: true,
        // changePass: true,
        password: '',
        confirmPassword: '',
        isLoading: false,
        messageDisplayname: '',
        messageRoles: '',
        messageUsername: '',
    }

    checkExitsField = () => {
        let { t } = this.props;
        if (this.state.displayName == '') { this.setState({ messageDisplayname: t("sign_up.require_displayName") }); return true }
        if (this.state.username == '') { this.setState({ messageUsername: t("sign_up.require_userName") }); return true }
        if (this.state.email == '') { this.setState({ messageEmail: t("sign_up.require_email") }); return true }
        if (this.state.roles == '') { this.setState({ messageRoles: t("Event.content.not_blank") }); return true }
        if (this.state.password == '') { this.setState({ messagePass: t("sign_up.require_password") }); return true }
        if (this.state.confirmPassword == '') { this.setState({ messageconfirmPassword: t("sign_up.require_rePassword") }); return true }
        return false
    }

    handleFormSubmit = (event) => {
        let { t } = this.props;
        event.preventDefault();
        this.setState({
            isLoading: true
        });
        var checkUsername = new RegExp(/^[a-zA-Z0-9_-]{3,16}$/);
        let { id } = this.state
        let save = {};
        save.email = this.state.email;
        save.username = this.state.username;
        save.password = this.state.password;
        this.state.person.displayName = this.state.displayName.trim();
        if (this.state.person.gender == null || this.state.person.gender.length == 0) {
            this.state.person.gender = "M"
        }
        if (this.checkExitsField()) {
            this.setState({
                isLoading: false
            });
        }
        else if (this.state.displayName.trim().length < 1 || this.state.displayName < 1) {
            this.setState({
                isLoading: false,
                messageDisplayname: 'Họ tên không hợp lệ',
            })
        } else if (!checkUsername.test(this.state.username)) {
            this.setState({
                messageUsername: t("sign_up.message_username"),
                isLoading: false
            });
        } else if (this.state.password.length < 6) {
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
            getUserByUsername(this.state.username).then((data) => {

                if ((data.data && data.data.id && data.data.id !== id)) {
                    toast.error(("username này đã được sử dụng"));
                    this.setState({ isLoading: false });
                    return;
                } else {
                    checkEmail(save).then((data2) => {
                        if (data2 && data2.data && data2.data != '') {
                            toast.error(("Email này đã được sử dụng"));
                            this.setState({ isLoading: false });
                            return;
                        }
                        else {
                            saveUser(this.state).then((res) => {
                                this.setState({ isLoading: false });
                                toast.success(t("Category.add"));
                                this.props.history.push("/user_manager/user")
                            });
                        }
                    });
                }
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
        // let userId = this.props.match.params.userId;
        // getItemById(userId).then((result) => {
        //     this.setState({ user: result.data })
        // });
    }

    handleChangeEmail = (event, source) => {
        let { t } = this.props;
        event.persist()
        var mailformat = new RegExp(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        if (source === 'email') {
            return
        }
        this.setState({
            [event.target.name]: event.target.value,
        })
        this.setState({
            messageEmail: '',
            [event.target.name]: event.target.value,
        }, function () {
            if (!mailformat.test(this.state.email)) {
                this.setState({
                    messageEmail: t('sign_up.format_email')
                })
            }
        })
    }

    handleChange = (event, source) => {
        event.persist();

        // if (source === "displayName") {
        //     let { person } = this.state;
        //     person = person ? person : {};
        //     person.displayName = event.target.value;
        //     this.setState({ person: person });
        //     return;
        // }

        if (source === 'gender') {
            let { person } = this.state;
            person = person ? person : {};
            person.gender = event.target.value;
            this.setState({ person: person });
            return;
        }

        if (source === 'active') {
            let active = this.state;
            active = event.target.value;
            this.setState({ active: active })
            return
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

        // if (source === "birthDate") {
        //     let { user } = this.state;
        //     user = user ? user : {};
        //     user.person.birthDate = event.target.value;
        //     this.setState({ user: user });
        //     return;
        // }
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    handleChangeUsername = (event, source) => {
        let { t } = this.props;
        var checkUsername = new RegExp(/^[a-zA-Z0-9_-]{3,16}$/);
        event.persist()
        if (source === 'username') {
            return
        }
        this.setState({
            [event.target.name]: event.target.value,
        })
        this.setState({
            messageUsername: '',
            [event.target.name]: event.target.value,
        }
            , function () {
                if (!checkUsername.test(this.state.username)) {
                    this.setState({
                        messageUsername: t("sign_up.message_username")
                    })
                }
            }
        );
    }

    handleChangeDisplayname = (event, source) => {
        event.persist()
        if (source === 'displayName') {
            let { person } = this.state;
            person = person ? person : {};
            person.displayName = event.target.value;
            this.setState({ person: person, });
            // return;
        }
        this.setState({
            [event.target.name]: event.target.value,
            messageDisplayname: '',
        }, function () {
            if (this.state.displayName.trim().length < 1) {
                this.setState({
                    messageDisplayname: 'Họ tên không hợp lệ'
                })
            }
        })
    }


    handleChangeSelect = (value, source) => {
        this.setState({
            [source]: value,
            messageRoles: '',
        });
    };

    handleChangePass = name => event => {
        this.setState({
            [name]: event.target.value,
        })
        this.setState({
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
            username,
            email,
            roles,
            listRole,
            person,
            active,
            messagePass,
            messageconfirmPassword,
            isAddNew,
            displayName,
            password,
            confirmPassword,
            isLoading,
            messageDisplayname,
            messageRoles,
            messageUsername,
            messageEmail,
        } = this.state;
        return (
            <div>
                <div className="container">
                    <Helmet>
                        <title>{t('web_site.title_page')} | {t('web_site.manage_user')}</title>
                    </Helmet>
                    <h1 className="text-center title title-mb">{t("user.account")}</h1>
                    <div className="text-center m-5"><img className="img-fluid img-title-mb" src="/assets/userinfo/title-foot.png" height={250} width={250} alt="" /></div>
                    <h2 className="text-center title-foot ">{user?.displayName}</h2>
                    {/* <h2 className="text-center title-foott">{moment(user?.person ? user?.person.birthDate : '').format("DD MMMM, YYYY")}</h2> */}
                    <ValidatorForm ref="form" onSubmit={this.handleFormSubmit} >
                        <form action className="fz-mb" >
                            <div className="row">
                                <div className="col-xl-2" />
                                <div className="col-xl">
                                    <Form.Group controlId="displayName" className="mb-4">
                                        <Form.Label>
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("user.displayName")}
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            onChange={displayName => this.handleChangeDisplayname(displayName, "displayName")}
                                            // required
                                            type="name"
                                            name="displayName"
                                            value={person.displayName}
                                        />
                                        <p><h6 className="validated-error">{messageDisplayname}&nbsp;</h6></p>
                                    </Form.Group>
                                </div>
                                <div className="col-xl">
                                    <Form.Group controlId="gender" className="mb-4">
                                        <Form.Label>{t("Profile.gender")}</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={person.gender}
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
                                        <Form.Label>
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("Profile.username")}
                                            </span>
                                        </Form.Label>
                                        <Form.Control
                                            onChange={this.handleChangeUsername}
                                            // required
                                            type="text"
                                            name="username"
                                            value={username} />
                                        <p><h6 className="validated-error">{messageUsername}&nbsp;</h6></p>
                                    </Form.Group>
                                </div>
                                <div className="col-xl">
                                    <Form.Group controlId="email" className="mb-4">
                                        <Form.Label>
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("Profile.email")}
                                            </span>
                                        </Form.Label><br />
                                        <Form.Control
                                            onChange={this.handleChangeEmail}
                                            // required
                                            type="email"
                                            name="email"
                                            value={email}
                                        />
                                        <p><h6 className="validated-error">{messageEmail}&nbsp;</h6></p>
                                    </Form.Group>
                                </div>
                                <div className="col-xl-2" />
                            </div>
                            <div className="row">
                                <div className="col-xl-2" />
                                <div className="col-xl">
                                    <Form.Group controlId="roles">
                                        <Form.Label>
                                            <span className="font">
                                                <span style={{ color: "red" }}> * </span>
                                                {t("user.role")}
                                            </span>
                                        </Form.Label>
                                        <Select
                                            isMulti
                                            name="roles"
                                            // required
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            options={listRole}
                                            //defaultValue={}
                                            value={roles}
                                            onChange={(value) => {
                                                this.handleChangeSelect(value, "roles");
                                            }}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                        />
                                        <p><h6 className="validated-error">{messageRoles}&nbsp;</h6></p>
                                    </Form.Group>
                                </div>
                                <div className="col-xl">
                                    <Form.Group controlId="active" className="mb-4">
                                        <Form.Label>{t("user.status")}</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={active}
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
                                    <Form.Label>
                                        <span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("user.new_pass")}
                                        </span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        // required
                                        placeholder=""
                                        onChange={this.handleChangePass('password')}
                                        name="password"
                                        value={this.state.password}
                                    />
                                    <p><h6 className="validated-error">{messagePass}</h6></p>
                                </div>
                                <div className="col-xl">
                                    <Form.Label>
                                        <span className="font">
                                            <span style={{ color: "red" }}> * </span>
                                            {t("user.re_pass")}
                                        </span>
                                    </Form.Label>
                                    <Form.Control
                                        type="password"
                                        // required
                                        placeholder=""
                                        onChange={this.handleChangeRePass('confirmPassword')}
                                        name="confirmPassword"
                                        value={this.state.confirmPassword}
                                    />
                                    <p><h6 className="validated-error">{messageconfirmPassword}</h6></p>
                                </div>
                                <div className="col-xl-2" />
                            </div>
                            <LoadingOverlay
                                active={isLoading}
                                spinner
                                text='Please wait...'
                            >
                                <div className="text-center mb-5 z-10">
                                    <a style={{ minWidth: '250px' }} href="/user_manager/user" ><button style={{ minWidth: '250px' }} className="btn btn-orangee btn-lg mb-4" type="button" >{t("user.cancel")}</button></a>
                                    <button style={{ minWidth: '250px' }} className="btn btn-blue btn-lg mb-4" type="submit">{t("user.save")}</button>
                                </div>
                            </LoadingOverlay>
                        </form>
                    </ValidatorForm>
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
export default (Save);
