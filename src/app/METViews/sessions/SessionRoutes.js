import NotFound from "./NotFound";
import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import ConstantList from "../../appConfig";
import VerifyPage from "./VerifyPage";

const SignIn = EgretLoadable({
  loader: () => import("./SignIn")
});
const ViewComponentSignIn = withTranslation()(SignIn);

const ForgotPassword = EgretLoadable({
  loader: () => import("./ForgotPassword")
});
const ViewForgotPassword = withTranslation()(ForgotPassword);

const SignUp = EgretLoadable({
  loader: () => import("./SignUp_RegisterAccount")
});
const ViewComponentSignUp = withTranslation()(SignUp);

const SignUpSo = EgretLoadable({
  loader: () => import("./SignUp_AccountSocial")
});
const ViewComponentSignUpSo = withTranslation()(SignUpSo);

const PreReset = EgretLoadable({
  loader: () => import("./PreReset")
});
const ViewComponetPreResetPassword = withTranslation()(PreReset);

const SignUpNoti = EgretLoadable({
  loader: () => import("./SignUp-Register-Noti")
});
const ViewComponetSignUpNoti = withTranslation()(SignUpNoti);

const SignUpNotiSo = EgretLoadable({
  loader: () => import("./SignUp-Social-Noti")
});
const ViewComponetSignUpNotiSo = withTranslation()(SignUpNotiSo);

const ChangePassNoti = EgretLoadable({
  loader: () => import("./Change-Pass-Noti")
});
const ViewComponentChangePassNoti = withTranslation()(ChangePassNoti);

const ChangePassVerify = EgretLoadable({
  loader: () => import("./Change-Pass-Verify")
});
const ViewComponentChangePassVerify = withTranslation()(ChangePassVerify);

const ViewComponent = withTranslation()(VerifyPage);

const sessionRoutes = [
  {
    path: ConstantList.ROOT_PATH+"register",
    component: ViewComponentSignUp,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH+"session/signup-account-social",
    component: ViewComponentSignUpSo,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH+"login",
    component: ViewComponentSignIn,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH+"forgot-password",
    component: ViewForgotPassword,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH+"session/404",
    component: NotFound,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH + "resetPassword",
    component: ViewComponetPreResetPassword,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH + "signup-noti",
    component: ViewComponetSignUpNoti,
    isPublic: true
  },

  {
    path: ConstantList.ROOT_PATH + "session/signup-noti-so",
    component: ViewComponetSignUpNotiSo,
    isPublic: true
  },


  {
    path: ConstantList.ROOT_PATH + "confirmRegistration",
    exact: true,
    component: ViewComponent,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH+"session/change-pass-noti",
    component: ViewComponentChangePassNoti,
    isPublic: true
  },
  {
    path: ConstantList.ROOT_PATH+"change-pass-verify",
    component: ViewComponentChangePassVerify,
    isPublic: true
  },
];

export default sessionRoutes;
