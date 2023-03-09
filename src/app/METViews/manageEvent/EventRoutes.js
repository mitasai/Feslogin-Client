import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import ConstantList from "../../appConfig";
import VerifyPage from "./VerifyPage";

const ManageEvent = EgretLoadable({
  loader: () => import("./ManageEvent"),
});
const ViewComponentEvent = withTranslation()(ManageEvent);

const EventCreate = EgretLoadable({
  loader: () => import("./EventCreate"),
});
const ViewComponentCreateEvent = withTranslation()(EventCreate);

const EventDetail = EgretLoadable({
  loader: () => import("./Event"),
});
const ViewComponentEventDetail = withTranslation()(EventDetail);

const EventNoti = EgretLoadable({
  loader: () => import("./Event-Noti"),
});
const ViewComponentEventNoti = withTranslation()(EventNoti);
const ThankyouPage = EgretLoadable({
  loader: () => import("./ThankyouPage"),
});
const ViewComponentThankyouPage = withTranslation()(ThankyouPage);

const ViewComponentVerify = withTranslation()(VerifyPage);

const eventRoutes = [
  {
    path: ConstantList.ROOT_PATH + "event",
    component: ViewComponentEvent,
    isPublic: false,
  },
  {
    path: ConstantList.ROOT_PATH + "edit-event/:id",
    component: ViewComponentCreateEvent,
    isPublic: false,
  },
  {
    path: ConstantList.ROOT_PATH + "create-event",
    component: ViewComponentCreateEvent,
    isPublic: false,
  },
  {
    path: ConstantList.ROOT_PATH + "detail/:id",
    component: ViewComponentEventDetail,
    isPublic: true,
  },
  {
    path: ConstantList.ROOT_PATH + "thankyou/:code",
    component: ViewComponentThankyouPage,
    isPublic: true,
  },
  {
    path: ConstantList.ROOT_PATH + "event-noti",
    component: ViewComponentEventNoti,
    isPublic: false,
  },
  {
    path: ConstantList.ROOT_PATH + "confirmEvent",
    component: ViewComponentVerify,
    isPublic: false,
  },
];

export default eventRoutes;
