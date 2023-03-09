// moved env variables into js file for stackblitz because it doesn't support dotenv (.env)
export default {
    REACT_APP_API_URL: 'http://localhost:4000',
    REACT_APP_FACEBOOK_APP_ID: '375810377175481',//real
    // REACT_APP_FACEBOOK_APP_ID: '1694817924059763',//fake
    SDK_FACEBOOK: "https://connect.facebook.net/en_US/sdk.js",
    LOGIN_ERROR_FAIL:'LOGIN_ERROR_FAIL',
    User_is_disabled:'User is disabled',
    Bad_credentials:'Bad credentials',
    SDKL_GOOGLE:"https://apis.google.com/js/platform.js?onload=googleSDKLoaded",
    ACCESS_TOKEN:'https://graph.facebook.com/v10.0/me?access_token=',

};