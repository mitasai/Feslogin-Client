import ConstantList from "../../appConfig";
import { EgretLoadable } from "egret";
import { useTranslation, withTranslation, Trans } from 'react-i18next';


const RecordView = EgretLoadable({
    loader: () => import("./RecordView")
  });
const ViewComponent = withTranslation()(RecordView);
const RecordViewRoutesRoutes = [
  {
    path: ConstantList.ROOT_PATH + "record/:roomId/:recordId/:eventId",
    exact: true,
    component: ViewComponent,
    isPublic: false
  }
];

export default RecordViewRoutesRoutes;