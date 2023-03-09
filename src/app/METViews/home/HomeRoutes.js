import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
import ConstantList from "../../appConfig";

const Home = EgretLoadable({
  loader: () => import("./Home")
});
const ViewComponentHome = withTranslation()(Home);


const homeRoutes = [
  {
    path: ConstantList.ROOT_PATH+"/",
    component: ViewComponentHome,
    isPublic: true
  }
];

export default homeRoutes;
