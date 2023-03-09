import { EgretLoadable } from "egret";
import ConstantList from "../../appConfig";
import { useTranslation, withTranslation, Trans } from 'react-i18next';
const User = EgretLoadable({
  loader: () => import("./User")
});
const ViewComponent = withTranslation()(User);

const Save = EgretLoadable({
  loader: () => import("./Save")
});
const ViewSaveComponent = withTranslation()(Save);

const Update = EgretLoadable({
  loader: () => import("./Update")
});
const ViewUpdateComponent = withTranslation()(Update);

const UserRoutes = [
  {
    path:  ConstantList.ROOT_PATH+"user_manager/user",
    exact: true,
    component: ViewComponent
  },
  {
    path:  ConstantList.ROOT_PATH+"user_manager/update/:userId",
    exact: true,
    component: ViewUpdateComponent
  },
  {
    path:  ConstantList.ROOT_PATH+"user_manager/save",
    exact: true,
    component: ViewSaveComponent
  }
];

export default UserRoutes;
