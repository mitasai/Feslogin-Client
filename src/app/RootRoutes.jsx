import React from "react";
import { Redirect } from "react-router-dom";
import homeRoutes from "./METViews/home/HomeRoutes";
import paymentRoutes from "./METViews/Payment/PaymentRoutes";
import TypeRoutesRoutes from "./METViews/Type/TypeRoutes";
import CategoryRoutesRoutes from "./METViews/Category/CategoryRoutes";
import sessionRoutes from "./METViews/sessions/SessionRoutes";
import pageLayoutRoutes from "./METViews/page-layouts/PageLayoutRoutees";
import PartnerRoutesRoutes from "./METViews/Partner/PartnerRoutes";
import UserRoutes from "./METViews/User/UserRoutes";
import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import fiscalYearRoutes from "./views/FiscalYear/FiscalYearRoutes";
import departmentRoutes from "./views/Department/DepartmentRoutes";
import eventRoutes from "./METViews/manageEvent/EventRoutes";
import RecordViewRoutes from "./METViews/RecordView/RecordViewRoutes";
import depositRoutes from "./METViews/Deposit/DepositRoutes";
import roleRoutes from "./views/Role/RoleRoutes";
import ConstantList from "./appConfig";
import MenuRoutes from "./views/Menus/MenuRoutes";

const redirectRoute = [
  {
    path: ConstantList.ROOT_PATH,
    exact: true,
    component: () => <Redirect to={ConstantList.HOME_PAGE} />, //Luôn trỏ về HomePage được khai báo trong appConfig
  },
];

const errorRoute = [
  {
    component: () => <Redirect to={ConstantList.ROOT_PATH + "session/404"} />,
  },
];

const routes = [
  ...homeRoutes,
  ...paymentRoutes,
  ...sessionRoutes,
  ...depositRoutes,
  ...pageLayoutRoutes,
  ...UserRoutes,
  ...roleRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
