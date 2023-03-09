import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import ConstantList from "../../appConfig";

const Deposit = EgretLoadable({
  loader: () => import("./Deposit"),
});
const ViewComponentSearch = withTranslation()(Deposit);

const depositRoutes = [
  {
    path: ConstantList.ROOT_PATH + "deposit",
    component: ViewComponentSearch,
  },
];

export default depositRoutes;
