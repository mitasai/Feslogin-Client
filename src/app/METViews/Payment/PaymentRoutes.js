import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from "react-i18next";
import ConstantList from "../../appConfig";

const Payment = EgretLoadable({
  loader: () => import("./Payment"),
});
const ViewComponentPayment = withTranslation()(Payment);

const paymentRoutes = [
  {
    path: ConstantList.ROOT_PATH + "payment",
    component: ViewComponentPayment,
  },
];

export default paymentRoutes;
