import ConstantList from "../../appConfig";
import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';


const Partner = EgretLoadable({
    loader: () => import("./Partner")
  });
const ViewComponent = withTranslation()(Partner);
const PartnerRoutesRoutes = [
  {
    path: ConstantList.ROOT_PATH + "partner",
    exact: true,
    component: ViewComponent,
    isPublic: false
  }
];

export default PartnerRoutesRoutes;