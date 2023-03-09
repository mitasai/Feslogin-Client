import ConstantList from "../../appConfig";
import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';


const Category = EgretLoadable({
    loader: () => import("./Category")
  });
const ViewComponent = withTranslation()(Category);
const CategoryRoutesRoutes = [
  {
    path: ConstantList.ROOT_PATH + "category",
    exact: true,
    component: ViewComponent,
    isPublic: false
  }
];

export default CategoryRoutesRoutes;