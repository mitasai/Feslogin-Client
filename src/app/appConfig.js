const APPLICATION_PATH = "/";
const CLIENT_ID = 'ATLrHo6YQHQ5KJCvb7KiFBMyrxoaqQO32lCD5VQzbEjnTir33owQ_w2YpyJ_hAT1UJOCy8VlU5bw1S3g'
const VERIFY_REGISTRATION = {
  INVALID_TOKEN: 1, //sai token
  TOKEN_EXPIRED: 2, // token vượt quá thời gian
  TOKEN_APPROVED: 3, // Token đúng
}
const VERIFY_EVENT = {
  INVALID_TOKEN: 1, //sai token
  TOKEN_EXPIRED: 2, // token vượt quá thời gian
  ACCOUNT_NOT_MATCH: 3, // Không đăng nhập hoặc tài khoản đang đăng nhập không khớp với tài khoản yêu cầu xác nhận token
  TOKEN_APPROVED: 4, // Token đúng
};
const EVENT_STATUS = {
  STATUS_INCOMING: 0,
  STATUS_HAPPENING: 1,
  STATUS_ENDED: 2,
}
const EVENT_ACTION_FOR_USER = {
  ACTION_START_OR_JOIN: 0,
  NO_ACTION_EVENT_INCOMING: 1,
  ACTION_REGISTER: 2,
  NO_ACTION_EVENT_ENDED: 3
}
//const APPLICATION_PATH="/asset_develop/";//Đặt homepage tại package.json giống như tại đây nếu deploy develop
module.exports = Object.freeze({
  //ROOT_PATH : "/egret/",
  ROOT_PATH: APPLICATION_PATH,
  ACTIVE_LAYOUT: "layout2", //layout1 = vertical, layout2=horizontal
  
  API_ENPOINT: "http://127.0.0.1:8000", //local
  // API_ENPOINT: "http://54.169.217.221" , //Server AWS EC2
  // API_ENPOINT: "https://api.dichvutrieudo.com" , //api domain dichvutrieudo.com

  LOGIN_PAGE: APPLICATION_PATH + "login", //
  HOME_PAGE: APPLICATION_PATH, //Nếu là Spring
  //HOME_PAGE:APPLICATION_PATH+"dashboard/learning-management"//Nếu là Keycloak
  //HOME_PAGE:APPLICATION_PATH+"landing3",//Link trang landing khi bắt đầu
  MATERIAL_DEPARTMENT_CODE: "VPB4",
  VERIFY_EVENT: VERIFY_EVENT,
  EVENT_STATUS: EVENT_STATUS,
  EVENT_ACTION_FOR_USER: EVENT_ACTION_FOR_USER,
  VERIFY_REGISTRATION : VERIFY_REGISTRATION
});
