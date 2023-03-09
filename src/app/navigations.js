import ConstantList from "./appConfig";
export const navigations = [
  // {
  //   name: "Dashboard.dashboard",
  //   icon: "dashboard",
  //   path: ConstantList.ROOT_PATH + "dashboard/analytics",
  //   isVisible:true,
  // },
  // {
  //   name: "Dashboard.directory",
  //   icon: "dashboard",
  //   path: "",
  //   isVisible:true,
  //   children: [
  //     {
  //       name: "Dashboard.AdministrativeUnit",
  //       path: ConstantList.ROOT_PATH+"dashboard/AdministrativeUnits",
  //       iconText: "S",
  //       isVisible:true,
  //     }
  //   ]
  // },
  {
    name: "webinar.list",
    icon: "dashboard",
    path: ConstantList.ROOT_PATH + "webinar",
    isVisible:true,
  },
  {
    name: "webinar.myList",
    icon: "dashboard",
    path: ConstantList.ROOT_PATH + "my-webinar",
    isVisible:true,
  },
  {
    name: "Zoom Meeting",
    icon: "dashboard",
    path: ConstantList.ROOT_PATH + "zoom-meeting",
    isVisible:true,
  },
  // {
  //   name: "Category",
  //   icon: "dashboard",
  //   path: ConstantList.ROOT_PATH + "category",
  //   isVisible:true,
  // },
  {
    name: "Manage",
    isVisible:true,
    icon: "engineering",
    children: [
      {
        name: "Category",
        icon: "keyboard_arrow_right",
        path: ConstantList.ROOT_PATH + "category",
        isVisible:true,
      },  
      {
        name: "Tag",
        isVisible:true,
        path: ConstantList.ROOT_PATH + "tag",
        icon: "keyboard_arrow_right"
      }
    ]
  },  
  {
    name: "Dashboard.manage",
    isVisible:true,
    icon: "engineering",
    children: [
      {
        name: "manage.user",
        isVisible:true,
        path: ConstantList.ROOT_PATH + "user_manager/user",
        icon: "keyboard_arrow_right"
      },
      {
        name: "manage.menu",
        isVisible:true,
        path: ConstantList.ROOT_PATH + "list/menu",
        icon: "keyboard_arrow_right"
      }
    ]
  },
];
