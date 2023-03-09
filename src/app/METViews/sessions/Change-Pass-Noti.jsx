import React, { Component } from "react";
import ConstantList from "../../appConfig";

class ChangePassNoti extends Component {
    render() {
        const { t, i18n } = this.props;
        return (
            <div className="container ">
                <h1 className="text-center title">{t("reset_password.title_succes")}</h1>
                <div className="text-center m-5">
                    <img className="img-fluid" src="/assets/confirm-email/title-foot.png" alt="" />
                </div>
                <div 
                    className="col"
                    style={{display: "flex",
                    justifyContent: "center", margin: '0 9rem'}}
                    onClick={() =>
                        this.props.history.push(ConstantList.ROOT_PATH+"login")}
                >
                <button className="btn btn-light btn-confirm btn-lg btn-space" >
                  {t("Home.login.login")}
                </button>
              </div>
            </div>
        )
    }
}
export default ChangePassNoti;
